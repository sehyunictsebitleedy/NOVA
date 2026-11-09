# NOVA 상회 벤치마크 근거 (vs 소프트보울 SBUx 생태계)

> 목적: SEbit NOVA(웹서비스 표준 플랫폼)를 소프트보울 SBUx 생태계보다 **기능·성능·확장성에서 상회**시키기 위한 **근거 있는 목표수치**를 출처와 함께 확보.
> ⛔ 규칙: 모든 "상회" 목표는 **외부 벤치마크 출처 위에서만** 제시. 근거 없는 수치 발명 금지. 출처 못 찾은 항목은 "미확인"으로 명시.
> 조사 방법: softbowl.co.kr / sbgrid.co.kr(전용사이트+v2.5 서버/Lazy 샘플) 실 fetch(HTML 원문 텍스트 추출) + 업계 표준 문서 교차검증.
> 작성: SEbit 리서치 정찰병 · **조회 기준시각 2026-07-27** · 연계 문서 `nova-platform-spec.md`(planner) / `nova-platform-architecture.md`(architect).

---

## 0. 요약 판정 (제품별 상회 가능성)

| NOVA 제품 | 소프트보울 대응 | 상회 핵심 축 | 판정 |
|---|---|---|---|
| NOVA Grid | SBGrid v3 | 가상스크롤 처리량·프레임예산·Excel 스트리밍 | 🟡 조건부(기능갭 최대 — spec §90 🔴, 단 상회 목표수치는 업계표준으로 근거 확보 가능) |
| NOVA Chart | SBChart v2 | **SVG(무손실)+Canvas(대용량) 이중 렌더러** → SBChart(SVG 전용)의 대용량 약점 상회 | 🟢 달성가능(ECharts 구조적 우위) |
| NOVA UX/UI | SBUx v2.6 | 개수는 이미 동급, 구조는 SSR/아일랜드 우위 | 🟡 조건부(API 문서화·Layer 상속 선행) |
| NOVA Dashboard | SBDashBoard | 위젯 조립 + 백엔드 통합 | 🟡 조건부(자산 실사 필요) |
| **NOVA Doc(신설)** | **SBWrapDoc** | 웹표준 PDF·PPT·동적보고서 vs HWP/워드 변환 | 🟢 부분상회+🔴 부분열위(HWP/전자문서유통 도메인은 열위) |
| NOVA 플랫폼(통합) | (SBUx엔 없음) | 백엔드 Gateway·노코드 Flow·SSO·AI/MCP 수직결합 | 🟢 구조적 우위(SBUx=순수 프론트 판매모델) |

---

## 표1. 소프트보울 성능·확장성 주장 원장 (실 fetch 원문)

> 출처 표기: [M]=softbowl.co.kr/front/main.do, [G]=softbowl.co.kr/front/solution/sbgrid.do, [G2]=sbgrid.co.kr(SBGrid v3 전용사이트), [G3]=sbgrid.co.kr/v2_5/resources/server/samples(+samples2·samples3), [G4]=sbgrid.co.kr/v2_5/resources/lazyloading, [U]=.../sbux.do, [C]=.../sbchart.do, [W]=.../sbwrapdoc.do. 전부 **2026-07-27 fetch**.

