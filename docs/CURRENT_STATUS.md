# NOVA 현재 구현 현황

기준: 2026-11-23. 현재는 **Nuxt 4/Vue 3 소개 사이트 + Nitro 서버 기반 + UX·Grid 기능 데모**입니다.

## 현재 동작하는 범위

- `apps/portal`: 최신 간결한 시안을 Vue 컴포넌트로 구성. SSR 공개 소개, 제품 탭, 키보드, 모바일 메뉴, 쿠키 기반 라이트/다크.
- `packages/tokens`: --nova-* 디자인 토큰.
- `packages/ux`: Nuxt UI v4·Tailwind v4 기반 Layer, 테마/데이터 composable, 페이지 역할 미들웨어, stateless 서버 유틸리티.
- `/ux`: 공통 UX 19종과 TabWorkspace, 검색·실제 미리보기·코드·props. [UX 가이드](ux/README.md) 참조.
- `/grid`: TanStack Grid Layer 코어 1차. 클라이언트 정렬·필터·편집·변경분·열 설정·Excel/CSV·10만 행 가상화. [Grid 가이드](grid/README.md) 참조. Must 26 전체 완료는 아니다.
- Nitro 공개 API: health, products, ux/components.
- 인증 기반: Hub 서명·issuer/audience·만료·역할 검증, host-only HttpOnly 세션 쿠키, session/logout/finalize API, 서버 RBAC.
- 외부 연동 기반: API-On Gateway 고정 경로 요청, viewer 업무 조회, manager Nexus 실행 BFF, 동일 출처·본문 제한·타임아웃·실패 처리.
- 외부 값이 없는 상태에서도 소개 페이지는 실행 가능. 운영 연동 API는 미설정 오류를 반환한다.

실제 Hub·API-On·Nexus는 미연결이다. [백엔드 가이드](backend/SETUP.md)의 설정과 실제 SSO/API 규약을 먼저 확인해야 한다.
지금의 API 어댑터를 운영 SSO 완료나 실제 AI 실행 완료로 해석하지 않는다.

## 구조와 실행

루트 `npm.cmd ci` → `npm.cmd run dev` → http://127.0.0.1:4000.
`npm.cmd run build` → `npm.cmd start`로 프로덕션 빌드를 실행한다.
API 키는 `apps/portal/.env` 또는 운영 프로세스 환경변수에서만 제공한다.
자체 DB/OAuth/토큰 발급은 추가하지 않았다. DB·상태·OAuth는 설계대로 서비스·Hub의 책임이다.
모노레포 내부 workspace로 상속하며 아직 GH Packages에 배포하지 않았다.

## 기존 HTML 통합 프로토타입

원본은 `docs/02-design/nova-integrated-workspace.html` 한 개다. 공개 자산 준비 스크립트가 `/prototype/` 출력물을 만든다.
소스는 HTML/CSS/JavaScript·인라인 SVG와 LEDGER 예시 데이터다. 화면에 있는 ECharts/Vue Flow 표기는 정식 제품 목표이며 해당 라이브러리 구현 증거가 아니다.

현재 기능 탭: T1 상황실, T2 CRUD, T3 조건부서식, T6 차트, T7 지도, T9 급여,
T12 팔레트, T14 템플릿, T15 AI 워크플로우 그래프, T16 트레이딩 라인, T17 온톨로지 그래프.
기능 11탭+홈 = 12화면. 목표는 T1~T17+홈 = 18화면.
T4 그룹핑, T5 가상스크롤, T8 통계, T10 조회, T11 사원, T13 리포트는 아직 미구현이다.
이전 11탭 전체의 동작 회귀나 17탭 완료를 이번 서버 테스트가 증명하지 않는다.

## 다음 단계

1. API-On·Hub·Nexus 환경과 계약 확인, SSO 로그인/콜백/state/nonce 실제 연결.
2. Grid 고급 기능·서버 조회/저장·실서비스 적용, Chart 전용 Vue 구현과 제품 연계.
3. 업무 데이터 스키마 및 필요 시 서비스 DB 설계.
4. 운영 통합 검증과 배포.

소개 메인 시안은 유지하며 UX 코어에 이어 Grid 코어 1차를 구현했다. Doc·Dashboard·Portal 전체 문서화/MCP는 후속 범위다.
과거 Micro 배치·빈 저장소·외부 레포 실사·QA·성능 수치는 작성 당시 이력으로 취급한다.

## 검증 범위

프로덕션 빌드·Nuxt 타입 검사·서버·UX·Grid 규칙과 Excel 왕복 42개 테스트·로컬 upstream 통합 시험·프로덕션 브라우저 QA를 수행했다.
운영 서비스 실연결·컨테이너 빌드·GH Packages publish·배포는 수행하지 않았다.
