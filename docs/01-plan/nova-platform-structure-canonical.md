# NOVA 플랫폼 구조 — 정본 (Canonical Structure)

> **작성**: 2026-07-31 · planner(기획) · **상태**: 정본(Canonical) — 상위 구조 문서
> **개정**: 2026-08-03 · planner — 마스터 확정(1차 공개 = **17탭 전부** · **17탭 완성 후 일괄 배포** · 데모 URL = ADR-007) 반영: §9-2·§9-3(a) 종결, ②-2C·②-3·②-5 S2·②-6 WBS·②-8·요약 동기 개정
> **정본 근거**: 사용자 확정(2026-07-31) — softbowl 3-part 벤치마크를 NOVA 4-part로 이식. ⛔ 본 문서는 **사용자 확정 구조·순서를 문서화**한 것이며, 구조/배포/코드 결정은 architect·frontend 위임(본문 표기).
> **지위**: 흩어진 `nova-*.md`(2레이어·showcase·워크스페이스·제품데모 등 서로 다른 어휘)의 **상위 정본 인덱스**. 하위 문서는 §7에서 각 part로 귀속.
> **소비자**: architect(배포·URL·링크 구조 설계) · frontend(② 리파인·배포) · 이후 세션(구조 혼선 재발 차단)

---

## 0. 이 문서의 지위 (왜 이 문서가 필요한가)

NOVA는 7/27~31 동안 여러 각도로 기획되며 문서가 **12건 이상** 누적됐고(§7), 그 과정에서 구조를 부르는 말이 문서마다 달랐다 — "2레이어(소개/실제데모)"·"통합 쇼케이스"·"멀티탭 워크스페이스"·"제품 데모"·"showcase". 같은 것을 다른 이름으로 부르며 **혼선**이 생겼다(예: `project_nova_platform` 메모리 안에서만도 갤러리→제품데모→2레이어→멀티탭으로 3회 정정).

**이 문서 = 그 혼선을 종결하는 상위 정본.** 사용자가 2026-07-31 확정한 **softbowl 3-part ↔ NOVA 4-part** 대응으로 전 구조를 한 장에 고정하고, 기존 문서를 각 part의 하위로 귀속시킨다. 앞으로 "NOVA 구조가 뭐냐"는 이 문서를 먼저 본다.

---

## 1. 무엇을 왜

**한 줄**: 소프트보울 SBUx 생태계의 **3-part 전시/판매 구조**(코퍼레이트 소개 · 통합 데모 · 제품별 상세 사이트)를 NOVA에 **그대로 이식**하되, NOVA는 여기에 **실물 제품 레포(④)**를 명시적으로 더한 **4-part**로 세운다.

**해결하는 실제 문제**:
1. **혼선 종결** — 위 §0. 구조를 부르는 말이 통일되지 않아 매 세션 재설명·재정정 비용 발생.
2. **벤치마크 정합** — 소프트보울은 "소개(마케팅)"와 "실제 데모(인터랙션)"를 **분리된 사이트**로 운영한다(근거: 사용자 확정 3 URL + `nova-integrated-demo-analysis.md` §0 "모든 콘텐츠 탭=iframe 정적 로드, home.sb는 별도 앱"). NOVA도 소개(①)와 데모(②③)와 제품(④)을 분리해야 벤치마크와 동형이 된다.
3. **판매 서사** — 방문자가 "소개를 읽고 → 통합 데모로 체험하고 → 제품별 상세를 보고 → 실물을 도입"하는 여정을 벤치마크와 같은 문법으로 밟게 한다.

---

## 2. softbowl 3-part ↔ NOVA 4-part (⛔ 정본 매핑, 사용자 확정)

| # | softbowl (벤치마크·사용자 제시 URL) | 역할 | → | NOVA 대응 part | NOVA 위치/URL | 현 상태 |
|---|---|---|---|---|---|---|
| — | `softbowl.co.kr/front/main.do` | 솔루션 **소개**(코퍼레이트) | → | **① Micro NOVA 랜딩** | `sebit.co.kr/nova/` (Micro 내 페이지, 현 Nexus 랜딩 격) | 미착수 |
| — | `softbowl.co.kr/SBUxDemo/home.sb` | **통합 데모**(멀티탭 업무포털) | → | **② NOVA 통합 데모 대시보드 사이트** | **자체 URL**(독립 배포, ①이 "바로가기"로 링크) | ⭐ **프로토타입 존재**(11탭·`nova-integrated-workspace.html`) |
| — | `sbux.co.kr` · `sbgrid.co.kr` · `sbchart.co.kr` | **제품별 상세** 샘플 사이트 | → | **③ NOVA 제품별 데모** | 제품별 독립(UX·Grid·Chart 상세) | 설계만(`nova-product-demo-*`) |
| — | (SBUx 프레임워크 실물 = 판매품) | **실제 제품**(FE 프레임워크) | → | **④ SEbit-NOVA 제품** | `github.com/Sebit-AI-Infra/SEbit-NOVA` (FE+백엔드 실물) | ⛔ **빈 레포**(2026-07-31 생성·`isEmpty:true`·diskUsage 0·로컬 미클론) |

