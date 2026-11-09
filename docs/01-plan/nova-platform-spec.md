# SEbit NOVA — 웹서비스 표준 플랫폼 기획서 (최종 통합본 v2.0)

> 작성: 2026-07-27 · planner (SEbit-Creator 개발조직) · v2.0 = research 2종 통합 최종본
> 벤치마크: softbowl 5제품 생태계 — SBUx·SBGrid·SBChart·SBDashBoard·**SBWrapDoc**(v2.0에서 추가 채집) + 통합데모 허브(SBUxDemo)
> **통합 입력 3문서**: ① 본 문서 v1(기획 골격) ② `nova-feature-coverage-checklist.md`(전수 기능 인벤토리 — 커버리지 원장) ③ `nova-superiority-benchmark.md`(상회 목표 근거 — 성능 원장). 구조 결정 대조: `../02-design/nova-platform-architecture.md`(architect ADR 16건)
> 문서 위치가 Micro인 이유: NOVA 대외 소개의 주체가 sebit.co.kr(Micro)이므로. Micro 개편 기획서(`micro-renewal-spec.md`)의 자매 문서.
> ⛔ 본 문서는 "무엇을·왜"를 확정한다. "어떻게"(도구·라이브러리·구조)는 architect가 ADR로 결정한다.

### v2.0 통합 4원칙 (이 문서 전체를 관통)

| # | 원칙 | 의미 |
|---|---|---|
| 1 | **완전 커버리지 — 드롭 0** | 소프트보울 8년·608버전(SBUx 247·SBGrid 146·SBChart 215 릴리즈 실측)이 쌓은 기능을 P1에 다 복제할 수 없다. 대신 **전 항목을 MoSCoW로 분류·시퀀싱**한다. "안 함"은 없고 "이번/다음"만 있다 (§3-0 총괄표가 증명) |
| 2 | **근거 있는 상회** | 상회 목표수치는 benchmark 문서의 외부 출처 인용값만 사용. ⛔ **인용값=목표선이지 우리 실측이 아님 — qa 실측 게이트 통과 전 마케팅 문구화 금지** |
| 3 | **정직한 열위** | HWP/전자문서유통(SBWrapDoc 도메인)·MCP 선점·GS/SA 인증·i18n 동급은 열위/동급으로 정직히 박제(§2-4). **"전면 상회" 주장 금지** |
| 4 | **⭐ 통합 쇼케이스가 핵심** | 소프트보울의 제일 핵심 무기 = SBUxDemo 통합데모(전 제품을 한 화면·한 업무 시나리오로 체험) — **사용자 지정 핵심(2026-07-27)**. NOVA는 이를 **실데이터 live 통합 쇼케이스**로 상회한다 (§2-2) |

---

## A. 근거 원장 (이 문서의 모든 수치·판정의 출처)

> 여기 없는 수치는 본 문서에 없다. 벤치마크 미확인 항목은 "미확인"으로 박제하고 우리 목표를 별도 제시한다.

### A-1. 벤치마크 실측 1차 (research, 2026-07-27 실 fetch) — v1 원장 유지, v2 정정 주석

| 항목 | 실측 팩트 | v2.0 정정(coverage-checklist 전수 실측) |
|---|---|---|
| SBUx | 웹표준 UI 컴포넌트 "30종 50유형" 주장. SBGrid·SBChart를 포함하는 상위 플랫폼 포지션 | **실측 = 29종(+미완 1종)/56유형·속성 2,561건·공통메서드 32·그리드 연계속성 7** (searchData.js 직접 파싱). 데모 미노출 4종(label·carousel·pdfviewer·datastore) 발견 |
| SBGrid v3 | 엔터프라이즈 그리드, "680 API" 주장. 2013년 국내 최초 Non-ActiveX HTML5 그리드. Angular/React/Vue 데모 | **실측 = 데모 38항목(11카테고리)·API 문서화 287항목(28카테고리·메서드 126·셀타입 12종)·서버바인딩 3방식(Ajax/WebSocket/Http)**. "680" 집계 근거는 **미확인**(문서화 287과 별개 집계 추정) |
| SBChart v2 | SVG 차트 "41종". SA(SW접근성) 인증 — 배경패턴·대체텍스트·TTS | **실측 = 42종(데모 41+API 전용 waterfall)·API 문서화 1,336항목·접근성 9속성·datarange 19속성**. 옵션토글 10·애니 3·스타일 4 |
| SBDashBoard | 독립 제품 사이트 없음. 통합데모 내 데모로만 존재 | **실측 = 위젯 5·테마 3·사이드메뉴 33항목(그리드활용 11+연계 2+퍼포먼스 1+업무화면 11+시각화 8)**. 위젯 빌더(추가/배치) 여부는 미확인 |
| **SBWrapDoc** (v2 신규) | — (v1 미인지) | **문서 데이터 변환·생성 솔루션(5번째 제품)**: 특장점 4(Pubdoc 변환·배포문서(DRM성)·문서 병합·Data I/O) + 기능 6(Pubdoc API·HWPX API·Data I/O·Append·한글 Automation·기술지원). 전용 데모 사이트 없음. 처리량 수치 없음 |
| 개발자 포털 | ①제품홈 ②튜토리얼 5단계 ③API가이드(가이드/예제 2탭+라이브 플레이그라운드) ④Demo ⑤릴리즈노트 ⑥구매 | **실측 보강 = API가이드에 속성 검색(searchData) + Monaco Editor 플레이그라운드 내장. 릴리즈노트 = 3제품 608버전·기능추가 615건(주간 케이던스)** |
| AI 지원 | MCP 서버 공개(sbgrid3.do·sbchart2.do) + Claude 등록 가이드 PDF + GPTs + SB-Chat | **MCP 2종 JSON-RPC initialize 실호출 200 확인**(선점 사실 확정). SB-Chat = BYOK 4프로바이더(Claude·GPT·Groq·OpenRouter) |
| 인증·조달 | GS·SA·전자정부프레임워크 호환성·나라장터/조달우수 | 인증 6종 체계 실측(GS 3제품·SA 2제품·전자정부 2제품·나라장터 2건·디지털서비스몰 1건·조달우수) |
| 외부 표준 | Telerik "데모=문서"·IBM Carbon·Storybook | (유지) |

### A-2. 우리 자산 실사 (2026-07-27 레포 직접 확인 — planner 재검증 완료, v1 유지)

