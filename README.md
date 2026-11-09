# SEbit NOVA

**SEbit 웹서비스 표준 플랫폼 — 컴포넌트·그리드·차트·대시보드를 한 벌로 제공하는 모노레포**

NOVA 는 SEbit 서비스가 공통으로 상속해 쓰는 화면 표준입니다. NOVA UX(컴포넌트) · NOVA UI(페이지 템플릿) · NOVA Grid · NOVA Chart · NOVA Dashboard 다섯 제품과, 이를 전시·문서화하는 NOVA Portal 로 이루어집니다.
프런트 라이브러리만 파는 기존 제품과 달리, 인증(API-On Hub SSO) · 데이터 게이트웨이(API-On) · 노코드 흐름(Nexus)을 함께 묶는 것이 차별점입니다.

> 현재 단계: **기획·설계 완료, 제품 코드 착수 전.** 이 레포에는 기획·설계 문서와 통합 데모 프로토타입(17탭)이 들어 있습니다. 패키지(`packages/`)와 Portal(`apps/portal`)은 아직 없습니다.
> 운영 주소(예정): Portal `https://nova.sebit.co.kr` · 통합 데모 `https://nova-demo.sebit.co.kr` — 둘 다 아직 배포 전입니다.

---

## Tech Stack

설계 확정안 기준입니다(`docs/02-design/nova-platform-architecture.md`). 구현하면서 바뀌면 이 표를 같이 고칩니다.

| Layer | Technology |
|-------|-----------|
| 레포 구조 | npm workspaces 모노레포 (ADR-A1) |
| Framework | Nuxt 4 (Vue 3, Nitro) · `<script setup>` 전용 |
| UI | Nuxt UI v4 + Tailwind CSS v4 · 토큰 `--nova-*` (ADR-A2·A3) |
| State | Pinia |
| Grid | @tanstack/vue-table v8 (어댑터 격리) + @tanstack/vue-virtual · Excel = exceljs (ADR-B2·H1·H4) |
| Chart | ECharts 6.0 등록형 래퍼 · svg/canvas 자동 선택 · 접근성 계약 (ADR-B3·G1·G2) |
| 문서·데모 | Nuxt Content + vue-component-meta (ADR-C2) |
| Auth | NaverWorks SSO — API-On Hub 경유 · 서명검증 내장 (ADR-E1) |
| Data | `useNovaGateway()` — API-On 경유 · Origin 직접 호출 금지 (ADR-E2) |
| 배포물 | GitHub Packages npm (`@sebit-nova/*`) (ADR-F2) |
| Portal 배포 | IDC Docker + Cloudflare · 포트 4000 |
| 통합 데모 배포 | Cloudflare Pages 별도 프로젝트 · 빌드 없음 (ADR-007·008) |

## Architecture

```
                 ┌──────────────── SEbit-NOVA (이 레포) ────────────────┐
                 │  packages/tokens   --nova-* 디자인 토큰                │
                 │  packages/ux       Nuxt Layer (상속 · 런타임)          │
  SEbit 서비스 ──extends──▶  packages/grid · chart · dashboard · doc      │
  (Origin·PROVE…)│  ui-templates/     복사 전용 페이지 템플릿             │
                 │  apps/portal :4000 문서 · 데모 · 쇼케이스 · MCP        │
                 └──────────────┬───────────────────────────────────────┘
                                │ useNovaGateway() / SSO
                                ▼
                  API-On Hub (:3100) ──▶ Origin (:3000)
                  Nexus Flow (노코드)
```

- **UX = 상속, UI = 복사**: NOVA UX 는 서비스가 `extends` 로 런타임 상속하고 NOVA 가 소유합니다. NOVA UI 템플릿은 개발 시점에 복사하고, 복사한 뒤엔 서비스가 소유합니다(ADR-B1).
- **Layer 의 서버 코드는 stateless 만**: 상태를 가진 처리는 각 서비스와 Hub 몫입니다(ADR-A4).
- 전체 다이어그램·인증 시퀀스는 설계서 §1 · §15 에 있습니다.

## Key Features

- **NOVA UX** — Nuxt UI 위에 NOVA 토큰을 입힌 컴포넌트 Layer. 셸(GNB·LNB)·인증 미들웨어·RBAC(guest < viewer < editor < manager < admin)를 기본 제공
- **NOVA UI** — 로그인·목록/상세·폼 마법사·설정·셸 변형 등 복사해서 쓰는 페이지 템플릿
- **NOVA Grid** — 행·열 가상화, 서버 블록 지연 로딩(50만 행 이상 목표), 그룹핑·편집·Excel 내보내기·피봇·스파크라인
- **NOVA Chart** — ECharts 6.0 래퍼. 데이터 양에 따라 svg/canvas 를 고르고, aria·decal·대체 표로 접근성 기본 확보
- **NOVA Dashboard** — 위젯 계약·배치 렌더러·레이아웃 직렬화 스키마(저장 DB 는 서비스 몫)
- **NOVA Portal** — 제품별 문서·라이브 플레이그라운드·통합 쇼케이스·벤치마크 공개·NOVA MCP 서버
- **통합 데모 프로토타입** — 가상 회사 업무 포털 안에 NOVA 제품을 심은 17탭 워크스페이스(`docs/02-design/nova-integrated-workspace.html`, 단일 HTML · 외부 요청 없음)

## Numbers

2026-11-09 이 레포에서 직접 센 값입니다.

