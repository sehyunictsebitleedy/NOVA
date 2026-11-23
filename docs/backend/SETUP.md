# NOVA 백엔드 설정 가이드

기준: 2026-11-14. 현재 구현은 Nuxt 4/Vue 3 소개 사이트와 Nitro BFF 기반입니다.
설계 ADR-A4·E1·E2·D2의 경계를 적용했습니다. API-On·Nexus를 이 저장소에 복제하거나 DB/OAuth 서버를 새로 만들지 않습니다.

## 구현된 것과 남은 것

구현: Vue SSR 페이지, Nuxt UI v4·Tailwind v4 Layer, --nova-* 토큰, 공개 제품 API, Hub 토큰 검증기·쿠키·RBAC, API-On 고정 경로 어댑터, Nexus 입력 검증 및 Gateway 중개, 미설정·실패 오류, 테스트.

운영 미연결: API-On 주소·서비스 키, Hub 실제 서명 방식·클레임·발급자·대상, SSO 로그인/콜백 규약, Nexus의 Gateway 공개 엔드포인트 및 실제 입출력 규격.
현재 프런트에는 로그인 버튼이나 Hub 왕복 콜백 UI를 붙이지 않았습니다.
SSO state/nonce·인증 코드 교환·로그인 리다이렉트는 실제 Hub 규약 확인 뒤 구현해야 합니다. 지금 제공하는 것은 최종 토큰 처리 API와 검증 어댑터입니다.
Nexus의 NOVA 측 입력은 `{ "input": "..." }`이며, 실제 Gateway API가 다른 계약이면 연결 전 어댑터를 수정해야 합니다.
실서비스에 맞는 업무 데이터 응답 스키마도 아직 확정하지 않았습니다.

## 실행과 환경변수

Node.js 24 이상. 루트에서 `npm.cmd ci`, `npm.cmd run dev` 실행. 기본 주소 http://127.0.0.1:4000.
소개 페이지는 키 없이 동작합니다.

`apps/portal/.env.example`을 `apps/portal/.env`로 복사하고 외부 연동 값만 입력합니다. 실제 키는 Git에 올리거나 채팅에 붙여넣지 않습니다.
Nuxt 런타임의 private config에만 매핑되며 `runtimeConfig.public`에는 넣지 않습니다.

| 변수 | 의미 |
|---|---|
| NUXT_NOVA_PUBLIC_URL | 브라우저가 사용하는 NOVA origin, 예: HTTPS 스킴·호스트만 |
| NUXT_NOVA_GATEWAY_URL | API-On Gateway base URL, 필요하면 Gateway prefix 포함 |
| NUXT_NOVA_GATEWAY_SERVICE_KEY | API-On이 NOVA에 발급한 서비스 키 |
| NUXT_NOVA_GATEWAY_TIMEOUT_MS | 100~30000ms 범위로 제한되는 요청 타임아웃, 기본 10000 |
| NUXT_NOVA_SHOWCASE_PATH | Gateway base 뒤에 붙일 고정 업무 조회 경로 |
| NUXT_NOVA_NEXUS_PATH | Gateway base 뒤에 붙일 고정 Nexus 실행 경로 |
| NUXT_NOVA_HUB_TOKEN_SECRET | Hub와 합의한 HS256 검증 키, 최소 32bytes |
| NUXT_NOVA_HUB_ISSUER | 토큰의 예상 iss |
| NUXT_NOVA_HUB_AUDIENCE | 토큰의 예상 aud |
| NUXT_NOVA_ALLOW_LOCAL_HTTP | 로컬 통합 시험만 명시적으로 true. 원격 HTTP는 여전히 금지 |

프로덕션 Node 서버는 `.env` 파일을 읽지 않으므로 배포 환경에서 환경변수를 주입합니다.
`npm.cmd run build` 후 `npm.cmd start`로 실행하며 HOST 기본 127.0.0.1, PORT 기본 4000입니다.
컨테이너 설정은 Dockerfile에 있습니다. 최종 이미지에는 `.output`만 복사하며 컨테이너 빌드·운영 배포는 이번에 검증하지 않았습니다.

