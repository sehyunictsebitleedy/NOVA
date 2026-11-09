# NOVA 기능 완전 커버리지 체크리스트 — 소프트보울 전 제품 전수 채집

> **목적**: 소프트보울 5제품(SBUx·SBGrid·SBChart·SBDashBoard·SBWrapDoc)의 모든 기능·특장점을 하나도 빠짐없이 열거하여, NOVA가 벤치마킹 극대화 시 **단 하나의 기능/특장점도 누락하지 않도록** 하는 완전 커버리지 체크리스트.
> **기준시각**: 2026-07-27 (전 항목 실 fetch / 원시 데이터 파일 직접 다운로드·파싱 실측)
> **방법론**: ① 페이지 실 fetch(WebFetch) ② SPA 페이지는 원시 HTML의 데이터 소스 JS 파일(searchData.js·SBGridApiData.js·SBChartApiData.js·ReleaseNote.js)을 curl로 직접 다운로드해 Node로 전수 파싱 ③ MCP 엔드포인트는 JSON-RPC initialize 실호출(200 확인). **발명 0 — 전 항목 원문/실측**.
> **성능 수치는 별도 research 담당** — 본 문서는 기능 완전성만.
> 확인상태 범례: ✅ 확인(실측) / 🟨 SPA-blocked(데이터 소스로 우회 확보) / ❓ 미확인(URL 기록)

---

## §1. SBUx v2.6 (웹 컴포넌트 프레임워크)

### 1-1. 특장점·슬로건 (원문 전수)

| 소프트보울 기능/특장점 (원문) | 원문 근거(URL) | 확인상태 | NOVA 대응 계획 | 우선순위 |
|---|---|---|---|---|
| "웹 컴포넌트 기반의 웹 디자인 솔루션" / "진정한 웹 사용을 위한" | https://www.sbux.co.kr | ✅ | NOVA UX 포지셔닝 문구 | Must |
| "30개 종 50개 유형의 컴포넌트로 다양한 웹 구성 레이아웃 지원" (실측 = 29종+계약상 30종 / 56유형, §1-2) | sbux.co.kr + API 사이드메뉴 실측 | ✅ | Canvas 41컴포넌트 → **유형(변형) 카탈로그 재정의** | Must |
| "강력한 적응력 — HTML5 웹 표준 기술 준수, 다양한 개발환경에 적용 가능" | https://www.sbux.co.kr | ✅ | Nuxt UI v3/웹표준 기본 충족 — 문구화만 | Should |
| "강력한 연계성 — SBChart와 SBGrid가 함께 구성되어 다양한 그래픽 활용" | https://www.sbux.co.kr | ✅ | NOVA UX↔Grid↔Chart 연동(§1-4 그리드 연계속성 참조) | Must |
| "다양한 데이터 시각화와 대시보드 업무 화면 제작 지원" | https://www.sbux.co.kr | ✅ | NOVA Dashboard와 결합 전시 | Must |
| "No.1 UI/UX Solution" | https://www.sbux.co.kr | ✅ | (경쟁 슬로건 — 참고만) | Could |
| "종속성을 탈피한 새로운 UI/UX 개발의 대안" / "Pretty Cool & easy to Build" | https://softbowl.co.kr/front/solution/sbux.do | ✅ | 비종속(OSMU) 포지셔닝 — NOVA는 Nuxt Layer 상속으로 대응 | Should |
| 특장점 6종: 웹 표준 준수 / 표준개발 환경 / 유연성·확장성 / 30+ 컴포넌트 / 빠른 기술 지원 / 원라인 코드 | solution/sbux.do | ✅ | "원라인 코드"=HTML5 Custom Tag 방식 — NOVA는 SFC+auto-import로 등가 서술 | Should |
| 기능 4종: ① Lightweight(복잡한 웹구성 단순화) ② HTML5 Custom Tag(간단·일관 코드) ③ 우수한 연계성(표준 외부 라이브러리 연계) ④ OSMU 가능(비종속성 통한 개발자 확보) | solution/sbux.do | ✅ | NOVA UX 특장점 4축으로 번안 | Should |
| **이클립스 플러그인 제공** | solution/sbux.do | ✅ | NOVA=VSCode/AI(MCP) 시대 등가물 — MCP 서버·에디터 스니펫 [제안] | Could |
| 반응형 웹 제작 가능 / SVG 기반 차트 컴포넌트 | solution/sbux.do | ✅ | 기본 충족 | Must |
| 인증 배지: GS인증 / 나라장터 종합쇼핑몰 등록 / 전자정부프레임워크 호환성 레벨2 / 조달청 우수제품 / 크로스브라우저 / 웹 표준 / 템플릿 제공 / 교육 및 기술지원 | https://www.sbux.co.kr | ✅ | 인증=D3 결정(보류) — 나머지는 Portal 배지 | D3 |
| 제품 소개서 PDF: SBUx2.6_introduction_2022.pdf / SBUx_v2.1_Feature.pdf | softbowl.co.kr/resources/pdf/ | ❓ 내용 미독(URL만 확보) | 추가 정찰 시 독해 | — |

### 1-2. 컴포넌트 전수 — "30종 50유형"의 실체 (API 사이드메뉴+searchData.js 실측: **29종 56유형** + 주석처리 1종 2유형)

근거: https://www.sbux.co.kr/SBUxNew/api/js/Import_sidemenu.js + /SBUxNew/api/data/searchData.js (직접 다운로드·파싱, 2026-07-27). 데모 썸네일(27종 노출)에 **없던 컴포넌트 4종 발견: label·carousel·pdfviewer·datastore**.

| # | 컴포넌트(종) | 유형(전수) | 속성 수(searchData 실측) | 데모 노출 | NOVA 대응(Canvas/Nuxt UI 기준) | 우선순위 |
|---|---|---|---|---|---|---|
| 1 | input | input_text / input_password / input_search / input_hidden | 84/51/87/9 | ✅ 입력 | UInput 계열 보유 | Must |
| 2 | datepicker | datepicker_inline / datepicker_popup / datepicker_range | 39/81/95 | ✅ 입력 | 캘린더/범위선택 — range 포함 확인 필요 | Must |
| 3 | radio | radio_normal | 45 | ✅ 입력 | 보유 | Must |
| 4 | checkbox | checkbox_normal | 55 | ✅ 입력 | 보유 | Must |
| 5 | **label** | label_normal (label_title은 주석="??") | 25 | ❌ 데모 미노출 | FormField/label 대응 | Should |
| 6 | select | select_single / select_checkbox(다중체크) / select_singleExt | 51/62/62 | ✅ 입력 | USelect+체크박스형 변형 | Must |
| 7 | button | button_normal / button_modal / button_submit / button_send | 38/38/38/39 | ✅ 입력 | UButton — modal/submit/send 유형은 동작 결합형 | Must |
| 8 | textarea | textarea_normal | 50 | ✅ 입력 | 보유 | Must |
| 9 | listbox | listbox_single | 40 | ✅ 입력 | 리스트박스 | Should |
| 10 | dropdown | dropdown_normal / dropdown_button / dropdown_splitbutton | 46/47/47 | ✅ 네비 | UDropdown+**스플릿버튼 변형** | Must |
| 11 | **layout** | layout_row / layout_col (사이드메뉴 주석="작업 미완료", searchData엔 존재) | — | ❌ | 그리드 레이아웃(row/col) — Tailwind 기본 | Should |
| 12 | alert | alert_alert | 36 | ✅ 피드백 | UAlert | Must |
| 13 | modal | modal_normal / modal_small / modal_middle / modal_large | 36/33/33/33 | ✅ 피드백 | UModal+사이즈 변형 3종 | Must |
| 14 | progress | progress_bar / progress_loading | 42/13 | ✅ 피드백 | UProgress+로딩 | Must |
| 15 | tabs | tabs_normal / tabs_inbox / tabs_webacc(웹접근성 전용 유형) | 97/85/56 | ✅ 네비 | UTabs — **접근성 전용 유형** 주목 | Must |
| 16 | menu | menu_normal | 50 | ✅ 네비 | 내비게이션 메뉴 | Must |
| 17 | tree | tree_normal / tree_checkbox | 91/96 | ✅ 네비 | **트리(체크박스 포함)** — Canvas 확인 필요 | Must |
| 18 | accordion | accordion_normal | 48 | ✅ 네비 | UAccordion | Must |
| 19 | **carousel** | carousel_image / carousel_tag | 48/34 | ❌ 데모 미노출 | UCarousel | Should |
| 20 | sidemenu | sidemenu_normal | 100 (최다 속성) | ✅ 네비 | LNB — API-On 레이아웃 차용 | Must |
| 21 | fileupload | fileupload_single / fileupload_multiple / fileupload_singleExt / fileupload_multipleExt | 23/22/34/42 | ✅ 입력 | 파일업로드 4유형(단일/다중×기본/확장) | Must |
| 22 | slider | slider_single | 22 | ✅ 입력 | USlider | Should |
| 23 | **datastore** | datastore_ajax (searchData 인덱스에 있으나 속성표 없음) | 미상 | ❌ | **데이터 스토어(ajax 바인딩) 개념** — NOVA는 Gateway 연동으로 상회 | Should |
| 24 | gallery | gallery_single / gallery_multiple | 16/27 | ✅ 피드백 | 갤러리 | Could |
| 25 | breadcrumb | breadcrumb_text / breadcrumb_select | 33/31 | ✅ 네비 | UBreadcrumb+select형 변형 | Must |
| 26 | imageviewer | imageviewer | 7 | ✅ 피드백 | 이미지 뷰어 | Should |
| 27 | **pdfviewer** | pdfviewer | 16 | ❌ 데모 미노출 | **PDF 뷰어** — Canvas 부재 추정, 신규 후보 | Should |
| 28 | switch | switch_single | 57 | ✅ 입력 | USwitch | Must |
| 29 | spinner | spinner_normal / spinner_splitbutton | 65/67 | ✅ 입력 | 숫자 스피너+스플릿버튼형 | Should |
| 30 | contextmenu | (사이드메뉴 주석: "생성 이슈로 인해 코드 확인 못함") | — | ❌ | 컨텍스트메뉴 — Grid쪽엔 존재(§2) | Could |
| — | 솔루션 연계 3유형: UI&Grid / UI&Chart / UI&Grid&Chart | — | — | ✅ 연계 | NOVA 통합데모 3종 등가 구성 | Must |

