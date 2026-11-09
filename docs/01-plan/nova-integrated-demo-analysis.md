# 소프트보울 통합 데모(SBUxDemo/DashBoard/home.sb) 심층 분석 — NOVA 통합 데모 refine 기준

> **조회일 2026-07-29** · 방법 = 원시 HTML 실 fetch(curl, HTTP 200) + 참조 JS 역추적(dashboard.js·chart.js·SBUx.js 826KB·index.css 76KB·content.css) + 탭 콘텐츠 HTML 10종 직접 다운로드. **발명 0 — 전 항목 원문/실측. 못 본 것은 "미확인" 명기.**
> 선행 조사: [nova-feature-coverage-checklist.md](nova-feature-coverage-checklist.md) §4 (2026-07-27, 메뉴 33·위젯 5·테마 3 관찰) — 본 문서가 이를 **소스 레벨로 심화·일부 정정**한다(테마 3종 → **미구현 판정**).
> **2026-07-29 2차 완결**: 미확인 26개 콘텐츠 탭 전수 fetch(전부 HTTP 200)·본문 판독 → §2-b 신규 표. **전 페이지 분석 38/38 완료**.
> **2026-07-29 3차 보강(2대 구멍 보완)**: ① **§1-6 신규** — 탭 워크스페이스(`sbux-tabs`)를 셸 골격이 아니라 **NOVA UX 제품 핵심 기능**으로 재분류·전 동작 소스 역추적(SBUx.js 826KB webpack 번들 offset 실측). ② **§2-c 신규** — 데이터 시각화 카테고리 차트 타입 전수 → **NOVA Chart(ECharts 6.0) 커버리지 표**(공식 cheat-sheet·v6 feature 실검증). 기존 §0~§4·§2-b 전부 보존, 추가만.

---

## 0. 핵심 판정 (요약)

| # | 질문 | 결론 | 판정 |
|---|---|---|---|
| 1 | home.sb의 본질은? | **"제품 나열"이 아니라 가상 회사 그룹웨어 셸("SBWS", 자산운용 관리팀 김남길 페르소나)** 안에 SBUx(셸 컴포넌트)+SBGrid(조회그리드)+SBChart(차트)를 심은 업무포털 모사물. 모든 콘텐츠 탭 = **iframe으로 정적 HTML 로드** | ✅ 소스 실증 |
| 2 | 통합의 장치는? | ① 메인 대시보드 3탭이 **4.5초 간격 자동 로테이션(전시장/키오스크 모드, pause 버튼)** ② GNB 33메뉴 → 탭 추가(멀티탭 워크스페이스) ③ 즐겨찾기 트리(우클릭 편집·dnd) | ✅ home.sb 인라인 JS + dashboard.js |
| 3 | 위젯 조립/편집(대시보드 빌더)? | **없음.** 위젯 추가·드래그 배치 기능 부재. 개인화 = 즐겨찾기 트리 + 포스트메모 추가 + SBGrid v3 개인화(목록/저장)뿐 | ✅ 전 소스 grep |
| 4 | 테마 3종 전환? | **미구현(장식).** LNB의 Theme 1/2/3 `sbux-select`·`sbux-switch`에 핸들러 0건(SBUx.js 826KB 내 "Theme1" 0건). sbgrid_v3 탭의 테마선택(Gray/Light Blue/Dark)도 주석 처리 + "테마선택 : 진행중" ※**각주(2026-07-29):** 이 미구현 판정은 **셸 LNB Theme·sbgrid_v3 탭에 국한**한다. 별도 콘텐츠 탭 `grid/theme.html`은 **iframe 5테마(Default/Gray/Navy/Light-blue/Simple) 실스왑이 동작**(fnTheme 핸들러 존재, §2-b). 즉 소프트보울은 "그리드 테마 전환"을 **데모로는 시연**하되 **통합 셸엔 미탑재**한 상태. | ✅ (7/27 조사 "테마 3종 선택" 정정) |
| 5 | 데이터는? | **전부 하드코딩 mock**(DATA_JSON_eval1.js, gridFormBIndData.js, chart.js 내 인라인 배열, mapData 인라인). API 호출 0. 실데이터 0 | ✅ |
| 6 | 위젯 간 연동? | **없음.** 필터→타 위젯 갱신 부재. 있는 것 = 그리드 셀 편집→해당 셀 ▲▼ 적/청 착색(valuechanged), 지도 drillDown, 탭 전환 시 차트 재렌더 | ✅ |
| 7 | 모바일? | `home.sb?mobile=true` 별도 모바일 버전 실존(HTTP 200, 167KB, title "Dashboard_m") | ✅ URL 실호출 |

---

## 1. 표1 — home.sb 셸 구조·사이드메뉴 전수·위젯 전수

### 1-1. 화면 셸 (레이아웃·픽셀)

근거: https://softbowl.co.kr/SBUxDemo/DashBoard/home.sb 원시 HTML(50.6KB) + resources/dashboard/css/index.css(76KB)·content.css(42KB). 뷰포트 meta `width=1920` **고정**(반응형 아님).

| 영역 | 실측 내용 | 근거 |
|---|---|---|
| 헤더(GNB) | 높이 **100px**, 배경 **#31476E**(네이비). 우상단 유틸: 알림 벨(붉은 점)·댓글 아이콘·로그인연장·회원가입·환경설정. GNB 메뉴는 중앙 정렬 **1000px** 폭, hover 시 서브메뉴 slideDown(300ms) | index.css `.dash-header`, home.sb L704-778 |
| LNB(좌측) | `<sbux-sidemenu>` 컴포넌트 + 커스텀 확장(`ext-menu-html-id`). 폭 ≈300px(접힘 시 본문 padding 30px↔펼침 300px, 인라인 JS로 토글). 구성: SBWS 로고 → 프로필(자산운용 관리팀/김남길님 인사말 + 나의정보·알림/메세지 + 로그인/로그아웃 버튼) → **탭 2개[나의메뉴/즐겨찾기]** → 메뉴트리(높이 860px 스크롤) → 하단 **Theme 셀렉트(미구현)+스위치(미구현)** | home.sb L781-855, index.css L242 |
| RNB(우측) | 슬라이드 패널 폭 **294px**(기본 숨김 right:-295px, 버튼 클릭 시 1.5s transition으로 등장). 내용: **TO DO LIST**(sbux-textarea) + 탭[알람 88건/메세지 89건] 리스트 각 8건 | home.sb L859-991, index.css `.dash-rnb-wrap` |
| 메인 | 배경 **#F1F5FB**. `<sbux-tabs>` 멀티탭 바(탭 drag 가능 `is-draggable=true`, close 버튼, 마지막 1개 탭은 close 숨김) + **탭 콘텐츠 = iframe(height 962px)**. 좌상단 pause/play 버튼(자동 슬라이드 제어) | home.sb L994-1011 |
| 푸터 | "모바일로 보기" 버튼 + License vershion(오타 원문) / IP info 192.168.020.140 / Copyright©2021 SOFTBOWL | home.sb L1014-1023 |
| 팝업(목업) | 로그인/로그아웃/나의정보/회원가입 4종 모달 — sbux-input·sbux-select·sbux-button로 구성, **전송 로직 없음(순수 목업)** | home.sb L525-699 |
| 타이포/미감 | 본문 폰트 **KoPub World Dotum Light**(KoPublight), 아이콘 FontAwesome 5.15.4. 카드 = 흰 배경 + 1px #E2E2E2 테두리 + radius 15px + 얕은 그림자(1px 1px 5px rgba(0,0,0,0.2)). 팔레트 상위: **#4B71B7(액센트 블루) · #31476E(네이비) · #F1F5FB(바탕) · #FAFBFC/#E2E2E2(경계) · #658DE8** | index.css 색상 빈도 실측 |