**해석 주의(정본)**:
- softbowl의 3개 "사이트"(main.do·home.sb·sbux 류)는 **전부 데모/마케팅 레이어**다. 실제로 파는 SBUx 프레임워크(고객이 설치하는 실물)는 그 3사이트가 아닌 **별도 제품**이다. NOVA는 이 실물을 **④로 명시**해 3-part → 4-part가 된다.
- ②의 "통합"은 **제품 나열이 아니라 가상 회사 그룹웨어 셸 안에 NOVA 제품을 심은 멀티탭 업무포털**이다(home.sb 본질, `nova-integrated-demo-analysis.md` §0 판정1). NOVA ②도 동일 문법(가상사 "한올정밀" 통합 업무 포털).

---

## 3. Micro 1depth 개편 (⛔ 정본, 사용자 확정)

**확정 사실 (그대로 문서화)**:
1. Micro 현 최상위 메뉴 **`SEbit Nexus` → `SEbit NOVA`로 대체** (⛔ **흡수 아님**: NOVA가 Nexus를 삼키는 게 아니라, 메뉴 자리에 NOVA를 세운다).
2. **Nexus는 별도 새 1depth로 신설** — NOVA와 **공존**(NOVA·Nexus 둘 다 최상위 메뉴로 존재).
3. **링크 구조 = "바로가기" 패턴**: Micro 랜딩 페이지 → `바로가기` 버튼 → 실 사이트로 이동. (예: 현 `SEbit-Micro/nexus/index.html`에 이미 존재하는 `Nexus 바로가기` → `https://nexus.sebit.co.kr` 패턴 — 실측 확인. NOVA 랜딩도 동일 패턴으로 ②·③·④로 링크.)

**근거 실측**: 현 `nexus/index.html`(Micro 내 소개 페이지)은 Hero에 `<a href="https://nexus.sebit.co.kr" target="_blank">Nexus 바로가기</a>`를 둔 **"소개 페이지 + 실 서비스 바로가기"** 구조다. ① NOVA 랜딩 = 이 문법을 그대로 따른다.