| # | 제품 | 항목 | 원문 주장(발췌) | 출처 | 수치 명시 |
|---|---|---|---|---|---|
| 1 | SBGrid v3 | 시장지위 | "조달쇼핑몰 시장 점유율 1위" / "조달청 쇼핑몰 그리드 분야 납품실적 1위" | [G][M] | 순위O, 절대수치X |
| 2 | SBGrid v3 | 기술 | "국내 최초 출시된 Non ActiveX 기반 제품" / "웹 표준을 준수" | [G] | X |
| 3 | SBGrid v3 | 대용량 | "그리드로 표시되는 영역만을 컨트롤하는 기술을 적용하여 탁월한 처리속도" | [G] | **X (뷰포트 렌더 원리만, 행수 없음)** |
| 4 | SBGrid v3 | 빅데이터바인딩 | "**빅데이터 바인딩** — 서버 부하를 최소화한 클라이언트 데이터바인딩! **가상 공간 생성, 무한 스크롤링 기술** 적용으로 속도저하, 용량에 대한 문제를 개선" | [G2] | **X (처리 행수·응답시간 없음)** |
| 5 | SBGrid v3 | 프레임워크 | "Angular Demo / React Demo / Vue Demo" 3종 제공 (+v2.5 "Vue.js 예시") | [G2][G3] | 3종 |
| 6 | SBGrid v3 | 인증 | "GS 인증" + "소프트웨어 접근성(SA) 인증" + "전자정부 표준프레임워크 호환성 인증" 3종 | [G2] | 3종 |
| 7 | SBGrid v3 | Excel | "셀 수식과 스타일, 그룹핑 등 개인 설정이 그대로 저장된 엑셀 파일" / "고성능 압축으로 유동적인 데이터 활용" | [G2] | X (압축 배율 없음) |
| 8 | SBGrid v3 | 기능군 | Sticky·Grouping·Lazy Loading·필터링·트리·페이징·Drag&Drop·Copy&Paste·Undo&Redo·커스터마이징·SBChart연동 | [G2] | 기능목록 |
| 9 | SBGrid v3 | API 규모 | (680 API — 사이트 fetch에서는 **미확인**, spec §90·과제배경 근거) | spec §90 | 680(2차출처) |
| 10 | SBGrid v2.5 | **서버사이드 연동** | 공식 샘플 = "JQuery의 ajax를 이용하여 화면과 서버간의 json형태의 데이터를 송·수신" + **Web Socket**·**Http(XMLHttpRequest)** 3방식 코드예제(서버측=Spring MVC `HttpServletRequest`). **성능·행수 수치 전무** — ag-grid SSRM류 "블록 캐시·서버 그룹핑/집계" 개념 없음 | [G3] | **X (코드예제만)** |
| 11 | SBGrid v2.5 | **Lazy Loading 실증** | "대용량의 데이터를 한 번에 조회하는 방식이 아닌 lazy loading 방식으로 데이터를 수신하는 예제" — 구현=`scrollmax`(스크롤 최하단) 이벤트 시 서버 재요청(`fnPaging`). **공식 데모 데이터 = "총 데이터 건 : 100"** | [G4] | **데모 100건 (대용량 정량 실증 부재의 직접 증거)** |
| 12 | SBUx v2.6 | 컴포넌트 수 | "**30+ 컴포넌트**" / "컴포넌트 유형의 손 쉽게 다양한 UI 화면 개발" | [U] | **30+** |
| 13 | SBUx v2.6 | 표준/비종속 | "웹 표준 준수 / 표준개발 환경 / 유연성·확장성 / 원라인 코드" · "HTML5 Custom Tag" · "개발코드와 운영코드가 일치" | [U] | X |
| 14 | SBUx v2.6 | 도구 | "이클립스 플러그인 제공(코드 자동완성·Snippet)" · "SBChart 컴포넌트 제공(SVG 기반)" | [U] | X |
| 15 | SBChart v2 | 렌더/화질 | "SVG 기반 — 해상도에 관계없이 깨끗하고 선명한 화질" / "확대해도 깨지지 않는 고품질 그래픽으로 빅데이터를 표현" | [C][M] | X (빅데이터 규모 없음) |
| 16 | SBChart v2 | 표준/호환 | "HTML5 웹 표준 준수" · "IE 9 이상, 크롬, 사파리 등" · "모든 OS 지원" · "UMD(CommonJS, AMD)" | [C] | X |
| 17 | SBChart v2 | 접근성 | "장애인 웹접근성 지원" (SA 인증 — spec §21) | [C] | X |
| 18 | SBChart v2 | 차트 종류 | "다양한 종류의 차트"(41종 — 사이트 fetch 미확인, spec §21 근거) | spec §21 | 41(2차출처) |
| 19 | SBWrapDoc | 정체성 | "데이터 기반 문서 생성 및 변환솔루션" / "한글, MS워드, 엑셀 문서에 데이터를 연계하여 문서를 변환, 생성, 취합" | [W][M] | X |
| 20 | SBWrapDoc | 기능 | "Pubdoc 변환 API"·"HWPX 변환 API"·"Data I/O"·"Append"·"Automation 한글 제어"·"배포문서 생성(수정/인쇄/복사 제한)"·"문서 병합(대량 문서·문단 병합)"·"한글 파일 텍스트 추출" | [W] | X |
| 21 | SBWrapDoc | 대량성능 | "**대량의 문서 내용 병합**" (대량 규모·처리속도 **수치 없음**) | [W] | **X** |
| 22 | 전사 | MCP | "SBGrid3.0 · SBChart2.0 MCP 서버" 2종 운영 (Node.js 18+, AI 코드생성용) | [G2] | 2종 |

