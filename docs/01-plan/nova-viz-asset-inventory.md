# SEbit 시각화 자산 카탈로그 — NOVA Chart/Dashboard 하베스트 근거

> 목적: NOVA Chart/Dashboard가 "처음부터 새로 짜기"가 아니라 **우리가 이미 만든 실제 시각화 자산을 하베스트·포함**하도록.
> ⛔ SEbit 메타룰(`c:\SEbit\CLAUDE.md §0`): 1:1 차용·새로짜기 금지 / ⛔ 발명 금지·실코드 근거(파일:라인)만.
> 조사 기준시각: 2026-07-29 (c:\SEbit 로컬 실코드 grep·Read)
> 조사자: research 정찰 (실코드 실사, 추측 없음)

---

## 0. 한눈에 (요약)

- **시각화 자산 보유 레포 = 9개** (Origin·PROVE·PROVES·Stock·Nexus·Sentinel·API-On·Canvas·Insight). Cure·EHS = KPI 그리드만(차트 라이브러리 없음).
- **차트 엔진 2계열 병존**:
  - **ECharts + vue-echarts** — Origin·PROVE·PROVES(**v6.0 / vue-echarts 8**) · Stock·Canvas·Nexus·Sentinel·API-On(**v5.6 / vue-echarts 7**). (`package.json` 실측)
  - **Vue Flow(@vue-flow/core)** — Nexus·Sentinel·API-On (노드 그래프/플로우 에디터·온톨로지 그래프)
  - **recharts(React)** — Insight (Next.js 앱, 별세계)
- ⛔ **핵심 발견 1 — "선언했지만 안 쓴다"**: Nexus·Sentinel·API-On 3개는 `package.json`에 echarts를 넣어놨지만 **app 코드에서 vue-echarts/VChart를 단 한 곳도 렌더하지 않음**(grep 0건). 대신 대시보드 시각화를 **손으로 짠 인라인 SVG**(도넛·라인·게이지)로 구현. → **NOVA Chart 하베스트 1순위 = 이 손코딩 SVG를 NOVA Chart로 대체**.
- ⛔ **핵심 발견 2 — 버전 파편화**: ECharts 6(Origin/PROVE 계열) vs 5.6(나머지), vue-echarts 8 vs 7 혼재. NOVA는 확정 D5=ECharts 6.0 기준 → **6 계열(Origin/PROVE) 래퍼가 최신·정본 후보**.
- **재사용 컴포넌트 = 최소 11개**(아래 §재사용 표). 이 중 **테마 자동 동기화 래퍼**(Canvas `CanvasChartWrapper`)와 **금융 인터랙션 라인**(Stock `SkEquityChart`)이 NOVA Chart에 바로 흡수할 완성 자산.

---

## 1. 레포별 시각화 자산 표

### 1-1. Origin — ECharts 래퍼 + 플러그인(5종 등록)

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | echarts ^6.0.0 / vue-echarts ^8.0.1 | `SEbit-Origin/package.json` |
| 등록 차트 | **Line·Pie·Bar·Graph·Gauge** 5종 tree-shaking 등록 | `app/plugins/echarts.client.ts:3,12` |
| 등록 컴포넌트 | Grid·Tooltip·Legend·Title·**DataZoom** | `echarts.client.ts:4-7` |
| 재사용 래퍼 | `OriginChart.vue` — `<VChart>` ClientOnly 래퍼, 기본 높이 280px, autoresize, 로딩 스피너 fallback | `app/components/ui/OriginChart.vue:1-14` |
| ⚠️ 실사용 | 현재 `app/pages/*` 에서 OriginChart/VChart **직접 소비 0건**(grep). 래퍼+플러그인은 완비, 대시보드 연결은 미연결/레거시 상태 | `app/pages/index.vue` grep 0 |
| 고유점 | **Graph(관계형)·Gauge** 를 미리 등록 — integration 도메인 토폴로지/게이지 대비 자산 | plugin 근거 |