**⚠️ 기존 메모리와의 정합(planner 주의 — §9-1에서 결정 요청)**: `project_sebit_brand_universe` 메모리는 "**NOVA ⊃ Nexus** (NOVA 안에 Nexus)" 및 "nav 순서 AI→NOVA→LUMO→GeoAxis"로 적혀 있다(⛔ 그 메모리 스스로 "최종본 아님" 명기). 이번 확정("Nexus 별도 1depth 공존")은 **최소한 Micro 네비게이션 층위에서는 NOVA·Nexus 공존**을 뜻한다. 세계관 서술(브랜드 계층)과 사이트 IA(메뉴 구성)를 어떻게 정합할지는 **① 착수 시(빌드 순서 #2) planner가 확정** — §9-1 결정 항목.

---

## 4. 링크 구조 & 사용자 여정 (User Journey Map)

**진입 → 핵심행동 → 전환**을 벤치마크 문법으로:

```
[방문자: 고객사 의사결정자 · SI 실무자 · 개발자]
        │
        ▼  sebit.co.kr 진입
┌──────────────────────────────────────────────┐
│ Micro (sebit.co.kr) — 코퍼레이트                │
│ 1depth: [SEbit AI] [SEbit NOVA] [LUMO] [GeoAxis] [SEbit Nexus] … │  ← §3 개편(순서는 §9-1)
└──────────────────────────────────────────────┘
        │ "SEbit NOVA" 클릭
        ▼
┌──────────────────────────────────────────────┐
│ ① NOVA 랜딩 (sebit.co.kr/nova/) — 소개          │
│  · NOVA가 무엇인가(웹표준 플랫폼·5제품)          │
│  · [통합 데모 바로가기 ↗] ─────────────────────┼──→ ② 자체 URL (통합 데모 대시보드 사이트)
│  · [제품별 데모: UX / Grid / Chart ↗] ──────────┼──→ ③ 제품별 데모 사이트
│  · [개발자/도입 문의 · 제품 저장소] ─────────────┼──→ ④ SEbit-NOVA(도입·Portal)
└──────────────────────────────────────────────┘
        │ "통합 데모 바로가기"
        ▼
┌──────────────────────────────────────────────┐
│ ② 통합 데모 대시보드 사이트 (자체 URL) — 체험     │
│  가상사 "한올정밀" 멀티탭 업무 워크스페이스        │
│  · 만지고(탭 열기·크로스필터·테마·편집) 체험      │
│  · 각 탭 우상단 [이 제품 전체 데모 ↗] ───────────┼──→ ③ 해당 제품 데모(깊이)
└──────────────────────────────────────────────┘
```

- **①→② 링크가 이 구조의 핵심**(사용자 강조: "NOVA 랜딩이 링크할 자체 URL"). ②는 Micro 안의 한 페이지가 아니라 **독립 URL을 가진 별도 사이트**다(home.sb가 front/main.do와 분리된 것과 동형).
- ②→③ 깊이 이동은 "맛보기(②) → 제품 전수 데모(③)" — 설계 `nova-integrated-workspace-design.md` §5-3의 `[전체 데모 ↗]` 새 창 링크로 이미 골격 존재. ③ 미빌드 시점의 링크 처리 = §9-3 결정.

---

## 5. 빌드 순서 (⛔ 정본, 사용자 지정) = ② → ① → ③ → ④

| 순서 | part | 왜 이 순서인가 (planner 해설 — 순서 자체는 사용자 확정, 변경 금지) |
|---|---|---|
| **1** | **② 통합 데모 대시보드 사이트** | 플래그십 체험물이자 **이미 프로토타입(11탭)이 존재** → 리파인+배포로 가장 빠르게 "만질 수 있는 NOVA"를 세운다. ①이 링크할 대상이므로 먼저 있어야 링크가 산다. |
| **2** | **① Micro NOVA 랜딩** | ②라는 링크 대상이 생긴 뒤, 그것으로 이끄는 소개 페이지를 만든다. `nexus/` 바로가기 패턴 재사용(§3). Micro 1depth 개편 동반. |
| **3** | **③ 제품별 데모** | ②(통합 탭 데모)를 **제품별로 쪼개 확장**(sbux/sbgrid/sbchart 격). ②의 탭 렌더러 자산을 제품 축으로 재편성. |
| **4** | **④ SEbit-NOVA 제품** | FE 패키지+백엔드 실물(빈 레포 → 스캐폴딩). 가장 무겁고, ②의 **실연결(샘플→실데이터)**이 여기에 의존 → 맨 뒤. |

> ⛔ **순서 불변**: 위 순서는 사용자 지정. planner/architect가 임의 재배열 금지. "해설" 열은 순서의 논리를 설명할 뿐 순서를 바꾸는 근거가 아니다.

---

## 6. 4-part 각 상세 (무엇을 · 현 자산 · 담당)

### ① Micro NOVA 랜딩 (소개)
- **무엇을**: `sebit.co.kr/nova/` — NOVA가 무엇인지(웹표준 플랫폼·5제품 UX/UI/Grid/Chart/Dashboard)를 소개하고 ②③④로 **바로가기** 링크. 현 `nexus/index.html` 소개 페이지와 동급 격.
- **현 자산**: `micro-renewal-spec.md`(Micro 개편 기획, 부분) · `nexus/index.html`(랜딩+바로가기 패턴 참조원) · 브랜드 토큰(딥퍼플·오로라, `project_sebit_brand_universe`).
- **담당**: planner(② 확정 후 ① 기획) → architect(라우팅·nav 개편) → frontend(순수 HTML/CSS/JS, ⛔ Micro 프레임워크 금지·`deploy.sh` allowlist).
- **상태**: 미착수(빌드 순서 #2).

### ② NOVA 통합 데모 대시보드 사이트 (통합 데모) — 본 문서 후반 스펙 대상
- **무엇을**: home.sb 격. 가상사 멀티탭 업무 워크스페이스로 NOVA 5제품이 조립된 모습을 **만지며 체험**. **자체 URL**(①이 링크).
- **현 자산**: ⭐ **프로토타입 실존** `nova-integrated-workspace.html`(11탭·자체완결 HTML·약 183KB) · 설계 정본 `nova-integrated-workspace-design.md`(셸5층·ADR001~006) · 벤치 분석 `nova-integrated-demo-analysis.md`(home.sb 38/38).
- **담당**: planner(본 스펙) → frontend(리파인·T6 버블 마감) → architect(배포·자체 URL) → 독립 qa(재계측).
- **상태**: 프로토타입 → **배포 가능 사이트화 대상**(본 문서 스펙).

### ③ NOVA 제품별 데모 (제품별 상세)
- **무엇을**: sbux/sbgrid/sbchart 격. NOVA **UX·Grid·Chart를 제품별 독립 사이트**로 각각 다양한 샘플+상세 설명. ②의 통합 탭을 제품 축으로 쪼개 확장. (NOVA Doc = 데모 없이 소개만 = SBWrapDoc 동일.)
- **현 자산**: `nova-product-demo-benchmark.md`(벤치) · `nova-product-demo-design.md` · `nova-product-demo-site-design.md`(설계) · 폐기 프로토타입 `b9c86d0e`(통합 탭본 — ③으로 쪼갤 재료).
- **담당**: planner(③ 기획) → architect → frontend.
- **상태**: 설계만(빌드 순서 #3).

### ④ SEbit-NOVA 제품 (실물)
- **무엇을**: FE 패키지(tokens·ux·grid·chart·dashboard·ui-templates)+백엔드(API-On Gateway·Nexus Flow 소비)+Portal의 **실 제품**. ②③가 데모하는 대상의 실체. ②의 **실연결**(실데이터)이 여기에 의존.
- **현 자산**: ⛔ **빈 레포**(`github.com/Sebit-AI-Infra/SEbit-NOVA`·`isEmpty:true`·로컬 미클론) · 전체 기획 `nova-platform-spec.md`(6제품·MoSCoW·P1~P6) · 전체 설계 `nova-platform-architecture.md`(ADR30) · Chart 하베스트 `nova-viz-asset-inventory.md`(코어=Canvas `CanvasChartWrapper`).
- **담당**: architect(스캐폴딩·GH Packages) → backend/frontend(패키지 빌드) → devops(배포). 백엔드 ≈ SEbit 4축(SSO·RBAC·승인·AI) 소비.
- **상태**: 레포 준비됨(빈 상태)·제품코드 미빌드(빌드 순서 #4).

---

## 7. 기존 nova-*.md 문서 정리 (⛔ 상위 정본화 — 각 문서를 part로 귀속)

| 기존 문서 | 다루는 part | 새 지위(본 정본 하위) |
|---|---|---|
| **본 문서** `nova-platform-structure-canonical.md` | 전체 | ⭐ **상위 정본**(구조 인덱스) |
| `nova-platform-spec.md` | ④(전체 제품) | 제품 기획 정본(④) |
| `nova-platform-architecture.md` | ④(전체 제품) | 제품 아키텍처 정본(④·ADR30) |
| `nova-viz-asset-inventory.md` | ④ Chart | Chart 하베스트 카탈로그(④·②) |
| `nova-chart-adoption-migration-plan.md` | ④ Chart | 손코딩 SVG 부채 마이그레이션(④ 후) |
| `nova-superiority-benchmark.md` | 공통 | 상회 벤치마크(정직 원장) |
| `nova-feature-coverage-checklist.md` | 공통 | SBUx 커버리지 체크리스트 |
| `micro-renewal-spec.md` | ① | Micro 개편 기획(①) |
| `nova-integrated-demo-analysis.md` | **②** | home.sb 벤치 분석(② 근거) |
| `nova-integrated-workspace-design.md` | **②** | ⭐ ② 설계 정본(셸5층·ADR001~006) |
| `nova-integrated-workspace.html` | **②** | ⭐ ② 프로토타입 실물(11탭) |
| `nova-integrated-demo-design.md` | ② | ② 구 설계(상황실 탭 상세 — 워크스페이스 설계에 흡수됨) |
| `nova-showcase-design.md` | ② | ② 구 쇼케이스 설계(토큰 원장 부록 A만 유효) |
| `nova-product-demo-benchmark.md` | **③** | ③ 벤치 |
| `nova-product-demo-design.md` | **③** | ③ 설계 |
| `nova-product-demo-site-design.md` | **③** | ③ 제품별 사이트 설계 |

> ⛔ **폐기 프로토타입 명시**(혼선 차단): `4133d90a`(서비스 갤러리·정체성 오설정) 폐기 · `b9c86d0e`(통합 탭 제품데모·③으로 쪼갤 재료) · `f6404aac`(단일 대시보드·②의 T1 한 탭에 편입됨). 현 ② 정본 프로토타입 = `nova-integrated-workspace.html` **하나뿐**.

---

## 8. 기존 "2레이어" 모델과의 정합 (메모리 reconcile)

`project_nova_platform` 메모리(2026-07-29)의 "**2레이어(소개 vs 실제 데모)**"는 폐기가 아니라 **4-part로 정밀화**된 것이다. 모순 아님 — 같은 것의 세분화:

| 2레이어(구 어휘) | → | 4-part(본 정본) |
|---|---|---|
| 레이어1 소개(Micro) | → | **①** Micro NOVA 랜딩 |
| (통합 데모 — 레이어1이 링크) | → | **②** 통합 데모 대시보드 사이트 (**자체 URL로 명시 분리**) |
| 레이어2 실제 데모(제품별) | → | **③** 제품별 데모 |
| (SEbit-NOVA 실물 — 암묵) | → | **④** SEbit-NOVA 제품 (**명시**) |

**4-part가 더한 것 = ②·④의 명시적 분리.** 특히 ②를 "①이 링크하는 자체 URL 사이트"로 못 박은 것이 이번 확정의 핵심 정밀화다.

---

## 9. 결정이 필요한 것 (사용자·architect 확정 대상 — 선택지 + 추천)

### 9-1. Micro nav 최종 구성·순서 & 세계관 정합 (① 착수 시)
- **확정**: NOVA·Nexus 둘 다 1depth 공존(§3).
- **미정**: nav 내 순서/위치 + `brand_universe` "NOVA⊃Nexus·순서 AI→NOVA→LUMO→GeoAxis" 서술과의 정합.
- 선택지: (A) AI·NOVA·LUMO·GeoAxis·Nexus 5개 병렬 / (B) 4대 브랜드(AI·NOVA·LUMO·GeoAxis) + Nexus를 NOVA 서브 진입점으로 병기.
- **[내 추천]**: **빌드 순서상 ②가 먼저이므로 지금 결정 불요** → ① 착수(순서 #2) 시 planner가 사용자와 확정. 지금은 "NOVA·Nexus 공존"만 정본으로 고정.

### 9-2. ②의 자체 URL / 배포 위치 — **종결(2026-08-03)**
- **확정**: architect ADR-007(`../02-design/nova-demo-site-deployment-architecture.md` §1) = **`nova-demo.sebit.co.kr`**(별도 CF Pages 프로젝트 `sebit-nova-demo`) — 마스터 승인. 아래는 결정 이력 보존.
- **미정(구)**: ②가 어디에 어떤 URL로 배포되는가.
- 고려사항(결정 아님·architect 판단 재료): ⛔ **ISS-276/277 학습** — Micro `deploy.sh`는 allowlist 스테이징으로 기밀 유입을 막는다. ②를 Micro에 얹으면 allowlist 경유 필수. ② 자체완결 HTML은 별도 배포 타깃(서브도메인/CF Pages 프로젝트/`nova.sebit.co.kr` 하위 경로)도 가능.
- **[내 추천]**: architect가 정하되 **요구는 명확** — (1) ①이 링크할 **안정적 공개 URL** 1개, (2) 기밀 유입 0(ISS-276/277 재발 금지), (3) ④ 실 서비스와 URL 충돌 없음.

### 9-3. ② 1차 배포 범위 & ③ 링크 처리
- **확정 (a) — 종결(2026-08-03 마스터 확정)**: 1차 공개 범위 = **17탭 전부**(2차 6탭 T4·T5·T8·T10·T11·T13을 1차 범위로 편입) + 배포 시점 = **17탭 완성 후 일괄 배포**. 6탭 기능정의 = `nova-demo-tier2-tabs-spec.md`(본 정본 하위 스펙).
  - ~~[구 추천] 11탭 배포 우선~~ — **기각**(이력 보존: 구현·검증된 11탭 선노출 안이었으나, 마스터가 커버리지 완결 상태의 일괄 공개를 확정).
- **미정 (b)**: ③ 미빌드 시점의 `[전체 데모 ↗]` 링크 처리.
  - **[내 추천]**: ③ 존재 전까지 **링크 숨김 또는 ① 소개로 회귀**(⛔ sbux "준비중 alert" 반면교사 — 죽은 링크·alert 금지). ③ 빌드 후 실 URL 연결.

---
---

# [부] ② 통합 데모 대시보드 사이트 — 기능정의서 (스펙)

> 빌드 순서 #1. 본 스펙 = **"현 프로토타입을 제대로 된 배포 가능 데모 사이트로 발전"**시키는 무엇/범위/수용기준. ⛔ 구조·배포위치·코드는 architect/frontend 위임(②-7).

## ②-1. 무엇을 왜

**한 줄**: 현 멀티탭 워크스페이스 프로토타입(`nova-integrated-workspace.html`, 11탭)을 **배포 가능한 독립 "NOVA 통합 데모 대시보드 사이트"**로 발전시킨다 — home.sb 격, 자체 URL, ① 랜딩이 링크.

**해결하는 문제**: 방문자(고객사 의사결정자·SI 실무자)가 "NOVA 제품들로 조립한 실제 업무 워크스페이스는 이렇게 생겼고, **우리 업무도 이 안에 탭으로 들어온다**"를 **만지며** 확신하게 한다(설계 §0-2). 소프트보울 home.sb가 mock·1920고정·테마미구현인 지점을 **live 크로스필터·반응형·테마 실전환·실경계 지도**로 상회(설계 §6).

## ②-2. 사용자가 말한 것 / 내가 제안하는 것

**사용자가 말한 것 (확정 — 그대로 이행)**:
1. 현 프로토타입을 **제대로 된 "NOVA 샘플 데모 대시보드 사이트"로 발전**.
2. **배포 가능 사이트화** + **NOVA 랜딩이 링크할 자체 URL**.
3. **현 프로토타입 리파인 + T6 버블 마감**.
4. **샘플데이터로 시작**, **실연결은 ④ 백엔드 후**.
5. **데모/제품 경계** 명시.
6. 구조·배포위치·코드 = architect/frontend 위임.

**내가 제안하는 것 [planner 제안]**:
- A. ②를 **3 Phase로 분리**(리파인 → 사이트화 → 실연결). 실연결(P3)은 ④ 의존이므로 빌드 순서상 **맨 뒤**에 자연 배치 → 사용자 "샘플로 시작, 실연결 ④ 후"와 정합.
- B. "T6 버블 마감"을 **검증 가능 수용기준으로 정의**: 버블 차트 라벨 AA 대비 ≥4.5(라이트/다크 양모드) **계측 통과** + 잔여 폴리시 종결. (근거: 프로토타입에 이미 `fill-opacity 0.35→0.22` AA 대응 흔적 존재 → 최종 계측 확정만 남음.)
- C. ~~1차 11탭 배포 우선~~ — **기각·종결**(2026-08-03 마스터 확정: 1차 = 17탭 전부·완성 후 일괄 배포, §9-3(a)).
- D. ③ 미빌드 시점 `[전체 데모↗]` 링크는 숨김/회귀(§9-3).

## ②-3. 범위 (하는 것 / 안 하는 것)

**하는 것**:
- 현 11탭 프로토타입 **리파인**(T6 버블 마감 + 설계 §10 체크리스트 잔여 폴리시 + 독립 qa 재계측·회귀0).
- **배포 가능 정적 사이트화**: 자체완결 HTML을 배포 형태로 패키징(⛔ standalone 추출 시 `<!doctype><html lang><head><meta charset><meta viewport>` **4줄 골격 필수** — 없으면 쿼크모드·모바일 980px 폴백, `project_nova_platform` P1 노트).
- **자체 URL 확보**(①이 "통합 데모 바로가기"로 링크할 대상).
- **샘플 데이터 기반 유지**(단일 원장 파생·크로스필터 — 설계 §7 자산).
- **데모/제품 경계 명시**(X-ray 태그로 "정식판 = NOVA Chart(ECharts 6.0)" 제품 귀속 표기 — 설계 §3-5-B).
- **정직 장치 유지**(예시 배지 1곳·라이브 배선 자리 명시·"한올정밀 예시" 푸터).

**안 하는 것 (경계)**:
- ⛔ **실 백엔드 연결**(실데이터 바인딩) — ②-P3(④ 후) 별도 Phase.
- ⛔ **④ SEbit-NOVA 제품 코드 빌드**(패키지·실 ECharts·백엔드) — part ④.
- ⛔ **③ 제품별 데모 사이트 구축** — part ③.
- ~~2차 채움 6탭(T4·T5·T8·T10·T11·T13)~~ → **1차 범위로 편입**(2026-08-03 마스터 확정 — 스펙 = `nova-demo-tier2-tabs-spec.md`). ⛔ home.sb 잔여 항목(설계 §4-3 로드맵 — orgchart 리치노드·홈 "추가 예정" 배지 10종 등)은 여전히 범위 밖.
- ⛔ **실 서비스 SVG→NOVA Chart 교체**(부채 마이그레이션, `nova-chart-adoption-migration-plan.md`) — ④ 실물 후.

## ②-4. ⛔ 데모 / 제품 경계 (혼동 금지 — 사용자 명시 요구)

| 축 | **② 통합 데모** (지금 만드는 것) | **④ SEbit-NOVA 제품** (나중 실물) |
|---|---|---|
| 목적 | 전시·영업·**체험**(맛보기+조립 증명) | 실제 **도입·판매** |
| 데이터 | **샘플**(단일 원장 파생, `[예시 데이터]` 배지) | **실데이터**(Origin→API-On Gateway 등) |
| 차트 렌더 | **인라인 SVG 드로어**(외부 CDN 0) | 실 **NOVA Chart**(ECharts 6.0 패키지) |
| 그래프 차별화(T15·T17) | 인라인 SVG 대표 + X-ray로 실엔진(Vue Flow) 표기 | 실 Vue Flow / ECharts `graph` |
| 형태 | **자체완결 단일 HTML** | 모노레포 **패키지**(FE+백엔드) |
| 배포 | 정적 사이트(자체 URL) | 실 서비스(`nova.sebit.co.kr`:4000 등) |
| 제품 귀속 | X-ray 태그로 "**정식판 = NOVA Chart/Grid/UX**" 명시 | 실물 그 자체 |
| 실연결 | ②-P3(④ 후)에 샘플→실데이터 **1위젯 이상** | 전면 실데이터 |

> **한 줄 경계**: ②는 **"NOVA 제품으로 이런 걸 만들 수 있다"를 샘플로 증명**하는 데모다. ④는 **"NOVA 제품 그 자체"**(고객이 도입하는 실물)다. ②의 차트는 그림(SVG)이고, ④의 차트는 엔진(ECharts)이다. X-ray가 그 다리를 놓는다.

## ②-5. 성공 판정 (⛔ 검증 가능해야 함)

| # | 질문(무엇이 되면 성공인가) | 정답 / 판정 방법 |
|---|---|---|
| S1 | ① NOVA 랜딩의 "통합 데모 바로가기" 클릭 → ②가 **자체 URL로 열리는가** | 실 URL HTTP 200 + 워크스페이스 렌더(새 창) |
| S2 | **17탭 전부 실화면**으로 열리는가 (빈 탭·"준비중" alert 0) — 2026-08-03 개정(마스터 확정 1차=17탭) | 홈+T1~T17 각 오픈 → 렌더 계측 + **17탭 전부 오픈 상태에서 탭바 오버플로(설계 D3 드롭다운) 정상·성능 저하 없음**(tier2 스펙 R3) |
| S3 | **T6 버블 마감** — 버블 차트 라벨 대비 통과 | 라이트/다크 양모드 대비 **계측 ≥4.5**(눈대중 금지, `feedback_visual_verify_measure_not_eyeball`) |
| S4 | **데모/제품 경계**가 X-ray로 명시되는가 | X-ray 켜기 → 차트에 `chart:ECharts6/<type>`·"정식판=NOVA Chart" 태그 노출 |
| S5 | **샘플 데이터임이 정직 표기**되는가 | `[예시 데이터]` 배지 1곳 + "라이브 배선 자리=placeholder" 문구 + 실URL/실서비스명 0 |
| S6 | home.sb **상회 축 유지** | 테마 전환 전 탭 관통 · 크로스필터 6경로 · 실경계 지도 드릴다운 · 반응형 4단 (설계 §6·§10) |
| S7 | **자체완결·성능** | 파일 ≤480KB · 외부 요청 0 · standalone 골격 4줄(모바일 정상) |
| S8 | **독립 검증 통과** | ⛔ 만든 frontend가 아닌 **독립 qa/ui-designer** 재계측 PASS·회귀0(설계 §10 전수) |

> ⛔ **판정 기준 정본 = 설계 `nova-integrated-workspace-design.md` §10 체크리스트**(멀티탭·keep-alive·TabWorkspace 차별화6·X-ray·breadth·차별화3종·테마관통·실경계지도·타이머규율·접근성·반응형·정직). 본 표(S1~S8)는 그 위에 **② 사이트 레벨**(자체 URL·①링크·배포·데모경계) 판정을 더한 것.

## ②-6. WBS

| Phase | 내용 | 담당 | 완료 판정 |
|---|---|---|---|
| **②-P0** | 본 스펙 확정 + architect/frontend 위임 브리핑 | planner | 사용자 확인(main 검증 후) |
| **②-P1** | 프로토타입 **리파인**(기존 11탭) — T6 버블 마감 + 설계 §10 잔여 폴리시 + 독립 qa 재계측 | frontend → 독립 qa | S3·S6·S8 PASS·회귀0(기존 탭 기준) |
| **②-P1b** *(2026-08-03 신설)* | **2차 6탭 증분 구현**(T4·T5·T8·T10·T11·T13) — 상세 WBS = `nova-demo-tier2-tabs-spec.md` §9 | frontend → 독립 qa | 탭별 S-T#·SC 전항 PASS + 증분마다 기존 탭 회귀0 |
| **②-P2** | **배포 가능 사이트화** — standalone 골격·자체 URL(`nova-demo.sebit.co.kr`, ADR-007)·배포. 준비 작업은 P1b와 병행 가능하되 ⛔ **공개 배포 = 17탭 완성 + S2 PASS 후 일괄**(마스터 확정) | architect(위치·URL) → frontend(패키징) → devops | S1·S2·S5·S7 PASS(자체 URL 200·① 링크 연결·기밀유입0) |
| **②-P3** *(④ 후)* | **실연결** — 샘플→실데이터 1위젯 이상(정직 배선) | backend(④) → frontend | 실 소스 표기·라이브 배선 실동작(`no-direct-origin-call` 준수·시뮬원천이면 정직표기) |

> **의존성**: P1·P1b·P2 준비는 지금 착수 가능(빌드 순서 #1) — 단 **공개 배포는 17탭 완성 후 일괄**(마스터 확정). **P3는 ④ 백엔드 존재가 전제** → 빌드 순서상 ④(#4) 이후. 사용자 "샘플로 시작, 실연결 ④ 후"와 정합.

## ②-7. 위임 (⛔ 구조·배포·코드 = architect/frontend)

- **architect 결정 위임**: (1) ② **배포 위치·자체 URL 스킴**(서브도메인 vs Micro 경로 vs CF Pages 프로젝트 — §9-2 요구 3건 충족) · (2) ②→③→④ **링크 구조**(새 창·경로) · (3) 자체완결 HTML을 **레포/배포에 넣는 방식**(ISS-276/277 기밀유입 가드) · (4) standalone 골격 적용 방식.
- **frontend 구현 위임**: (1) **T6 버블 마감** 잔여 실체(fill-opacity·라벨 배치 최종 계측) · (2) 설계 §10 잔여 폴리시 · (3) standalone 4줄 골격 · (4) 독립 qa 재계측 대응 수정.
- **planner(나) 다음 산출**: 본 스펙 확정 후 → ①(빌드 순서 #2) 기획 착수(Micro nav 개편·§9-1 확정 포함).

## ②-8. ② 관련 결정 필요
- ~~§9-2(자체 URL)~~ · ~~§9-3(a) 배포 범위~~ **종결**(2026-08-03: URL = ADR-007 `nova-demo.sebit.co.kr` · 1차 = 17탭 완성 후 일괄). **잔여 미정 = §9-3(b) ③ 링크 처리** + tier2 스펙 §8-2 (b)(c). P1(리파인)·P1b(6탭 증분)는 잔여 결정 없이 착수 가능.

---

## 요약 (3줄)
1. **NOVA = softbowl 3-part의 4-part 이식**(정본): ① Micro NOVA 랜딩(소개) · ② 통합 데모 대시보드 사이트(home.sb 격·**자체 URL**) · ③ 제품별 데모(sbux류) · ④ SEbit-NOVA 실물(**빈 레포 확인**) — Micro 1depth는 `Nexus→NOVA 대체(흡수 아님)+Nexus 별도 1depth 공존`, 빌드 순서 **②→①→③④**(사용자 확정).
2. **② 스펙 = 현 프로토타입(`nova-integrated-workspace.html`)을 17탭 완성 데모 사이트로 발전** — P1 리파인(T6 버블 마감)·P1b 6탭 증분(1차 = 17탭 전부, 2026-08-03 마스터 확정·`nova-demo-tier2-tabs-spec.md`)·P2 사이트화(`nova-demo.sebit.co.kr`, 17탭 완성 후 일괄 배포)·P3 실연결(④ 후). ⛔ **데모(샘플·SVG)/제품(실데이터·ECharts) 경계**를 X-ray로 명시.
3. ⛔ **구조·배포·코드 결정은 architect/frontend 위임**(본 문서 §9·②-7 표기). 정본 문서 = `SEbit-Micro/docs/01-plan/nova-platform-structure-canonical.md`. **main 검증 → 사용자 확인 후 ②-P1 착수.**