**실측 총계: 29종(+미완 1종) / 56유형 / 속성 총 2,561건**. "30종 50유형" 마케팅 주장과 정합. 원시 카탈로그 재취득 URL: `https://www.sbux.co.kr/SBUxNew/api/data/searchData.js` (86KB).

### 1-3. 공통 메서드 32종 (method_common 전수 — searchData.js 실측)

getAllData, refreshAll, clearAllData, wrap-class, wrap-style, clear, popupWindow, popupLayer, closePopupLayer, **exportImage, exportPdf**, validateRequired, getAttr, **connectAllGridToComps**, **calcHistogram, calcAxisData, calcStackData**, getGroupData, refreshGroup, clearGroupData, changeGroupAttr, hidenshowGroup, getNamespaceData, clearNamespaceData, clearCompData, render, setExt, getExt, getAttrExt, clearExt, refreshNamespaceData, dispatch

| 기능군 | NOVA 대응 | 우선순위 |
|---|---|---|
| 그룹/네임스페이스 단위 데이터 일괄 관리(getAllData·refreshGroup·Namespace 계열) | 폼 그룹 상태관리(Pinia) 표준화 [제안] | Should |
| **exportImage / exportPdf** (컴포넌트 수준 내보내기) | NOVA 공통 export 유틸 [제안] | Should |
| validateRequired (일괄 필수값 검증) | 폼 검증 표준(zod) 매핑 | Must |
| **connectAllGridToComps + calcHistogram/calcAxisData/calcStackData** (컴포넌트→그리드/차트 데이터 연산 연계) | NOVA UX↔Grid↔Chart 연동 API — SBUx 연계성의 실체 | Must |
| popupWindow/popupLayer (팝업 제어) | UModal/overlay 매핑 | Must |

### 1-4. 그리드 연계 공통 속성 7종 (attribute_common(SBGrid2.5) 전수)

`grid-id, grid-ref, grid-direction, grid-status, grid-event, grid-ignore-header-event, grid-jit` — **컴포넌트에 속성만 붙이면 그리드와 양방향 바인딩**되는 선언형 연계. NOVA 등가물: 컴포넌트↔NOVA Grid 선언형 바인딩 규약 [제안, Must].

### 1-5. 개발자 포털 요소 (SBUx 사이트)

| 요소 | 근거(URL) | 확인상태 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|
| 튜토리얼 5단계: ①라이센스 설치(무설치 디렉토리) ②제품 적용(head 연결만) ③컴포넌트 생성(필수 코드) ④컴포넌트 편집(API 속성) ⑤웹 화면 꾸미기(커스터마이징) | https://www.sbux.co.kr/tutorial | ✅ | NOVA 5단계 튜토리얼(spec §4-② 확정: 상속→적용→생성→데이터연결→테마) | Must |
| API 가이드: 제목 "SBUx 2.6 API Sample"(ver 2.6.minor), iframe+사이드메뉴+**속성 검색**(searchData.js 기반 검색창) | https://www.sbux.co.kr/SBUxNew/api/index.html | 🟨 SPA(데이터소스로 전수 확보) | Portal API 문서+검색 | Must |
| 데모(썸네일 그리드 → 개별 데모 페이지 27종) | https://www.sbux.co.kr/demo/thumbnail/thumbnail | ✅ | Portal 컴포넌트 갤러리 | Must |
| Release Note — **실측 247버전(2021.03.26 v2.6.1080 → 2026.04.01 v2.6.1342), 기능추가 125건** | https://www.sbux.co.kr/release → 데이터: /SBUxNew/js/data/ReleaseNote/ReleaseNote.js | 🟨→✅ | Portal 릴리즈노트(주간 릴리즈 체계가 신뢰 신호) | Must |
| 구매 페이지 / 기존 홈페이지(old.sbux.co.kr) 병행 운영 | https://www.sbux.co.kr/purchase | ✅ | (대외 상품화 시) | Could |

### 1-6. SBUx 릴리즈노트에서 드러난 기능 시그널 (기능추가 125건 중 대표 — 전수는 ReleaseNote.js)

- 접근성 지속 보강: tab aria-label / datepicker from·to-aria-label / menu tabIndex (2025.04.29 집중)
- tree: uncheckChildTreeNodes·getChildTreeNodeAll 메서드, datepicker date-part-step, gallery 드래그 정렬(is-draggable+getGallerysChangedOrderData), blurOnScroll(모바일 스크롤 UX), disabled-validate, SBUxConfig CompletedAfterRendering(렌더 완료 훅)

### 1-7. SBUx — 아직 확인 못한 영역