## 인증 계약

현재 어댑터는 **HS256 + iss/aud/sub/iat/exp/role**을 검증합니다. 이것은 NOVA 측 구현 계약이며 실제 Hub 프로토콜이 확인된 것은 아닙니다.
Hub가 RS256/JWKS·다른 클레임을 사용하면 이 어댑터를 맞춰야 합니다. 서명 검증을 우회하거나 decode만 해서 사용하면 안 됩니다.
허용 역할은 guest/viewer/editor/manager/admin입니다. builder/operator 등의 별칭은 거부합니다.

`POST /api/auth/sso-finalize`는 동일 출처의 `application/json` 요청으로 `{ "token": "Hub가 발급한 토큰" }`을 받습니다.
서명·발급자·대상·필수 클레임·만료·역할을 확인한 뒤 `sebit-token` 쿠키를 설정합니다.
쿠키는 HttpOnly·host-only·SameSite=Lax이며 HTTPS 설정에서는 Secure입니다. 토큰 발급은 하지 않습니다.
POST는 정확한 Origin 비교로 보호하고, JSON 스트림은 20000bytes로 제한합니다.

SSR/CSR 화면 접근은 페이지 메타 `minRole`과 검증된 `/api/auth/session`으로 처리합니다. localStorage를 인증 근거로 쓰지 않습니다.
이 점은 예전 문서의 localStorage 이중 체크 표현을 보완한 것입니다. 서버 API가 최종적으로 권한을 다시 검사합니다.
로그아웃은 현재 브라우저의 쿠키를 지웁니다. Hub 전역 로그아웃·토큰 철회는 Hub 프로토콜과 별도 연동이 필요합니다.

## 데이터·Nexus 경계

- 브라우저는 같은 출처 NOVA BFF만 호출합니다. `useNovaGateway()`가 두 로컬 API를 제공합니다.
- 서버는 환경변수의 고정된 경로만 API-On으로 호출합니다. 클라이언트가 URL·서비스 키·모델·Flow 경로를 임의 지정할 수 없습니다.
- X-Service-Key와 검증된 세션 토큰을 upstream 요청에만 넣습니다.
- 리다이렉트·URL 사용자정보·상대 경로 탈출을 금지합니다. 기본 HTTPS, 명시적 로컬 시험만 HTTP 허용.
- `/api/showcase`는 viewer 이상, `/api/nexus/run`은 manager 이상입니다.
- Origin이나 LLM을 직접 호출하지 않습니다.
- 타임아웃·응답 실패·JSON 오류를 명확한 API 오류로 반환하며 fixture로 대체하지 않습니다.
- API 응답은 no-store입니다. Hub·Gateway·배포단의 권한 및 요청 제한도 운영 연결 시 확인해야 합니다.

## 상태 코드

400 입력 오류 / 401 인증 없음·유효하지 않은 토큰 / 403 권한 또는 출처 오류 /
413 본문 한도 초과 / 415 JSON 아님 / 502 Gateway 통신·응답 실패 /
503 연동 설정 없음 또는 유효하지 않은 서버 설정.

## 검증

`npm.cmd test`: 토큰 위조·잘못된 대상/발급자·만료·역할 별칭·쿠키·출처·크기 제한·권한·Gateway 경계 등 21개 테스트.
`npm.cmd run typecheck`: Nuxt 앱과 Nitro 서버 타입 검사.
`npm.cmd run test:integration`: **빌드된 Nitro**를 임시 포트에서 시작하고 로컬 Gateway fixture로 SSO 쿠키→세션→업무 조회→manager Nexus 실행→로그아웃을 검증합니다. 실제 Hub·API-On·Nexus에 연결하지 않습니다.
브라우저 QA: Vue hydration 경고 없음, 제품 탭·키보드·테마·모바일 메뉴·6개 너비·정적 프로토타입 및 문서/키 파일 비노출 확인.

제품·기능별 데모, DB 저장, 운영 SSO 전체 흐름, 실제 Nexus 실행이 완료되었다는 의미는 아닙니다.