### 1-2. GNB 메뉴 전수 (5그룹 33항목) + 숨은 항목 2

근거: home.sb L715-776 (`fnAddTab(id)` onclick) + dashboard.js `DATA_TAB`(38항목). 탭 콘텐츠 URL 규칙 = `/SBUxDemo/resources/dashboard/html/<category>/<id>.html` (dashboard.js L395).

| 그룹 | 항목(id) | 확인상태 |
|---|---|---|
| 그리드 활용 (11) | Rowheader(rowheader) · CRUD(crud) · 그룹핑(grouping) · 틀고정(fixframe) · 테마(theme) · 엑셀변환(excel-import) · 필터(filter) · 개인화(personalize) · 데이터병합(merge) · 서브토탈(subtotal) · **SBGrid v3(sbgrid_v3, V3 배지)** | ✅ 33항목 전수 = 원문 |
| 연계 (2) | 리포팅툴&그리드(grid-detaildata) · 컨트롤컴포넌트(control-component) | ✅ |
| 퍼포먼스 (1) | 대용량데이터바인딩(bigdata-binding) | ✅ |
| 활용방안 (11) | 사원관리(insa) · 급여관리(pay) · 퇴직연금(retirement) · 청구조회(uxex03) · 청구마감(uxex04) · 수금현황(uxex05) · 상품조회(uxex06) · 보험설계(uxex07) · 학기별시간표(schedule) · 원달러현물환거래(wondollar) · 세금계산서발행대장(tax) | ✅ |
| 데이터시각화 (8) | 경영분석차트(business_analysis) · 코로나현황(covid19) · 부동산거래량(areaRange) · 국가별기대수명(plot) · 주정차위반단속현황(wing) · 조직도(orgchart) · Datarange(datarange) · 축산물통합정보(kape) | ✅ |
| **GNB 미노출·실존** (2) | **입출항정보(portofentry)** — uxex/portofentry.html HTTP 200(53KB) · **SBGrid3(sbgrid3)** — grid/sbgrid3.html HTTP 200(13KB). DATA_TAB에 등록돼 즐겨찾기/직접 URL로 접근 가능 | ✅ URL 실호출 |

### 1-3. LNB "나의메뉴" 트리 (7그룹 — **전부 장식**)

근거: home.sb L783-816. `<menu-item>` 전부 `id=""`·onclick 없음 → **클릭해도 아무 동작 없음**(탭 연결은 즐겨찾기 트리만 담당).

대시보드(-자산운용/-지방재정/-메인조회) · 공지사항(-글쓰기/-내가 작성한 글) · To Do(2) · 전자 결재(2) · 메세지(2) · 메모 관리(2) · 고객 지원 — 그룹웨어 IA를 시각적으로만 모사.

### 1-4. 위젯 전수 — 메인 대시보드 3탭 (자동 로테이션 대상)

차트 렌더 API = `sb.chart.render(selector, config)` (SBChart 2.0, chart.js 1,904라인 실측). 그리드 = `_SBGrid.create(SBGridProperties)` (SBGrid 2.5, `jsonref:'eval1.grid'` = DATA_JSON_eval1.js mock).

**탭 A "업종별 대시보드 - 자산운용"** (main/SBUx_A.html, 22.5KB — 보안관제형 개인 대시보드, 위젯 11 / 차트 12렌더):

| # | 위젯 | 내용(원문 수치) | 사용 제품 |
|---|---|---|---|
| 1 | KPI 스트립(도넛 4) | 내 종합 점수 88점(부서 대비 88%) · 종합 보고서 49개(목표 87) · 최근 위협파일 13건(총 108) · 최근 취약자산 20건(총 222) | SBChart donut ×4 |
| 2 | 자산운용점수 | 도넛 + 하단 stackbar("평균대비 36%") | SBChart donut+stackbar |
| 3 | AI 탐지 | **게이지 2장 겹침(gaugeNew) + mousemove로 z-index 반전 인터랙션** + stackbar(평균대비 -10%) | SBChart gaugeNew ×2 |
| 4 | 강점 분석 | 레이더 + 텍스트 요약("강점=자산운용/취약=네트워크") | SBChart radar |
| 5 | 요일별 위협 현황 | 라인(fill) + 요약(평균대비 -13%/위험요일 일요일) | SBChart line |
| 6 | 네트워크 현황 | stackbar.100 + 요약(변동 15%/주의 A NET) | SBChart stackbar.100 |
| 7 | 공지사항 | 요약 2(신규 3건/즐겨찾는 공지 2건) + 리스트 4건(2022.03.23 코로나 공지) | HTML 리스트 |
| 8 | 전자결재 | 결재상신 바로가기 + 신규 3/대기 1/반려 2/완료 7건 | HTML 카드 |
| 9 | 포스트 메모 | **sbux-textarea 편집 가능 + "메모추가" 동적 생성**(이벤트 위임) | SBUx textarea |

**탭 B "업종별 대시보드 - 지방재정"** (main/SBUx_B.html, 17.4KB — 공공 재정 현황판, 위젯 9 / 차트 7렌더 + 그리드 1):