| 영역 | URL | 비고 |
|---|---|---|
| 개별 데모 27페이지 각각의 화면 옵션 토글 | https://www.sbux.co.kr/demo/inputCompo/input 등 27개 | 속성 카탈로그(2,561건)로 상위 커버 — 화면 토글 UI는 미열람 |
| API 가이드 각 항목의 설명·예제 본문 | /SBUxNew/api/page/*.html | 항목명은 전수 확보, 본문 미독 |
| 제품 소개서 PDF 2종 | softbowl.co.kr/resources/pdf/SBUx2.6_introduction_2022.pdf, SBUx_v2.1_Feature.pdf | 미독 |
| old.sbux.co.kr (구버전 사이트) | https://old.sbux.co.kr/ | 미방문 |

---

## §2. SBGrid v3 (+v2.5) — 엔터프라이즈 그리드

### 2-1. 특장점·슬로건 (원문 전수)

| 소프트보울 기능/특장점 (원문) | 원문 근거(URL) | 확인상태 | NOVA 대응 계획 | 우선순위 |
|---|---|---|---|---|
| "웹 접근성을 고려한 그리드 솔루션" / "접근성을 고려한 국산 웹 그리드" | https://sbgrid.co.kr | ✅ | NOVA Grid 접근성(§2-3 accessibility 항목) | Should |
| "Sticky, Grouping, Lazy Loading 등 특화 기능… 다양한 업무 환경에 유연하게 대응" | https://sbgrid.co.kr | ✅ | spec §2-2 Must 승계 | Must |
| 3축: 다양한 데이터 표현 / 편리한 확장 / 유연한 호환성("주요 프레임워크와 자유롭게 연동") | https://sbgrid.co.kr | ✅ | 프레임워크 연동=§2-5 | Must |
| 홈 기능배지 14종: Sticky·Grouping·Lazy Loading·Excel Download·**Bigdata Binding**·필터링·트리·페이징·엑셀호환·Drag&Drop·Copy&Paste·Undo&Redo·커스터마이징·**SBChart 연동** | https://sbgrid.co.kr | ✅ | spec §2-2 전 항목 매핑 완료 확인 | Must |
| "국내 최초 출시된 Non-ActiveX 기반 제품(2013), 조달쇼핑몰 공공시장 점유율 1위" | solution/sbgrid.do + 통합데모 | ✅ | (경쟁 포지션 — NOVA는 사내 실증으로 대체) | — |
| 특장점 6배지: 개발 안정성 / 익숙한 DOM 기반 / 다양한 필수 기능 / 높은 성능 제공 / 기술지원 서비스 / 생산성·업무환경 특화 | https://softbowl.co.kr/front/solution/sbgrid.do | ✅ | NOVA Grid 특장점 축 번안 | Should |
| 상세 01 "개발하기 손쉬운 확장기능": 컨트롤패널·그룹/트리 지원·데이터 정렬(Sort)·**부분합계(Subtotal)/누계 처리**·**사용자 정의 수식**·**행간 자동 순번(Sequence)** | solution/sbgrid.do | ✅ | Aggregates+수식+순번(reverseRowNo 실측 §2-3) | Must |
| 상세 02 "유연한 외부 인터페이스": **MS Excel 파일 읽기/저장**·XML 및 JSON 데이터 연동·컨텍스트 메뉴·**사용자의 모든 동작 이벤트 제공**·**타 솔루션 연동(리포팅 툴 등)**·상용/비상용 라이브러리 연동 | solution/sbgrid.do | ✅ | Excel import/export(Must)+이벤트 전면 노출+리포팅툴 연계[제안] | Must/Should |
| 상세 03 "고객친화적 커스텀": 컨트롤패널(사용자정의 아이콘·버튼)·**다양한 Mask 기능**·**사용자 정의 병합(범위 지정)**·다양한 Custom 이벤트 | solution/sbgrid.do | ✅ | Mask=입력 포맷팅 — NOVA Grid 편집기 옵션 [제안] | Should |
| 슬라이드: "편리한 설정, **% 상대 좌표**, 열 단위 이동(Move), 틀 고정(Fixed), CSS 지원(테마), 다양한 애니메이션 효과, **그리드 간 데이터 복사/이동**" / "대용량 데이터 처리 — 표시 영역만 컨트롤하는 기술" / 데이터 표현 제어 / **스프레드시트 연동** | solution/sbgrid.do | ✅ | 가상렌더링(Must)·그리드간 D&D(Could)·스프레드시트(sbgsheet — §8 소멸 확인) | Must~Could |
| v2.5: "높은성능·빠른속도·안정적지원", 그리드 시장 점유율 1위, 국내외 200여 기업(공공 88·기업 46·금융/교육 24 로고), 모든 브라우저/OS/디바이스, GS(굿소프트웨어) 인증, No-plugin·N-Screen, JSON/Array 데이터 표현, W3C 가입 활동, 데이터 분할 표현 처리로 성능 향상, Active-X 제품에 준하는 성능, 자체 기술 개발로 기술지원 용이, 커스터마이징 지원, 방문/유선 지원 | https://sbgrid.co.kr/v2_5 | ✅ | (레거시 신뢰 서사 — NOVA는 SEbit 실적으로 대체) | — |
| v2.5 기능 10종: 편리한 CRUD·필터링·정렬/다중정렬·페이징·행/컬럼 고정·**셀 자동 병합**·엑셀 내보내기/가져오기·그룹핑/트리·**개인화 기능**·컨텍스트 메뉴 | https://sbgrid.co.kr/v2_5 | ✅ | v3 데모(§2-2)와 합집합 — 전부 매핑됨 | Must |
| 인증: GS인증·**SA인증**·전자정부 표준프레임워크 호환성·웹표준·크로스브라우저·나라장터(물품식별번호 24936572) | sbgrid.co.kr + /purchase | ✅ | D3 결정 | D3 |

### 2-2. 데모 카탈로그 전수 — 11카테고리 38항목 (https://sbgrid.co.kr/demo 실측)

| 카테고리 | 개별 데모 항목(전수) | 데모 URL 패턴 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|
| 컬럼 | 컬럼타입("업무 필수 컴포넌트 8종: 숫자·텍스트·날짜·체크박스·라디오버튼·멀티텍스트·버튼·콤보박스, 방향키 이동+Enter 에디트모드") / InnerHTML | /demo/basic/columnType, /demo/basic/InnerHTML | 셀 에디터 8종+커스텀 렌더러+키보드 내비 | Must |
| 캡션(헤더) | 캡션레이아웃 / 너비조정 / 다중캡션 / 캡션&로우 이동 / 정렬과 필터링 / 그룹핑 / **캡션메뉴** | /demo/caption/{captionlayout, resizeable, multicaption, reorderable, sortFilter, group, captionmenu} | 다단 헤더·리사이즈·헤더 메뉴 | Must |
| 스타일 | 테마 변경 / **로딩 UI** / 리사이즈 / **입력안내(placeholder)** / 행 스타일 변경 / 열 스타일 변경 | /demo/style/{theme, loadingui, resize, placeholder, rowcss, colcss} | 테마 토큰+행/열 CSS 훅 | Must |
| 병합 | 행&열 병합 | /demo/merge/merge | 셀 병합(행/열/갱신) | Must |
| 데이터조회 | 페이징 / 대용량 데이터 | /demo/data/{paging, bigdata} | 서버/클라 페이징+가상스크롤 | Must |
| 트리 | 트리그리드 / **트리 레이지 로딩** | /demo/tree/{tree, lazy_tree} | 트리그리드+lazy 노드 로딩 | Should |
| 연산 | 합계&소계 | /demo/calculation/total | Aggregates(합계/소계) | Must |
| 엑셀 | 엑셀 다운로드 / **엑셀 업로드** | /demo/excel/{excel, loadexcel} | export+**import** 양방향 | Must |
| 편집 | **정합성확인(validation)** / 복사와 붙여넣기 / **행의 상태정보(insert/update/delete)** / 취소하기와 되돌리기(Undo&Redo) | /demo/edit/{valid, copy, status, undo} | 편집 상태머신+검증+undo | Must/Should |
| 확장기능 | 우클릭 컨텍스트 / 툴팁(도움말) / **개인화** / 고정행(Sticky) / 고정열(Sticky) / **패널레이아웃** / **캘린더** / **스파크라인** / **그리드&차트 연동** / **피봇** | /demo/extention/{contextmenu, tooltip, personal, sticky, part, layout, calendar, sparkline, grid&chart, pivot} | 피봇·스파크라인·캘린더뷰·개인화(§2-3 API 존재 실증) — spec 미반영분 **신규 3건: 피봇/캘린더/패널레이아웃** | Should/Could |
| 접근성 | 웹접근성 | /demo/accessibility/webaccessibility | 키보드+aria+SA 구성요소 | Should |

### 2-3. API 가이드 전수 트리 — 28카테고리·문서화 287항목 (원시 데이터 실측)

근거: https://sbgrid.co.kr/SBGridV3/api/index.html → `datas/SBGridApiData.js` (2MB, 직접 다운로드·파싱 2026-07-27). API 가이드에 **Monaco Editor 내장 = 코드 플레이그라운드 실증**. ("680 API" 마케팅 수치는 이 문서화 287항목과 별개 집계로 추정 — 미확인)

| 카테고리 [항목수] | 개별 항목(전수) | NOVA 대응 | 우선순위 |
|---|---|---|---|
| Basic Usage [2] | Import Lib, Using Grid | 문서 구조 차용 | Must |
| Data Binding [2] | Local Data, ajax | dataSource 이원화 | Must |
| DataSource [4] | schema, ajax, tree, dataConfig | 스키마 선언형 바인딩 | Must |
| Columns [35] | align, valign, calc(수식), caption, captionCheck, captionCss, captionMenu, colCss, command, customEdit, dataType, directApplyEdit, directApplyValue, exportLabel, field, filter, format, getValue, setValue, skipValidation, groupable, groups, masterColumn, part, placeHolder, sortable, tooltip, total, **type[12: type설정·text·number·date·check·radio·combo·multitext·password·button·tree·sparkline]**, unit, showUnSortIcon, validators, visible, exportVisible, width | 컬럼 정의 API — **셀타입 12종**(데모 8종+password·tree·sparkline·설정) | Must |
| Multi Column [2] | tree Type, merge Type | 다단 컬럼 2방식 | Must |
| Excel [3] | csvExport, excelExport, excelImport | CSV까지 3종 | Must |
| Copy&Paste [4] | copyable, copyInsert, pasteable, skipPaste | 복사삽입·선택적 붙여넣기 | Should |
| RowHeaders [6] | rowHeaders, showCheck, showRowNo, showRadio, showStatus, showSticky | 행헤더 6기능(체크/번호/라디오/상태/고정) | Must |
| Sticky [7] | stickyHeader, stickyFooter, stickyRow, stickyEdit, stickyInsert, stickyUpdate, stickyDelete | 고정+**고정행 편집/추가/수정/삭제** | Must |
| Scrolling [5] | liveScrollRender, scrollLabel, scrollRange, virtualRow, **virtualColumn** | 행+**열 가상화** | Must |
| Paging [2] | serverPaging, clientPaging | 양방향 페이징 | Must |
| Filtering [4] | filters(initial), filterable, filter, serverFiltering | 서버 필터링 포함 | Must |
| Merge [3] | mergeRow, mergeColumn, mergeUpdate | 병합 3종 | Must |
| Drag&Drop [2] | reorderable, data move | 열 재배열+데이터 이동 | Could |
| Sizing [12] | autoHeight, captionHeight, rowHeight, headerHeight, footerHeight, groupHeight, detailHeight, filterHeight, fixedCaptionHeight, fixedRows, maxRowHeight, maxDetailHeight | 영역별 사이징 12종 | Should |
| ContextMenu [2] | default Usage, custom Usage | 기본+커스텀 | Should |
| Grouping [5] | groups, groupable, groupTitle, groupAutoOpen, groupCheck | 그룹핑 5옵션 | Should |
| Sortable [3] | serverSorting, single sort, multi Sort | 서버/단일/다중 정렬 | Must |
| Panel Layout [6] | toolBar, groupBar, titleBar, pagerBar, statusBar, captionLayout | **그리드 6패널 구조**(툴바·그룹바·타이틀·페이저·상태바) | Should |
| Select [3] | selectable, navigatable, hover | 선택/키보드내비/호버 | Must |
| Aggregates [2] | Aggregates 설정, 집계데이터 표현하기 | 집계 | Must |
| Template [7] | captionTemplate, cellTemplate, **detailTemplate**, detailOverflow, detailAutoOpen, emptyTemplate, loadingTemplate | 템플릿 7종(**마스터-디테일 행 확장** 포함) | Should |
| Style [9] | theme, alternateCss, bgColumnsOnly, captionCss, headerCss, footerCss, rowCss, colCss, placeHolderCss | 스타일 훅 9종 | Should |
| Extension [2] | doCommand, canCommand | **커맨드 인터셉트 패턴**(실행 전 승인/후처리) | Should |
| Others [18] | accessibility, captionVisible, editable, resizable, pageable, freezable, tree, hideDeleted, masterColumns, defaultColumn, **personalization**, search(내장 검색 모달), skipValidation, undoable, defaultConfig, rowVisible, rowEditable, reverseRowNo(역순번) | 개인화·내장검색·undoable | Should |
| API Methods [126] | addRow, addRows, appendRow, autoFit, **bulkAppend**, cancelEdit, clearGrid, clearSaveData, collapseTree, columnEditable, columnVisible, deleteRow, deleteRows, deSelectAll, deSelectCells, deSelectColumns, deSelectRows, editable, csvExport, excelExport, excelImport, expandAllTree, findChildTreeData, findRows, findInvalid, fireCommand, fireCommandAsync, getAllItems, getAllFormattedItems, getCheckedKeys, getCheckedRows, getCheckedTreeKeys, getClientData, getColumn, getColumnByField, getColumns, getFocused, getFocusedColumn, getFocusedKey, getFocusedRow, getFocusedValue, getFormattedValue, getGrid, getLabelByValue, getPageNo, getPageSize, getPersonalConfig, getRadioKey, getRadioRow, getRangedColumns, getRangedKeys, getRangedRows, getRow, getRowByIndex, getRowData, getRowKey, getRow_Index, getSaveData, getSelectedKeys, getSelectedRows, getTreeCheckState, getValue, getWholeColumns, hideDetail, insertColumn, insertRow, isEditable, isCellValid, **listPersonalization**, loadPage, **mergePersonalConfig**, moveFocus, moveRowAsync, moveRowsAsync, moveColumnPart, removeFocus, rebuild, reload, **reloadTreeNodeAsync**, removeColumn, **removePersonalization**, **resetPersonalization**, rowEditable, save, **savePersonalization**, search, openSearch, closeSearch, setCaption, setCaptionCheck, setCheckedKeys, setClientData, setColumnConfigs, setColumnSize, setDefault, setDoCommand, setFilter, setFixedRows, setGroup, setDataDraggable, setPageSize, **setPersonalization**, setRadioKey, setResource(다국어 리소스), setResourceDefault, setRowValue, setScrollRangeAsync, setSize, setSelect, setStickyKeys, setTemp, setTheme, setValue, setValues, selectCells, selectColumns, selectRows, showDetail, showLoading, sort, sortData, toggleCheckTreeRow, toggleRow, undeleteRow, validateGrid, validateRow | 메서드 126종 — **개인화 CRUD 7종·비동기 행이동·트리 노드 재로드·다국어(setResource)** 주목 | Must~Could |

### 2-4. 서버연동 (v2.5 서버 샘플 실측)

| 항목 | 근거(URL) | 확인상태 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|
| 서버 바인딩 3방식: **Ajax / Web Socket / Http** | https://www.sbgrid.co.kr/v2_5/resources/server/samples (+samples2, samples3) | ✅ | Gateway(API-On) 경유 바인딩 — WebSocket 실시간까지 [제안] | Should |
| 서버 샘플 코드: Java/Spring(Controller·Service·Mapper)+JSP 제시, lockGrid()(로딩 잠금), refresh(), clearStatus(), getUpdateData(true)(insert/update/delete 상태 구분 저장) | 동일 | ✅ | 저장 프로토콜(상태 구분 payload) 표준화 | Should |

### 2-5. 프레임워크·포털·AI

| 항목 | 근거(URL) | 확인상태 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|
| 프레임워크별 데모 3종: Angular / React / Vue | https://sbgrid.co.kr/v3_0/framework/{angular, react, vue}/ (3개 모두 HTTP 200 실확인) | ✅ | NOVA는 Vue/Nuxt 우선 — 래퍼 전략은 architect | Could |
| API 가이드 = 트리 내비+검색+**Monaco 플레이그라운드**(예제 탭에서 소스 확인·편집) | https://sbgrid.co.kr/SBGridV3/api/index.html | ✅ | Portal 플레이그라운드(spec §4-④) | Should |
| Release Note — **실측 146버전(2023.07.01 → 2026.06.18), 기능추가 122·기능개선 446** (주간 릴리즈) | /release → /SBGridV3/js/data/ReleaseNote/ReleaseNote.js (133KB) | 🟨→✅ | 릴리즈 케이던스 벤치마크 | — |
| 구매: Core 기반 견적(SBGrid v3.0·SBUx 2.6) vs 서버 기반 견적(SBChart V2), 방문/원격 지원, 옴니채널(카톡·유선·메일), 영업일+1일 이내 지원, 프로젝트 기간 내 기술지원, 1년 무상 유지보수, 마이너 업그레이드 제공, 조달쇼핑몰 등록 | https://sbgrid.co.kr/purchase | ✅ | (대외 상품화 시 SLA 모델) | Could |
| AI: ChatGPT 질문 채널+SB-Chat(코드 생성/수정, API Key)+**MCP 2종**(sbgrid3.do·sbchart2.do, Node 18+)+Claude MCP 등록 가이드 PDF(/SBGridV3/docs/Claude_MCP_URL등록_가이드.pdf) | https://sbgrid.co.kr | ✅ (MCP 2종 JSON-RPC POST 200 실호출 확인 2026-07-27) | NOVA MCP(spec §2-2 P6 Must) | Must |
| v2.5 포털 요소: SBGrid 가이드·API 목록·**Code Generator**·Release Note·적용예시·**UI Template**·제품구매정보·FAQ·기술지원 | https://sbgrid.co.kr/v2_5 | ✅ (항목명만) | **Code Generator = NOVA 미계획 신규 후보** / UI Template=ui-templates 대응 | Should |

### 2-6. SBGrid 릴리즈노트 기능 시그널 (기능추가 122건 중 최근 — 전수는 ReleaseNote.js)

sparkline 컬럼타입(2026.01), csvExport(2026.05), 달력 커스텀(2026.04), initPageNo(서버페이징 초기 페이지), skipValidation(행/유동), doCommand.columnMove, bgColumnsOnly, autoComplete(최근 입력값), setColumnConfigs(동적 컬럼 재구성), allowFocusOutInvalid, pagerBar totalCount, liveScrollRender, scrollLabel, sortCheckList(필터 체크리스트 정렬), excelExport prepend/appendContent(전후 텍스트·이미지)·행 높이 지정, getFormattedValue/getAllFormattedItems, toolBar.search 모달 open/close

### 2-7. SBGrid — 아직 확인 못한 영역

| 영역 | URL | 비고 |
|---|---|---|
| "680 API" 공식 집계 근거(이벤트 카탈로그 포함 여부) | API 가이드 트리엔 이벤트 카테고리 부재 — doCommand/canCommand 문서 본문에 있을 것으로 추정 | 문서화 287항목은 실측, 680 집계 방식 미확인 |
| **이벤트 전체 목록** ("사용자의 모든 동작 이벤트로 제공" 주장) | https://sbgrid.co.kr/SBGridV3/api/ 본문 | 미추출 |
| v2.5 Code Generator·UI Template 실물 | sbgrid.co.kr/v2_5 하위(정확 URL 미확인) | 항목명만 확보 |
| 프레임워크 데모 3종의 내부 데모 항목 | /v3_0/framework/{angular,react,vue}/#/ | SPA — 미열람 |
| Angular/React/Vue 래퍼 제공 형태(npm 패키지 여부) | 미상 | 미확인 |
| SBGrid v2.1 소개서 PDF | http://www.softbowl.co.kr/resources/pdf/SBGrid_v2.1.pdf | 미독 |

---

## §3. SBChart v2 — SVG 차트

### 3-1. 특장점·슬로건 (원문 전수)

| 소프트보울 기능/특장점 (원문) | 원문 근거(URL) | 확인상태 | NOVA 대응 계획 | 우선순위 |
|---|---|---|---|---|
| "접근성을 고려한 국산 웹 차트 솔루션" | https://sbchart.co.kr | ✅ | 접근성 1단계 P2 선반영(spec D3) | Should |
| "SVG 방식의 고품질 그래픽 — 확대해도 해상도 깨짐 없음" | https://sbchart.co.kr | ✅ | ECharts SVG 렌더러 옵션 명시 | Should |
| "소프트웨어 접근성 SA인증 획득 — **배경 패턴 / 대체 텍스트 / TTS 연동**… 시각 약자를 위한 웹 접근성 보장" | https://sbchart.co.kr | ✅ | SA 3요소=NOVA Chart 접근성 로드맵(패턴·altText·TTS) | Should→D3 시 Must |
| "유연한 호환성 — 외부 웹 라이브러리와 유연성·확장성" / "커스텀 차트 및 기능" | https://sbchart.co.kr | ✅ | 등록형 확장 래퍼(spec) | Must |
| "모든 브라우저·모든 OS·모든 디바이스(반응형)" / "서버 부하 최소화 클라이언트 데이터바인딩, 가상 공간 생성, 무한 스크롤링 기술" | https://sbchart.co.kr | ✅ | (성능 주장 — 성능 research 소관) | — |
| solution.do: "HTML5 기반 웹차트 컴포넌트 라이브러리"·"데이터 Visualization 필수 툴"·"재사용 가능한 고품질 JavaScript 차트 컴포넌트"·SVG 기반·우수한 연계성·**UMD 명세 지원(CommonJS·AMD)**·장애인 웹접근성 지원·IE9+/크롬/사파리 | https://softbowl.co.kr/front/solution/sbchart.do | ✅ | ESM 배포로 상회 서술 | Could |
| 인증: **GS인증 1등급 + SA인증**, 나라장터(물품식별번호 23688380) | https://sbchart.co.kr | ✅ | D3 결정 | D3 |

### 3-2. 차트 전수 — 데모 41종 + API 전용 1종 = **42종**

근거: https://sbchart.co.kr/demo (카테고리 트리) + https://sbchart.co.kr (영문 41종 목록+개별 URL) + SBChartApiData.js(waterfall). 8카테고리.

| 카테고리 | 차트(전수) | 데모 URL | NOVA(ECharts) 커버 판정 |
|---|---|---|---|
| 라인형(3) | 라인(Line) / 스플라인(Spline) / 스탭(Step) | /demo/line/{line, spline, step} | ECharts line(+smooth/step) ✅ |
| 영역형(4) | 영역(Area) / 범위 영역(AreaRange) / 누적 영역(Stackarea) / 누적 영역 100% | /demo/area/{area, areaRange, stackarea, stackarea100} | ECharts area/stack ✅ |
| 막대형(10) | 막대(Bar) / 범위 막대(Barrange) / 누적 막대(StackBar) / 누적 막대 100% / 윙(Wing, 양방향) / 브로큰(Broken, 축 생략) / 박스플롯(Boxplot) / 캔들스틱(Candlestick) / 히스토그램(Histogram) / 이미지싱글(ImageSingle) | /demo/bar/{bar, barrange, stackbar, stackbar100, wing, broken, boxplot, candlestick, histogram, imagesingle} | boxplot·candlestick 내장, wing=양방향 bar 조합, broken=축 커스텀, imageSingle=pictorial 유사 ✅ |
| 원형(4) | 도넛(Donut) / 파이(Pie) / 게이지(Gauge) / 게이지NEW(GaugeNew) | /demo/circle/{donut, pie, gauge, gaugeNew} | pie/gauge ✅ |
| 분포형(11) | 버블(Bubble) / 플롯(Plot) / 산점도(Scatter Plot) / 포인터(Pointer) / 히트맵(Heatmap) / 매트릭스(Matrix) / 트리맵(Treemap) / 워드클라우드(Wordcloud) / 온톨로지(Ontology, 관계그래프) / 선버스트(Sunburst) / 벨(Bell, 정규분포) | /demo/distribution/{bubble, plot, scatterPlot, pointer, heatmap, matrix, treemap, wordcloud, ontology, sunburst, bell} | scatter/heatmap/treemap/sunburst/graph 내장, wordcloud=플러그인, bell=수식 시리즈 |
| 결합형(1) | 바+버블+라인(Combination) | /demo/combination/bar+bubble+line | 혼합 시리즈 ✅ |
| 확장형(3) | 지도(Map, 대한민국 시군구 SIGUNGU.json) / **북한지도** / **심전도(HeartBeat)** | /demo/extend/map 등 | 지도 geoJSON — 북한지도=차별 소재, 심전도=실시간 스트리밍 라인 |
| 기타(6) | 트리(Tree) / 트리 레디얼(TreeRadial) / 간트(Gantt) / 레이더(Radar) / 센키(Sankey) / 픽토리얼(Pictorial) | /demo/etc/{tree, treeradial, gantt, radar, sankey, pictorial} | tree/radar/sankey/pictorialBar 내장, gantt=custom series |
| **API 전용** | **waterfall(폭포수)** — 릴리즈 2026.04.22 추가, 데모 목록엔 미노출 | SBChartApiData.js extend.waterfall[8] | ECharts bar stack 기법 ✅ |

### 3-3. 데모 인터랙션 (전 차트 공통 — /demo/line/line 실측)

| 항목 | 내용(전수) | NOVA 대응 | 우선순위 |
|---|---|---|---|
| 옵션 토글 10종 | 눈금선 / 축 / 격자 / 툴팁 / 제목 / 범위(datarange) / 십자선(crosshair) / 모양(marker) / 회전 / **접근성** | Portal 데모 옵션 토글(spec Should) | Should |
| 애니메이션 3종 | 올라오기 / 채우기 / 나타나기 | 애니 프리셋 | Could |
| 스타일 4종 | 트렌드 / 파스텔 / 하이브리드 / 심플 | 테마 프리셋 4종(토큰화) | Should |
| 코드 | View Code / Copy Code | 코드보기+복사(spec Should) | Should |
| 차트별 설명문 | 예: "라인차트는 데이터를 선으로 표현하는 시각화 차트…" | 카탈로그 설명문 | Should |

### 3-4. API 문서 전수 — 3탭(charts·maps·samples)·문서화 리프 **1,336항목**

근거: https://sbchart.co.kr/SBChart2/api/index.html → `datas/SBChartApiData.js` (3.7MB, 직접 다운로드·파싱 2026-07-27). Monaco 플레이그라운드 내장. 상위 구조 전수:

| 탭/카테고리 [하위수] | 하위 항목(전수 또는 대표) | NOVA 대응 주목점 |
|---|---|---|
| charts/global [24] | svg, size[3], color[5], padding[4], **accessibility[9: use·title·description·useContainer·replaceH3·replaceH4·legendDataType·useRoving·rovingContentsFormat]**, **animation[5: show·type·types·delay·ease]**, **export[6: show·tabindex·nextFocusId·jpgTransparentColor·eventCallback·position]**, **pattern**, patternOffKeys, changePatternSeq, dash, onMouseEvent, onclick, onclickFocus, onclickDataAll, noDisplayValue, broken[9], **crosshair[9]**, **milestone[5]**, background[6], paint[11], tile[4], onAfterRender, onAfterTime | 접근성 9속성(roving tabindex까지)=SA 실체 / 이미지 export 내장 / 배경 패턴(색약 대응) / milestone(기준선) |
| charts/data [27] | columns, rows, json, useJsonData, type, types, groups, stackCombiJson, legends, hideLegendItems, labels[3], useLabelMultiLine, labelMultiLineGap, labelsHighlight, noDisplayExceptHighlight, x, xs, noData[2], keys[4], imageConf, **datarange[19]**(미니맵/범위선택·backgroundChart·min/max바·syncCrosshair), useLabelOnBarrange, useJsonColorForLabel, secondLabelFormat, secondLabelPosition[2], skipValue, useMinInculdeSkipValue | 3가지 데이터 포맷(columns/rows/json) / **datarange=범위 브러시+배경차트**(ECharts dataZoom 등가) |
| charts/axis [8] | rotated(가로전환), axes(다중축), xAxisReverse, yAxisReverse, xFixedCount, xFixedScrollArea, x[12], y[10] | 다중 Y축·축 반전·固定 스크롤 |
| charts/grid [2] | x[3], y[6] | 그리드라인 |
| charts/title [3] | text, position, padding[4] | — |
| charts/legend [16] | show, position, background, padding, width, customLabels, itemGap, useItemNewLine, marginDisplayHeight, item[6], inset[4], removeSpace, useHoverActionOnClick, maxHeight, hideScroll, labelStyle[5] | 범례 스크롤·인셋 |
| charts/tooltip [31] | show, grouped, groupedOption[5], sort, showBackground, position, custom, addCustomClass, format[3], mouse[2], noUseExpand, noUseUnexpand, noUseTitle, noUseLegendTile, template, width, minWidth, padding, borderColor, borderRadius, backgroundStyle, opacity, wordBreak, tileStyle[6], contentStyle[20], useColorfulText, useDiffTickInterval, hideLineValue, useTitleArc, useContentScroll, useHigherTooltip | 툴팁 템플릿·그룹·스크롤 |
| charts/extend [35] | 차트별 전용 옵션 그룹(하위 속성수): line[12], point[6], bar[14], area[3], stackbar[2], stackarea[4], areaRange[4], pie[12], donut[27], gauge[9], gaugeNew[12], bubble[2], radar[6], histogram[9], heatmap[10], barrange[5], candlestick[6], wing[5], tree[21], treeRadial[14], treemap[28], imageSingle[5], scatter[1], plot[10], boxplot[5], wordcolud[13], ontology[37], matrix[5], pointer[7], gantt[21], sankey[6], sunburst[21], pictorial[9], bell[8], **waterfall[8]** | 차트당 전용 옵션 문서화 — NOVA 카탈로그도 차트별 옵션 시트 필요 |
| charts/API [15] | Options_API: global(), data(), grid(), title(), legend(), tooltip(), axis(), extend(), **getBlob()**, resize(), sb.chart.render(), sb.chart.destroy(), sb.chart.version, setHoverEffect(), **exportImage()** | 런타임 옵션 갱신 API+이미지 추출 |
| charts/classes [7] | chart, title, axis, legend, grid, tooltip, 기타 | CSS 클래스 문서화 |
| maps 탭 [5그룹] | global[6], data[3], title[3], tooltip[3], extend[1] | 지도 전용 문서 탭 분리 |
| samples 탭 [9그룹] | line[1], scatter[1], donut[1], stackbar[2], tree[1], treeRadial[1], gantt[2], bell[2], map[1](한 지역 여러지점 등) | 실무 샘플 모음 |

### 3-5. 튜토리얼·릴리즈·AI

| 항목 | 근거(URL) | 확인상태 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|
| 튜토리얼 5단계: ①라이센스 설치(무설치) ②차트 적용(head 연결) ③차트 생성(Element+데이터+옵션) ④**차트 구조**(유형별 구조) ⑤차트 꾸미기(Option·CSS). 데이터 3포맷(Columns/Rows/JSON)·data.keys·axis.x.type=category·global.padding·Axis/Grid/Title/Legend/Tooltip/Label 구조 설명 | https://sbchart.co.kr/tutorial | ✅ | 튜토리얼에 "차트 구조" 단계 차용 | Should |
| Release Note — **실측 215버전(2018.08.09 v2.0.1 → 2026.06.22 v2.0.222), 기능추가 368건** | /release → /SBChart_new/js/data/ReleaseNote/ReleaseNote.js | 🟨→✅ | 8년 연속 릴리즈 이력 | — |
| SB-Chat: LLM 4프로바이더 선택(**Anthropic Claude·OpenAI GPT·Groq(무료)·OpenRouter**), API Key 사용자 입력, "AI 샘플은 참고용·검증 권고", "렌더된 차트 요소 직접 CSS 수정 금지" 주의 문구 | https://sbchart.co.kr/aichat | ✅ | NOVA AI챗=Nexus 엔진(키 보유) — BYOK 패턴 참고 | Should |
| GPTs: "SBChart v2 고객지원 챗봇" | https://chatgpt.com/g/g-685cecad763c81918c539b6b205d5202-... | ✅(URL) | Could(spec) | Could |
| MCP: sbchart2.do (JSON-RPC POST 200 실확인) + Claude 등록 가이드 PDF(/SBChart_new/docs/Claude_MCP_URL등록_가이드.pdf) | https://softbowl.co.kr/mcp/sbchart2.do | ✅ | NOVA MCP | Must |
| 통합데모: AllChart 한 화면 전시 | https://softbowl.co.kr/SBUxDemo/sbchart/AllChart.sb | ✅(URL) | 전 차트 일람 갤러리 | Should |

### 3-6. SBChart 릴리즈노트 기능 시그널 (기능추가 368건 중 최근 — 전수는 ReleaseNote.js)

waterfall 추가(2026.04.22), bell 빈도수 입력(평균/표준편차 자동, 2026.03.31), stackbar oneRadius, export 위치 설정, patternOffKeys, tick autoSkipOverlap, datarange 강화(drBoundary·selectable·backgroundChart barWidth/yLabel·syncCrosshair), onMouseEvent 콜백, 맵차트 stroke/hover/select/3D효과/stretchX, line minMaxMarker(최대·최소 마커)

### 3-7. SBChart — 아직 확인 못한 영역

| 영역 | URL | 비고 |
|---|---|---|
| 1,336 문서 항목 각각의 설명·예제 본문 | SBChartApiData.js 내 explain/example 필드 | 항목명·구조는 전수, 본문 미독(파일 보유로 재추출 가능) |
| 북한지도·심전도 데모 실화면 | /demo/extend/ 하위(정확 URL 미확인 — 홈 목록엔 map만 노출) | 데모 카테고리 명시로 존재 확인 |
| SBChart 소개서 PDF | softbowl.co.kr/resources/pdf/SBChart2.0_introduction_2022.pdf, SBChart_v2.5.pdf | 미독 |
| old.sbchart.co.kr | https://old.sbchart.co.kr/ | 미방문 |

---

## §4. SBDashBoard (대시보드 데모)

근거: https://softbowl.co.kr/SBUxDemo/DashBoard/home.sb (실측 2026-07-27). 독립 제품 사이트 없음 — SBUx+SBGrid+SBChart 조합 시연물.

| 소프트보울 기능/특장점 | 원문 근거(URL) | 확인상태 | NOVA 대응 계획 | 우선순위 |
|---|---|---|---|---|
| 위젯: TO DO LIST / 알림(8) / 메세지(8) / 사용자 인사말 / 테마 선택 영역 | DashBoard/home.sb | ✅ | NOVA Dashboard 위젯 세트 | Should |
| 테마 3종 선택(Theme 1/2/3) + "우클릭으로 즐겨찾기 편집" + 환경설정/나의정보/알림·메세지 메뉴 | 동일 | ✅ | 테마 전환+우클릭 개인화 | Should |
| 사이드메뉴 "그리드 활용" 11: Rowheader / CRUD / 그룹핑 / 틀고정 / 테마 / 엑셀변환 / 필터 / 개인화 / 데이터병합 / 서브토탈 / SBGrid v3 | 동일 | ✅ | Grid 기능별 업무 데모 | Should |
| "연계" 2: **리포팅툴&그리드** / 컨트롤컴포넌트 | 동일 | ✅ | 리포팅툴 연계=미계획 신규 소재 | Could |
| "퍼포먼스" 1: 대용량데이터바인딩 | 동일 | ✅ | 대용량 시연(성능 research 연계) | Must |
| "활용방안" 업무화면 11종: 사원관리 / 급여관리 / 퇴직연금 / 청구조회 / 청구마감 / 수금현황 / 상품조회 / 보험설계 / 학기별시간표 / 원달러현물환거래 / 세금계산서발행대장 | 동일 | ✅ | **업무 도메인별 완성 화면 갤러리** — NOVA는 SEbit 실서비스 화면(Origin·PROVE·Sentinel·Stock)으로 상회 가능 | Should |
| "데이터시각화" 8종: 경영분석차트 / 코로나현황 / 부동산거래량 / 국가별기대수명 / 주정차위반단속현황 / 조직도 / Datarange / 축산물통합정보 | 동일 | ✅ | 실데이터 시각화 갤러리(Origin 데이터로 대체) | Should |
| 미확인: 위젯 추가/제거·드래그 배치 등 대시보드 빌더 기능 여부 | 동일(SPA 내부 동작) | ❓ | 빌더 여부는 실조작 필요 | — |

---

## §5. SBWrapDoc (문서 데이터 변환·생성 솔루션) ⭐신규 채집

근거: https://softbowl.co.kr/front/main.do + https://softbowl.co.kr/front/solution/sbwrapdoc.do (실측 2026-07-27). 전용 도메인/데모 사이트 없음.

| 소프트보울 기능/특장점 (원문) | 원문 근거(URL) | 확인상태 | NOVA 대응 계획 | 우선순위 |
|---|---|---|---|---|
| 정의: "문서 데이터 변환 및 생성솔루션! — 데이터 기반 문서 변환 및 생성 솔루션으로 **한글, MS워드, 엑셀** 문서에 데이터를 연계하여 문서를 **변환, 생성, 취합**하는 기능 제공" | front/main.do | ✅ | SEbit 등가물: F1 보고서 자동생성(pptxgenjs)·제안서 웹표준→PDF 파이프라인 — 문서 자동화 제품화 여부는 planner 결정 [제안] | Could |
| 슬라이드: "다양한 형태의 문서를 나만의 문서로 변환" / "대량의 데이터를 하나의 문서로 생성" | front/main.do | ✅ | 템플릿 기반 대량 생성(mail-merge형) | Could |
| 특장점 01 **Pubdoc 변환**: "정부 전자문서 유통 시스템 pubdoc과 상호 연동" | solution/sbwrapdoc.do | ✅ | 공공 전자문서 규격 — 공공시장 진출 시에만 | Could |
| 특장점 02 **배포문서 생성**: "수정·인쇄·복사 제한한 배포용 문서 생성"(DRM성) | solution/sbwrapdoc.do | ✅ | PDF 권한 제어 등가 | Could |
| 특장점 03 **문서 병합**: "대량의 문서 내용 병합, 문단 병합 등 편집" | solution/sbwrapdoc.do | ✅ | 문서 취합 파이프라인 | Could |
| 특장점 04 **Data I/O**: "한글 파일에서 텍스트 추출 및 조건에 맞는 컨트롤 제공" | solution/sbwrapdoc.do | ✅ | HWP 파싱 — Omni-BIM/RAG 문서 인제스트와 접점 [제안] | Could |
| 기능 6종: Pubdoc 변환 API / **HWPX 변환 API** / Data I/O / **Append** / **Automation(한글 제어)** / 기술 지원 | solution/sbwrapdoc.do | ✅ | HWPX(개방형 한글) 변환 주목 | Could |
| 조달: 디지털서비스몰 등록(계약번호 R25TA00876852000000001) | https://digitalmall.g2b.go.kr/link/GDSF001_01/?ctrtItemMngNo=R25TA00876852000000001 | ✅ | — | — |
| **미확인**: 입출력 포맷 상세 매트릭스·아키텍처·데모·가격·소개서 | solution/sbwrapdoc.do (PDF 아이콘 있으나 링크 없음) | ❓ | 추가 정찰(영업자료 요청 필요 수준) | — |

---

## §6. 공통 — 개발자 포털·AI·인증·지원 (전 제품 횡단)

| 요소 | 실측 내용(전수) | 근거(URL) | 확인상태 | NOVA 대응 | 우선순위 |
|---|---|---|---|---|---|
| 제품별 독립 도메인+공통 IA | sbux.co.kr / sbgrid.co.kr / sbchart.co.kr — 공통 메뉴 5: 튜토리얼·API가이드·Demo·Release Note·구매 | 각 홈 | ✅ | NOVA Portal 단일 도메인+제품 섹션(spec 확정) | Must |
| 튜토리얼 5단계 패턴(3제품 동일 골격) | 설치→적용→생성→편집→꾸미기 | 각 /tutorial | ✅ | NOVA 5단계(4단계=데이터연결 차별화) | Must |
| API 가이드 공통 골격 | 트리 내비+검색+Monaco 플레이그라운드+markdown-it 렌더+highlight.js | 각 api/index.html 원시 HTML | ✅ | Portal 문서 스택 | Must |
| Release Note 3제품 전수 | SBUx 247버전·기능추가125 / SBGrid v3 146버전·추가122·개선446 / SBChart 215버전·추가368 — **3제품 모두 주간 단위 릴리즈** | 각 ReleaseNote.js | ✅ | 릴리즈 공개 문화 자체가 신뢰 상품 | Should |
| AI 지원 4채널 | ① MCP 서버 2종(softbowl.co.kr/mcp/sbgrid3.do·sbchart2.do — JSON-RPC 200 실확인, Node 18+) ② Claude MCP 등록 가이드 PDF 2종 ③ ChatGPT GPTs(SBChart 고객지원) ④ SB-Chat(BYOK: Claude·GPT·Groq·OpenRouter) | §2-5·§3-5 | ✅ | NOVA MCP(Must)+AI챗(Should)+가이드 문서(Must) | Must |
| 인증 자산 | GS인증(SBUx·SBGrid·SBChart 1등급) / SA인증(SBGrid·SBChart) / 전자정부 표준프레임워크 호환성(SBUx 레벨2·SBGrid) / 나라장터 물품식별번호(SBGrid 24936572·SBChart 23688380) / 디지털서비스몰(SBWrapDoc) / 조달청 우수제품 | 각 홈·구매 | ✅ | D3(보류) — 접근성 설계만 선반영 | D3 |
| 지원 채널 | 구매 02-2088-5590 / 기술 02-6253-3693 / cs@·sales@softbowl.co.kr / 카카오톡 오픈채팅 2종(기술·영업) / 문의게시판 / 블로그·페이스북 / 방문·원격, 옴니채널, 영업일+1일 SLA, 1년 무상 유지보수 | 각 홈·/purchase | ✅ | (대외 상품화 시) | Could |
| 통합데모 허브 | softbowl.co.kr/SBUxDemo(index.sb) — 3제품 브랜드관+고객사 20로고 / SBUxDemo/sbgrid3/basic/columnType.sb / sbchart/AllChart.sb / DashBoard/home.sb | https://softbowl.co.kr/SBUxDemo/index.sb | ✅ | NOVA 통합 쇼케이스 | Should |
| 회사 사이트 IA | 회사소개(연혁·보울지기·문화·오시는길)/솔루션(SBUx·SBGrid·SBChart·SBWrapDoc·고객사)/스마트 헬스케어/온라인문의/고객센터(보도자료·인재채용) | https://softbowl.co.kr/front/main.do | ✅ | (참고) | — |
| 기타 제품 링크 | BIDBOWL(bidbowl.co.kr — 입찰 서비스, 범위 외) / **sbgsheet.co.kr — DNS NXDOMAIN(소멸)** — "스프레드시트 연동" 주장의 제품 실체는 현재 없음 | solution/sbgrid.do 링크 실검 | ✅ | — | — |

---

## §7. NOVA 필수 커버 항목 총계 (실측 집계)

| 축 | 소프트보울 실측 수량 | NOVA 커버 목표 |
|---|---|---|
| SBUx 컴포넌트 | **29종(+미완1)/56유형, 속성 2,561건, 공통 메서드 32, 그리드 연계속성 7** | Canvas 41종 기반 — 유형 카탈로그·연계 규약 신설. 데모 미노출 4종(label·carousel·pdfviewer·datastore) 포함 대조 |
| SBGrid 기능 | **데모 38항목(11카테고리) + API 문서화 287항목(옵션 카테고리 27+메서드 126, 셀타입 12종)** + 서버바인딩 3방식 + 프레임워크 데모 3종 | spec §2-2 Must/Should에 **신규 반영 필요: 피봇·스파크라인·캘린더·패널레이아웃 6종·개인화 API 7종·마스터-디테일·엑셀 업로드·CSV·다국어 setResource·doCommand 인터셉트** |
| SBChart | **차트 42종(데모 41+waterfall), 옵션토글 10·애니3·스타일4, API 문서화 1,336항목(접근성 9속성·datarange 19속성 등)** | ECharts 커버리지 재확인 — 북한지도·심전도·datarange·배경패턴은 개별 판정 |
| SBDashBoard | 위젯 5+테마 3+사이드메뉴 33항목(업무화면 11·시각화 8 포함) | 실서비스 화면 갤러리로 상회 |
| SBWrapDoc | 특장점 4+기능 6(Pubdoc·HWPX·Data I/O·Append·Automation·지원) | 제품화 여부 planner 결정 대기 |
| 공통 포털 | 메뉴 5+튜토리얼 5단계+API가이드(검색·플레이그라운드)+릴리즈(3제품 608버전 누적)+구매, AI 4채널, 인증 6종 | Portal spec 확정분+Code Generator 신규 후보 |

**본 채집으로 spec(nova-platform-spec.md) 대비 신규 발견된 기능/특장점**: ① SBUx 미노출 컴포넌트 4종+유형 56 실체 ② 그리드 선언형 연계속성 7종 ③ Grid 피봇/스파크라인/캘린더/패널레이아웃/개인화API/마스터-디테일/엑셀업로드/CSV/다국어/doCommand ④ Chart waterfall(42종째)+접근성 9속성+datarange 상세 ⑤ SBWrapDoc 전체(HWPX·Pubdoc) ⑥ v2.5 Code Generator·UI Template ⑦ SB-Chat BYOK 4프로바이더 ⑧ 서버바인딩 WebSocket ⑨ 릴리즈 3제품 608버전 실데이터.

---

## §8. 아직 확인 못한(추가 정찰 필요) 영역 — 통합 목록

| # | 영역 | URL | 방법 |
|---|---|---|---|
| 1 | SBGrid "680 API" 공식 집계 근거·이벤트 전체 목록 | https://sbgrid.co.kr/SBGridV3/api/ (본문) | SBGridApiData.js 본문(explain) 재파싱 또는 MCP 서버 tools/list 호출 |
| 2 | SBGrid Angular/React/Vue 데모 내부 항목·npm 래퍼 여부 | https://sbgrid.co.kr/v3_0/framework/{angular,react,vue}/#/ | 브라우저(Playwright) 렌더 필요 |
| 3 | SBGrid v2.5 Code Generator·UI Template 실물 | sbgrid.co.kr/v2_5 하위 (정확 경로 미확인) | v2_5 페이지 내 링크 재추적 |
| 4 | SBUx 개별 데모 27페이지의 화면 토글 UI | https://www.sbux.co.kr/demo/{inputCompo,navigationCompo,feedbackCompo}/* | 필요 시 개별 fetch(속성 카탈로그로 대부분 커버) |
| 5 | 제품 소개서 PDF 6종 | softbowl.co.kr/resources/pdf/{SBUx2.6_introduction_2022, SBUx_v2.1_Feature, SBGrid2.5_introduction_2022, SBGrid_v2.1, SBChart2.0_introduction_2022, SBChart_v2.5}.pdf | PDF 다운로드·독해 |
| 6 | SBWrapDoc 입출력 포맷 매트릭스·아키텍처·데모·가격 | https://softbowl.co.kr/front/solution/sbwrapdoc.do (페이지에 PDF 아이콘만, 링크 없음) | 영업 채널 문의 수준 |
| 7 | SBDashBoard 위젯 빌더(추가/배치) 동작 여부 | https://softbowl.co.kr/SBUxDemo/DashBoard/home.sb | 브라우저 실조작 |
| 8 | 북한지도·심전도 데모 실화면 | sbchart.co.kr/demo/extend/ 하위 | 개별 fetch |
| 9 | MCP 서버가 노출하는 tools/resources 실목록 | https://softbowl.co.kr/mcp/sbgrid3.do·sbchart2.do (initialize 200 확인됨) | tools/list JSON-RPC 후속 호출 |
| 10 | old.sbux.co.kr / old.sbchart.co.kr 구버전 기능 | https://old.sbux.co.kr/, https://old.sbchart.co.kr/ | 필요 시(레거시 — 우선순위 낮음) |
| 11 | 스마트 헬스케어 사업부 제품 | https://softbowl.co.kr/front/healthcare/healthcare.do | 범위 외 추정 — 미방문 |

---

## Sources (조회 기준시각: 2026-07-27)

- https://www.sbux.co.kr / /tutorial / /demo/thumbnail/thumbnail / /release / /purchase
- https://www.sbux.co.kr/SBUxNew/api/index.html + js/Import_sidemenu.js + data/searchData.js + js/data/ReleaseNote/ReleaseNote.js (직접 다운로드·파싱)
- https://sbgrid.co.kr / /tutorial / /demo / /release / /purchase / /v2_5
- https://www.sbgrid.co.kr/demo/basic/columnType / /v2_5/resources/server/samples(+2·3)
- https://sbgrid.co.kr/SBGridV3/api/index.html + datas/SBGridApiData.js + js/data/ReleaseNote/ReleaseNote.js (직접 다운로드·파싱)
- https://sbgrid.co.kr/v3_0/framework/{angular,react,vue}/ (HTTP 200 확인)
- https://sbchart.co.kr / /tutorial / /demo / /demo/line/line / /aichat
- https://sbchart.co.kr/SBChart2/api/index.html + datas/SBChartApiData.js + SBChart_new/js/data/ReleaseNote/ReleaseNote.js (직접 다운로드·파싱)
- https://softbowl.co.kr/front/main.do / front/solution/{sbux,sbgrid,sbchart,sbwrapdoc}.do
- https://softbowl.co.kr/SBUxDemo/index.sb / SBUxDemo/DashBoard/home.sb
- https://softbowl.co.kr/mcp/sbgrid3.do · /mcp/sbchart2.do (JSON-RPC initialize POST → HTTP 200)
- http://sbgsheet.co.kr (DNS NXDOMAIN — 소멸 확인)
