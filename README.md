# SEbit NOVA

Vue 기반 웹서비스 UI 플랫폼. 현재는 **소개 시안 + Nuxt/Nitro 백엔드 기반 + UX·Grid 기능 데모**를 구성한 단계입니다.

- 개인 저장소: https://github.com/sehyunictsebitleedy/NOVA
- 원본 저장소: https://github.com/Sebit-AI-Infra/SEbit-NOVA (`upstream`)
- 로컬: `C:\Users\lenovo\Downloads\git\NOVA`

## 로컬 실행

Node.js 24 이상을 사용합니다.

```powershell
cd C:\Users\lenovo\Downloads\git\NOVA
npm.cmd ci
npm.cmd run dev
```

http://127.0.0.1:4000 에서 최신 소개 시안이 열립니다. 이미 설치된 환경에서는 `npm.cmd run dev`만 실행하면 됩니다.
외부 API 설정 없이 소개 페이지와 제품 설명이 동작합니다. 종료는 Ctrl+C입니다.

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:integration
# 별도 터미널에서 서버 실행 후
npm.cmd run test:grid
npm.cmd start
```

프로덕션 서버도 기본 `127.0.0.1:4000`에서 실행합니다. `HOST`, `PORT` 환경변수로 변경할 수 있습니다.
`test:integration`은 빌드 후 실행하며, 임시 로컬 Gateway와 테스트 토큰만 사용합니다. 실제 외부 서비스를 호출하지 않습니다.

## 구조

```text
apps/portal/
  app/pages/index.vue              소개 페이지
  app/components/                  헤더·제품 탭·푸터
  app/assets/css/site.css          현재 시안 스타일
  shared/data/products.ts          공개 제품 소개 콘텐츠
  server/api/                     Nitro BFF
  .env.example                    외부 연동 설정 예시
packages/
  tokens/css/nova.css              --nova-* 디자인 토큰
  ux/nuxt.config.ts               Nuxt UI v4·Tailwind v4 기반 Layer
  ux/app/                         테마·Gateway composable·페이지 인증 미들웨어
  ux/server/                      서명검증·RBAC·동일 출처·Gateway 유틸리티
scripts/prepare-assets.mjs         공개 자산 허용 목록 준비
tests/                            서버 단위·HTTP·Nitro 통합 테스트
site/                             기존 정적 시안·공개 자산 원본 보존
docs/                             기획·설계·연동 가이드
```

실행 화면은 Vue 컴포넌트입니다. 기존 HTML을 iframe으로 감싼 소개 페이지가 아닙니다.
제품 사진은 기존 프로토타입의 실제 캡처이며, `/prototype/`는 원래의 HTML 업무 포털입니다.

## 백엔드 경계

```text
브라우저 → NOVA Nitro BFF → API-On Gateway → 업무 데이터 / Nexus
                    ↑
              API-On Hub 토큰 검증
```

- NOVA는 OAuth·계정·JWT를 자체 발급하지 않습니다.
- Hub 토큰은 서버에서 서명·발급자·대상·만료·역할을 검증하고 host-only HttpOnly 쿠키에 저장합니다.
- 브라우저에 서비스 키·Hub 검증 키를 전달하지 않습니다.
- 역할은 `guest < viewer < editor < manager < admin`입니다.
- Layer는 stateless 유틸리티만 제공하고 실제 API는 Portal이 소유합니다.
- 자체 DB·직접 Origin 호출·직접 LLM 호출은 추가하지 않았습니다.
- 현재 화면은 공개 소개 페이지이며 로그인 UI와 운영 SSO 왕복 흐름은 아직 연결하지 않았습니다.

운영 API-On·Hub·Nexus는 주소·키·콜백/API 규격 확인 전입니다. 현재는 연결 어댑터와 검증 기반만 준비되어 있습니다.
설정이 없거나 연동이 실패하면 명확한 오류를 반환합니다. 예시 데이터로 성공을 가장하지 않습니다.

## 외부 연동

```powershell
Copy-Item apps/portal/.env.example apps/portal/.env
```

실제 값을 로컬 `.env`에 입력하세요. 소개 페이지 실행에는 필요하지 않습니다.
프로덕션에서는 프로세스 환경변수를 주입합니다. `npm start`는 `.env`를 자동으로 읽지 않습니다.
자세한 계약과 미구현 범위는 [백엔드 설정 가이드](docs/backend/SETUP.md)를 확인하세요.

## 현재 API

| 경로 | 용도 | 접근 |
|---|---|---|
| `GET /api/health` | 서버 상태 | 공개 |
| `GET /api/ux/components` | UX 컴포넌트·코드·props 카탈로그 | 공개 |
| `GET /api/products` | 소개 페이지 제품 카탈로그 | 공개 |
| `GET /api/auth/session` | 검증된 현재 세션 | 익명 상태 조회 가능 |
| `POST /api/auth/sso-finalize` | Hub 토큰 검증·쿠키 설정 | 동일 출처·설정 필요 |
| `POST /api/auth/logout` | 쿠키 제거 | 동일 출처·설정 필요 |
| `GET /api/showcase` | API-On 경유 업무 데이터 | viewer 이상 |
| `POST /api/nexus/run` | API-On 경유 Nexus 어댑터 | manager 이상·동일 출처 |

## 디자인·데모

- `/`: 최신 간결한 Vue 소개 시안
- `/grid`: Grid 조회·편집·Excel/CSV·10만 행 가상 스크롤 데모
- `/ux`: 공통 UX 19종 + TabWorkspace의 실제 Vue 미리보기·코드·API
- `/design/`: 동일 Vue 페이지 별칭
- `/classic/`: 초기 밝은 정적 시안
- `/concept/`: 이전 키캡 중심 정적 시안
- `/prototype/`: 기능 11탭 + 홈의 HTML 업무 포털 프로토타입

통합 데모 목표는 T1~T17 + 홈입니다. T4·T5·T8·T10·T11·T13은 아직 미구현입니다.
UX 기본 컴포넌트와 전용 갤러리를 구현했습니다. 사용법과 범위는 [UX 가이드](docs/ux/README.md)를 확인하세요. Grid 코어 1차 구현과 사용법은 [Grid 가이드](docs/grid/README.md)를 확인하세요. Chart 전용 Vue 구현과 Grid 고급 기능은 다음 단계입니다.
공통 UX Layer를 추가했다고 전체 제품 구현이 완료된 것은 아닙니다.

## 문서

- [현재 상태](docs/CURRENT_STATUS.md)
- [백엔드 설정·미연결 범위](docs/backend/SETUP.md)
- [현재 시안 기획](design/nova-simple-design.md)
- [사이트 기획](docs/01-plan/nova-website-spec.md)
- [플랫폼 아키텍처](docs/02-design/nova-platform-architecture.md)

과거의 Micro 배치안·QA·외부 저장소 실사·성능 수치는 당시 기록입니다. 현행 상태와 구분합니다.
기존 브랜치·PR 정책 및 `.github/CODEOWNERS`는 유지합니다. 이번 작업으로 커밋·푸시·운영 배포를 수행하지 않았습니다.

## 가비아 배포

Ubuntu 서버 설치와 서비스 관리 방법은 [가비아 배포 기록](deploy/gabia/README.md)을 참고하세요. 기존 Canvers는 유지하고 NOVA는 8080 포트를 사용합니다.