| Metric | Value |
|--------|-------|
| 기획 문서 (`docs/01-plan/`) | 9 |
| 설계 문서 (`docs/02-design/*.md`) | 7 |
| 플랫폼 아키텍처 ADR (설계서 안 A1~M1) | 32 |
| 통합 데모 ADR (`docs/02-design/adr/` 001~006) | 6 |
| 배포 ADR (배포 아키텍처 문서 안 007~009) | 3 |
| 통합 데모 프로토타입 | 1개 · 17탭 · 191KB |
| 제품 패키지 (`packages/`) | 0 (착수 전) |

## Structure

지금 들어 있는 것:

```
SEbit-NOVA/
├── README.md
├── .github/CODEOWNERS                 PR 승인자 지정
└── docs/
    ├── 01-plan/                       기획 9건
    │   ├── nova-platform-structure-canonical.md   ⭐ 구조 정본(4-part · 빌드 순서)
    │   ├── nova-platform-spec.md                  제품 기획 정본
    │   ├── nova-demo-tier2-tabs-spec.md           통합 데모 2차 6탭 기능정의
    │   └── …                                      벤치마크 · 기능 커버리지 · 시각화 자산 · 차트 이관 계획
    └── 02-design/                     설계 7건 + 프로토타입
        ├── nova-platform-architecture.md          ⭐ 제품 아키텍처 정본(ADR 32건 · 디렉토리 확정안 §15)
        ├── nova-integrated-workspace-design.md    통합 데모 설계 정본
        ├── nova-demo-site-deployment-architecture.md  통합 데모 배포(ADR-007~009)
        ├── nova-integrated-workspace.html         통합 데모 프로토타입(17탭)
        ├── adr/                                   통합 데모 ADR 001~006
        └── …                                      제품별 데모 설계 · 구 설계(이력)
```

설계상 목표 구조(아직 없음 · 설계서 §15):

```
packages/{tokens,ux,grid,chart,dashboard,doc}
ui-templates/
apps/portal/
benchmarks/
scripts/
.github/workflows/
```

문서를 처음 볼 때는 `docs/01-plan/nova-platform-structure-canonical.md` 부터 읽으면 됩니다. NOVA 를 ① Micro 소개 페이지 · ② 통합 데모 사이트 · ③ 제품별 데모 · ④ 제품 실물(이 레포) 네 부분으로 나누고, 빌드 순서(② → ① → ③ → ④)와 문서별 위치를 정리해 둔 상위 문서입니다.

## Development

아직 빌드할 코드가 없습니다. 프로토타입은 브라우저로 바로 엽니다.

```bash
git clone git@github.com:Sebit-AI-Infra/SEbit-NOVA.git
cd SEbit-NOVA
git switch dev
start docs/02-design/nova-integrated-workspace.html   # Windows · macOS 는 open
```

패키지가 생기면 아래 형태가 됩니다(설계 기준).

```bash
npm install
npm run dev -w apps/portal      # http://localhost:4000
```

### 브랜치 · PR 규칙

| 브랜치 | 용도 | 직접 push |
|---|---|---|
| `dev` | 개발 · 기본 브랜치 | 금지 — PR 로만 반영 |
| `prod` | 운영 배포 | 금지 — `dev` → `prod` PR 로만 반영 |

`main` 은 두지 않습니다.

1. 최신 `dev` 에서 작업 브랜치를 만듭니다. 이름은 `<작업자>/<종류>-<주제>-<YYYYMMDD>` (종류 = feat · fix · docs · chore · refactor)
   예: `leedy/feat-tokens-scaffold-20261110`
2. 작업 브랜치를 push 하고 **base = `dev`** 로 PR 을 엽니다.
3. 승인자(김혁진 · `@SEHYUNICT-SeBit`)가 검토·승인한 뒤 병합합니다.
4. 운영 반영은 `dev` → `prod` PR 을 같은 방식으로 승인받아 병합합니다.

코드나 기능을 바꾸면 README 와 관련 설계 문서를 **같은 PR** 에서 고칩니다.

## Quality

코드가 생기면 아래 검사를 PR 마다 통과해야 합니다(SEbit 공통 기준).

```bash
npm run lint          # ESLint (@sebit-ai-infra/eslint-config · 커스텀 룰 8개)
npm run test:run      # Vitest
npm run build         # 빌드
```

- 성능 수치는 `benchmarks/` 실측 게이트를 통과하기 전에는 공표하지 않습니다(ADR-L1).
- 다크모드 변형 필수 · 키는 환경변수로만 · catch 에서 하드코딩 기본값 반환 금지.

## 검증

| 항목 | 값 |
|---|---|
| 최근 검증 | 2026-08-03 · 통합 데모 프로토타입 독립 qa 3회차 통과 |
| 결함 | 수정 4건(T6 버블 라벨 겹침·대비 · 라이트 히어로 대비 · 거대 아이콘 렌더 · 복사 거짓 성공) |
| 미결 | 홈 런처 아이콘 크기 변경(36→14px) 판단 · 정본 개정 추인 · T5 최대 행수 · T8 범위 |
| 게이트 | 제품 코드 없음 — 해당 없음 |

## 변경 이력

| 날짜 | 내용 |
|---|---|
| 2026-07-27 ~ 08-03 | 기획·설계·통합 데모 프로토타입 작성(당시 `SEbit-Micro` 레포 `0d0aa6c` · `7c7058e` · `1a13754` · `2a1860d`) |
| 2026-11-09 | 레포 첫 반영 — 기획 9 · 설계 7 · ADR 6 · 프로토타입을 `SEbit-Micro/docs` 에서 옮김(내용 동일) · README · CODEOWNERS · dev/prod 브랜치 구성 |

---

*SEbit AI Infra — SEbit NOVA (2026-11-09)*