**표1 핵심 관찰**
1. 소프트보울의 성능 주장은 **원리 서술(가상공간·무한스크롤·SVG무손실)**에 그치고, **처리 행수·응답시간·대량생성 처리량 같은 절대 수치를 어디에도 명시하지 않는다**(#3·#4·#7·#15·#21 전부 수치 X).
2. **결정적**: 서버사이드·대용량의 공식 실증 채널인 v2.5 서버 샘플[G3]·Lazy Loading 샘플[G4]조차 **"총 데이터 건: 100"짜리 데모 + 단순 scrollmax 재요청 페이징**이 전부다. RealGrid가 50만건 공개 데모[RG]를 운영하는 것과 대조적. → NOVA는 "**정량 목표(행수·ms)를 명시한 공개 벤치마크 데모**"를 세우는 것만으로 실증 우위를 점할 수 있다(단, 실측 검증 필수).

---

## 표2. NOVA 상회 목표 매트릭스

> ⛔ "NOVA 목표"의 근거 = 아래 업계 벤치마크 출처. 소프트보울이 수치를 안 밝힌 축은 **업계 표준값을 목표선으로** 삼는다. 실제 채택 여부/실측은 architect·qa 게이트에서 검증.

| 축 | 소프트보울 기준(원문) | 업계 벤치마크(출처) | NOVA 목표(근거) | 우리 자산 레버리지 | 판정 |
|---|---|---|---|---|---|
| **Grid 클라이언트 대용량** | SBGrid "가상공간+무한스크롤"(행수 미명시) [G2] | ag-grid: "100k+ rows 처리, 화면엔 보이는 ~40행만 렌더" [AG]. TanStack Virtual: "헤드리스, **60FPS**로 수백만 리스트/그리드 렌더, 보이는 DOM만 마운트" [TV][TT] | **행 가상화로 10만행+ 클라이언트 렌더, 프레임예산 60fps=16.6ms 준수**(업계 표준선). SBGrid가 수치를 안 밝히므로 "명시된 10만행 벤치" 자체가 상회 서사 | `@tanstack/vue-table` 4서비스(Origin·PROVE·PROVES·Sentinel, 헤드리스) + `@tanstack/virtual` 별도도입 필요(현재 미도입) | 🟡 조건부(virtual 신규 도입·Grid 기능갭 spec §90 🔴) |
| **Grid 서버사이드 초대용량** | SBGrid v2.5 공식 샘플 = ajax/WebSocket/Http 코드예제 + **Lazy 데모 100건**(scrollmax 재요청) [G3][G4] — 블록캐시·서버 그룹핑/집계 개념 부재 | ag-grid 3모델: Infinite/Server-Side/Viewport Row Model = "블록 단위 lazy-load, 블록캐시(cacheBlockSize·maxBlocksInCache), 서버 그룹핑·집계" [AG]. RealGrid: "행 제한 없음, 공식데모 **50만건 CSV 로드 테스트**"(단 브라우저 메모리 한계 명시) [RG] | **서버사이드 블록 lazy-load(캐시·그룹핑 포함)로 50만건+ 공개 데모**(RealGrid 데모 동급선, SBGrid 100건 데모 대비 정량 실증 우위). tanstack은 server-side 데이터 패턴 지원 [TT] | API-On Gateway(페이지네이션·구간암호·DLQ) = 서버사이드 블록 로딩의 백엔드 기둥 | 🟡 조건부(API-On 연동설계 필요) |
| **Grid Excel 입출력** | SBGrid "수식·스타일·그룹핑 저장 엑셀 / 고성능 압축" [G2] | ExcelJS vs SheetJS 실측: 50k행×20열 읽기 **ExcelJS 1.24s / SheetJS 1.56s**; SheetJS는 50MB→힙 300~400MB, 대용량 스트리밍 취약; **ExcelJS는 스트리밍 API로 50MB+ 처리** [XL][SK] | **ExcelJS 스트리밍 채택으로 대용량 export/import**(스타일·수식 포함). 목표선=50k행 read 1.2s대(ExcelJS 실측) | 현재 서비스레포 xlsx/exceljs **0개**(spec §36) → 신규 도입 필요 | 🟡 조건부(라이브러리 신규 선정=architect ADR) |
| **Chart 무손실 확대** | SBChart "SVG 기반, 확대해도 안 깨짐, 해상도 무관" [C][M] | ECharts: `renderer:'svg'` 선택 시 "**won't be blurry when zooming in**, less memory usage" [EH] | **SVG 렌더러 옵션으로 SBChart 동급 무손실 확대 확보** | ECharts 8레포 자산(직접의존) — 렌더러만 svg로 지정하면 동급 | 🟢 달성가능 |
| **Chart 대용량** | SBChart "빅데이터 표현"(SVG 전용 → **대용량 구조적 약점**) [C][M] | ECharts: ">1k는 canvas 권장" [EH]; "**sampling:'lttb'**(10000+ 포인트), **progressive/progressiveThreshold**(3000+ 요소)" [ES][EO]; "WebGL로 수백만 포인트" [WS] | **Canvas+LTTB+progressive로 수만~수십만 포인트, WebGL로 수백만** → SVG 전용 SBChart가 못하는 대용량을 상회 | ECharts 자산 그대로. 렌더러/샘플링을 데이터 규모별 전환 | 🟢 달성가능(**핵심 차별화: SVG 무손실 + Canvas 대용량 둘 다**) |
| **Chart 접근성** | SBChart "SA(SW접근성) 인증 — 배경패턴·대체텍스트·TTS" [C], spec §21 | ECharts: `aria.enabled`+`aria.decal.show`="색각이상 대비 무늬(decal)", "차트 설정 기반 설명 자동생성(스크린리더)" [EA]. ⚠️단 "키보드 접근성은 미흡"(공식 이슈 #18585) [EA2] | **aria+decal+대체텍스트로 SA 구성요소(배경패턴·대체텍스트) 대응**. 목표=대체텍스트+데이터테이블 토글(1단계), 배경패턴·TTS(2단계) | ECharts aria 컴포넌트(수동 import) + 데이터테이블 폴백 자체구현 | 🟡 조건부(SA **인증 자체**는 비용·기간 — spec D3, 키보드접근성 갭 잔존) |
| **컴포넌트 개수** | SBUx "30+ 컴포넌트" [U] (spec: 30종50유형) | (참조) Canvas 41컴포넌트·11카테고리 [spec §89] | **개수는 이미 동급 이상(41 vs 30+)** — 상회는 개수 아닌 **문서화·구조** | Canvas 41(prior art 참조만, ⛔의존금지) → NOVA 자체 Layer 신규 | 🟡 조건부(API 문서 0→전수·Layer 상속 실현이 관건) |
| **초기 로드/CWV(구조)** | SBUx=순수 클라이언트 lib(이클립스 플러그인 개발) [U] | Nuxt Islands: "**정적 구간 JS 제거로 최대 83% 적은 JS 전송**, INP/LCP 개선" [NX] | **SSR+아일랜드로 초기 로드·Core Web Vitals 구조적 우위**(SBUx는 클라이언트 하이드레이션 전량) | Nuxt4(SSR/islands 내장) 표준 스택 | 🟢 구조적 우위(단 실측 CWV는 qa 검증) |

**표2 근거 주석**
- ag-grid의 "100k+ rows, 보이는 ~40행만 렌더"는 공식 Row Models 문서 서술 [AG]. TanStack Virtual "60FPS·수백만·보이는 DOM만" [TV].
- ECharts 임계값(LTTB 10000+, progressive 3000+)은 공식 옵션/성능 가이드 근거 [ES][EO]. 기본값 sampling='none', progressive=0 [EO].
- RealGrid "50만건 CSV 데모"는 공식 성능 문서 [RG] — **단 로드 소요 ms는 문서에 수치 미기재(미확인)**.
- SBGrid v2.5 서버 샘플·Lazy 100건 데모는 1차 fetch 원문 [G3][G4] — v3 "빅데이터바인딩"의 별도 정량 데모는 발견 못함(미확인 U6).
- ExcelJS/SheetJS 50k행 실측은 sheetkit 벤치마크 [SK], 메모리 특성은 SheetJS 문서·비교글 [XL].

---

## 표3. 확장성 우위 전략 근거

| 전략 축 | 소프트보울 현황 | NOVA 방향 | 업계 근거(출처) | 우위/열위 판정 |
|---|---|---|---|---|
| **프레임워크 중립** | Angular/React/Vue **3종 데모** 제공(SBGrid) [G2] | NOVA=Nuxt(Vue) 단일. **Web Components 배포**로 프레임워크 중립 확보 가능 | Web Components "Chrome 페이지로드 **10%→18%(2024)**, MS·GitHub·Google·Adobe·SAP 프로덕션 투자". Carbon/Spectrum/Shoelace가 **framework-agnostic custom elements** 배포 [WC] | 🟡 현재 열위(단일 프레임) → WC 배포 시 동급 이상(엔터프라이즈 표준 채택 추세가 근거) |
| **SSR/아일랜드** | 순수 클라이언트 lib(SSR 개념 없음) [U] | Nuxt SSR+islands 기본 | Islands "최대 83% 적은 JS" [NX] | 🟢 우위(SBUx엔 없는 구조) |
| **i18n·다크모드** | SBGrid "다국어 설정(Locale 설정/변경)" API 존재 [G3] / 다크모드 **미확인** | Nuxt UI v4 + `dark:` 변형 필수(CLAUDE.md), i18n=Nuxt 생태계 표준 | (엔터프라이즈 DS 표준 요건 — Carbon/MUI/Ant 공통) | 🟡 조건부(i18n은 양측 보유 — 다크모드는 소프트보울측 근거 부재로 직접비교 불가) |
| **플러그인 아키텍처** | SBUx=이클립스 플러그인(개발도구) [U] / MCP 서버 2종 [G2] | NOVA=등록형 Wrapper 확장(Chart)·MCP 대응 여지 | (Storybook/Telerik "데모=문서" 패턴 — spec §26) | 🟡 조건부(소프트보울 MCP 2종은 선점 사실 — 우리도 대응 필요) |
| **모노레포 독립배포** | (미확인) | Nuxt Layer로 서비스가 상속, 독립 배포 | (Nuxt Layer 표준) | 🟡 조건부(Layer 상속 실현이 spec §89 선행과제) |
| **백엔드 수직결합** | SBUx=순수 프론트 판매모델(백엔드 없음 — 서버연동은 고객측 Spring 코드예제 수준 [G3]) | NOVA=API-On Gateway+Nexus Flow(노코드)+SSO+AI/MCP 통합 | (SBUx 라인업에 백엔드 제품 부재 — 표1 관찰) | 🟢 **최대 차별화**(경쟁사 구조에 없음) |

---

## SBWrapDoc → NOVA Doc 신설 타당성

### 기능 대조 (우리 문서자산 vs SBWrapDoc)

| 기능 | SBWrapDoc(원문 [W]) | NOVA Doc 후보 자산 | 우열 |
|---|---|---|---|
| HWP/한글 변환 | Pubdoc 변환 API·HWPX 변환 API·한글 제어(Automation)·한글 텍스트 추출 | ❌ 없음 | 🔴 **열위**(HWP/전자문서유통 도메인은 소프트보울 강점) |
| 전자문서 유통(Pubdoc) | "정부 전자문서 유통 시스템 pubdoc 연동" | ❌ 없음 | 🔴 열위(공공 전자문서 유통 요건) |
| MS워드/엑셀 데이터 연계 | 워드·엑셀 문서 데이터 연계·취합 | 엑셀=ExcelJS(도입시), docx=스킬 자산 | 🟡 조건부(엑셀 강함, 워드 템플릿은 신규) |
| 배포문서(편집제한) | 수정·인쇄·복사 제한 배포문서 | web→PDF(Playwright)로 유사 구현 여지(권한/워터마크) | 🟡 조건부 |
| 대량 문서 병합 | "대량 문서·문단 병합"(처리량 미명시) | pptxgenjs 대량 PPT 자동생성·web→PDF 대량화 | 🟡 동급 여지(단 처리량 실측 필요) |
| 웹표준 PDF·PPT·동적보고서 | (SBWrapDoc 범위 아님 — HWP/워드 중심) | **web→PDF(Playwright 벡터)·PPT(pptxgenjs)·동적 대시보드 리포트** | 🟢 **우위**(웹 네이티브 리포팅은 우리 강점) |

### 판정
- **부분 상회 + 부분 열위**: NOVA Doc은 **웹표준 리포팅(PDF/PPT/동적 대시보드)**에서 우위지만, **HWP/전자문서유통(Pubdoc·HWPX)**은 명확한 열위. 국내 공공 문서 시장에서 HWP는 필수요건 → NOVA Doc이 SBWrapDoc을 "전면 상회"한다고 주장할 근거는 **없음**(미확보 시 과대주장 금지).
- **권장 포지셔닝**: "SBWrapDoc=레거시 오피스(HWP/워드) 변환 / NOVA Doc=웹표준·데이터연동 리포팅"으로 **영역 분리**. HWP 요건이 필수인 조달 건에서는 열위 인정. 우리 자산이 실제로 겹치는 범위는 **엑셀 입출력·대량 리포트 생성**뿐.

---

## 미확인 · 리스크

| # | 항목 | 상태 | 영향 |
|---|---|---|---|
| U1 | SBGrid v3 "빅데이터바인딩" 실제 처리 행수/응답시간 | **미확인**(v3 사이트 수치 없음 [G2]. v2.5 공식 Lazy 샘플은 **데모 100건** [G4] — 대용량 정량 실증 자체가 부재) | NOVA "몇 행 상회"의 직접 비교 불가 → 업계표준(ag-grid 100k/RealGrid 50만)을 목표선으로 대체 |
| U2 | SBWrapDoc 대량생성 처리량(초당 문서수 등) | **미확인**(원문 수치 없음 [W]) | NOVA Doc "상회 처리량" 정량 비교 불가 |
| U3 | RealGrid 50만건 CSV **로드 소요 ms** | **미확인**(데모 존재하나 문서에 ms 미기재 [RG]) | NOVA 목표 응답시간의 절대 기준선 부재 → 자체 실측 필요 |
| U4 | SBGrid 680 API / SBUx 27종·SBChart 41종 | 사이트 fetch **미확인**, 2차출처(spec·과제배경)만 | 개수 비교는 2차출처 기준 — 1차 검증 시 재확인 권장 |
| U5 | 소프트보울 제품의 다크모드·모노레포 지원 | **미확인**(사이트에 근거 없음. i18n은 v2.5 Locale API로 확인 [G3]) | 확장성 직접비교 불가(표3 해당행 조건부) |
| U6 | SBGrid **v3**의 서버사이드 바인딩 데모(수치 포함) | **미확인**(v2.5 샘플만 발견 [G3][G4] — v3 전용 서버 샘플·빅데이터 데모 URL 미발견) | v3에서 정량 데모가 추가됐을 가능성 배제 못함 — 재정찰 여지 |
| R1 | ECharts 키보드 접근성 미흡(공식 이슈 #18585 [EA2]) | 확인된 갭 | SA 인증 추진 시(D3) 키보드 접근성 자체구현 필요 — NOVA Chart 리스크 |
| R2 | `@tanstack/virtual`·`exceljs` 현재 서비스레포 **0 도입** | 확인된 갭(spec §36) | NOVA Grid 상회목표는 **신규 도입 전제** — 미도입 시 목표 미달 |
| R3 | 소프트보울 MCP 서버 2종 **이미 운영** [G2] | 경쟁사 선점 | AI 코드생성 연동은 우리가 후발 — 대응 필요 |
| R4 | 상회 목표수치는 **업계표준 인용값**(NOVA 실측 아님) | 미검증 | 마케팅 확정 전 architect ADR + qa 실측 게이트 필수(발명 아닌 "목표선") |

---

## Sources (전부 2026-07-27 조회)

**소프트보울 1차(실 fetch)**
- [M] softbowl.co.kr 메인 — https://www.softbowl.co.kr/front/main.do
- [G] SBGrid 솔루션 — https://www.softbowl.co.kr/front/solution/sbgrid.do
- [G2] SBGrid v3 전용사이트 — https://www.sbgrid.co.kr/ (빅데이터바인딩·GS/SA/전자정부 인증·Angular/React/Vue 데모·MCP 2종)
- [G3] SBGrid v2.5 서버 샘플 — https://www.sbgrid.co.kr/v2_5/resources/server/samples (Ajax) · .../samples2 (Web Socket) · .../samples3 (Http/XHR) — 코드예제만, 성능수치 전무
- [G4] SBGrid v2.5 Lazy Loading 샘플 — https://www.sbgrid.co.kr/v2_5/resources/lazyloading ("총 데이터 건 : 100" 데모 · scrollmax 재요청 방식)
- [U] SBUx 솔루션 — https://www.softbowl.co.kr/front/solution/sbux.do
- [C] SBChart 솔루션 — https://www.softbowl.co.kr/front/solution/sbchart.do
- [W] SBWrapDoc 솔루션 — https://www.softbowl.co.kr/front/solution/sbwrapdoc.do

**업계 벤치마크(교차검증)**
- [AG] AG Grid Row Models(100k+ rows, 보이는 ~40행만 렌더; Infinite/Server-Side/Viewport·블록캐시) — https://www.ag-grid.com/javascript-data-grid/row-models/ , https://www.ag-grid.com/javascript-data-grid/server-side-model/
- [TV] TanStack Virtual(헤드리스·60FPS·수백만) — https://tanstack.com/virtual/latest
- [TT] TanStack Table 가상화 가이드(보이는 DOM만 마운트·server-side 패턴) — https://tanstack.com/table/v8/docs/guide/virtualization
- [RG] RealGrid 대량 데이터 로드 테스트(50만건 CSV·행 제한 없음·브라우저 메모리 한계) — https://docs.realgrid.com/guides/performance/large-data-load-test
- [XL] SheetJS 대용량/메모리 특성 — https://docs.sheetjs.com/docs/demos/bigdata/stream/
- [SK] sheetkit 벤치마크(ExcelJS 1.24s / SheetJS 1.56s @ 50k행×20열) — https://github.com/Nebu1eto/sheetkit/blob/main/benchmarks/node/RESULTS.md
- [EH] ECharts Canvas vs SVG 핸드북(renderer:'svg' 무손실·저메모리, >1k canvas 권장) — https://apache.github.io/echarts-handbook/en/best-practices/canvas-vs-svg/
- [ES]/[EO] ECharts 성능 가이드·옵션(sampling:'lttb' 10000+, progressive/progressiveThreshold 3000+, 기본 none/0) — https://www.mintlify.com/apache/echarts/guides/performance , https://github.com/apache/echarts/blob/master/src/chart/line/LineSeries.ts
- [WS] ECharts WebGL 수백만 포인트 — (핸드북/피처) https://echarts.apache.org/en/feature.html
- [EA] ECharts Aria 핸드북(aria.enabled·decal 색각이상·설명 자동생성) — https://echarts.apache.org/handbook/en/best-practices/aria/
- [EA2] ECharts 키보드 접근성 갭(공식 이슈) — https://github.com/apache/echarts/issues/18585
- [WC] Web Components 엔터프라이즈 채택(Chrome 10%→18% 2024·Carbon/Spectrum/Shoelace WC) — https://core.cz/en/blog/2026/web-components-2026/ , https://backlight.dev/mastery/best-web-components-libraries-for-design-systems
- [NX] Nuxt Islands 성능(최대 83% 적은 JS·INP/LCP) — https://alisoueidan.com/blog/deep-dive-into-nuxt-ssr-hydration-and-islands , https://www.debugbear.com/blog/nuxt-ssr-performance

**내부 2차출처(자산 판정)**
- `SEbit-Micro/docs/01-plan/nova-platform-spec.md`(§21·36·89·90·D1·D3·D5) · 메모리 `project_sebit_brand_universe.md`(NOVA 5제품+Portal)