| # | 위젯 | 내용(원문 수치) | 사용 제품 |
|---|---|---|---|
| 1-5 | KPI 스트립 5 | 집행액 32조4,928억(64%) · 예산액(추경포함) 32조5,807억(82%) · 예산현액 50조1,000억 · 추경예산 12조5,193억(15%) · 종합예산(작년대비 32%↑) — 각각 미니 stackbar/donut 부착 | SBChart bar/donut |
| 6 | 광역시도별 집행현황 | **대한민국 지도(map, SIGUNGU.json, drillDown:true, gradation #B7C9E9→#526FA1)** + 요약 4(집행내역 1위 경기/집행현황 1위 서울/집행부진 1위 울산/총 집행률 67%). **탭 선택 시점에 지연 렌더**(fnAfterSelectTab→renderMapChart) | SBChart map |
| 7 | 집행률 TOP 10 | 가로 bar + 우측 % 리스트 | SBChart bar |
| 8 | 기초 자치단체 분야/부문별 집행내역 | **SBGrid(585×270) — 전입대비 컬럼 커스텀 포맷(▲/▼) + 양수 적색/음수 청색 셀 착색 + valuechanged 이벤트로 편집 시 재착색**. 요약 3(1위 강남구/급상승 성동구/최다 일반행정) | **SBGrid 2.5** |
| 9 | 분야별 예산현황 | wing 차트(양방향, 7개 분야) + 좌우 수치 리스트 | SBChart wing |

**탭 C "메인조회"** (main/SBUx_C.html, 54.1KB — 정형 업무조회 화면):

상단 도움말 박스("지방 재정 현황 메인 조회 화면입니다") + 프린트(window.print)·도움말 버튼 → 현황 테이블(집행액/예산현액/예산액/추경예산 4셀) → **서브탭 3[광역시도별/분야별/부문별]** — 각 탭 = 검색조건 폼(sbux-dropdown 4 + sbux-input 검색어 + 조회 버튼) → **SBGrid(1150×430)** → 목표 달성률 미니차트 4(stackbar.100 ×12 = 4×3탭, chart19~30). 탭 전환 시 `fnReRenderChart` 재렌더.

### 1-5. 셸 상주 위젯 (탭 밖, 7/27 조사 "위젯 5"의 실체)

TO DO LIST(RNB, sbux-textarea) · 알람 리스트(8건, 뱃지 88) · 메세지 리스트(8건, 뱃지 89) · 사용자 인사말 프로필(LNB) · Theme 선택 영역(LNB — **미구현**). 알림/메세지 항목은 정적 HTML 반복(mock).

### 1-6. 탭 워크스페이스 — NOVA UX 핵심 기능 (2026-07-29 3차 보강)

**재분류 근거**: home.sb 메인 영역은 `<sbux-tabs>` 커스텀 엘리먼트로 인스턴스화(home.sb L1001-1004). `sbux-tabs` = **SBUx(소프트보울 UX 제품) 컴포넌트**이며, 이 멀티탭 시스템 자체가 **UX 제품의 간판 기능**이다. 1차 분석이 이를 "셸 골격"으로만 본 것을 정정 — **NOVA UX 제품의 핵심 기능(간판)으로 명시 분류**한다.

근거 소스: home.sb 인라인 JS(L55-215) + dashboard.js(L378-407 fnInitTab/fnAddTab) + SBUx.js(webpack 미니파이 번들 826,076B, 단일 라인 → 바이트 offset 실측). home.sb 메인 탭 인스턴스 속성 원문(L1001-1002):
`wrap-class="dash-main-tab"` · `uitype="normal"` · `is-scrollable="false"` · `show-control-panel="true"` · `is-draggable="true"` · `is-draggable-openlayer="true"` · `callback-before-close="fnBeforeCloseTab"` · `is-close-icon="true"` · `limit-draggable-displacement-axisX="9999"`

| # | 동작 | softbowl(home.sb) 지원 | 소스 근거 | 표준 sbux-tabs / home.sb 미사용 구분 | NOVA 상회 여지 |
|---|---|---|---|---|---|
| 1 | GNB 항목 클릭 → 탭 오픈 | ✅ | GNB `onclick=fnAddTab(id)` → `fnInitTab` → `SBUxMethod.addTab('dash-main-tab', options)` (dashboard.js L403·378-401) | 표준(addTab) | 동등 |
| 2 | 즐겨찾기 트리 클릭 → 탭 오픈 | ✅ | jstree `click.jstree` → `fnAddTab(sID[1])` (dashboard.js L244-257) | 셸 배선 | 동등 |
| 3 | 활성화·전환 | ✅ | `.active` 클래스 토글(home.sb L121-128 fnSelectedTargetIndexTabAndContent) | 표준+셸 | 동등 |
| 4 | 중복 오픈 방지 | ✅(부분) | `fnInitTab` L379 `if(document.querySelector('#'+id)){ SBUxMethod.selectTab(...); return; }` → 이미 열린 탭은 **신규 DOM 생성 안 함**(early return) | 셸 가드 | ⚠️ 재활성 호출 `SBUxMethod.selectTab`은 SBUx.js 826KB **문자열 0건**(미정의 의심). 중복 DOM 방지는 확실, 재활성 실동작은 [미확인/의심] → NOVA는 재활성까지 확실 처리 |
| 5 | 닫기(close 버튼) | ✅ | `is-close-icon="true"` (home.sb L1002) | 표준 | 동등 |
| 6 | 마지막 탭 close 숨김 | ✅ | `callback-before-close="fnBeforeCloseTab"` → tabCount==1이면 `return false`(닫기 차단, home.sb L140-153) + `lastTabClose()`가 `close-button-hidden` 토글(L190-207). `callbackBeforeClose` SBUx.js 12건 배선 | 표준 콜백 + 셸 커스텀 | 동등 |
| 7 | 드래그 재배치 | ✅ | `is-draggable="true"` + `is-draggable-openlayer="true"` + jQuery UI **ui.draggable 1.11.4**(SBUx.js offset 340907~) + axisX 제한(9999). 재배치 결과 `info.orderIndex` 산출(fnBeforeCloseTab L143에서 사용) | 표준 | 동등 |
| 8 | 자동 로테이션(4.5초) | ✅ | `fnStartSlide` WAIT=4500, `mainTabIds.length>1`일 때만, 전환마다 `fnReRenderChart`(home.sb L94-111). pause 버튼 `stop-active` 토글(L155-167) | **home.sb 고유 스크립트**(표준 sbux-tabs 기능 아님) | 동등+live 데이터 결합 시 상회 |
| 9 | 탭 콘텐츠 = iframe | ✅ | addTab `options.link` = iframe URL(dashboard.js L395), 각 탭 = iframe(height 962px) | 표준(iframe 타입 탭) | 동등 |
| 10 | 상태 유지(keep-alive vs 재조회) | ⚠️ 혼합 | iframe DOM은 **유지(keep-alive)**되나 전환/로테이션 시 **차트는 재렌더**: `fnReRenderChart`가 전환 탭 iframe의 `createXCharts()` 재호출(home.sb L60-75), `fnAfterSelectTab`이 SBUx_B 지도 `renderMapChart` 재호출(L113-119) | 셸 스크립트 처리 | ⭐ **탭 keep-alive 캐시**(전환 시 재렌더 X·상태 보존) = 상회 |
| 11 | 오버플로 처리(탭 넘침) | ⚠️ 미적용 | 표준엔 **SBUxScrollTabs** 플러그인 존재(좌우 chevron 스크롤+마우스휠, scroll_distance 300, SBUx.js offset 585,500~) — 그러나 home.sb 메인탭 `is-scrollable="false"`로 **비활성**. 넘칠 때 실처리는 [미확인, 실조작 필요] | **표준 보유·home.sb 미사용** | ⭐ 오버플로 스크롤/탭리스트 드롭다운 명시 = 상회 |
| 12 | 우클릭 컨텍스트 메뉴(close others/all) | ❌ 탭바 부재 | SBUx.js `closeAll` = `closeAllWindows`(winpopup 창 닫기, offset 771129·799687)로 **탭 컨텍스트 아님**. 컨텍스트 메뉴는 즐겨찾기 jstree에만(이름수정/그룹추가/삭제, dashboard.js L190-232) | 탭 워크스페이스에 부재 | ⭐ close others/all/right 컨텍스트 = 명백한 상회 |
| 13 | 탭 배지(badge) | ⚠️ 미사용 | 표준 addTab options에 `badgecolor`·`badgetext` 존재(SBUx.js offset 763676 부근) — home.sb 메인탭 미사용 | 표준 보유·미사용 | NOVA 실사용으로 차별 |
| 14 | 탭별 드롭다운 메뉴 | ⚠️ 미사용 | 표준 `dropMenu`/`addDrop` 존재(SBUx.js offset 731961~750000) — home.sb 미사용 | 표준 보유·미사용 | NOVA 실사용으로 차별 |
| 15 | 탭 → 플로팅 윈도우 분리/재도킹 | ⚠️ 불확실 | 표준 **EXT_WINPOPUP** 보유(min/max/maximize/close + `isRecover`·`recoverPos:"last"`로 탭바 복귀, SBUx.js offset 763400~772000). home.sb `is-draggable-openlayer="true"` 설정은 레이어 드래그아웃과 연관 가능성 있으나 실동작 [미확인] | 표준 보유·home.sb 활성여부 미확인 | 확정 후 도입 판단 |
| 16 | 컨트롤 패널(show-control-panel) | ⚠️ 미확인 | 속성 `show-control-panel="true"` 설정됐으나 SBUx.js에 `control-panel`/`controlPanel`/`showControlPanel` 핸들러 문자열 **0건** — 렌더 실체 [미확인] | [미확인] | — |
| 17 | 홈/고정(핀) 탭·최대 탭 수 제한 | ❌ 없음 | 핀/고정 기능 부재(마지막 1개 탭만 닫기 차단으로 항상 ≥1). `maxTab`/`limit-tab` 문자열 0건 → 최대 탭 수 제한 없음 | 부재 | ⭐ 핀/고정 탭·탭 관리 = 상회 |

**⭐ 분류 확정**: 이 탭 워크스페이스는 **NOVA UX 제품의 핵심 기능(간판)**. softbowl은 `sbux-tabs`를 UX 제품으로 판매하고 home.sb는 그 위에 멀티탭 워크스페이스를 구성했다. NOVA UX 제품이 **동등 기능**(오픈/활성/전환/닫기/드래그 재배치/중복 방지/마지막 탭 보호)을 갖추고 + **softbowl이 안 켠/없는 기능**을 채우면 상회:
- **컨텍스트 메뉴(close others/all/right)** — softbowl 탭바에 부재(#12)
- **탭 keep-alive 캐시**(전환 시 재렌더 X·입력/스크롤 상태 보존) — softbowl은 전환마다 차트 재렌더(#10)
- **오버플로 처리 명시**(스크롤 or 탭 오버플로 드롭다운) — softbowl 메인탭 `is-scrollable="false"`로 미적용(#11)
- **세션 지속**(탭 세트 새로고침 복원) — softbowl 없음(전 소스에 지속 로직 0건)
- **핀/고정 탭·최대 탭 관리** — softbowl 없음(#17)
- **배지·탭별 드롭다운** — 표준엔 있으나 home.sb 미사용, NOVA는 실사용으로 차별(#13·#14)

---

## 2. 표2 — 업무 시나리오형 데모 (콘텐츠 탭 실측)

대표 페이지 직접 다운로드·판독(전 페이지 HTTP 200). 공통 골격: 제목 h2/h3 + 도움말 박스(question_alert) + 즐겨찾기 별버튼(`top-btn-shortcut` → 부모 jstree 등록/해제) + 프린트 버튼 + Sample 영역.

| 탭 | 시연 내용(실측) | 제품 조합 | 근거 URL(…/resources/dashboard/html/) |
|---|---|---|---|
| 급여관리(pay) | **마스터-디테일**: "좌측 사원정보를 선택하면 해당하는 사원의 기본정보가 우측에 표시됩니다"(원문) — 사원 그리드(SBGridArea3) → 인사정보 폼(radio 24·input 18·select·picker) + 급여(수당)정보 그리드 + 공제 그리드. 저장 시 "급여정보가 저장되었습니다" 알럿 | SBGrid ×3 + SBUx 폼 | uxex/pay.html (34.6KB) |
| 사원관리(insa) | 검색폼 + 그리드 2 + 탭·picker — 인사 조회/등록 화면 | SBGrid ×2 + SBUx | uxex/insa.html (36KB) |
| 경영분석차트(business_analysis) | "경영 분석 차트" — **차트 10종 동시 렌더**(step·pie·bar·line·bubble·donut·stackbar·combi·gauge×2) + 그리드 2 | SBChart ×10 + SBGrid ×2 | visual/business_analysis.html (33KB) |
| SBGrid v3(sbgrid_v3) | "도매시장별 육질_육량별 경락가격" 실그리드 + **가이드 시나리오 패널 4종**(①필터+그룹핑+Sticky ②정렬+열고정+멀티소팅 ③컨텍스트메뉴+행추가 ④필터 응용 — 단계별 조작 지시문) + 개인화 목록/저장. 단, 시나리오 패널 `display:none`·테마선택 주석("진행중") | SBGrid v3 | grid3/sbgrid_v3.html (42KB) |
| 리포팅툴&그리드(grid-detaildata) | "리포팅툴&그리드 페이지입니다" — "매장별 내역": **리포트형 정밀 폼(label 82·input 70·select 22)** + 그리드 2 = 장표(리포트) 레이아웃을 SBUx 컴포넌트로 재현. 외부 리포팅툴 임베드 아님 | SBUx 대량 + SBGrid ×2 | linked/grid-detaildata.html (52KB) |
| 대용량데이터바인딩(bigdata-binding) | 행수 셀렉트(**5만/20만/30만 건**) → SBGrid 바인딩 성능 시연 | SBGrid | performance/bigdata-binding.html (7.2KB) |
| CRUD(crud) | 그리드 1 + 버튼 10(행추가/삭제/저장류) 기본기 데모 | SBGrid | grid/crud.html (7KB) |
| 나머지 26탭(전수) | **본문 전수 판독 완료 → 아래 §2-b 표** (2026-07-29 26종 직접 fetch, 전부 HTTP 200) | — | §2-b |

**통합 방식의 본질(실증)**: 제품별 갤러리가 아니라 ① 그룹웨어 셸(페르소나·알림·결재·메모) ② 업종 대시보드 2종(보안관제/공공재정) ③ 정형 업무화면(조회 폼→그리드→차트) ④ 기능 데모(그리드 12·시각화 8)를 **하나의 멀티탭 워크스페이스**에 묶고, 메인 3탭을 자동 로테이션시켜 "살아있는 시스템"처럼 보이게 한 것.

---

### 2-b. 나머지 26개 콘텐츠 탭 전수 판독 (2026-07-29 · 전부 HTTP 200)

근거: 26종 직접 fetch + 소스 grep(sb.chart.render / _SBGrid.create / sbux-* 마커 실측). 화면유형·제품조합·특이 위젯만 간결 기록(전문 덤프 X). URL = …/resources/dashboard/html/<category>/<id>.html.

#### 활용방안 (uxex, 9)
| id | 화면유형 | 제품조합 | 특이 위젯 | 크기 |
|---|---|---|---|---|
| retirement(퇴직연금) | 입력/조회 폼 | SBUx폼(select9·input7·checkbox2·datepicker1·**picker1**) + SBGrid×1 | sbux-picker, "연금정보 입력사항" 섹션 | 35.6KB |
| uxex03(청구조회) | 조회 | SBUx(**tabs1**·input6·select3·datepicker1) + SBGrid×4 | sbux-tabs 멀티탭 조회 | 28.7KB |
| uxex04(청구마감) | 조회/처리 | SBUx(**modal1**·input17·checkbox3·radio3) + SBGrid×4 | sbux-modal 팝업, 물류(미청구현황/컨테이너목록) | 52KB |
| uxex05(수금현황) | 조회/등록 | SBUx(datepicker3·input4·radio1) + SBGrid×1 | **calendar 위젯 3**, "수금 등록" 폼 | 33KB |
| uxex06(상품조회) | 조회 | SBUx(input2) + SBGrid×3 | 소형 조회 | 10.7KB |
| uxex07(보험설계) | 업무 설계폼 | SBUx(**tabs2·textarea5**·input9·select4) + SBGrid×2 | "파워라이트 통합보험(1901) 1종 설계", 담보 메모 textarea 다수 | 26KB |
| schedule(학기별시간표) | 시간표 그리드 | SBUx(button8·select3·radio2) + SBGrid×2 | 교시/요일(월~금) 시간표 | 21KB |
| wondollar(원달러현물환) | 대형 입력폼 | **SBUx 단독**(input24·select18·label36·button12·datepicker2), 그리드/차트 0 | "원달러 현물환 거래 입력" 최다 입력 컨트롤 | 44.5KB |
| tax(세금계산서발행대장) | 조회/발행 | SBUx(datepicker1·input5·select8) + SBGrid×2 | 발행일자 기간 datepicker | 25KB |

#### 데이터시각화 (visual, 7)
| id | 화면유형 | 제품조합 | 특이 위젯 | 크기 |
|---|---|---|---|---|
| covid19(코로나현황) | 지도 대시보드 | SBChart **Map(SIGUNGU 한국 시군구)+Donut** | 지역콤보(mapCode)+createMap_new, GridData_uxexmap.js mock. 원문 "Map Chart와 Donut Chart 활용" | 10.7KB |
| areaRange(부동산거래량) | 차트 | SBChart **AreaRange+Scatter+Line** | Spline/Line 셀렉트 + checkbox5(시리즈 토글) | 26.5KB |
| plot(국가별기대수명) | 산점도 | SBChart **plot(scatter)** | "2020년 국가별 기대수명", checkbox6 필터 | 17KB |
| wing(주정차위반단속) | 양방향 차트 | SBChart **wing**(+category/drag) | 좌우 대칭 wing | 10.9KB |
| orgchart(조직도) | 조직도 | **SBOrgChart 별도 제품**(sborgchartb.js·chartb.css) — SBChart 아님 | 프로필 이미지 노드, DATA_JSON_eval1 | 5.9KB |
| datarange(Datarange) | 범위 슬라이더 차트 | SBChart **datarange(area)** + SBGrid×1 | **sbux-switch(가로/세로 토글)** onChange→재렌더(인터랙션 有) | 13KB |
| kape(축산물통합정보) | 지도+멀티차트 종합 | SBChart **Map(SIGUNGU)+Donut×5+Radar+Bar×2+barrange+treemap** | 위젯 최다양(종류별 사육두수 한우/돼지/육계), gradation | **74.6KB(최대)** |

#### 그리드활용 (grid, 9) — 전부 순수 SBGrid 기능 데모(차트 render() 0건)
| id | 화면유형 | 제품조합 | 특이 위젯 | 크기 |
|---|---|---|---|---|
| rowheader | 그리드 | SBGrid×1 | 로우헤더 | 6.2KB |
| grouping | 그리드 | SBGrid×1 + button3 | 그룹핑 | 6.3KB |
| fixframe | 그리드 | SBGrid×2 | 행/열 틀고정 | 8.6KB |
| theme | **그리드 테마 스위처** | **iframe 5테마 실스왑**(Default/Gray/Navy/Light-blue/Simple)·fnTheme() 핸들러 실동작 | 유일 iframe 기반 + **실동작 테마**(home.sb LNB 장식 테마와 대조) | 4.4KB |
| excel-import | 그리드 | SBGrid×1 + **sbux-fileupload×2** | 엑셀 업로드→그리드 | 7.5KB |
| filter | 그리드 | SBGrid×1 + input | 컬럼 필터 | 6.6KB |
| personalize | 그리드 | SBGrid×1 + button3 | 컬럼 개인화 저장/불러오기 | 6.6KB |
| merge | 그리드 | SBGrid×1 + button5 | 셀 병합 | 8KB |
| subtotal | 그리드 | SBGrid×1 + button3·select | 소계/집계 | 18KB |

#### 연계 (linked, 1)
| id | 화면유형 | 제품조합 | 특이 위젯 | 크기 |
|---|---|---|---|---|
| control-component(컨트롤컴포넌트) | 폼 컴포넌트 갤러리 | SBUx(label12·input5·select4·checkbox1·datepicker1·textarea1·button4) + SBGrid×1 | SBUx 입력 컨트롤 총망라 + 그리드 연계 | 16.7KB |

**전 페이지 분석 = 38/38 완료** (기존 12: main 3·uxex insa/pay/portofentry·visual business_analysis·grid crud/sbgrid3·grid3 sbgrid_v3·linked grid-detaildata·performance bigdata-binding + 신규 26 = 전 DATA_TAB 등록 탭 전수 판독. 미확인 콘텐츠 탭 잔여 0).

---

### 2-c. 데이터 시각화 → NOVA Chart(ECharts 6.0) 커버리지 (2026-07-29 3차 보강)

**배경(사용자 요구)**: 데이터 시각화 카테고리는 **필수로 Chart를 활용하는 페이지** → **NOVA Chart 기술로 채울 근거**를 확보한다. NOVA Chart = **ECharts 6.0**(NOVA 결정 D5, [[project_nova_platform]]).

**softbowl 차트 타입 인벤토리(소스 실측)**: SBChart 2.0 `sb.chart.render()`(chart.js 30회 실측). 아래는 §2-b visual 7종 + business_analysis + 메인탭 SBUx_A/B/C에서 각 HTML/chart.js의 `type:` 값을 grep 실측한 SBChart 시리즈 타입 전수다(축 타입 category/output/drag 등은 제외).

**ECharts 6.0 사실확인(2026-07-29 공식 문서)**:
- ECharts 6.0 = **정식 릴리스**, **22개 series type**(cheat-sheet 실측): Bar·Line·Pie·Scatter·EffectScatter·Candlestick·Radar·Heatmap·Tree·Treemap·Sunburst·**Map**·Lines·Graph·Boxplot·Parallel·**Gauge**·Funnel·Sankey·ThemeRiver·PictorialBar·**Custom** + 컴포넌트 **visualMap·dataZoom·geo(registerMap)**.
- v6.0 신규: **등록형(registerable) custom series**(echarts-custom-series 6종 — violin 등) + **동적 테마 전환**(dispose 불요) + chord·beeswarm.

| softbowl 차트타입 | ECharts6.0 지원 | 구현방식 | 커버리지 | 근거 |
|---|---|---|---|---|
| **map**(SIGUNGU choropleth + gradation) | ✅ map series | `echarts.registerMap('KR-sigungu', SIGUNGU_GeoJSON)` → `series.type:'map'` + `visualMap`(continuous)로 gradation 착색 + drillDown=지역 클릭→하위 registerMap 재바인딩 | ✅ | cheat-sheet: Map·Geo·visualMap 확인 |
| **donut** | ✅ pie | `series.type:'pie'`, `radius:['40%','70%']` | ✅ | pie 확인 |
| **pie** | ✅ pie | `series.type:'pie'` | ✅ | pie 확인 |
| **bar** | ✅ bar | `series.type:'bar'` | ✅ | bar 확인 |
| **stackbar** | ✅ bar+stack | `series.type:'bar'`, `stack:'x'` | ✅ | bar stack 확인 |
| **stackbar.100**(100% 누적) | ✅ bar+stack | 값/행합계×100 정규화 후 `stack` (100% 누적 표현) | ✅(데이터 전처리) | bar stack + 정규화 |
| **line** | ✅ line | `series.type:'line'` | ✅ | line 확인 |
| **step**(계단) | ✅ line+step | `series.type:'line'`, `step:'middle'\|'start'\|'end'` | ✅ | line step 옵션 |
| **fill**(area 라인) | ✅ line+areaStyle | `series.type:'line'`, `areaStyle:{}` | ✅ | area-line 핸드북 |
| **bubble** | ✅ scatter | `series.type:'scatter'`, `symbolSize:val` | ✅ | scatter 확인 |
| **plot/scatter** | ✅ scatter | `series.type:'scatter'` | ✅ | scatter 확인 |
| **gauge/gaugeNew** | ✅ gauge | `series.type:'gauge'`(겹침 게이지=2 gauge series z-index 조합) | ✅ | gauge 확인 |
| **radar** | ✅ radar | `series.type:'radar'` | ✅ | radar 확인 |
| **treemap** | ✅ treemap | `series.type:'treemap'` | ✅ | treemap 확인 |
| **combi**(bar+line 복합) | ✅ 다중 series | 동일 grid에 `bar`+`line`, 필요 시 yAxis 2축 | ✅ | 다중 series(combiChart 원문) |
| **datarange**(area + 범위 슬라이더) | ✅ line+dataZoom | `series.type:'line'`+`areaStyle` + `dataZoom`(slider) 범위 조절 | ✅ | dataZoom 컴포넌트 확인 |
| **wing**(양방향/back-to-back) | ✅ bar(음수축) | bar 2 series(한쪽 값 음수) 공유 category axis + `axisLabel.formatter`로 마이너스 제거 = population-pyramid 패턴 | ✅ | bar 음수 back-to-back 표준 패턴 확인 |
| **barrange**(범위/floating bar, start-end) | ⚠️ 대안 | 네이티브 range-bar 부재 → ① 투명 base bar + 실 bar `stack`(start만큼 투명·range만큼 색) 또는 ② v6.0 등록형 `custom` series renderItem | ⚠️ 대안 | 네이티브 없음, custom/stacked. v6.0 custom series 확인 |
| **areaRange**(범위 밴드 min-max) | ⚠️ 대안 | 네이티브 arearange 부재 → ① 하한 line(투명) + 밴드 `stack` line(areaStyle) 2-line 밴드 또는 ② `custom` series(공개 `@echarts-x/custom-line-range` renderItem:'lineRange') | ⚠️ 대안 | 네이티브 없음, custom/2-line. custom-line-range 패키지 확인 |
| **orgchart**(SBOrgChart 별도제품·프로필 노드 계층) | ⚠️ 대안 | 계층 **구조**는 `series.type:'tree'`(orient:'vertical')로 네이티브 대체 → **별도 제품 불요**. 단 프로필-이미지 카드형 리치 노드는 `label.rich`(이미지) 또는 `graph`/custom 렌더 필요 | ⚠️ 대안 | tree 확인(구조 OK), 리치 노드=커스터마이즈 |

**커버리지 종합 판정**: softbowl 데이터 시각화 차트 타입 **전 종에 ❌(완전 불가) 없음**. 대다수(map·pie/donut·bar/stackbar·line/step/area·scatter/bubble·gauge·radar·treemap·combi·datarange·wing)는 **ECharts 6.0 네이티브 ✅**, 나머지 3종(barrange·areaRange·orgchart 리치노드)만 **⚠️ v6.0 등록형 custom series / 조합으로 재현**. → **NOVA Chart(ECharts 6.0)로 softbowl 데이터 시각화 100% 커버 가능**(네이티브 우선 + custom 3종). ⭐ 발명 없이 전부 공식 지원/공개 custom 패턴 근거. 추가 상회 축: v6.0 **동적 테마 전환**(§0-4 softbowl 셸 테마 미구현 지점을 실동작으로 상회) + live 데이터 결합(softbowl은 전부 mock).

---

## 3. 표3 — NOVA 통합 데모 refine 매트릭스

기준: home.sb 실측(본 문서) vs 어제 우리 통합 데모 프로토타입(Dashboard 탭, Artifact `b9c86d0e` = KPI 4위젯 + 매출라인 + 채널도넛 + 기간세그먼트 + X-ray) — 우리 것 기술은 부모 태스크 기술 기준.

| 축 | home.sb (실측) | 우리 어제 것 | 다듬을 것 / 추가할 것 | 상회 축 |
|---|---|---|---|---|
| 셸 | 그룹웨어 풀셸: GNB 5그룹 33메뉴 + LNB 프로필/즐겨찾기 + RNB 알림/메세지/TODO + 멀티탭 | 단일 Dashboard 탭 | **① 페르소나 셸 도입**(가상 사용자·팀·인사말) **② 멀티탭 워크스페이스**(메뉴 클릭→탭 추가·드래그·닫기) **③ 알림/결재/TODO 등 업무 문맥 위젯** — "제품 데모"가 아니라 "업무 시스템"으로 보이게 | 우리는 실서비스(Origin·PROVE·Sentinel·Stock) 화면을 탭으로 편입 가능 — 저들의 mock 그룹웨어 대비 **진짜 시스템** |
| 시연 모드 | **3탭 4.5초 자동 로테이션 + pause/play**(키오스크) | 없음 | **자동 시연 모드 추가**(N개 씬 로테이션 + 일시정지) — 전시/영업 데모에서 강력 | 로테이션 씬에 **live 데이터 갱신**을 결합하면 저들(정적 재렌더)을 즉시 상회 |
| 위젯 구성 | 탭A 위젯 11(KPI도넛4·게이지·레이더·라인·스택바·공지·결재·메모), 탭B 위젯 9(KPI5·**지도 드릴다운**·TOP10·**그리드+조건부서식**·wing) | KPI 4 + 라인 + 도넛 + 세그 + X-ray | **① 지도 위젯**(우리 GeoAxis 정체성과 직결 — 저들도 지도를 센터피스로 씀) **② 그리드 위젯**(조건부서식 ▲▼ 적/청 + 셀 편집) **③ 게이지/레이더 1종** — 위젯 다양성 7~10종으로 | X-ray(코드 투시)는 저들에 없는 우리 고유 축 — 유지·강화 |
| 업무 시나리오 | 업무화면 11종(급여=마스터-디테일 3그리드+폼, 조회화면=검색→그리드→목표차트 정형 패턴) | 없음 | **정형 조회화면 1종 추가**(검색조건→그리드→미니차트, 서브탭 3) + **마스터-디테일 1종**(행 클릭→상세 폼) — 국내 SI 고객이 "우리 업무가 되는가"를 보는 결정 화면 | 우리 실데이터(Origin 센서·Stock 체결·F1 업무일지)로 채우면 mock 대비 설득력 압도 |
| 인터랙션 | 즐겨찾기 jstree(우클릭 그룹추가/이름수정/삭제·dnd·별버튼 등록) · 지도 드릴다운 · 그리드 편집→착색 · 프린트 · 도움말 알럿 · **가이드 시나리오 패널**(v3: 단계별 조작 지시 4종) | 기간 세그먼트 | **가이드 투어 패널 채용**(“이렇게 조작해보세요” 단계 지시 — 저들 최고 아이디어 중 하나, 단 저들은 display:none으로 꺼둠) + 즐겨찾기/핀 | **위젯 간 크로스필터**(클릭→타 위젯 갱신)는 저들에 전무 — 우리가 넣으면 명백한 상회 |
| 조립/편집 | **없음**(빌더 부재) | 없음 | — | **위젯 추가/드래그 배치 빌더** = 저들이 못 한 것. 넣으면 국내 경쟁 구도에서 차별 1순위 |
| 테마 | **미구현**(select 장식·"진행중" 주석) ※단 별도 `grid/theme.html` 탭은 iframe 5테마 실스왑 동작(§2-b) | [미확인 — 우리 다크모드 여부는 Artifact 재확인 필요] | 테마 전환 **실동작**(light/dark 최소 2종) — 저들의 미구현 지점(셸 통합)을 정확히 찌르는 항목. ECharts 6.0 **동적 테마 전환**(dispose 불요, §2-c)으로 차트까지 즉시 스왑 | 셸 자체에 실동작 테마 통합하면 상회(저들은 데모탭에만 존재·셸엔 미탑재) |
| 데이터 | 전부 mock(인라인 JS·eval1.grid), API 0 | 데모 데이터 | **live 실데이터 1개 위젯이라도**(Origin API) — "IP info 192.168.020.140" 같은 가짜 라벨 대신 진짜 소스 표기 | **결정적 상회 축** |
| 반응형/모바일 | 데스크톱 1920 고정 + **별도 모바일 버전**(?mobile=true 실존) | [미확인] | 반응형 1벌로 해결(별도 버전 불필요) — 모바일 확인 화면은 데모 신뢰도에 유효 | 반응형 우위 |
| 미감 | 네이비 #31476E + 블루 #4B71B7, KoPub 돋움, 흰 카드+연회색 경계, 밀도 높은 엔터프라이즈 톤. 약점: 2021~2022 스타일(그림자·radius 구식), 오타(vershion/defalut/serch), 주석 잔해 다량, jQuery 1.12.4 | NOVA 톤 | 저들의 **정보 밀도**(KPI+요약문+차트 병기: "위험 요일 일요일" 같은 인사이트 문장)는 차용 — 각 위젯에 한 줄 인사이트 텍스트 | 모던 토큰(다크·타이포·모션)으로 세대 차 시연 |

---

## 4. 미확인·리스크

| # | 항목 | 사유 | 재확인 경로 |
|---|---|---|---|
| 1 | ~~나머지 26개 콘텐츠 탭의 본문 상세~~ → **해소(2026-07-29)** | **§2-b로 전수 완료(38/38)** — 26탭 전부 직접 fetch(HTTP 200)·본문 판독. 미확인 콘텐츠 탭 잔여 0 | (완료) §2-b |
| 2 | Theme 셀렉트가 서버사이드/외부 스크립트로 동작할 가능성 | 셸 LNB Theme는 정적 소스 전수에서 핸들러 0건 — 브라우저 실조작으로만 100% 확정 가능(단 `grid/theme.html` 탭은 fnTheme 실동작 확인) | Playwright 실조작 |
| 3 | 모바일 버전(?mobile=true, 167KB)의 내부 구성 | fetch만 하고 미판독(title=Dashboard_m, chart 참조 114건) | 동일 URL |
| 4 | 어제 우리 Artifact `b9c86d0e`의 정확한 현재 상태(테마/반응형 유무) | 본 조사에서 미열람(부모 태스크 기술만 기준) | claude.ai Artifact 재열람 |
| 5 | ~~`covid19` 탭의 특수 라우팅~~ → **해소(2026-07-29)** | **표준 SIGUNGU Map 패턴 확정·`.do` 미사용** — covid19.html은 createMapChart/createMap_new + SIGUNGU.json + GridData_uxexmap.js(mock)로 동작. dashboard.js 내 `/uxex-map-dashboard.do`는 주석(비활성) | (완료) visual/covid19.html |
| 6 | 자동 로테이션이 방문 즉시 시작인지 여부 | pause 버튼 초기 class가 `stop-active`(=정지 상태로 시작, 클릭 시 시작)로 보임 — 실조작 미확인 | 브라우저 실조작 |
| 7 | 각 콘텐츠 탭의 런타임 실렌더 결과 | §2-b는 정적 소스·mock 기준 판독(핸들러 존재까지 확인). datarange switch·covid19 drillDown·theme iframe 스왑의 실동작은 Playwright 실조작으로만 100% 확정 | Playwright 실조작 |
| 8 | ~~(§1-6) 탭 중복 오픈 시 재활성 실동작~~ → **해소·확인(2026-07-29 라이브 관측)** | **재활성 정상 동작 실증.** GNB 실클릭 경로(그룹 hover→항목 click)로 CRUD 탭 오픈 → 필터 탭 오픈(필터 active) → **CRUD 재클릭**: active가 `필터→CRUD`로 전환(재활성 O), `#crud` DOM **1개 유지(중복 생성 0)**, **재클릭 액션 콘솔 에러 0건**. 정적분석의 "`SBUxMethod.selectTab` 문자열 0건" 우려는 실동작에서 **재현되지 않음**(미니파이 명 상이 또는 정상 resolve) — 재활성은 깨끗이 처리됨. §1-6 #4의 [미확인/의심] 표기를 본 실관찰로 대체. | (완료) Playwright headless 실조작 · 근거=스크린샷 `shots/04-crud-reactivate.png`(CRUD 탭 파란 active) + `observations.json` reactivate 블록(activeBefore=필터/activeAfter=CRUD/crudCount=1/console=[]) |
| 9 | ~~(§1-6) `show-control-panel`·탭 오버플로(`is-scrollable=false`) 실 UI~~ → **해소·확인(2026-07-29 라이브 관측)** | **컨트롤패널 실렌더·실동작 확인.** `show-control-panel="true"` → 렌더 결과 `#dash-main-tab .sbux-tabs-panel`(computed `display:block`·`visibility:visible`, 우상단 x≈1752) **실존**. 내부 컨트롤: **① Tab List 드롭다운 실동작**(`.sbux-tabs-list-wrap` 클릭 → `.sbux-tabs-list.sbux-tabs-scroll` 열려 전 탭 목록 표시·활성 탭 ● 마킹) **② play 버튼**(자동 로테이션). **Previous/Next**(스크롤 chevron) `li`는 존재하나 `display:none` — `is-scrollable="false"`로 **가로 스크롤 모드 미진입**(탭 13개 오픈해도 `ulScrollW==ulClientW`, 미오버플로 → 오버플로 내비는 Tab List 드롭다운이 담당). **ShortCut Menu** wrap 존재하나 미구성(`display:none`). ⛔정정: 정적분석 "핸들러 0건"은 검색 문자열이 `control-panel`/`showControlPanel`이었으나 **실 렌더 class는 `sbux-tabs-panel`**이라 놓친 것 — 렌더/동작 실체는 존재. 잔여: `is-draggable-openlayer`(탭→레이어 드래그아웃)는 헤드리스 드래그 불안정으로 **실조작 미확정**. §1-6 #16의 [미확인]을 본 실관찰로 대체(#11 오버플로도 실측 반영). | (완료) Playwright headless 실조작 · 근거=스크린샷 `shots/05-control-panel.png`·`06-tablist-dropdown.png`(≡ 클릭→전 탭 드롭다운·CRUD ● 활성)·`07-many-tabs.png`(13탭) + `observations.json` controlPanel/tabListDropdown/overflow 블록 |
| 10 | (§2-c) barrange/areaRange/orgchart custom 재현의 픽셀 동등성 | ECharts 6.0 지원·공개 custom 패턴은 확인, 실제 NOVA에서 SBChart와 시각 동등까지는 구현·비교 필요 | NOVA Chart 프로토타입 |

리스크 메모: home.sb 콘텐츠는 Copyright 2021·공지 2022.03 기준의 **구세대 자산**이다. 소프트보울이 SBGrid v3/SBChart 2.5 세대의 신형 통합 데모를 별도로 준비 중일 가능성(사이트 내 "진행중" 주석)은 배제 못 함 — refine 기준으로는 충분하되, "이걸 이기면 끝"으로 간주하지 말 것.

## Sources (전부 2026-07-29 실호출, HTTP 200)

- https://softbowl.co.kr/SBUxDemo/DashBoard/home.sb (50.6KB) / 동 `?mobile=true` (167KB)
- https://softbowl.co.kr/SBUxDemo/resources/dashboard/js/dashboard.js (11.5KB — DATA_TAB 38·즐겨찾기·탭 라우팅·fnInitTab/fnAddTab)
- https://softbowl.co.kr/SBUxDemo/resources/dashboard/js/chart/chart.js (48.5KB — sb.chart.render 30회·차트 타입 grep·mapData)
- https://softbowl.co.kr/SBUxDemo/resources/dashboard/js/sbux/SBUx.js (826KB webpack 번들 — sbux-tabs/SBUxScrollTabs/ui.draggable 1.11.4/EXT_WINPOPUP/addTab options·offset 실측. Theme·selectTab·control-panel 문자열 부재 확인)
- https://softbowl.co.kr/SBUxDemo/resources/dashboard/css/index.css (76KB) · content.css (42KB)
- 탭 HTML 1차 10종: …/html/main/SBUx_A.html·SBUx_B.html·SBUx_C.html · uxex/pay.html·insa.html·portofentry.html · visual/business_analysis.html · grid/crud.html·sbgrid3.html · grid3/sbgrid_v3.html · linked/grid-detaildata.html · performance/bigdata-binding.html
- 탭 HTML 2차 26종(2026-07-29 전수, 전부 HTTP 200): …/uxex/{retirement·uxex03·uxex04·uxex05·uxex06·uxex07·schedule·wondollar·tax}.html · …/visual/{covid19·areaRange·plot·wing·orgchart·datarange·kape}.html · …/grid/{rowheader·grouping·fixframe·theme·excel-import·filter·personalize·merge·subtotal}.html · …/linked/control-component.html
- 차트타입 재확인(3차): chart.js·visual/business_analysis.html·kape.html·areaRange.html·wing.html·plot.html·datarange.html·orgchart.html의 `type:` grep 실측(map·donut·pie·bar·stackbar·stackbar.100·line·step·fill·bubble·gauge·gaugeNew·radar·wing·barrange·treemap·spline·plot·area·combi·orgchart)
- 참조 에셋 실존 확인: …/js/sbgrid/DATA_JSON_eval1.js · …/data/gridFormBIndData.js · …/data/GridData_uxexmap.js(covid19) · …/js/sbux/assets/js/sbchart/SIGUNGU.json(covid19·kape·SBUx_B) · …/sborgchart/js/sborgchartb.js(orgchart) · grid/theme.html 하위 defaulttheme/graytheme/navytheme/lightbluetheme/simpletheme.html
- ECharts 6.0 검증(3차): https://echarts.apache.org/en/cheat-sheet.html (22 series type·visualMap·dataZoom·geo) · https://echarts.apache.org/handbook/en/basics/release-note/v6-feature/ (v6 신규 등록형 custom series·동적 테마) · https://www.npmjs.com/package/@echarts-x/custom-line-range (arearange용 custom lineRange) · https://echarts.apache.org/handbook/en/how-to/chart-types/line/area-line/ (areaStyle)
- 선행 조사: `SEbit-Micro/docs/01-plan/nova-feature-coverage-checklist.md` §4·§6 (2026-07-27)