### 1-2. PROVE — 도메인 차트 2종(제조 검증)

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | echarts ^6.0.0 / vue-echarts ^8.0.1 | `SEbit-PROVE/package.json` |
| `LineChart.vue` | **영역 라인**(smooth, areaStyle opacity 0.15, emerald #10b981) — 월별 검증 완료 추이 | `app/components/chart/LineChart.vue:15-36` |
| `DonutChart.vue` | **도넛/링 파이**(radius 45~70%, center 50/45), 완료/진행/실패 3분할 + 색코드(#10b981/#f59e0b/#ef4444) | `app/components/chart/DonutChart.vue:15-30` |
| 데모/문서 | ui-guide 차트 카탈로그 페이지(Prop 표 + 라이브 프리뷰 + CodeBlock) | `app/pages/system/ui-guide/charts.vue:1-90` |
| 특수 SVG | SMD/UnitWork 리포트에 **커스텀 SVG 마일스톤 아이콘**(diamond/wave polygon path) + KPI 그리드(grid-cols-5) | `app/pages/smd-sim/report.vue:139`, `unit-work-sim/report.vue:231-233` |
| 고유점 | **BOP L1→L2→L3 검증 추이** 도메인 라인/도넛. ui-guide가 "차트=문서화" 패턴(NOVA 데모 갤러리 원형) | — |

### 1-3. PROVES — PROVE 미러(SCP 버전)

| 구분 | 내용 | 근거 |
|---|---|---|
| 엔진 | echarts ^6.0.0 / vue-echarts ^8.0.1 | `SEbit-PROVES/frontend/package.json` |
| 컴포넌트 | `LineChart.vue`·`DonutChart.vue` (PROVE와 동일 구조) + ui-guide/charts | `frontend/app/components/chart/*.vue`, `pages/system/ui-guide/charts.vue` |
| 판정 | PROVE 자산의 복제본 — NOVA 하베스트 시 **PROVE 원본 하나로 통합**(중복 제거 대상) | — |

### 1-4. Stock — 금융 인터랙션 라인(최고 완성도)

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | echarts ^5.6.0 / vue-echarts ^7.0.0 | `SEbit-Stock/package.json` |
| `SkEquityChart.vue` | **자산 곡선(equity curve) 라인** — 높이 300px | `app/components/SkEquityChart.vue` |
| ─ dataZoom | `inside` + `slider` 이중 줌(하단 20px 슬라이더, 다크 대응 fillerColor) | `SkEquityChart.vue:65-76` |
| ─ markLine | **원금 기준선**(dashed #F59E0B, "원금 $..." 라벨) — P&L 기준 오버레이 | `SkEquityChart.vue:94-107` |
| ─ 그라디언트 area | linear gradient(상단 0.3→하단 0 투명), 다크/라이트 분기 | `SkEquityChart.vue:84-93` |
| ─ 커스텀 tooltip | 손익 금액·수익률 계산 + 색상 분기(#22C55E/#EF4444) HTML 렌더 | `SkEquityChart.vue:23-37` |
| 고유점 | **금융 특화 라인**(줌·기준선·손익 툴팁·그라디언트) = softbowl 일반 라인 상회. NOVA "실시간/트레이딩" 차트 시드 | — |

### 1-5. Nexus — Vue Flow 노드 에디터(19종) + 손코딩 SVG 라인

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | **@vue-flow/core 1.48 + background/controls/minimap** / echarts 5.6 **선언만·미사용** | `package.json`; app grep echarts=0 |
| 플로우 빌더 | 드래그&드롭 노드 캔버스, 커스텀 노드(type:'custom'), 카탈로그 API 기반 팔레트, 미니맵 | `app/pages/flow-builder/index.vue:2,57,94-114` |
| **19종 AI 노드** | input·prompt·chain·tool·parser·router·transformer·aggregator·memory·classifier·output·webhook·decision·llm·embedding·retrieval·batch-processor·oracle-connector·splitter | `server/engine/ai/nodes/*.ts` (19 파일 실측) |
| 노드 카테고리 | input·ai·logic·output·data 등 색코드(#6366F1/#8B5CF6/#0EA5E9/#F59E0B/#22C55E) | `flow-builder/index.vue:661-733` |
| 실행 오버레이 | executionStatus·chainOfThought·executionOutput 노드에 주입(실행 결과 시각화) | `flow-builder/index.vue:114` |
| 손코딩 SVG | monitor 페이지에 인라인 SVG 라인(reqPath/errPath) | `app/pages/monitor/index.vue` (svg grep) |
| 고유점 | **AI 워크플로우 노드 그래프**(Vue Flow) = softbowl에 없는 시각화 축. lineage(계보) 그래프도 보유 | `pages/lineage/index.vue` |

### 1-6. Sentinel — 온톨로지 그래프(Vue Flow) + 애니메이션 SVG 도넛/라인

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | **@vue-flow/core 1.41** / echarts 5.6 **선언만·미사용** | `package.json`; app grep echarts=0 |
| **지식 그래프** | VueFlow 온톨로지 뷰 — 노드/엣지(animated smoothstep), 카테고리별 색, fit-view, zoom 0.2~2.5 | `app/pages/admin/ontology.vue:2,38-40,316` |
| SVG 도넛 | 대시보드 "원인 분석" — SVG `<circle>` stroke-dasharray 로 도넛 세그먼트 + **cubic-bezier 순차 애니메이션**(idx*0.15s) | `app/pages/dashboard/index.vue:485-497` |
| SVG 라인 | cases/trends — SVG viewBox 라인 차트 + **임계선 dashed 오버레이**(2,1) + path fill | `app/pages/cases/trends.vue:245-274` |
| 스레드 뷰 | monitoring/threads 시각화 | `app/pages/monitoring/threads.vue` (svg grep) |
| 고유점 | **이상탐지 인과 그래프(온톨로지)** + **애니메이션 도넛** = 손코딩이지만 인터랙션 완성도 높음. NOVA Graph/Chart 하베스트 대상 | — |

### 1-7. API-On — 워크플로우 디자이너(Vue Flow) + SVG 시계열

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | **@vue-flow/core 1.48** / echarts 5.6 **선언만·미사용** | `package.json`; app grep echarts=0 |
| 디자이너 | iPaaS 파이프라인 노드 에디터(http-trigger·data-mapper·api-gateway·db-sink·circuit-breaker·dlq-handler 등), 프리셋 플로우 | `app/pages/designer/index.vue:238-241,662-718` |
| SVG 시계열 | sla.vue — SVG 라인(reqPath #nx-primary / errPath #nx-danger) + grid line + 애니메이션 circle | `app/pages/sla.vue:344-385` |
| 게이지 UI | i-lucide-gauge 아이콘 KPI(실차트 아님) | `app/pages/sla.vue:186` |
| 고유점 | **API 파이프라인 토폴로지** + SLA 시계열. Nexus/API-On 디자이너는 동일 Vue Flow 계열(공통화 여지) | — |

### 1-8. Canvas — 테마 동기화 ECharts 래퍼 + 위젯 레지스트리

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | echarts ^5.6.0 (vue-echarts 없이 `echarts/core` 직접 init) | `package.json` |
| `CanvasChartWrapper.vue` | **Line·Bar·Pie·Scatter** 등록, `echarts.init` 직접, **다크/라이트 테마 자동 동기화**(watch isDark → setOption 재적용), resize 핸들러, dispose 정리 | `app/components/canvas/data/CanvasChartWrapper.vue:21,29,47-85` |
| 위젯 레지스트리 | 재사용 컴포넌트 카탈로그(카테고리 kpi/data/status/display) | `app/composables/useCanvasRegistry.ts:33-46` |
| ─ KPI Card | `CanvasKpiCard` — label·value·trend·icon | `useCanvasRegistry.ts:62-73` |
| ─ Stats Grid | `CanvasStatsGrid` — StatsGridItem[] 컴팩트 대시보드 | `useCanvasRegistry.ts:76-85` |
| ─ Chart Wrapper | `CanvasChartWrapper` — EChartsOption 주입, 테마 자동 | `useCanvasRegistry.ts:112-121` |
| ─ Timeline | `CanvasTimeline` — items(title/time/color) | `useCanvasRegistry.ts:392-398` |
| 고유점 | **테마 자동 동기화 + dispose 안전 처리 + 레지스트리(등록형 확장)** = NOVA Chart Wrapper 아키텍처의 사실상 프로토타입. NOVA "등록형 Wrapper 확장"(superiority-benchmark §플러그인)의 실물 근거 | — |

### 1-9. Insight — recharts(React) 매출 대시보드

| 구분 | 내용 | 근거(파일:라인) |
|---|---|---|
| 엔진 | **recharts ^2.15.0** (Next.js/React, `src/components`, .tsx) — Nuxt 아님 | `SEbit-Insight/web/package.json` |
| Monthly | **스택 막대**(과제별 stackId, 25색 팔레트, 커스텀 스크롤 툴팁, 합계) | `src/components/dashboard/MonthlyRevenueChart.tsx:103-119` |
| Department | **그룹 막대**(계약액/매출/영업이익 3계열, radius) | `DepartmentRevenueChart.tsx:30-40` |
| Yearly | **그룹 막대**(연도별 3계열) | `YearlyRevenueChart.tsx:30-41` |
| 판정 | React/recharts라 **코드 직접 차용 불가**(엔진 상이). NOVA(ECharts)로 **재구현할 UX 사양**(스택/그룹 막대·억원 포맷·커스텀 툴팁)만 참조 | — |

### 1-10. Cure / EHS — KPI 그리드만(차트 라이브러리 없음)

| 레포 | 내용 | 근거 |
|---|---|---|
| Cure | 차트 라이브러리 의존성 0. quality/index 등 grid-cols KPI 카드 + i-lucide-gauge 아이콘만 | `SEbit-Cure/package.json`(viz 0), `app/pages/quality/index.vue:26,47` |
| EHS | 차트 라이브러리 의존성 0. KPI 그리드/규제 목록만 | `SEbit-EHS/web/package.json`(viz 0) |

---

## 2. 재사용 컴포넌트 인벤토리 (하베스트 후보)

| # | 컴포넌트 | 레포 | 엔진 | 하베스트 가치 | 경로 |
|---|---|---|---|---|---|
| 1 | `CanvasChartWrapper` | Canvas | echarts5 | ⭐⭐⭐ 테마 자동동기화+dispose+레지스트리 = NOVA Chart Wrapper 골격 | `SEbit-Canvas/app/components/canvas/data/CanvasChartWrapper.vue` |
| 2 | `SkEquityChart` | Stock | echarts5/ve7 | ⭐⭐⭐ dataZoom·markLine·그라디언트·손익툴팁(금융 인터랙션) | `SEbit-Stock/app/components/SkEquityChart.vue` |
| 3 | `OriginChart` | Origin | echarts6/ve8 | ⭐⭐ ClientOnly+autoresize+로딩 fallback (최신 v6 기준) | `SEbit-Origin/app/components/ui/OriginChart.vue` |
| 4 | `LineChart`(area) | PROVE | echarts6/ve8 | ⭐⭐ 영역 라인 도메인 프리셋 | `SEbit-PROVE/app/components/chart/LineChart.vue` |
| 5 | `DonutChart` | PROVE | echarts6/ve8 | ⭐⭐ 링 파이 상태분할 프리셋 | `SEbit-PROVE/app/components/chart/DonutChart.vue` |
| 6 | `CanvasKpiCard` | Canvas | — | ⭐⭐ KPI 카드(trend/icon) = Dashboard 위젯 | 레지스트리 `useCanvasRegistry.ts:62` |
| 7 | `CanvasStatsGrid` | Canvas | — | ⭐⭐ 스탯 그리드 = Dashboard 위젯 | `useCanvasRegistry.ts:76` |
| 8 | `CanvasTimeline` | Canvas | — | ⭐ 타임라인 위젯 | `useCanvasRegistry.ts:392` |
| 9 | Nexus 19-node 팔레트 | Nexus | Vue Flow | ⭐⭐⭐ 노드 그래프 에디터(카탈로그 API + 커스텀노드 + 미니맵) | `SEbit-Nexus/app/pages/flow-builder/index.vue` + `server/engine/ai/nodes/*` |
| 10 | 온톨로지 그래프 뷰 | Sentinel | Vue Flow | ⭐⭐ 지식/인과 그래프(animated edge, fit-view) | `SEbit-Sentinel/app/pages/admin/ontology.vue` |
| 11 | PROVES `LineChart/DonutChart` | PROVES | echarts6/ve8 | ▲ #4·#5 복제본(통합 대상) | `SEbit-PROVES/frontend/app/components/chart/*` |

> ⛔ 손코딩 SVG(Sentinel 도넛/라인, API-On/Nexus 라인)는 "컴포넌트"가 아닌 **인라인 마크업** → 재사용 자산 아님. **하베스트 방향 = 컴포넌트화가 아니라 NOVA Chart로 대체**(§4-B).

---

## 3. 실제 사용 차트 타입 총목록 (레포 교차)

| 차트 타입 | 실사용 레포 | 근거 | 엔진 |
|---|---|---|---|
| Line(단순/영역/smooth/그라디언트) | PROVE·Stock·Canvas | LineChart, SkEquityChart, Wrapper | ECharts |
| Line + DataZoom + MarkLine | Stock | SkEquityChart:65-107 | ECharts |
| Bar(스택/그룹) | Insight·Canvas(등록) | Insight recharts, Wrapper | recharts/ECharts |
| Pie / Donut(링) | PROVE·Canvas(등록) | DonutChart:18-30 | ECharts |
| Scatter | Canvas(등록) | Wrapper:21,29 | ECharts |
| **Gauge** | Origin(등록만) | plugin:3,12 | ECharts |
| **Graph(관계형)** | Origin(등록만) | plugin:3,12 | ECharts |
| **Flow/Node Graph** | Nexus·Sentinel·API-On | Vue Flow (19노드·온톨로지·디자이너) | Vue Flow |
| KPI Card / Stats Grid / Timeline | Canvas·Cure·PROVE·Nexus | 레지스트리·grid-cols | 커스텀 |
| **손코딩 SVG**(도넛/라인/게이지) | Sentinel·API-On·Nexus | dashboard/sla/monitor svg | 인라인 SVG |

> 확정 차트 타입(엔진 렌더) = **line·area·bar·pie/donut·scatter·gauge·graph·flow-graph = 8종** + KPI/timeline 위젯 + 손코딩 SVG 3종.
> ⚠️ candlestick·heatmap·treemap·radar·sankey·map = **우리 실코드에 없음**(grep 0건, `type:` 실사용 없음). softbowl 41종 대비 우리 실보유는 좁음 → NOVA는 이 공백을 ECharts 6.0로 신규 채움.

---

## 4. NOVA Chart 하베스트 매핑 (softbowl §2-c ↔ 우리 자산)

> softbowl(SBChart v2) 실제 41종 차트 리스트는 **2차출처(spec §21)만·사이트 fetch 미확인**(`nova-superiority-benchmark.md` U4). 따라서 아래는 **차트 카테고리 단위** 매핑. NOVA=ECharts 6.0 SVG+Canvas 이중 렌더러(D5 확정).

### 4-A. 우리 자산으로 커버(차용 우선 — 새로 짜지 말 것)

| 차트/위젯 | softbowl 대응 | 우리 기존 자산(차용원) | 하베스트 액션 |
|---|---|---|---|
| Line/Area | SBChart 라인류 | PROVE `LineChart`, Canvas Wrapper | 프리셋 옵션 그대로 승격 |
| **금융/실시간 Line** | (softbowl 일반 라인) | **Stock `SkEquityChart`**(줌·기준선·손익툴팁) | NOVA "실시간/트레이딩" 차트로 흡수 = **차별화** |
| Pie/Donut | SBChart 파이류 | PROVE `DonutChart`(링·상태색) | 프리셋 승격 |
| Bar(스택/그룹) | SBChart 바류 | Insight UX사양(재구현) + Canvas Wrapper | ECharts로 재구현(스택 stackId·억원 포맷) |
| Scatter | SBChart 산점 | Canvas Wrapper 등록 | 프리셋 승격 |
| Gauge | SBChart 게이지 | Origin plugin 등록(옵션 부재) | 등록 기반 위 옵션 신규 |
| **테마동기화 래퍼** | (SBChart 자체 테마) | **Canvas `CanvasChartWrapper`**(다크동기화·dispose·레지스트리) | **NOVA Chart Wrapper 코어로 채택** |
| KPI/Stats/Timeline 위젯 | SBGrid+대시보드 | Canvas 레지스트리 3종 | NOVA Dashboard 위젯으로 이관 |

### 4-B. ⛔ 손코딩 SVG → NOVA Chart로 "대체"(하베스트=리팩터 대상)

Nexus·Sentinel·API-On은 echarts를 **선언만 하고 손코딩 SVG로 우회**했다. NOVA Chart 정식 채택 시 아래를 **삭제→NOVA Chart 옵션으로 치환**:

| 현 손코딩 | 위치 | NOVA 치환 |
|---|---|---|
| SVG 애니메이션 도넛(원인분석) | Sentinel `dashboard/index.vue:485-497` | ECharts pie + animationDelay |
| SVG 라인+임계선 | Sentinel `cases/trends.vue:245-274` | ECharts line + markLine(threshold) |
| SVG 시계열(req/err) | API-On `sla.vue:344-385` | ECharts line 2계열 |
| SVG 라인 | Nexus `monitor/index.vue` | ECharts line |

→ **효과**: 3개 플래그십이 손코딩 SVG를 유지보수하는 부채를 NOVA Chart 단일 엔진으로 흡수(메타룰 §0 "공통으로 관리" 실현).

### 4-C. softbowl엔 있고 우리엔 없음(NOVA 신규 — ECharts 6.0로 채움)

- candlestick·heatmap·treemap·radar·sankey·map(지도)·boxplot 등 = **우리 실코드 0건**. NOVA가 ECharts 6.0 기본 제공으로 신규 구현. (superiority-benchmark: ECharts 구조적 우위·SVG 렌더러 무손실 확대로 SBChart 동급+)

### 4-D. softbowl엔 없고 우리가 가진 것(= NOVA 차별화 축)

1. **AI 워크플로우 노드 그래프(Vue Flow 19종)** — Nexus. softbowl(SBChart/SBGrid)엔 없는 인터랙티브 플로우 오케스트레이션 시각화.
2. **지식/인과 온톨로지 그래프** — Sentinel(animated edge, fit-view). 이상탐지 도메인 그래프.
3. **금융 인터랙션 라인(dataZoom+markLine+손익툴팁+그라디언트)** — Stock `SkEquityChart`. 일반 라인 이상의 실시간/트레이딩 특화.

---

## 5. 미확인·리스크

- **softbowl 41종 실목록 미확인**: 2차출처(spec §21)만. §4 매핑은 카테고리 단위 — 1차 사이트 fetch 시 재대조 권장(`nova-superiority-benchmark.md` U4/근거 [C]).
- **Origin 대시보드 실연결 부재**: OriginChart 래퍼+plugin(Gauge/Graph 포함)은 완비이나 현 `pages/*`에서 소비 0건. "자산은 있으나 화면 연결은 레거시/미완" → 하베스트 시 래퍼는 쓰되 실사용 화면은 신규 필요.
- **버전 파편화**: ECharts 6(Origin/PROVE) vs 5.6(나머지), vue-echarts 8 vs 7. NOVA=ECharts6 확정이므로 **6 계열 코드(Origin/PROVE)를 정본**으로, 5.6 계열은 옵션만 이식(API 호환 확인 필요).
- **Insight=React/recharts**: 코드 직접 차용 불가, UX 사양만 참조.
- **PROVE↔PROVES 중복**: 차트 컴포넌트 복제 — 하베스트 시 1개로 통합.

---

## Sources (실코드·조회 기준시각 2026-07-29)

- `SEbit-Origin/app/plugins/echarts.client.ts:1-18`, `app/components/ui/OriginChart.vue:1-14`, `package.json`
- `SEbit-PROVE/app/components/chart/LineChart.vue`, `DonutChart.vue`, `app/pages/system/ui-guide/charts.vue`, `app/pages/smd-sim/report.vue`, `unit-work-sim/report.vue`, `package.json`
- `SEbit-PROVES/frontend/app/components/chart/*.vue`, `package.json`
- `SEbit-Stock/app/components/SkEquityChart.vue:1-121`, `package.json`
- `SEbit-Nexus/app/pages/flow-builder/index.vue`, `server/engine/ai/nodes/*.ts`(19), `app/pages/monitor/index.vue`, `package.json`
- `SEbit-Sentinel/app/pages/admin/ontology.vue`, `app/pages/dashboard/index.vue:485-497`, `app/pages/cases/trends.vue:245-274`, `package.json`
- `SEbit-API-On/app/pages/designer/index.vue`, `app/pages/sla.vue:344-385`, `package.json`
- `SEbit-Canvas/app/components/canvas/data/CanvasChartWrapper.vue:1-115`, `app/composables/useCanvasRegistry.ts`, `package.json`
- `SEbit-Insight/web/src/components/dashboard/{Monthly,Department,Yearly}RevenueChart.tsx`, `web/package.json`
- `SEbit-Cure/app/pages/quality/index.vue`, `SEbit-EHS/web/package.json` (viz 의존성 0 확인)
- 대조 문서: `SEbit-Micro/docs/01-plan/nova-superiority-benchmark.md`(SBChart/ECharts 우위·41종 2차출처), `nova-platform-spec.md`(D5 ECharts6.0)