| 항목 | 실측 | 출처 |
|---|---|---|
| Canvas 컴포넌트 | **41개 .vue**, 카테고리 11(action·data·display·explorer·feedback·form·kpi·layout·nav·overlay·status)+presets | `SEbit-Canvas/app/components/canvas/` find 계수 |
| Canvas 디자인토큰 | `--cv-*` **75회** | `app/assets/css/canvas.css` grep 계수 |
| Canvas Explorer | index + **카테고리 10페이지** | `app/pages/canvas/explorer/` |
| Canvas Builder | builder 2페이지 + workspace 5페이지 + PresetDashboard | `app/pages/canvas/` |
| 그리드 | CanvasDataTable 1개(검색·정렬·페이지네이션). `@tanstack/vue-table` 소스레포 **4개**(Origin·PROVE·PROVES·Sentinel, 헤드리스). xlsx/exceljs 서비스레포 **0** · `@tanstack/virtual` **0** | package.json 전수 grep |
| 차트 | ECharts 직접의존 **8레포**, 버전 이원화 **^5.6.0×5 / ^6.0.0×3**. CanvasChartWrapper 등록 4종 | package.json grep + `CanvasChartWrapper.vue:21` |
| **문서 자동생성 자산** (v2 추가) | PPT = **pptxgenjs**(F1 업무보고서 자동생성 — 샘플 3종 완료·고객 확정, `C:\SEbit\f1-report-samples\`) / PDF = **Playwright web→벡터PDF**(제안서 웹표준 파이프라인) / docx = 스킬 자산 | 메모리 `project_f1_report_ppt_samples`·`reference_proposal_web_to_pdf` — **NOVA Doc의 실물 기반** |
| **ISS-252** (sso-finalize 서명미검증) | ⭐코드 수정 완료(7/23 부류수정 8개). 잔여=운영 JWT_SECRET provisioning | 소스 직접 확인 |
| **ISS-256** (role 어휘 이중화) | 미조치: `role-guard.ts:16` builder vs 전사 표준 manager 불일치 | 소스 직접 확인 |
| **ISS-257** (Layer 상속경계 붕괴) | 미조치: Origin·PROVE `nuxt.config.ts:8` extends 주석 — 상속 서비스 0 | 소스 직접 확인 |
| Canvas 감사게이트 | ❌배포차단(크리티컬1+메이저6: ISS-252~259) | ISS registry |
| API-On | Gateway·커넥터 4종·DLQ 자가치유·SLA·Swagger·Kyber-768 PQC·API 43+ | research + Micro 원장 |
| Nexus | AI엔진(RAG·pgvector)·Vue Flow 노코드. AI 노드 수 17 vs 19 상충 — P4 문서화 시 확정 | research + CLAUDE.md |
| SSO/RBAC/승인 | Canvas RBAC 5단계+승인 워크플로우+전사 SSO(4축 표준) | 메모리 + 소스 |
| 품질 거버넌스 | sebit-eslint-config 7룰 + sebit-ci + Creator 3계층. GH Packages publish 미완 부채 → **D8 확정으로 해소 경로 확정** | CLAUDE.md |
| 프레임워크 | Nuxt(Vue) 단일. Nuxt UI 실측 이원화(v4×3 / v3×7 / v2×1 — architect E3) → **D7 확정 = v4 통일** | architect 설계서 §0 E3 |
| 인증·조달 배지 | 없음 | — |

### A-3. 전수 커버리지 실측 총계 (coverage-checklist §7 — 커버리지 분모의 정본)

| 축 | 소프트보울 실측 수량 | 재취득 근거 |
|---|---|---|
| SBUx 컴포넌트 | **29종(+미완 1)/56유형 · 속성 2,561 · 공통메서드 32 · 그리드 연계속성 7** · 릴리즈 247버전(2021.03~2026.04, 기능추가 125) | searchData.js(86KB)·ReleaseNote.js 직접 파싱 |
| SBGrid | **데모 38항목(11카테고리) · API 문서화 287항목(옵션 27카테고리+메서드 126 · 셀타입 12종)** · 서버바인딩 3방식 · 프레임워크 데모 3종(HTTP 200) · 릴리즈 146버전(추가 122·개선 446) | SBGridApiData.js(2MB) 직접 파싱 |
| SBChart | **42종(데모 41+waterfall) · API 문서화 1,336항목 · 접근성 9속성 · datarange 19속성** · 옵션토글 10·애니 3·스타일 4 · 릴리즈 215버전(2018.08~2026.06, 추가 368) | SBChartApiData.js(3.7MB) 직접 파싱 |
| SBDashBoard | 위젯 5 · 테마 3 · 메뉴 33항목(업무화면 11·시각화 8 포함) | SBUxDemo/DashBoard 실측 |
| SBWrapDoc | 특장점 4 + 기능 6(Pubdoc·HWPX·Data I/O·Append·Automation·지원) | solution/sbwrapdoc.do 실측 |
| 공통 포털·AI | 메뉴 5 · 튜토리얼 5단계 · API가이드(검색+Monaco) · 릴리즈 3제품 **608버전** · AI 4채널(MCP 2종 200 실호출) · 인증 6종 | 각 사이트 실측 |

### A-4. 상회 근거 실측 (superiority-benchmark — 성능 원장의 정본)

| 관찰 | 내용 | 출처 |
|---|---|---|
| **소프트보울 절대 성능수치 = 0** | 대용량·Excel·SVG·대량병합 전 축에서 원리 서술만 있고 처리 행수·응답시간 수치가 어디에도 없음(benchmark 표1 #3·4·7·15·21) | [G][G2][C][W] 실 fetch |
| **대용량 공식 실증 = 100건 데모가 전부** | v2.5 Lazy Loading 공식 샘플 "총 데이터 건: 100" + scrollmax 재요청. 블록캐시·서버 그룹핑/집계 개념 부재 | [G3][G4] 실 fetch |
| 업계 상회선(클라) | ag-grid "100k+ rows, 보이는 ~40행만 렌더" · TanStack Virtual "60FPS·수백만 행·보이는 DOM만" | [AG][TV] |
| 업계 상회선(서버) | ag-grid SSRM 블록캐시·서버 그룹핑/집계 · RealGrid 공개데모 50만건 CSV(행 제한 없음, 로드 ms는 미기재) | [AG][RG] |
| Excel | ExcelJS 1.24s vs SheetJS 1.56s @50k행×20열 · ExcelJS 스트리밍 50MB+ | [SK][XL] |
| Chart 구조 우위 | ECharts **SVG(무손실)+Canvas(대용량) 이중 렌더러** · LTTB 샘플링(10000+ 포인트) · progressive(3000+ 요소) · WebGL 수백만 — SBChart는 SVG 전용 | [EH][ES][EO][WS] |
| Chart 접근성 | ECharts aria.enabled+decal(색각 무늬)·설명 자동생성. ⚠️ 키보드 접근성 미흡(공식 이슈 #18585) | [EA][EA2] |
| 구조(SSR) | Nuxt Islands "최대 83% 적은 JS 전송" — SBUx는 순수 클라이언트 lib | [NX] |
| WC 추세 | Web Components Chrome 페이지로드 10%→18%(2024)·Carbon/Spectrum/Shoelace WC 배포 | [WC] |
| SBWrapDoc 대조 | HWP/HWPX/Pubdoc/DRM = 우리 자산 0(열위). 웹표준 PDF/PPT/동적리포트 = SBWrapDoc 범위 밖(우리 우위) | [W] + A-2 문서자산 |
| i18n | SBGrid setResource(다국어)·v2.5 Locale API **보유 확인** — 우리 상회 아닌 **동급 축** | [G3] + checklist §2-3 |

> 출처 약호([G][AG][TV]…)의 전체 URL = `nova-superiority-benchmark.md` Sources 절.

### A-5. 확정 결정 원장 (2026-07-27 — 본 v2.0이 존중하는 기결정)

| # | 결정 | 확정 내용 | 파급 |
|---|---|---|---|
| **D1** | 그리드 경로 | **(a) tanstack v8 헤드리스 + 자체 UI** (architect ADR-B2: 어댑터 격리로 상용 전환 대비 구조 보존) | P3 착수 가능. `@tanstack/virtual`·ExcelJS 신규 도입 전제(R2) |
| **D4** | 라인업 명명 | **NOVA 접두 + UX·UI·Grid·Chart·Dashboard 5제품 + Portal(채널)** — UX=상속 Layer / UI=복사 템플릿 (architect ADR-B1 경계) | 본 문서 전면 반영(구 "NOVA UI"→**NOVA UX**, 구 "NOVA Board"→**NOVA Dashboard**) |
| **D5** | ECharts 통일 | **6.0 통일** (단 architect N7 breaking 실사 + 8레포 회귀 게이트 통과 조건부 실행) | Q3 판정 기준 = 8/8 레포 ^6.x |
| **D7** | Nuxt UI 버전 | **v4 통일** (실측 이원화 v4×3/v3×7/v2×1 종결 — NOVA가 3번째 축이 되지 않게) | NOVA UX 컴포넌트 기반 = Nuxt UI v4 + `--nova-*` 토큰 래핑(ADR-A2·A3) |
| **D8** | 배포 의존 방식 | **GitHub Packages npm**(`@sebit-nova/*`, 버전 트레인 fixed) — `file:../` CI 실패 부채(sebit-eslint-config) 동시 해소 | ADR-F2. publish 파이프라인 = P1 최우선 devops |
| **D9** | Portal 포트·도메인 | **:4000** · `nova.sebit.co.kr`(도메인은 추정 표기 유지 — DNS 등록 시 확정) | 포트 룰 메모리 등록 필요(3500 중복 전례) |

---

## 1. NOVA 플랫폼 정의 — 무엇을 왜

**한 줄 정의**: SEbit NOVA = 소프트보울이 증명한 "웹서비스 표준 프레임워크" 형태(컴포넌트·그리드·차트·대시보드·문서생성·개발자포털·MCP)에, 그들에게 없는 SEbit 수직결합(백엔드 통합 Gateway·노코드 Flow·SSO/RBAC/승인·품질 거버넌스·**실데이터 live 쇼케이스**)을 얹은 **웹 표준 플랫폼**.

**해결하는 실제 문제** (근거 있는 사례):
| # | 문제 | 근거 |
|---|---|---|
| 1 | 15+ 서비스가 UI·차트·테이블을 **각자 다시 만든다** — Canvas가 "공통 UI 허브"인데 상속 서비스 0 | ISS-257 실사 + CLAUDE.md §0 "왜 매번 새로 짜냐" 반복 지적 이력 |
| 2 | 같은 라이브러리도 버전이 갈라진다 — ECharts 5.6×5/6.0×3, Nuxt UI v4×3/v3×7/v2×1 | package.json 실사(§A-2) + architect E3 |
| 3 | 컴포넌트 41종이 있어도 **API 문서 0** — 쓰는 법을 소스 열어야 안다 | Canvas 실사 |
| 4 | 엔터프라이즈 그리드(Excel·트리·편집·대용량)가 전무해 매 프로젝트 임기응변 | 그리드 실사 🔴(§A-2) |
| 5 | 대외적으로 "플랫폼 회사"를 증명할 표준 자산 전시가 없다 — **특히 "한 화면에서 전 제품을 체험"시키는 통합 데모가 없다** | Micro 개편 기획서 §1 + §A-1 SBUxDemo 관찰(사용자 지정 핵심) |
| 6 | 보고서·제안서 자동생성 자산(pptxgenjs·Playwright PDF)이 프로젝트별 일회성으로 흩어져 제품화 안 됨 | §A-2 문서 자산 실사 — NOVA Doc의 존재 이유 |

**벤치마크가 증명하는 것 (v2.0 갱신)**: 국산 UI 솔루션(softbowl)이 5제품+포털+MCP를 **8년·608버전**(주간 릴리즈)으로 운영 중 — 이 형태(form)와 축적 방식(케이던스)은 시장 검증됨. NOVA는 form을 차용하되 내용은 SEbit 실물 자산으로 채우고, **그들이 하지 않는 것(절대 성능수치 공개·실데이터 live 데모·백엔드 수직결합)으로 상회**한다.

**608버전 축적의 전략적 의미 (⛔ 로드맵의 전제)**: 그들의 기능 총량(속성 2,561·API 문서화 287+1,336)은 8년 누적의 결과다. NOVA가 이를 P1에 복제하려는 것은 발명이자 실패 경로다. → **P1~P5 = 코어 특장점(각 제품 Must) + 플랫폼 뼈대 + 통합 쇼케이스, P6 = 축적 트랙(Should/Could 릴리즈 케이던스 소진)**. 전 항목은 §3-0에서 매핑되어 드롭 0을 보장한다.

### 목표 2단계 (⛔ 분리 — 사용자 확정 사항)

| 단계 | 목표 | 성격 |
|---|---|---|
| **1차 (대내)** | SEbit 15+ 서비스가 **공통으로 상속하는 표준 플랫폼**. 신규 서비스 부트스트랩 = NOVA 상속이 기본 경로 | 확정. 본 문서 로드맵 P1~P6 |
| **2차 (대외)** | 조달/판매 상품화(GS·SA 인증, 나라장터) | 로드맵 P7. 착수 여부·범위는 D2·D3 결정 대기 |

### 세계관 내 위치 (project_sebit_brand_universe 정본 준수)

- NOVA = 4대 서브브랜드 중 "Web Standard Platform" (딥 퍼플·오로라 모티브). 메뉴 순서 AI→**NOVA**→LUMO→GeoAxis.
- ⛔ **NOVA ⊃ Nexus(iPaaS)·API-On(통합)** — 폐기 아님, NOVA 하위 재배치(사용자 확정 2026-07-27).
- Canvas의 NOVA 편입 + 명명(UX·UI·Grid·Chart·Dashboard+Portal) = **D4 확정**(§A-5). 내부 레포명은 유지, 대외 제품명만 NOVA 접두.
- **[정본 갱신 필요]** NOVA Doc 신설(본 문서 §2-1 #6)로 세계관 정본의 NOVA 라인업을 5제품→**6제품**으로 갱신해야 함 — 세션 마감 시 `project_sebit_brand_universe.md` 반영.

---

## 2. 제품 라인업 — 6제품 + 1채널 + 1플래그십

> 판정(🟢/🟡/🔴)은 §A-2 실사 기준. "소프트보울 실측 수준"은 §A-3 커버리지 원장 기준.

### 2-1. 확정 라인업 (D4 명명 + NOVA Doc 신설 = **6제품**)

| # | NOVA 제품 | 대응 | 소프트보울 실측 수준 | 우리 실물(§A-2) | 판정 | 핵심 갭/상회 축 |
|---|---|---|---|---|---|---|
| 1 | **NOVA UX** (상속 Layer — 컴포넌트·토큰·auth/gateway 클라이언트) | SBUx v2.6 | 29종(+1)/56유형·속성 2,561·공통메서드 32·연계속성 7 | Canvas 41컴포넌트·`--cv-*` 75토큰·Nuxt UI(v4 기반 재편성 — D7) | 🟡 | 개수는 동급 이상(41 vs 29+1). 갭 = Layer 상속 실현(ISS-257)·API 문서 0→전수·감사게이트 ❌. 상회 = SSR/Islands 구조([NX] 83%)·Gateway 내장(datastore 상회) |
| 2 | **NOVA UI** (복사 템플릿 — 업무화면·페이지 골격) | SBUx 템플릿 배지 + v2.5 UI Template + SBDashBoard 업무화면 11종 | 업무 도메인 완성화면 11종 전시(사원관리~세금계산서) | SEbit 실서비스 화면(Origin·PROVE·Sentinel·Stock 등) — 템플릿화 안 됨 | 🟡 | 실서비스에서 추출한 템플릿 갤러리로 상회 여지(그들은 샘플, 우리는 운영 실물 기반) |
| 3 | **NOVA Grid** | SBGrid v3 | 데모 38항목·API 문서화 287·셀타입 12·서버바인딩 3방식 | CanvasDataTable(검색·정렬·페이지네이션)·tanstack 4레포(헤드리스)·Excel/virtual lib 0 | 🔴 **최대 갭** | D1 확정(tanstack)으로 경로 해소. 상회 = **정량 공개 벤치**(10만행@60fps·서버 50만+ — 그들은 수치 0·데모 100건) |
| 4 | **NOVA Chart** | SBChart v2 | 42종·API 문서화 1,336·접근성 9속성·SA 인증 | ECharts 8레포(D5 확정=6.0 통일)·Wrapper 4종 | 🟡 | 상회 = **SVG+Canvas 이중 렌더러**(그들 SVG 전용 — [EH]) 🟢 + LTTB/progressive 대용량. 열위 = SA 인증 부재·키보드 접근성 갭(R1) |
| 5 | **NOVA Dashboard** | SBDashBoard | 위젯 5·테마 3·메뉴 33(빌더 여부 미확인) | Nexus 대시보드+Canvas PresetDashboard+Builder 원형 | 🟡 | 상회 = 실데이터 위젯(Gateway dataSource — ADR-B4). 제품 승격 여부 D6 유지 |
| 6 | **NOVA Doc** ⭐신설 | **SBWrapDoc** | 특장점 4+기능 6(Pubdoc·HWPX·DRM·병합·Automation) | **pptxgenjs(F1 보고서 실증)·Playwright web→벡터PDF(제안서 표준)·docx 스킬** | 🟢 웹표준 / 🔴 HWP | **부분 상회+부분 열위**: 웹표준 문서(PPT/PDF/동적리포트) 우위, HWP/HWPX/전자문서유통(Pubdoc·DRM) 명확한 열위 — "전면 상회" 주장 금지. 1차 스코프 §3-6 |
| — | **NOVA Portal** (채널 — 제품 아님) | 개발자 포털 ①~⑥ + 통합데모 허브 | 메뉴 5·튜토리얼 5단계·API 검색+Monaco·릴리즈 608버전·MCP/AI 4채널 | Canvas Explorer 10카테고리(원형) | 🔴 | 신규 다수. §4 상세. apps/portal(:4000 — D9), NOVA UX 1호 상속(dogfooding, ADR-C1) |

### 2-2. ⭐ 플래그십: NOVA 통합 쇼케이스 (P1 Must 최상위 산출물)

> **왜 최상위인가**: 소프트보울의 제일 핵심 무기는 개별 제품 페이지가 아니라 **SBUxDemo 통합데모** — SBUx+SBGrid+SBChart를 하나의 대시보드·실제 업무 시나리오(업무화면 11종·시각화 8종)로 결합해 "전 제품을 한 화면에서 한번에 체험"시키는 영업·이해의 결정타다(§A-1·§A-3 실측, **사용자 지정 핵심 2026-07-27**). NOVA도 "제품 나열"이 아니라 "통합 체험"을 최상위 산출물로 만든다.

| 항목 | 정의 |
|---|---|
| 무엇 | **NOVA 6제품(UX+UI+Grid+Chart+Dashboard+Doc)을 하나의 업무 시나리오로 결합한 살아있는 통합 데모.** Portal의 플래그십이자 NOVA UX **상속 1호 dogfooding**(architect ADR-C1의 apps/portal 내 구현) |
| ⭐ 상회 포인트 | 소프트보울 통합데모 = 샘플 데이터 시연물(실서비스 데이터 연동 근거 관찰되지 않음 — 대용량 공식 실증도 100건 데모 [G4]). NOVA 쇼케이스 = **실데이터 바인딩(Origin 데이터 → API-On Gateway 경유 → Nexus Flow 가공) live 데모** → 정적 대비 구조적 상회. ⛔ 픽스처/Mock 금지(`feedback_no_fixture_in_runtime_engine`) — 실데이터 아니면 쇼케이스가 아님 |
| NOVA Dashboard와 구분 | **Dashboard = 조립형 제품**(위젯 계약+렌더러) / **통합 쇼케이스 = 전 제품 결합 플래그십 데모**(Dashboard 제품을 무대로 쓰되, 6제품 전부의 실동작 증거) |
| 시나리오 | 추천 = **SEbit 경영 현황 대시보드**(Origin 자사 경영 실데이터 보유 — 메모리 `project_origin_data_agent` 실데이터 층). 선택지·근거는 D13 |
| 진화 경로 | P1 v0.1(당시 보유 제품: UX+현 Chart 래퍼+실데이터 1소스) → 각 Phase 완료 시 해당 제품 편입(P2 Chart 정식 → P3 Grid 10만행 데모 → P4 Dashboard 위젯+Portal 정식 플래그십 → P5 **Doc "이 대시보드를 PPT/PDF 보고서로 내보내기"** = 6제품 완성) — **쇼케이스 = 플랫폼 진척의 살아있는 증거**. 각 Phase 완료판정에 "쇼케이스 편입" 포함(§5) |
| 성공판정 | Q11 — 6제품 전부 한 시나리오 실구동 + 실데이터 + 보고서 내보내기 실동작 |

### 2-3. SEbit 차별화 축 (소프트보울에 없는 것)

| # | 축 | 우리 실물 | 판정 | NOVA 편입 방식 |
|---|---|---|---|---|
| 7 | **백엔드 통합** (NOVA ⊃ API-On) | Gateway·커넥터 4종·DLQ·SLA·Swagger·Kyber-768 PQC | 🟢 | "컴포넌트가 실데이터 API와 바로 연결되는 플랫폼" — 쇼케이스가 실증. UX Layer의 `useNovaGateway()`(ADR-E2) = SBUx datastore 개념의 상회 |
| 8 | **노코드 빌더** (NOVA ⊃ Nexus) | Vue Flow 노코드·Breakpoint·버전관리·RAG | 🟢 | 쇼케이스 데이터 가공 단계로 편입 + Portal AI챗 엔진(ADR-D2) |
| 9 | **SSO/RBAC/승인** | 전사 SSO+RBAC 5단계+승인 워크플로우 | 🟢 코드/⚠️ 잔여 | Layer auth-client(ADR-E1) — "상속 = SSO 자동" 그들에게 없는 온보딩. 잔여=ISS-252 provisioning·ISS-256 어휘(P1) |
| 10 | **품질 거버넌스** | eslint 7룰+sebit-ci+Creator 3계층 | 🟢/⚠️ | 배지 대신 신뢰 기반 전시. GH Packages 부채는 D8 확정으로 P1 해소 |
| 11 | **문서 자동생성** (NOVA Doc) | pptxgenjs·Playwright PDF — F1 납품 실증 | 🟢 웹표준 한정 | SBDashBoard의 "리포팅툴 연계"(서드파티)를 **자체 제품 수직결합**으로 상회 |

### 2-4. 정직 원장 — 열위·선점·동급·미확인 (⛔ 과장 금지의 근거)

| # | 항목 | 사실 | NOVA 입장 |
|---|---|---|---|
| H1 | **HWP/HWPX/전자문서유통** | SBWrapDoc = Pubdoc·HWPX API·한글 Automation·DRM 보유. 우리 자산 0 | **열위 인정.** NOVA Doc은 웹표준 영역으로 포지셔닝, HWP는 선택 보강(D10). 공공 HWP 필수 건에서는 열위 명시 |
| H2 | **MCP 선점** | 소프트보울 MCP 2종 **이미 운영**(JSON-RPC 200 실호출 확인) + Claude 등록 가이드 PDF | 후발 인정. 차별화 = **컴포넌트+백엔드 통합 MCP**(그들=Grid·Chart 2종 / 우리=6제품 카탈로그+Gateway·Flow까지 단일 MCP — ADR-D1 component-meta 재사용) |
| H3 | **인증 배지** | GS·SA·전자정부·나라장터 6종 체계 보유. 우리 0 | 1차(대내)는 품질 거버넌스로 대체, 인증은 D3 게이트 |
| H4 | **i18n** | SBGrid setResource·Locale API 보유 확인 | **동급 축** — 상회 주장 금지. Nuxt i18n 생태계로 대응(P6) |
| H5 | **키보드 접근성(Chart)** | ECharts 공식 이슈 #18585 — 미흡 확인 | SA 2단계(D3) 추진 시 자체구현 필요 리스크(R1) 박제 |
| H6 | **성능 인용값 미검증** | 10만행·50만·1.24s 등은 업계 인용값이지 NOVA 실측 아님 | ⛔ qa 실측 게이트 통과 전 마케팅 문구화 금지(R4) |
| H7 | **8년 축적** | 608버전·주간 릴리즈 — 하루에 못 따라잡는 총량 | 드롭 0 시퀀싱(§3-0)+릴리즈 케이던스 수립(P4)으로 대응 — "즉시 동등" 주장 금지 |
| H8 | 미확인 잔여 | 680 API 집계 근거·이벤트 전체 목록·SBDashBoard 빌더 여부·SBWrapDoc 처리량·소개서 PDF 6종 등(checklist §8 통합목록 11건) | "미확인" 유지 — 비교 주장에 사용 금지. 필요 시 재정찰 |

---

## 3. 기능정의서 — 완전 커버리지 MoSCoW (드롭 0)

> **기준**: 분모 = §A-3 커버리지 원장(coverage-checklist 전수 실측). 상회 목표 = §A-4 성능 원장 인용값만. [내 제안] = 벤치마크·사용자 요구에 없는 항목. ⛔ 벤치마크 수치 목표(680 API 등 집계 미확인분)는 동수 재현이 아니라 **기능군 단위**로 정의.

### 3-0. 커버리지 총괄표 — 전 항목 매핑 (드롭 0 증명)

| 축(실측 분모) | MoSCoW 분배 | 담당 제품 | 커버 Phase | 드롭 |
|---|---|---|---|---|
| SBUx 컴포넌트 29종(+미완 1) | **Must 19 / Should 9 / Could 2** (checklist §1-2 종별 분류 승계) | NOVA UX | Must=P1 · Should/Could=P1~P6(§3-1) | **0** |
| SBUx 56유형(변형) | 상당수 Nuxt UI v4 prop 변형으로 기실현 — 유형 매트릭스 문서화 | NOVA UX | P1(문서화)→P6(잔여 변형) | 0 |
| SBUx 공통메서드 32·연계속성 7 | 기능군 4+1로 재정의(§3-1 하단) | UX(+Grid·Doc) | P1~P5 | 0 |
| SBGrid 데모 38항목 | **Must 26 / Should 11 / Could 1** (§3-3 산정) | NOVA Grid | Must=P3 · Should/Could=P6 | **0** |
| SBGrid API 문서화 287(카테고리 28·메서드 126) | 기능군 매핑 — 동수 재현 아님(680 집계 미확인), NovaGrid 계약 API로 재정의 | NOVA Grid | P3(코어)~P6(축적) | 0(기능군 기준) |
| SBChart 42종 | 내장 직접 커버군(Must/Should)+조합·커스텀(Should)+플러그인·지도(Could) — §3-4 | NOVA Chart | P2(실사용 100%+내장군)→P6(42 전수 등가) | **0** |
| SBChart API 1,336·접근성 9·datarange 19 | 기능군 매핑(접근성 1단계 Must·2단계 D3, datarange 기본 Must·고급 Should) | NOVA Chart | P2~P6 | 0 |
| SBDashBoard 위젯 5·테마 3 | Must(프리셋 데모)+Should(빌더 — D6) | NOVA Dashboard | P4 | 0 |
| SBDashBoard 메뉴 33 | 업무화면 11→**NOVA UI 템플릿** · 시각화 8→쇼케이스 갤러리 · 그리드활용 11→Grid 데모 · 연계 2→Doc·UX · 퍼포먼스 1→Grid 벤치 | UI·Grid·Doc·쇼케이스 | P3~P6 | **0**(전량 이관 배치) |
| SBWrapDoc 특장점 4+기능 6 | 웹표준 등가(Must/Should)+HWP군(Could — D10 게이트)+Pubdoc(대외 P7 조건부) | NOVA Doc | P5~(D10) | 0(게이트 대기 ≠ 드롭) |
| 공통 포털(메뉴 5·튜토리얼·검색·Monaco·릴리즈·구매) | §4 — 구매만 2차(P7) | NOVA Portal | P4(구매=P7) | 0 |
| AI 4채널(MCP·가이드·GPTs·챗) | Must(MCP·가이드)/Should(챗)/Could(GPTs) | MCP+AI | P5(D12: P4 조기화 검토) | 0 |
| 인증 6종 | D3 게이트(접근성 설계만 선반영) | 전 제품 | P7 | 0(게이트 대기) |

### 3-0-b. ⭐ 신규 발견 기능군 배치표 (v1 spec에 없던 것 — research ②가 찾아낸 것 전량 배치)

| # | 신규 발견 | 실측 근거 | 배치: 제품 · MoSCoW · Phase |
|---|---|---|---|
| 1 | **피봇** | Grid 데모 /extention/pivot | Grid · Should · **P6 상반**(수요 실사 후 착수 게이트 — tanstack 코어에 없어 자체 구현 비용 大) |
| 2 | **스파크라인**(셀타입+데모) | Grid 셀타입 12 중 sparkline·데모 | Grid · Should · P6(NOVA Chart 래퍼 재사용으로 비용 절감) |
| 3 | **마스터-디테일**(행 확장) | Grid Template 7 중 detailTemplate·detailAutoOpen | Grid · Should · P6 |
| 4 | **개인화 API 7종**(save/list/merge/remove/reset/set/getPersonalConfig) | Grid 메서드 126 실측 | Grid · Should · P6(저장은 서비스 DB — ADR-B4 스키마 준용, RBAC 연동) |
| 5 | **WebSocket 바인딩** | v2.5 서버바인딩 3방식 실측 | Grid · Should · P6(API-On Gateway 경유 실시간 — 그들은 코드예제 수준[G3], 우리는 Gateway 상품으로 상회 여지) |
| 6 | **다국어(setResource)** | Grid 메서드 실측 | Grid(+UX) · Should · P6(Nuxt i18n — H4 동급 축, 과장 금지) |
| 7 | **CSV export** | Grid Excel 3종(csv/excel/import) | Grid · **Must · P3**(ExcelJS 도입 시 저비용) |
| 8 | **엑셀 업로드(import)** | Grid 데모 /excel/loadexcel + excelImport | Grid · **Must · P3**(양방향이 실무 요건 — checklist Must 승계) |
| 9 | **숨은 컴포넌트 4종**(label·carousel·pdfviewer·datastore) | SBUx 데모 미노출·API 실존 | UX — label=**P1**(FormField) · carousel=P6(UCarousel) · pdfviewer=P6(신규) · datastore=**P1 상회**(`useNovaGateway` — ADR-E2) |
| 10 | **접근성 9속성**(use~rovingContentsFormat) | SBChart global.accessibility[9] | Chart · 1단계(alt 필수+데이터테이블+decal 배경패턴)=**Must P2**(ADR-B3 계약 내장) · 2단계(TTS·roving/키보드)=Could→**D3 확정 시 Must**(R1 갭 정직) |
| 11 | 캘린더 뷰·패널레이아웃 6종 | Grid 데모 /extention | Grid · 캘린더=Could·P6 / 패널=Should·P6 |
| 12 | **waterfall**(42종째)·datarange 19속성 | SBChart API 전용+data.datarange | Chart · waterfall=Should·P2(bar stack 기법) / datarange 기본(dataZoom)=Must·P2·고급(backgroundChart·syncCrosshair 등가)=Should·P6 |
| 13 | **Code Generator·UI Template**(v2.5 포털) | 항목명 실측(실물 미확인) | Portal · Code Generator=Could·P6(MCP가 상위 대체 — AI 어시스턴트가 코드 생성, ADR-D2 논리) / UI Template=NOVA UI 제품으로 승격(§3-2) |
| 14 | **SB-Chat BYOK 4프로바이더** | aichat 실측 | AI · 참고 패턴 — 우리는 Nexus 경유(키 보유)라 BYOK 불요, 대외(P7) 시 BYOK 옵션 검토 |
| 15 | doCommand/canCommand **커맨드 인터셉트** | Grid Extension 실측 | Grid · Should · P6(실행 전 승인 훅 — 승인 워크플로우 4축과 결합 [내 제안]) |
| 16 | **그리드 연계속성 7종**(grid-id~grid-jit 선언형 양방향) | SBUx attribute_common 실측 | UX↔Grid · **Must · P3**(선언형 바인딩 규약 — SBUx 연계성의 실체 재현+Gateway 결합 상회) |

### 3-1. NOVA UX (P1) — SBUx 대응

| 기능 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| 코어 컴포넌트 **Must 19종**: input·datepicker(range 포함)·radio·checkbox·select(체크박스형)·button(4동작형)·textarea·dropdown(스플릿)·alert·modal(3사이즈)·progress·tabs·menu·tree(체크박스)·accordion·sidemenu·fileupload(4유형)·breadcrumb·switch | 19종/유형·속성 상세 = checklist §1-2 | Canvas 41 자산 + **Nuxt UI v4 직접활용+`--nova-*` 래핑**(ADR-A2·D7)으로 전수 대응 + API 문서 | **Must** | P1 |
| Should 9종: label(P1)·listbox·layout·carousel·slider·datastore·imageviewer·pdfviewer·spinner | 데모 미노출 4종 포함(§3-0-b #9) | label=P1 즉시, datastore=`useNovaGateway`로 **상회**(중앙 Gateway·키 주입·에러 표준 — ADR-E2), 나머지 P6 | Should | P1/P6 |
| Could 2종: gallery·contextmenu | gallery 2유형·contextmenu(그들도 미완) | P6(contextmenu는 Grid와 공용) | Could | P6 |
| Nuxt Layer 상속 실현 — stateless Layer 분리·타 서비스 extends 실동작 | (SBUx = script 삽입 방식 — Layer 개념 없음) | ISS-257 해소 + ADR-A4 경계. **상회 = 상속만으로 SSO·Gateway·토큰 자동**(ADR-E1·E2) | **Must** | P1 |
| RBAC role 어휘 단일화 | — | ISS-256 + `project_agend_rbac_common_module` | **Must** | P1 |
| 컴포넌트 API 문서 전수(props/slots/events/예시) | SBUx = 검색 가능한 속성 카탈로그 2,561건 | 41종 전수 + **속성 검색**(그들 searchData 패턴 차용) — vue-component-meta 자동 추출(ADR-C2) | **Must** | P1 |
| 감사게이트 ❌→✅ (ISS-253·254·258 포함) | — | NOVA 기반의 선결부채 | **Must** | P1 |
| 폼 일괄 검증(validateRequired 등가) | 공통메서드 32 중 | zod 매핑 | **Must** | P1 |
| 팝업 제어(popupWindow/Layer 등가) | 공통메서드 32 중 | UModal/overlay | **Must** | P1 |
| **UX↔Grid↔Chart 연동 API**(connectAllGridToComps·calc 3종·연계속성 7 등가) | SBUx "강력한 연계성"의 실체 | 선언형 바인딩 규약 + 쇼케이스 실증. **상회 = 연동 데이터가 실데이터(Gateway)** | **Must** | P3 |
| 그룹/네임스페이스 데이터 일괄 관리 | 공통메서드(getAllData·refreshGroup 등) | 폼 그룹 상태관리(Pinia) 표준 [내 제안] | Should | P6 |
| exportImage/exportPdf(컴포넌트 내보내기) | 공통메서드 32 중 | NOVA Doc 파이프라인과 결합(상회 — 단품 이미지가 아니라 보고서로) | Should | P5 |
| 디자인토큰 정본 문서화+다크모드 전수 | (그들 다크모드 미확인 — U5) | `--nova-*`(ADR-A3)+`dark:` 필수(CLAUDE.md). 비교 주장은 금지(미확인) | Should | P1 |
| 접근성 기본선(키보드·aria) | tabs_webacc 전용 유형·aria 릴리즈 시그널 관찰 | Nuxt UI v4 기본선+체크리스트 | Should | P1(→D3) |
| 유형(변형) 카탈로그 — 56유형 등가 매트릭스 | 29종→56유형 분화 | 상당수 v4 prop으로 기실현 — 매트릭스 문서화 후 잔여 변형만 추가(개수 목표는 P1 문서화 후 확정 — 발명 금지) | Could | P6 |
| 이클립스 플러그인 등가 | 코드 자동완성·스니펫 | MCP+에디터 스니펫(AI 시대 등가물 [내 제안]) | Could | P5 |
| Vue 외 프레임워크(WC 배포) | 그들 = Angular/React/Vue 데모 3종(200 확인) | 현재 열위 — WC 배포 시 동급 이상([WC] 추세 근거). **D11 게이트** | Could | P7 |

### 3-2. NOVA UI (P4 1차) — 복사 템플릿 (D4 확정 신설 제품)

| 기능 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| 템플릿 규약 + 부트스트랩 연동 | SBUx "템플릿 제공" 배지·v2.5 UI Template(실물 미확인) | ADR-B1(복사=서비스 소유)+ADR-F3(new-project 템플릿) | **Must** | P4 |
| 업무 도메인 템플릿 갤러리 | SBDashBoard 업무화면 **11종**(사원관리·급여·퇴직연금·청구·수금·상품·보험·시간표·환거래·세금계산서 등) | **SEbit 실서비스 화면에서 추출**(Origin·PROVE·Sentinel·Stock) — 그들은 샘플, 우리는 운영 실물 기반이 상회 서사. 1차 수량은 P4 실서비스 화면 실사 후 확정(발명 금지) | Should | P4~P6 |
| 솔루션 연계 템플릿(UI&Grid/UI&Chart/UI&Grid&Chart 등가) | SBUx 연계 데모 3유형 | 쇼케이스에서 파생한 결합 템플릿 3종 | Should | P4 |

### 3-3. NOVA Grid (P3 — D1 확정: tanstack, ADR-B2 3층 구조) — SBGrid 대응

> 데모 38항목 산정: **Must 26**(컬럼 2+캡션 7+스타일 6+병합 1+데이터조회 2+연산 1+엑셀 2+편집 3+Sticky 행/열 2) / **Should 11**(트리 2·Undo 1·접근성 1·contextmenu·tooltip·개인화·패널·스파크라인·Grid&Chart 연동·피봇) / **Could 1**(캘린더). API 287은 기능군으로 재정의(680 집계 미확인 — 동수 목표 금지).

| 기능군 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| 셀타입/에디터 | 12종(숫자·텍스트·날짜·체크·라디오·멀티텍스트·버튼·콤보+password·tree·sparkline·설정)+방향키·Enter 에디트 | 코어 8종+password P3 · tree/sparkline P6. 키보드 내비 포함 | **Must**(9)/Should(3) | P3/P6 |
| 캡션(헤더) | 7항목: 레이아웃·너비조정·다중캡션·이동·정렬필터·그룹핑·캡션메뉴 | 다단 헤더·리사이즈·헤더 메뉴 전수 | **Must** | P3 |
| 스타일 | 6항목: 테마·로딩UI·리사이즈·placeholder·행/열 CSS + Style 훅 9종 | `--nova-*` 토큰 테마(상회 — 다크모드 포함, 그들 미확인 U5) | **Must** | P3 |
| 병합 | 행&열 병합+mergeUpdate+사용자 정의 병합(범위) | 병합 3종 P3, 사용자 정의 범위 병합 P6 | **Must**/Should | P3/P6 |
| 페이징·정렬·필터 | 서버/클라 페이징·서버/단일/다중 정렬·서버 필터링 포함 4항목 | 전수(서버사이드 = Gateway 경유) | **Must** | P3 |
| **대용량(클라)** | "가상공간·무한스크롤" — **행수 미명시**[G2]·공식 Lazy 데모 100건[G4] | **행 가상화 10만행+ 클라 렌더·60fps(16.6ms 프레임예산)** — 근거 [AG](100k+·~40행 렌더)·[TV](60FPS). `@tanstack/virtual` 신규 도입(R2). **⛔ qa 실측 게이트 후 공개 벤치 데모화** — 수치 명시 자체가 상회 서사(그들 수치 0) | **Must** | P3 |
| 열 가상화(virtualColumn) | Scrolling 5항목 중 실측 | 행 가상화 후속 | Should | P6 |
| **대용량(서버)** | 서버바인딩 3방식 = 코드예제 수준, 블록캐시·서버 그룹핑/집계 개념 부재[G3] | **서버사이드 블록 lazy-load(캐시·그룹핑·집계) 50만건+ 공개 데모** — 근거 [AG](SSRM)·[RG](50만 데모 동급선). API-On Gateway가 백엔드 기둥. ⛔ qa 실측 게이트 | Should | **P6 상반** |
| **Excel/CSV** | excelExport(수식·스타일·그룹핑)·excelImport·csvExport + prepend/append 콘텐츠 | **ExcelJS 스트리밍**(50k행 read 1.2s대 목표선 — [SK][XL]) export/import/CSV 3종. 수식·스타일 export 포함. 신규 도입(현 0 — R2) | **Must** | P3 |
| RowHeaders | 6기능(체크·행번호·라디오·상태·고정) | 전수 | **Must** | P3 |
| Sticky | 7항목(헤더·푸터·행+고정행 편집/추가/수정/삭제) | 기본 Sticky(행/열/헤더/푸터) P3 · 고정행 편집 계열 P6 | **Must**/Should | P3/P6 |
| 편집 상태머신 | 정합성 검증·Copy&Paste(4옵션)·행 상태정보(insert/update/delete)·저장 프로토콜(getUpdateData 상태구분) | 검증(zod 정합)+복붙+상태 payload 표준 P3 · Undo&Redo(undoable) P6 | **Must**(3)/Should(1) | P3/P6 |
| 집계 | Aggregates·합계/소계·수식(calc)·역순번(reverseRowNo) | 합계/소계 P3 · 사용자 수식·순번 P6 | **Must**/Should | P3/P6 |
| 선택/내비 | selectable·navigatable·hover | 전수(키보드 내비 포함) | **Must** | P3 |
| 그룹핑·트리 | 그룹핑 5옵션·트리그리드·트리 lazy 로딩·비동기 노드 재로드 | P6 상반(그룹핑→트리 순) | Should | P6 |
| 템플릿 | 7종(cellTemplate·**detailTemplate 마스터-디테일**·empty·loading 등) | 셀 템플릿은 P3(Vue 슬롯이 자연 상회 — 선언적 커스텀 렌더러) · 마스터-디테일 P6 | Should | P3/P6 |
| 패널 레이아웃 | 6패널(툴바·그룹바·타이틀·페이저·상태바·캡션) | P6 | Should | P6 |
| 개인화 | API 7종(save/list/merge/remove/reset/set/get) + v2.5 "개인화 기능" | 서비스 DB 저장+RBAC 연동(ADR-B4 스키마 준용) — **상회 여지 = 전사 SSO 계정 단위 개인화** | Should | P6 |
| 확장 UX | contextmenu(기본+커스텀)·tooltip·내장 검색 모달·autoComplete·Mask 입력 포맷·Sizing 12종 | P6 일괄 | Should | P6 |
| doCommand/canCommand 인터셉트 | 실행 전 승인/후처리 훅 | 승인 워크플로우(4축)와 결합 [내 제안] | Should | P6 |
| Grid↔Chart 연동 | SBChart 연동 배지+데모 | NOVA Chart 연동(선택영역→차트) — 쇼케이스 실증 | Should | P3 |
| WebSocket 실시간 바인딩 | 3방식 중 하나(코드예제) | Gateway 경유 실시간(Origin 센서 스트림) — 상품화된 백엔드로 상회 여지 | Should | P6 |
| 다국어 | setResource·Locale API(**그들 보유 — H4**) | Nuxt i18n. 동급 목표(상회 주장 금지) | Should | P6 |
| Drag&Drop | 열 재배열·데이터 이동·그리드 간 복사/이동 | P6 | Could | P6 |
| 피봇·스파크라인·캘린더 | /extention 데모 실측 | §3-0-b #1·2·11 | Should·Should·Could | P6 |
| 프레임워크 3종 등가 | Angular/React/Vue 데모(200 확인) | D11(WC) 게이트 | Could | P7 |

### 3-4. NOVA Chart (P2 — D5 확정: ECharts 6.0 통일) — SBChart 대응

| 기능군 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| ECharts 6.0 단일화 8/8 레포 | (그들 자체엔진 단일) | D5 확정 — N7 breaking 실사+8레포 회귀 게이트(`feedback_optimize_no_regression`) | **Must** | P2 |
| 등록형 Wrapper 표준화 | 42종 각각 전용 옵션 그룹(extend 35그룹) 문서화 | 현 4종 하드 등록→등록형. **1차 = 사내 실사용 유형 100%**(P2-1 실사로 분모 확정) + 내장 직접 커버군 카탈로그 | **Must** | P2 |
| 42종 커버 — 내장 직접군 | 라인 3·영역 4·막대 코어(bar/range/stack/100%/boxplot/candlestick)·원형 4·분포(scatter/heatmap/treemap/sunburst/graph 등)·결합·기타(tree/radar/sankey/pictorial) — checklist §3-2 판정 ✅군 | ECharts 내장 시리즈로 커버(waterfall=bar stack 기법 포함) | **Must**(실사용)/Should(카탈로그 전시) | P2 |
| 42종 커버 — 조합·커스텀군 | wing(양방향)·broken(축 생략)·bell(정규분포)·histogram·imageSingle·gantt(custom series) | 조합/커스텀 구현 — P6 완주(42 전수 등가) | Should | P6 |
| 42종 커버 — 플러그인·확장군 | wordcloud(플러그인)·지도(대한민국 시군구)·**북한지도**·**심전도(실시간)** | wordcloud=플러그인 P6 · 지도 geoJSON P6 · 북한지도=Could(소재 미확인) · 심전도=**Origin 센서 실스트림으로 재해석 상회 여지 [내 제안]** | Could | P6 |
| **이중 렌더러 정책** | **SVG 전용**(무손실이나 대용량 구조 약점) | **SVG(무손실 확대 [EH]) + Canvas(대용량) 선택** = SBChart가 구조적으로 못 하는 것 🟢 | **Must** | P2 |
| **대용량** | "빅데이터 표현" 주장 — 수치 0 | Canvas+**LTTB(10000+ 포인트)**+**progressive(3000+ 요소)** [ES][EO] · WebGL 수백만 [WS]은 P6. ⛔ qa 실측 게이트 | **Must**(LTTB/progressive)/Could(WebGL) | P2/P6 |
| **접근성 1단계** | accessibility 9속성(use·title·description·useContainer·replaceH3/H4·legendDataType·useRoving·rovingContentsFormat) — SA 인증 실체 | `alt` **required** prop+`#data-table` 슬롯(ADR-B3 계약 내장)+**decal 배경패턴**(ECharts aria 내장 [EA] — 저비용) | **Must** | P2 |
| 접근성 2단계 | TTS 연동·roving tabindex(키보드) | ECharts 키보드 갭(R1·H5) — 자체구현 필요. **D3 확정 시 Must 승격** | Could | D3 |
| datarange(미니맵·범위선택) | 19속성(backgroundChart·syncCrosshair·min/max바 등) | dataZoom 기본 P2 · 고급 등가 P6 | **Must**/Should | P2/P6 |
| 축·범례·툴팁 고급 | axis 8군(다중축·반전)·legend 16·tooltip 31 | 내장 옵션 매핑 문서화(P2 코어·P6 고급 전수) | Should | P2~P6 |
| 다크모드·토큰 테마 | 스타일 4종(트렌드·파스텔·하이브리드·심플) | `--nova-*` 연동 테마 4종 등가+다크(CLAUDE.md 필수) | **Must** | P2 |
| 카탈로그 데모 패턴 | 옵션토글 10·애니 3·스타일 4·View/Copy Code·차트별 설명문 | Portal 데모 규격으로 차용 | Should | P4 |
| 밀스톤(기준선)·export 내장 | milestone 5속성·export 6속성(이미지) | markLine 등가 P2 · 이미지 export P2(내장), 보고서 export는 Doc 결합(상회) | Should | P2/P5 |

### 3-5. NOVA Dashboard (P4 — D6 유지: 기본안 데모/프리셋) — SBDashBoard 대응

| 기능 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| 프리셋 대시보드+테마 | 위젯 5(TODO·알림·메세지·인사말·테마)·테마 3 | PresetDashboard 승계+`--nova-*` 테마. 위젯 계약=ADR-B4 | **Must** | P4 |
| **실데이터 바인딩** | (근거 관찰되지 않음 — 샘플 시연물) | 위젯 dataSource=`useNovaGateway`(ADR-B4·E2) — **쇼케이스 요건이므로 Must 승격**(v1 Could→v2 Must). ⛔ 픽스처 금지 | **Must** | P4 |
| 위젯 조립 빌더+저장(RBAC) | 빌더 여부 **미확인**(❓ — 실조작 필요) | Builder 원형 보유 — D6에 따라 승격. 저장은 서비스 DB(ADR-B4 스키마) | Should | D6 |
| 우클릭 개인화(즐겨찾기 편집) | 실측 | Grid 개인화(P6)와 공용 패턴 | Should | P6 |
| 시각화 갤러리 | 시각화 8종(코로나·부동산·기대수명 등 — 샘플 데이터) | **Origin 실데이터 갤러리로 상회**(경영분석·센서 등) — 쇼케이스 파생 | Should | P4 |
| 업무화면 11종 | (§3-0 총괄표: NOVA UI로 이관) | §3-2 | — | P4~P6 |
| 대용량 데이터바인딩 시연 | "퍼포먼스" 데모 1 | Grid 10만행 벤치 데모와 결합(Q10) | **Must** | P3~P4 |
| 리포팅툴 연계 | "연계: 리포팅툴&그리드"(서드파티) | **NOVA Doc 수직결합으로 상회** — 대시보드→보고서 내보내기(§3-6) | Should | P5 |

### 3-6. NOVA Doc (P5 1차) — SBWrapDoc 대응 ⭐신설

**포지셔닝(⛔ 정직 원칙)**: "SBWrapDoc = 레거시 오피스(HWP/워드) 변환·전자문서유통 / NOVA Doc = **웹표준·데이터연동 리포팅**(PDF·PPT·동적리포트)"으로 **영역 분리**. HWP 필수 요건(공공 조달 등)에서는 열위를 인정한다(H1). "전면 상회" 주장 금지 — 우위 주장은 웹표준 영역에 한정.

| 기능 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| **템플릿 기반 PPT 자동생성** | (SBWrapDoc 범위 밖) | pptxgenjs — **F1 업무보고서 자동생성으로 이미 실증**(샘플 3종·고객 확정, §A-2). 템플릿 엔진 표준화 | **Must** | P5 |
| **web→벡터 PDF 파이프라인** | (범위 밖) | Playwright — 제안서 웹표준 파이프라인 자산(`reference_proposal_web_to_pdf`) 제품화 | **Must** | P5 |
| **동적 리포트(대시보드→보고서)** | (범위 밖 — 그들은 서드파티 리포팅툴 연계) | **쇼케이스 "이 대시보드를 PPT/PDF로 내보내기"** = 6제품 통합의 완성 장면(Q11·Q12) | **Must** | P5 |
| 대량 문서 생성(mail-merge형) | "대량의 데이터를 하나의 문서로"·"대량 문서 병합" — **처리량 수치 없음(U2)** | 템플릿×데이터 대량 생성. ⛔ 비교 주장 불가(U2) — **자체 실측치만 박제**(Q12) | **Must** | P5 |
| 엑셀 데이터 연계 | 워드·엑셀 데이터 연계·취합 | ExcelJS(Grid와 공유 — 도입 1회로 2제품 커버) | Should | P5 |
| docx(워드) 템플릿 | MS워드 연계 | docx 스킬 자산 — 수요 확인 후 | Should | P6 |
| 배포문서(편집·인쇄·복사 제한) | DRM성 배포문서 생성 | PDF 권한 제어·워터마크로 유사 구현(완전 DRM 아님 — 정직 표기) | Should | P6 |
| 문서 병합(문단 병합) | 특장점 03 | PDF/PPT 병합 파이프라인 | Should | P6 |
| **HWPX 변환** | HWPX 변환 API(개방형 한글) | ❌ 자산 0 — **D10 게이트**(공공 수요 발생 시 보강) | Could | D10 |
| 한글 텍스트 추출(Data I/O) | HWP 파싱·조건 컨트롤 | D10 종속. 채택 시 RAG 문서 인제스트(Omni-BIM·Nexus)와 접점 [내 제안] | Could | D10 |
| Pubdoc(정부 전자문서 유통)·한글 Automation | 특장점 01·기능 6 중 | ❌ 열위 인정(H1) — 대외 공공(P7·D2) 확정 시에만 재검토 | Could | P7 조건부 |

### 3-7. NOVA MCP + AI 지원 (P5 — D12로 조기화 검토)

| 기능 | 소프트보울 실측 수준 | NOVA 목표(근거) | MoSCoW | Phase |
|---|---|---|---|---|
| **NOVA MCP 서버** | MCP 2종 **운영 중·실호출 200 확인**(H2 선점) | Portal Nitro 라우트(ADR-D1) — component-meta.json 재사용. **차별화 = 그들 2종(Grid·Chart) vs 우리 단일 MCP로 6제품+Gateway·Flow까지**(컴포넌트+백엔드 통합 MCP) | **Must** | P5(D12: P4 동시 출시 검토) |
| MCP 등록 가이드(Claude 등) | 등록 가이드 PDF 2종 | 등가 문서 | **Must** | P5 |
| 포털 AI챗 | SB-Chat(BYOK 4프로바이더) | Nexus AI엔진/RAG 경유(ADR-D2 — Portal 자체 LLM 금지). 키 보유라 BYOK 불요(대외 시 옵션) | Should | P5 |
| GPTs 등 외부 채널 | GPTs 1종 관찰 | 후순위 | Could | P7 |
| Code Generator | v2.5 항목명 관찰(실물 미확인) | MCP가 상위 대체(사용자의 AI 어시스턴트가 생성) — 별도 구축 안 함이 기본, 수요 시 재검토 | Could | P6 |

---

## 4. 개발자 포털 표준 (NOVA Portal — apps/portal, :4000)

> 원칙 = **"데모=문서"**(Telerik·Storybook 패턴) — ADR-C2(Nuxt Content+vue-component-meta, 데모 SFC 단일 소스)로 구조 확정. v2.0 추가 실측: 그들 포털은 **속성 검색(searchData) + Monaco 플레이그라운드**까지 내장 — NOVA 대응을 아래에 반영.

| # | 소프트보울 요소(실측) | NOVA Portal 대응 | 우리 기반 | 신규 여부 |
|---|---|---|---|---|
| ⓪ | **통합데모 허브(SBUxDemo)** — 전 제품 결합 체험(**핵심 무기**) | **⭐ NOVA 통합 쇼케이스(§2-2)** — Portal 플래그십. 실데이터 live로 상회 | Origin 실데이터+Gateway+PresetDashboard | **신규 — P1부터 v0.1** |
| ① | 제품홈(인증배지+고객로고) | 1차 = 실측 수치·품질 거버넌스로 신뢰 전시. Micro `/nova`와 역할 분담(Micro=브랜드, Portal=실사용) | Micro 개편 기획서 §4 | 부분 신규 |
| ② | 튜토리얼 5단계(설치→적용→생성→편집/구조→꾸미기) | NOVA 5단계: **상속(extends)→컴포넌트 적용→페이지 생성→데이터 연결(Gateway)→테마/토큰**. 4단계가 그들에게 없는 차별화. SBChart의 "구조" 단계 서술 차용 | 없음 | **신규** |
| ③ | API가이드 — 가이드/예제 2탭+**속성 검색**+**Monaco 플레이그라운드** | 컴포넌트별 [가이드 탭]+[예제 탭]+**전 속성 검색**(그들 searchData 패턴). 플레이그라운드 = 2단계(iframe srcdoc→@vue/repl, ADR-C3) | 없음(문서 0) | **신규** |
| ④ | Demo(카테고리 트리+"소스는 예제탭" 연결) | Canvas Explorer 10카테고리 승격 + 데모↔가이드 상호링크 필수화 | Explorer 원형 보유 | 승격 |
| ⑤ | 릴리즈노트 — **3제품 608버전·주간 케이던스**(신뢰 신호 실측) | CHANGELOG 기반 릴리즈 페이지 + **정기 릴리즈 케이던스 수립**(주기는 P4 릴리즈 규율에서 확정 — 발명 금지). P1부터 CHANGELOG 규율 | 없음 | **신규** |
| ⑥ | 구매(Core/서버 기반 견적·나라장터·1년 무상 유지보수·영업일+1 SLA) | 1차 범위 제외 — D2 확정 시 P7 설계(SLA 모델 참고자료로 박제) | — | 2차 |

**Explorer 승격 경로**: 현 `pages/canvas/explorer/` = ④의 뼈대로 승계 → ③과 상호 링크 → P1 문서 41종을 ③의 콘텐츠로 주입 → ②·⑤ 신규 추가. **포털은 신축이 아니라 Explorer의 증축** + 쇼케이스(⓪)가 정문.

---

## 5. 로드맵 — 재편 (608버전 축적 현실 반영: P1~P5 코어 + P6 축적 트랙 + P7 대외)

> P1이 전체 선결(감사게이트+Layer+문서 파이프라인). **쇼케이스는 P1 v0.1부터 시작해 매 Phase 편입 확대** — 각 Phase 완료판정에 포함. P2·P3 상호 독립(병행 가능). P6은 Phase가 아니라 **상시 트랙**(릴리즈 케이던스로 Should/Could 소진 — 그들의 주간 릴리즈 8년에 대응하는 우리 방식).

### 5-1. Phase 정의

| Phase | 내용 | 선결조건 | 산출물 | 완료 판정(검증 가능) |
|---|---|---|---|---|
| **P1** 기반+뼈대+쇼케이스 v0.1 | Canvas 부채 해소·모노레포/publish(D8)·UX Layer(Must 19종)·문서 파이프라인·**쇼케이스 v0.1** | 없음(D1·D4·D5·D7·D8·D9 확정 완료 — §A-5) | ① ISS-252 provisioning ② ISS-256 ADR+구현 ③ Layer 분리 ④ ISS-253/254/258 ⑤ 41종 API 문서 ⑥ CHANGELOG ⑦ SEbit-NOVA 모노레포+GH Packages publish ⑧ **쇼케이스 v0.1(실데이터 1소스)** | ⓐ 1개 서비스 extends 실동작 ⓑ 문서 41/41 ⓒ qa 게이트 ✅ ⓓ **쇼케이스 v0.1 실데이터 렌더(픽스처 0)** |
| **P2** 차트 | ECharts 6.0 통일(D5)+등록형 Wrapper+접근성 1단계+이중 렌더러 | P1 Layer 구조 (N7 실사는 P1과 병행) | ① 8레포 실사용 유형 실사표 ② 6.0 적용 ③ 등록형 Wrapper ④ alt+데이터테이블+decal ⑤ LTTB/progressive 대용량 데모 | ⓐ 8/8 단일 6.x ⓑ 실사용 유형 100% 커버 ⓒ 8레포 회귀 통과 ⓓ **쇼케이스 Chart 정식 편입** |
| **P3** 그리드 코어 | NovaGrid Must 26항목(D1 tanstack·ADR-B2) + 연계 규약 | P1 Layer 구조 | ① 3층 코어 ② Must 26 데모 ③ 10만행 가상화 벤치 ④ Excel/CSV 3종 ⑤ UX↔Grid↔Chart 연계 규약 | ⓐ Must 26/26 데모 실동작(qa) ⓑ 10만행 데모 qa 실측(60fps 예산) ⓒ 1개 서비스 실적용 ⓓ **쇼케이스 Grid 편입** |
| **P4** 포털+쇼케이스 정식 | Explorer 승격+튜토리얼+API가이드(검색)+릴리즈+Dashboard Must+NOVA UI 1차 | P1 문서 41종 | ① 포털 ⓪~⑤ ② 데모=문서 파이프라인 ③ 속성 검색 ④ 플레이그라운드 1단계 ⑤ Dashboard 프리셋+실데이터 위젯 ⑥ UI 템플릿 규약 ⑦ 릴리즈 케이던스 확정 | ⓐ 데모↔가이드 상호링크 100% ⓑ 튜토리얼 5단계로 신규 페이지 1개 완성(qa 실행) ⓒ **쇼케이스 = Portal 정문(플래그십) 정식 편입** |
| **P5** MCP+AI+Doc 1차 | MCP 서버+등록 가이드+AI챗+**NOVA Doc 1차(PPT/PDF/동적리포트)** | P4 카탈로그 데이터(component-meta) | ① MCP ② 가이드 ③ AI챗(Nexus 경유) ④ Doc 템플릿 엔진 ⑤ **쇼케이스 "보고서 내보내기"** | ⓐ Claude 등록→실트래픽 ≥1건 ⓑ **쇼케이스에서 PPT+PDF 실생성 = 6제품 통합 완성(Q11·Q12)** |
| **P6** 축적 트랙(상시) | §3의 Should/Could 잔여 전량 백로그 소진 — 피봇·개인화·마스터디테일·WebSocket·그룹핑/트리·서버 50만·42종 완주·유형 카탈로그… | P3~P5 코어 | 분기별 커버리지율 보고(§3-0 분모 기준)+정기 릴리즈 | Must 잔여 0 유지 + Should 소진율 분기 보고(목표율은 분기 시작 시 백로그 기준으로 설정 — 수치 발명 금지) |
| **P7** 대외 조달(2차) | GS/SA 인증·나라장터·구매 페이지·WC 배포(D11)·Pubdoc(D10 연계) | **D2·D3 사용자 결정** + P1~P5 | 결정 후 별도 기획 | (D2·D3 확정 후 정의) |

### 5-2. 커버리지 시퀀싱 — "이번에 커버 / 다음으로 미룸" (⛔ 놓침이 아니라 시퀀싱임을 증명)

| Phase | 이번에 커버하는 소프트보울 기능(실측 항목) | 다음으로 미루는 것(이월처 — 드롭 0) |
|---|---|---|
| **P1** | SBUx Must 19종+label(20/30종)·공통메서드 중 검증/팝업·datastore 등가(Gateway)·속성 검색형 문서(2,561건 대응 구조)·CHANGELOG(릴리즈 케이던스 시동)·**통합데모 허브 형태(쇼케이스 v0.1)** | 잔여 컴포넌트 9종(→P6)·유형 56 전수 매트릭스(→P6)·그룹데이터 메서드군(→P6)·export 메서드(→P5 Doc) |
| **P2** | SBChart 42종 중 실사용 100%+내장 직접군·접근성 9속성 중 1단계(alt·설명·decal)·스타일 4종 등가·datarange 기본·이중 렌더러+LTTB(그들이 못 하는 것) | 조합·커스텀군(wing·bell·gantt 등 →P6)·북한지도·심전도·wordcloud(→P6)·TTS·roving(→D3)·datarange 고급 19 전수(→P6)·WebGL(→P6) |
| **P3** | SBGrid 데모 38 중 Must 26(셀타입 코어·캡션 7·스타일 6·병합·페이징·정렬·필터·Sticky·가상화·Excel/CSV 3종·RowHeaders·편집 3·집계·선택)+연계속성 7 등가+10만행 벤치(그들 수치 0 대비) | Should 11(트리·그룹핑·Undo·개인화·패널·스파크라인·피봇·contextmenu·tooltip·접근성·Grid&Chart 고급)+Could 1(캘린더) → P6 · 서버 50만 블록캐시 → P6 상반 |
| **P4** | 포털 5요소(SBUxDemo 허브 포지션 포함)·튜토리얼 5단계·API 검색·Monaco 등가 1단계·릴리즈노트(608버전 관찰 대응)·SBDashBoard 위젯/테마·업무화면 11종 대응 시동(UI 템플릿) | 플레이그라운드 2단계 @vue/repl(→P5~P6)·Code Generator(→P6, 기본 미구축)·구매(→P7)·업무화면 갤러리 확대(→P6) |
| **P5** | AI 4채널 중 3(MCP·가이드·챗)·SBWrapDoc 웹표준 등가(PPT/PDF/동적리포트/대량생성)·UX export 메서드군(Doc 결합) | GPTs(→P7)·HWPX·한글 추출(→D10)·Pubdoc·Automation(→P7 조건부)·배포문서 고급(→P6) |
| **P6** | 위 이월분 전량 소진(백로그 관리) + 42종 완주 + 서버사이드 50만 데모 | (잔여 시 차기 분기 이월 — 백로그에서 소실 금지) |
| **P7** | 인증 6종 대응(D3)·구매/SLA·WC(D11)·Pubdoc(D10) | — |

---

## 6. WBS — P1 착수 단위작업 (담당 역할 지정)

> 역할=SEbit-Creator 8역할 조직. ⛔ 만든 사람이 자기 검사 금지 — 게이트 재판정은 qa 독립 수행. 구조 전제 = architect 설계서 §9(N1~N7) — N1(D7~D9)은 확정 완료(§A-5).

| # | 작업 | 담당 | 선행 | 완료 판정 |
|---|---|---|---|---|
| P1-0 | **SEbit-NOVA 모노레포 뼈대 + GH Packages publish 파이프라인**(D8 확정 — architect N2. sebit-eslint-config publish 부채 동시 해소) | devops | — | `@sebit-nova/*` 시험 publish+타 레포 설치 성공 |
| P1-1 | Canvas 감사대장 전수 재확인 + ISS-252 운영 provisioning 검증 | devops + qa | — | provisioning 확인 결과 박제 |
| P1-2 | role 어휘 단일화 ADR(builder→manager 정렬+마이그레이션) | architect | — | ADR 승인 |
| P1-3 | Layer 분리 ADR — 확정본 반영(ADR-A4 stateless 경계) | architect | — | ADR 승인 |
| P1-4 | UX Layer 구현(Nuxt UI v4 래핑 — D7·ADR-A2 + `--nova-*` 토큰) | frontend | P1-3 | 빌드+기존 페이지 회귀 통과 |
| P1-5 | 상속 파일럿 — 1개 서비스 extends 실동작 | frontend | P1-4 | 파일럿 빌드+화면 실동작 |
| P1-6 | 문서 파이프라인(vue-component-meta — ADR-C2)+**속성 검색 구조** | architect(선정)→frontend | — | 샘플 3종 자동 생성+검색 동작 |
| P1-7 | 41종 문서 전수+사용예시+검수 | frontend + qa(검수) | P1-6 | 41/41+qa 통과 |
| P1-8 | ISS-253·254·258 해소 | backend | — | 실 DB 기록·PII grep 0·폴백금지 준수 |
| P1-9 | ISS-256 구현 | backend | P1-2 | 단일 어휘+JWT 왕복 테스트 |
| P1-10 | CHANGELOG 시작+릴리즈 규율(P4 ⑤ 원천 — 608버전 케이던스 대응 시동) | frontend | — | P1 변경분 기록 존재 |
| P1-11 | **쇼케이스 v0.1** — 시나리오 확정(D13)+Origin 실데이터 1소스(`useNovaGateway` 경유 — no-direct-origin-call 준수)+UX·현 Chart 래퍼 편입 | frontend + backend | P1-4 | **실데이터 렌더 실동작(픽스처 0 — qa 확인)** |
| P1-12 | 감사게이트 재판정 | **qa(독립)** | P1-1~11 | 게이트 ❌→✅ 판정문 박제 |

**P1 병행 선발대**: P2-1 8레포 실사용 차트 유형 실사표 + **N7 ECharts 6.0 breaking 실사**(D5 실행 전제) — research 담당, 코드 변경 없음.

---

## 7. 사용자 결정 — 확정 원장 + 신규 결정 필요사항

### 7-1. 확정 (재론 불요 — §A-5 상세)

| # | 확정 내용 |
|---|---|
| D1 | 그리드 = tanstack v8 헤드리스(어댑터 격리로 상용 전환 대비). D2가 그리드 중심 상품화로 확정되면 재검토 트리거 유지 |
| D4 | 명명 = NOVA UX·UI·Grid·Chart·Dashboard(+Portal 채널). **v2.0: Doc 추가로 6제품 — 세계관 정본 갱신 필요** |
| D5 | ECharts 6.0 통일(N7 실사+8레포 회귀 게이트 조건부 실행) |
| D7 | Nuxt UI v4 통일 |
| D8 | GH Packages npm 배포(버전 트레인 fixed) |
| D9 | Portal :4000 · nova.sebit.co.kr[도메인 추정 — DNS 등록 시 확정] |

### 7-2. 기존 결정 유지 (게이트 대기)

| # | 결정 | 옵션 | 추천 + 이유 (v1 유지) |
|---|---|---|---|
| **D2** | 대외 상품화 범위·시점(P7 게이트) | (a) 전 라인업 (b) 일부만 (c) 당분간 대내 | **추천 (c)→(b) 순차** — P5 실물 축적 후 근거로 결정. P5 완료 시점 재상정 |
| **D3** | 조달 인증(GS/SA) 추진 | (a) 추진 (b) 보류 | **추천 (b) 보류 + Chart 접근성 1단계는 P2 선반영**(v2.0: decal 배경패턴까지 1단계 포함 — ECharts 내장이라 저비용 [EA]. 되돌릴 필요 없는 방향) |
| **D6** | Dashboard 제품 승격 | (a) 독립 제품 (b) 데모/프리셋 | **추천 (b)** — 벤치마크도 독립 제품 아님(실측·빌더 여부 미확인). ADR-B4 계약은 양쪽 대응 |

### 7-3. 신규 결정 필요 (v2.0 — 옵션+추천+이유)

| # | 결정 | 옵션 | 추천 + 이유 |
|---|---|---|---|
| **D10** | **NOVA Doc HWP/HWPX 보강 여부** | (a) 1차 제외 — 공공 HWP 수요 발생 시 보강 검토(hwpx 라이브러리/제휴 실사 후 재상정) (b) 즉시 보강 착수 (c) 영구 제외 | **추천 (a)** — ① 우리 자산 0(실사)이라 즉시 보강은 신규 투자 ② 1차 목표(대내)엔 HWP 수요 근거 없음 ③ (c) 영구 제외는 공공 조달(D2) 가능성을 미리 닫음. 수요 트리거 명시: 공공 건 RFP에 HWP 요건 등장 시 재상정 |
| **D11** | **Web Components 중립 배포** | (a) 보류 — P7(대외) 게이트에서 재상정 (b) P6에서 추진 | **추천 (a)** — ① 1차 대내는 Nuxt 단일 스택 표준(CLAUDE.md)이라 수요 0 ② WC 채택 추세([WC] 10%→18%)는 근거 있으나 그들 프레임워크 3종 데모 대응은 **대외 판매 시나리오에서만 의미** ③ 지금 추진하면 P1~P5 코어 리소스 분산 |
| **D12** | **MCP 출시 시점** | (a) P5 유지 (b) **P4로 조기화**(포털과 동시 출시) | **추천 (b)** — ① 데이터 소스(component-meta.json)가 P1 산출물이라 조기화 비용 낮음(ADR-D1: Portal Nitro 라우트 = 추가 인프라 0) ② 소프트보울 MCP 2종 선점(H2 — 실호출 확인)이라 후발 격차 단축이 유리 ③ 리스크 = P4 범위 증가 — 실트래픽 검증(Q6)은 P5로 남겨도 됨 |
| **D13** | **쇼케이스 업무 시나리오** | (a) **SEbit 경영 현황 대시보드**(Origin 자사 경영 실데이터) (b) 공정/설비 모니터링(Origin 센서) (c) HR 현황(Origin tb_employee_mst) | **추천 (a)** — ① Origin 실데이터 층 보유 확인(메모리 `project_origin_data_agent`) ② (b)는 GeoAxis 계열 시연(`project_facility_viz_platform`)과 소재 중복 — 브랜드 역할 분리상 NOVA는 경영/업무 데이터가 정합 ③ (c)는 PII 취급 부담(ISS-254 교훈). Grid 대용량 데모는 시나리오와 별개로 Sentinel 케이스 DB(100만+ — Micro 원장) 활용 검토 |

---

## 8. 성공 판정 기준 (⛔ 정량 — 전부 검증 방법 포함)

| # | 질문 | 정답 / 판정 방법 |
|---|---|---|
| Q1 | 다른 SEbit 서비스가 NOVA UX를 Layer로 **실제 상속**하는가? | P1: extends 활성+빌드+실동작 **≥1**(현재 0). P4 시점: **≥3** |
| Q2 | 컴포넌트 API 문서 커버리지는? | **41/41** + 속성 검색 동작 — props/slots/events 표 존재 grep 전수 |
| Q3 | ECharts 버전은 단일한가? | 직접의존 **8/8 레포 ^6.x**(D5 확정 반영. 현재 5.6×5/6.0×3) — package.json grep |
| Q4 | 그리드 Must 기능군이 실동작하는가? | **SBGrid 데모 38항목 중 Must 26/26 데모 실동작**(qa 실행 검증, 현재 0) |
| Q5 | "데모=문서" 동기가 지켜지는가? | 포털 데모의 소스보기·API가이드 상호링크 **100%** — 링크 전수 크롤 |
| Q6 | MCP가 실동작하는가? | Claude에 NOVA MCP URL 등록 → 응답 **≥1건 실트래픽**(설정≠도달 — 실호출 로그) |
| Q7 | Canvas(NOVA UX) 감사게이트는? | ❌배포차단 → **✅**(qa 독립 재판정, 판정문 박제) |
| Q8 | 신규 서비스의 기본 경로가 NOVA인가? | Creator new-project 템플릿에 NOVA 상속 반영(ADR-F3) + 신규 서비스 1호가 실제 상속으로 시작 |
| **Q9** | **완전 커버리지 — 드롭 0인가?** | ⓐ 기획 매핑: §3-0 총괄표에 소프트보울 실측 전 축 매핑 존재·드롭 **0**(본 문서로 충족) ⓑ 구현 누적: **P5 종료 시 6제품 Must 항목 100%**(분모=§3 각 표 Must) ⓒ Should/Could: P6 백로그 소진율 분기 보고(백로그 소실 0) |
| **Q10** | **상회 목표를 실측으로 달성했는가?** | ⓐ Grid 클라 **10만행 가상화 데모, 프레임예산 60fps(16.6ms)** qa 실측 ⓑ Grid 서버 **50만건+ 블록 lazy-load 공개 데모**(P6) ⓒ Excel **50k행 스트리밍 export**(목표선 1.2s대 [SK]) ⓓ Chart **1만+ 포인트 LTTB/progressive 데모**. ⛔ 전부 **qa 실측 게이트 통과 후에만 마케팅 문구화**(인용값≠실측 — R4·H6) |
| **Q11** | **⭐ 통합 쇼케이스가 6제품 전부를 한 시나리오로 실제 구동하는가?** | ⓐ P1: v0.1 실데이터 렌더(픽스처 0) ⓑ 각 Phase 완료 시 해당 제품 편입 확인 ⓒ P5 종료: **UX+UI+Grid+Chart+Dashboard+Doc 6/6이 단일 업무 시나리오에서 실데이터로 실구동**(qa 시나리오 검증) — 소프트보울 통합데모(샘플 데이터·100건 실증) 대비 live 차별점 증빙 포함 |
| **Q12** | **NOVA Doc 웹표준 우위가 실증되는가?** | ⓐ 쇼케이스 "보고서 내보내기"로 **PPT+PDF 2포맷 실생성** ⓑ 대량 생성 자체 실측치 박제(건수·소요 — 비교 주장은 U2로 불가, 자체 수치만) ⓒ HWP 열위는 문서·전시에 정직 표기(H1 위반 0) |

---

## 9. 범위

**하는 것 (1차, P1~P6)**: Canvas 부채 해소·UX Layer 상속 실현·41종 문서화(+속성 검색) / 차트 자산화(6.0 통일·등록형 래퍼·접근성 1단계·이중 렌더러) / 그리드 Must 26(tanstack·10만행 벤치·Excel 3종) / 개발자 포털 ⓪~⑤·데모=문서 / **통합 쇼케이스(P1 v0.1→P5 6제품 완성)** / MCP+AI(D12 시점) / **NOVA Doc 1차(PPT·PDF·동적리포트·대량생성)** / P6 축적 트랙(Should/Could 백로그 소진) / Micro `/nova` 전시 연동.

**안 하는 것**:
- ⛔ SBGrid "680 API" 동수 재현(집계 근거 미확인 — 기능군 기준으로만)
- ⛔ 벤치마크 미확인 항목(이벤트 전체 목록·소개서 PDF·가격·SBDashBoard 빌더 여부 등 H8) 모방·비교 주장
- ⛔ **"전면 상회" 마케팅** — 열위(HWP·인증·MCP 선점)와 동급(i18n)은 §2-4 정직 원장대로만 서술
- ⛔ qa 실측 게이트 전의 성능 수치 마케팅화(H6)
- HWP/HWPX/Pubdoc/한글 Automation(D10·P7 게이트 — **드롭 아님, 게이트 대기**)
- WC 프레임워크 중립 배포(D11 — P7 게이트)
- 상용 판매·구매 페이지·조달 인증 착수(D2·D3 결정 전)
- Nexus·API-On 기능 개편(NOVA는 **포함**하지 재작성하지 않음)

**⛔ 용어 규율 — "드롭 0" 원칙**: ① **이번에 함**(해당 Phase) ② **다음으로 미룸**(P6 백로그 — §5-2에 이월처 명시) ③ **게이트 대기**(D2·D3·D10·D11 — 결정 후 착수) 세 가지만 존재한다. "안 하기로 함(드롭)"은 소프트보울 실측 항목에 대해 존재하지 않는다(§3-0이 전수 매핑 증거).

---

## 부록 1. v1 부록 유지 — research 근거와 달라진 실사 3건 (2026-07-27 planner 재검증)

| # | research 기재 | 최신 실사 | 기획 반영 |
|---|---|---|---|
| 1 | "ISS-252 미조치" | 코드 수정 완료(7/23) — 잔여=운영 JWT_SECRET provisioning | P1-1 = provisioning 검증 |
| 2 | Nexus AI 노드 "17종" | CLAUDE.md·Micro 원장 "19종" 상충 | 미확정 표기, P4 문서화 시 확정 |
| 3 | ECharts "8서비스" | 직접의존 8레포 실측 일치 | Q3 분모=8 확정 |

## 부록 2. v2.0 통합으로 정정·신규 확인된 사실 (전 항목 실측 근거)

| # | v1 기재/미인지 | v2.0 실측(출처=coverage-checklist·superiority-benchmark) | 기획 반영 |
|---|---|---|---|
| 1 | SBUx "30종 50유형" | **29종(+미완 1)/56유형·속성 2,561**(searchData.js 파싱) — 마케팅 주장과 정합하나 실체 확정 | §2-1·§3-1 분모 교체 |
| 2 | SBChart "41종" | **42종**(데모 41+API 전용 waterfall) | §3-4 분모 교체 |
| 3 | SBGrid "680 API" | 문서화 실측 **287항목** — "680" 집계 근거 미확인(별개 집계 추정) | 동수 목표 금지 유지, 기능군 기준 확정 |
| 4 | MCP "공개" 수준 인지 | **JSON-RPC initialize 실호출 200 확인** — 선점 확정 사실 | H2 정직 박제 + D12 조기화 논거 |
| 5 | (미인지) | **SBWrapDoc 발견** — 소프트보울은 4제품이 아니라 **5제품**(문서 변환·생성 포함) | **NOVA Doc 신설**(§3-6)의 직접 계기 |
| 6 | (미인지) | 소프트보울 **절대 성능수치 전무 + 대용량 공식 실증 = 100건 데모**[G3][G4] | 상회 전략의 핵심 근거(§A-4) — "정량 공개 벤치" 자체가 상회 서사 |
| 7 | (미인지) | **i18n(setResource·Locale) 그들 보유** | H4 동급 축 — 상회 주장 금지 |
| 8 | (미인지) | sbgsheet.co.kr **DNS 소멸** — "스프레드시트 연동" 제품 실체 현재 없음 | 대응 불요 판정(모방 대상 아님) |
| 9 | (미인지) | 릴리즈 3제품 **608버전·주간 케이던스** 실데이터 | §1 로드맵 전제(P6 축적 트랙)+P4 릴리즈 케이던스 수립 근거 |
| 10 | (미인지) | 숨은 컴포넌트 4종·피봇·스파크라인·마스터디테일·개인화 7 API·WebSocket 바인딩·접근성 9속성 등 신규 기능군 | §3-0-b 배치표로 전량 배치(드롭 0) |
