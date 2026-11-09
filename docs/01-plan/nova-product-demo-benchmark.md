# NOVA 제품별 독립 데모 사이트 — 구조·디자인 벤치마크 (research)

> **목적**: 확정 아키텍처(2레이어: Micro 소개 / **제품별 별도 실제 데모**)에 따라, NOVA UX·Grid·Chart **각각의 독립 데모 사이트**를 "다양한 샘플 + 더 디테일한 설명"으로 조직하기 위한 **사실 근거**.
> **범위**: ① 벤치마크 3사이트(sbux/sbgrid/sbchart)의 **조직 방식**(네비·샘플 배열·설명 깊이·코드뷰) 실측 ② **레퍼런스-퍼스트 디자인 벤치마크**(component docs / data grid demo / chart docs 카테고리). 코드/설계 확정은 하지 않음(그것은 architect·ui-designer 소관).
> **⛔ 전제**: 컴포넌트/기능/차트 **인벤토리는 재조사하지 않음** — `nova-feature-coverage-checklist.md`(2026-07-27 실측)가 정본. 본 문서는 "무엇이 있나"가 아니라 "**어떻게 조직하나**"만 다룬다.
> **⛔ 벤치마킹 ≠ 표절**: 아래 추출은 패턴(구조·문법) 차용 근거이며, 시각 자산·카피·코드의 복제 금지.
> 작성: SEbit 리서치 정찰병 · **조회 기준시각 2026-07-29** (재인용 항목은 2026-07-27 표기) · 어제 통합 탭 프로토타입 = `b9c86d0e`(제품 데모 정본), 통합 데모 = `f6404aac`.

---

## 0. 요약 — 이번 실측이 답한 핵심 질문

**"각 사이트는 '다양한 샘플 + 디테일 설명'을 어떻게 구현하나?"**

| 사이트 | 다양한 샘플의 구현 | 디테일 설명의 구현 |
|---|---|---|
| sbux.co.kr | 컴포넌트당 1페이지 + **스타일 테마 탭 3종**(오렌지 코어/아쿠아 베일/**전자정부 KRDS**) × **옵션 체크박스 7종**(대표 속성) — "변형 여러 개"는 별도 샘플이 아니라 **탭×토글 조합** | 인트로 2문장 + **대표 속성 API 표**(속성명+1~2문장 설명) + KRDS 링크 + 하단 Template 배너. 심화는 튜토리얼(5단계)·API 가이드로 **분리** |
| sbgrid.co.kr | **기능 1개 = 페이지 1개**(11카테고리 38항목, v3 데모 노출 37 — 레이지로딩은 주석 처리) + 대용량/페이징/서버(v2.5) 별도 샘플 | 기능 설명 2~3문장 + **조작 안내문**("방향키로 움직여 보시고, Enter 키를 눌러서 에디트 모드…") — **단 코드뷰 없음**, "소스는 API 가이드 [예제] 탭"으로 위임 |
| sbchart.co.kr | **차트 1종 = 페이지 1개**(8카테고리, 데모 LNB 42항목 — 북한지도·심전도 포함 실확인) + 공통 **옵션 토글 10종 + 애니 3종 + 스타일 4종** | 차트 정의 1~2문장 + 조작 안내문 + **View/Copy Code = `chart._userConf` 현재 상태 직렬화**(옵션 바꾸면 코드도 바뀜 — 우리 G9와 동일 사상 실존) |

**어제 우리 탭(`b9c86d0e`, 유닛=렌더+옵션+접이코드) 대비 풍부화 포인트 9개** → §3.

---

## 표1. 제품별 데모 사이트 구조 실측 (2026-07-29 원시 HTML 직접 해부)

### 1-1. 공통 셸 (3사이트 동일 문법)

| 요소 | 실측 내용 | 근거 |
|---|---|---|
| GNB 5메뉴 | **튜토리얼 · API가이드 · Demo · Release Note · 구매** (3사이트 완전 동일) + 구버전 사이트 병행 링크 | 3페이지 원시 HTML |
| 데모 내비 | 좌 LNB(카테고리 > 항목 트리) + **항목 1개 = 독립 페이지 1개**(멀티페이지, URL 딥링크 `/demo/{카테고리}/{항목}`) | 동일 |
| AI 노출 | SBGrid·SBChart 데모 **전 페이지**에 AI 배너: ChatGPT 질문 / SB-Chat(API Key) / **MCP 등록 모달**(주소 복사 + Claude 등록 가이드 PDF + 권고사항 — "AI 샘플은 참고용" 정직 고지 포함) | sbgrid-columntype·sbchart-line 원시 HTML |
| 푸터 | 제품군 크로스링크(SBDemo·SBDashBoard·SBGrid·SBChart·SBUx) + **통합데모 바로가기** + 기술/영업문의 | 동일 |
| 신뢰 장치 | 물품식별번호(조달) 상단 고지 · Release Note 메뉴 상시 | 동일 |

### 1-2. sbux.co.kr — 컴포넌트 데모 사이트 (개별 페이지 = `/demo/inputCompo/input` 완전 해부)

| 구획(위→아래) | 실측 내용 |
|---|---|
| ① 데모 목록(썸네일 페이지) | 카테고리 구획별 그리드: **썸네일 이미지 + 제목 + 설명 1문장**(예: "텍스트 입력 필드는 사용자가 키보드로 글자, 숫자, 기호 등이 조합된 짧은 텍스트를 입력하는 경우에 사용") → 클릭 시 개별 페이지 |
| ② LNB | 썸네일 페이지 / **입력(12) · 네비게이션(7) · 피드백(5)** = 컴포넌트 24페이지 / 솔루션 연계 3(⛔ **"페이지 준비중입니다" alert** — 연계 데모 실물 미완) |
| ③ 제목부 | `Input` + 부제 "텍스트 입력 필드" + **설명 2문장**(정의 1 + 제어 범위 1) + **"전자정부 디자인 시스템 보러가기"** 외부 링크 |
| ④ 데모 스테이지 | `sbux-tabs` **스타일 테마 탭 3종**: "오렌지 코어 스타일" / "아쿠아 베일 스타일" / "전자정부 디자인 시스템"(KRDS 스킨 — `krds-label` 클래스 실측) — 같은 컴포넌트를 3개 디자인 시스템 룩으로 전환 |
| ⑤ 옵션 패널(우측) | **체크박스 7종** = show-clear-button · password · mask · button-front-text · button-back-text · tooltip · popover (`group-id`로 배타 토글) |
| ⑥ 코드뷰 | `<pre><code class="hljs language-html">` **상시 노출**(접이식 아님) + 복사 버튼. **옵션 토글 → `html` 문자열 재생성**(`setHtmlAttr`/regex replace) → highlight.js 재하이라이트 → **복사 = 현재 옵션 상태** (우리 G9=코드↔렌더 단일소스와 동일 사상이 벤치마크에 실존) |
| ⑦ API 표 | "API" 섹션: **데모에서 만질 수 있는 대표 속성 7행만**(속성명 + 1~2문장 설명). 전수 속성(input 계열 84~87개)은 API 가이드로 분리 |
| ⑧ 하단 배너 | "SBUx로 만드는 간단한 업무화면! SBUx Template" → 템플릿 갤러리 유도 |

**깊이 판정**: 샘플 다양성 = 테마 3 × 옵션 7 조합(별도 정적 샘플 나열 아님). 설명 깊이 = 정의 2문장 + 속성별 마이크로카피. **개수보다 "만지는 조합"으로 다양성을 만든다.**

### 1-3. sbgrid.co.kr — 그리드 데모 사이트 (개별 페이지 = `/demo/basic/columnType` 해부)

| 구획 | 실측 내용 |
|---|---|
| LNB | 11카테고리 38항목(정본: coverage-checklist §2-2). **v3 데모 노출 37** — `/demo/data/lazy`(레이지로딩)는 **HTML 주석 처리로 비노출**(2026-07-29 실측), 대용량·페이징만 노출 |
| 제목부 | "컬럼타입" + 설명 3문장: 기능 요지("8가지의 다양한 컬럼 타입") + 구성("숫자, 텍스트(Input), 날짜…필수 컴포넌트 8종류") + **조작 안내**("방향키로 움직여 보시고, Enter 키를 눌러서 에디트 모드 활성화를 확인해 보세요") |
| 데모 스테이지 | 라이브 그리드 1개. 예시 데이터 = 업무 톤(반/이름/숫자/체크/다국적기 등) + **Handlebars식 커스텀 셀 템플릿**(국기 이미지 조건 렌더) 인라인 실증 |
| 코드뷰 | ⛔ **없음.** 원문: "해당 내용에 대한 소스는 API 가이드 내 상단 [예제] 탭 안에서 확인할 수 있습니다" — 코드는 **API 가이드(Monaco 플레이그라운드)로 위임** = 데모↔코드 분리(약점) |
| 대용량/서버 | v3: `/demo/data/bigdata`·paging. v2.5: 서버 샘플 3방식(Ajax/WebSocket/XHR + Spring 서버 코드)·Lazy 데모 "총 데이터 건: 100" (2026-07-27 실측, superiority-benchmark [G3][G4]) — **정량 수치 실증 부재** |

### 1-4. sbchart.co.kr — 차트 데모 사이트 (개별 페이지 = `/demo/line/line` 해부)

| 구획 | 실측 내용 |
|---|---|
| LNB | 8카테고리 **42항목**(라인3·영역4·막대10·원형4·분포11·결합1·확장3(**지도/북한지도/심전도** — 데모 LNB 실확인, checklist §3-7 미확인 일부 해소)·기타6) |
| 제목부 | "Line Chart(라인 차트)" + 정의 1~2문장 + **View Code / Copy Code 버튼**(제목부 우측 상단) |
| 데모 스테이지 | 라이브 차트(`chartConfig` 풀 옵션 인라인 — datarange 미니맵+배경차트, crosshair, pattern, 애니메이션 등 실전급 구성) + 조작 안내문("↑ 상단의 팁을 조정하여 범위를 조절해보세요") |
| 코드뷰 | **View Code = `JSON.stringify(chart._userConf)` 팝업**(demoSource.html, 650×800) / **Copy Code = 현재 설정 + `new sb.chart(...)` + `render()` 보일러플레이트 클립보드**. → **코드 = 차트의 현재 런타임 상태**(옵션 토글 반영). 예외: `/demo/extend/heartbeat`(심전도)는 코드 미제공 alert (demo.js 실측) |
| 옵션 패널(하단) | **차트 옵션 토글 10종**(눈금선·축·격자·툴팁·제목·범위·십자선·모양·회전·**접근성**) + **애니메이션 3종**(올라오기/채우기/나타나기) + **차트 스타일 4종**(트렌드/파스텔/하이브리드/심플) |

---

## §3. 어제 통합 탭(`b9c86d0e`) 대비 — 제품별 사이트로 쪼갤 때 풍부화 포인트 9

> 어제 탭 유닛 = 렌더 + 옵션 토글(대표 4개 이내) + 접이식 코드 + 복사. 아래는 벤치마크 실측과의 차분(설계 확정 아님 — 근거 제공).

| # | 벤치마크 실측 | 어제 탭 현황 | 풍부화 방향(근거 기반) |
|---|---|---|---|
| F1 | 항목 1개=**페이지 1개**+URL 딥링크(3사이트 공통) | 단일 HTML 해시 앵커 | 제품별 사이트에선 항목별 독립 페이지/라우트(공유·검색·SEO — sbux 썸네일→개별 페이지 문법) |
| F2 | **카탈로그(썸네일+설명 1문장) 진입 페이지**(sbux) | 히어로 제품 카드 5개뿐 | 각 사이트 정문 = 전 항목 썸네일 카탈로그(전체량 전시 + 설명 1문장) |
| F3 | **컴포넌트당 설명 2문장 + 대표 속성 표(속성명+설명)**(sbux) | 유닛에 설명 텍스트 0(옵션 라벨만) | "디테일한 설명"의 실체 = 정의문 + 조작안내 + 대표 API 미니 표. 전수 API는 문서로 분리 |
| F4 | **조작 안내문**("방향키로…Enter", "팁을 조정해보세요")(sbgrid·sbchart) | 없음 | 각 데모에 "이걸 해보라" 1문장 — 만지는 데모의 발견 가능성 장치 |
| F5 | **스타일 테마 탭**(sbux 3종 — KRDS 포함) | 다크/라이트 토글만 | 데모 스테이지에 테마 프리셋 축(NOVA 토큰 다크/라이트 + 필요 시 공공(KRDS류) 스킨은 별도 검토) |
| F6 | 코드=현재 상태 직렬화(sbux `html` 재생성 · sbchart `_userConf`) | **G9로 이미 동등**(옵션→코드 동기) | 유지가 곧 동급. **상회 여지**: sbgrid는 코드뷰 자체가 없음(API 가이드 위임) → 우리는 Grid 데모에도 인라인 코드 유지 |
| F7 | **대용량·서버사이드 전용 샘플 페이지**(sbgrid bigdata/paging, v2.5 서버 3방식 — 단 수치 실증 100건뿐) | 없음(그리드 1개+토글) | Grid 데모 사이트에 대용량/서버 샘플 독립 페이지 + **행수·ms 명시**(superiority-benchmark 표2 상회축: 10만행/50만행 공개 벤치) |
| F8 | **옵션 폭**: sbchart 10토글+애니3+스타일4 / sbux 7속성 | 유닛당 대표 4개 이내 큐레이션 | 제품별 사이트에선 옵션 폭 확대 여지 — Nivo형 **그룹 탭**(Base/Style/Axes…)이 큐레이션 한계의 해법(표2 D4) |
| F9 | **AI/MCP 데모 사이트 상시 노출**(모달+등록 가이드+정직 고지) · 튜토리얼/릴리즈노트 GNB 상설 | 없음 | 각 데모 사이트 셸에 MCP·AI 어시 진입 + 릴리즈노트(신뢰 신호) — 경쟁사 선점 대응(D12=MCP P4 조기화와 합류) |

**역상회 확인(우리가 이미 앞선 것)**: ① 접이식 인라인 코드(사이트 이탈 없는 코드뷰 — sbchart는 팝업, sbgrid는 부재) ② 렌더+옵션+코드 **단일 유닛 문법의 전 제품 일관성**(벤치마크는 제품마다 문법 상이) ③ 다크 기본+라이트 동등(3사이트 모두 다크모드 부재 — 2026-07-27 U5 미확인 유지, 화면상 근거 없음).

---

## 표2. ⭐ 디자인 벤치마크 (레퍼런스-퍼스트) — 카테고리별 우수 레퍼런스의 디자인 언어

> 카테고리 = 우리가 만들 것과 동일: **component library docs / data grid demo / chart library docs**. 전부 2026-07-29 실 fetch(또는 실측 파일). 시각 세부(정확 HEX·폰트명)는 fetch(마크다운 변환)로 못 보는 항목이 있어 [미확인] 구분.

| 레퍼런스 (카테고리) | URL | 추출한 디자인 언어 (실측) | NOVA 적용점 (--nova-* 딥퍼플·오로라 유지 전제) |
|---|---|---|---|
| **shadcn/ui** (component docs) | ui.shadcn.com /docs/components/button | 히어로 = "The Foundation for your Design System" + **완성 앱(금융 대시보드) 라이브 프리뷰**가 첫 화면. 문서 페이지 = 제목→설명→설치(**pnpm/npm/yarn/bun 패키지매니저 탭**)→사용법→**변형 예제 8종 나열**(Default/Outline/Secondary/Ghost/Destructive/Link/Icon/With Icon + spinner/group/RTL). 좌 사이드바 + **우측 "On This Page" 목차** + **Prev/Next 컴포넌트 이동**. 톤 = 간결·기술적("Start here then make it your own") | D1 유닛 스택에 **우측 페이지 목차 + Prev/Next** 채용 근거(항목별 페이지化 시 필수 내비). D2 설치 스니펫에 pm 탭. D3 변형은 shadcn처럼 **정적 나열**이 아니라 우리 G9(토글 조합)를 유지하되, 자주 쓰는 조합 2~3개는 "레시피"로 병렬 노출(F8과 합류) |
| **AG Grid** (data grid demo) | ag-grid.com/example/ | **플래그십 성능 데모 1개(주인공) + 업무 유스케이스 데모 카드(Finance/HR/Inventory 등 4종)** 이원 구조. 다크/라이트 토글, 데모별 라이트/다크 스크린샷 쌍, 소스는 GitHub 레포 연결, Docs/API로 즉시 이동 | D4 NOVA Grid 데모 사이트 IA의 직접 근거: **"성능 플래그십(수치 명시) + 업무 유스케이스 갤러리"** 이원 구조 — F7 상회축과 결합(SBGrid엔 둘 다 정량 실증 없음) |
| **Apache ECharts** (chart docs) | echarts.apache.org/examples | 예제 갤러리 = **37카테고리·378예제**(example-bundle.js 직접 다운로드·계수 실측 2026-07-29) 카드 그리드 → 클릭 시 라이브 에디터. 양적 전시 자체가 신뢰 장치 | D5 NOVA Chart 데모 = 카드 갤러리 정문(전 차트 일람 = F2) + "코드가 곧 데모" 에디터는 P4~P5(Monaco, architect K와 합류) |
| **Nivo** (chart docs) | nivo.rocks/line/ | 차트 문서 페이지 = 라이브 렌더 + **속성 컨트롤 그룹 탭**(Base/Dimensions/Style/Customization/Points/Grid & Axes) + **chart/code/data 탭** + 하단 레시피(스택 라인·시간축 등). 라이트/다크 지원 | D6 옵션 폭 확대의 해법: 대표 4개 큐레이션(어제 룰) ↔ 전수 노출(문서 소관) 사이에 **"그룹 탭" 중간층**. "data 탭" = 우리 Chart "표로 보기"(접근성)와 동형 — 접근성 장치를 문서 문법으로 승격 |
| **TanStack Table** (headless grid) | tanstack.com/table/latest | 히어로에 **라이브 테이블 데모 임베드**(정렬·필터 상태 표시) + 대형 수치 스탯("1.1 Billion Total Downloads") + 프레임워크 선택 탭. 그라디언트 억제, 대비 중심 | D7 각 데모 사이트 히어로 = 스크린샷이 아니라 **살아있는 해당 제품 1개**(Grid 사이트면 만져지는 그리드). 스탯 스트립(계수형 — 발명 숫자 금지)은 어제 탭 문법 유지 |
| **Design System Yellow** (Awwwards HM 2025-01-17) | awwwards.com/sites/design-system-yellow | UI 컴포넌트 시스템 사이트. **단일 브랜드 컬러(#FBC701) 강펀치** + 싱글페이지. Awwwards 커뮤니티 평점 7~8점대(디자인/사용성/창의성/콘텐츠), 태그: Data Visualization·UI design·Framer | D8 컴포넌트 시스템 사이트도 **브랜드 컬러 1축 강조가 수상권**이라는 외부 실증 → NOVA 딥퍼플+오로라(화면당 2곳 제한 G1) 아이덴티티를 제품별 사이트에서도 유지·통일할 근거 |
| **2026 트렌드**(교차 검증) | Figma 트렌드 리서치·tech-rz·Mintlify·GitBook (검색 2026-07-29) | ① 개발자 도구는 **dark-first**가 정착(GitHub·Linear·Figma 사례) ② **인터랙티브 플레이그라운드가 문서의 최다 사용 영역**(API-first 조직 82% 인용) ③ 고대비·키보드 플로우·스크린리더 지원의 표준화 | D9 다크 기본+라이트 동등(기존 확정 G5) 유지 근거 보강. "만지는 데모+코드 동기"(G9)가 트렌드 정합. 접근성 장치(표로 보기·aria)는 장식이 아니라 표준 요건 |

**게이트 실패 기록(정직)**: Godly(godly.website)는 **301 → recent.design 리다이렉트 후 403**(2026-07-29) — 갤러리 내용 [미확인]. Awwwards **목록/카테고리 페이지 미열람**(개별 사이트 페이지는 열람 성공). Dribbble [미확인](JS 게이트, 미시도) — 트렌드는 위 검색·개별 fetch로 대체.

---

## §5. 제품별 데모 사이트 IA 권고 (근거 매핑 — 확정은 ui-designer/architect)

공통 셸(3사이트 벤치마크 공통 문법 + 우리 상회 유지): `GNB[튜토리얼·가이드 | API | 데모 | 릴리즈노트 | 설치]` + 카탈로그 정문(F2) + 항목별 페이지(F1) + LNB 트리 + 우측 목차·Prev/Next(표2 D1) + 데모 유닛(렌더+옵션+**인라인 코드 동기 G9**+조작 안내문 F4) + MCP/AI 진입(F9) + 다크 기본(D9).

| 사이트 | LNB 조직(근거) | 페이지 구조 | 그 사이트만의 필수 샘플 |
|---|---|---|---|
| **NOVA UX 데모** | 카테고리 4(입력/네비게이션/피드백/연계 — sbux 문법) × 컴포넌트별 페이지. 인벤토리는 checklist §1-2(29종 56유형) | 정의 2문장 + 테마 탭(F5) + 렌더 + 옵션 패널(대표 속성) + 코드 동기 + **대표 API 미니 표(F3)** + 전수 API 링크 | **연계(UX↔Grid↔Chart) 데모를 실물로** — sbux는 3종 전부 "준비중" alert(1-2②) → 여기가 즉시 상회 지점 |
| **NOVA Grid 데모** | 기능군별 페이지(컬럼/헤더/스타일/병합/데이터/트리/연산/엑셀/편집/확장/접근성 — sbgrid 11카테고리 대응, checklist §2-2) | 기능 설명 + 조작 안내 + 라이브 그리드 + **인라인 코드(sbgrid 부재 → 상회 F6)** | **성능 플래그십**(행수·ms 명시 — AG Grid 이원 구조 D4 + superiority 표2 목표선) + 서버사이드/대용량 독립 페이지(F7) + 업무 유스케이스 카드 |
| **NOVA Chart 데모** | 차트종류별 페이지(카테고리 그루핑 — sbchart 8카테고리/ECharts 37카테고리 문법, checklist §3-2 42종) | 정의 + 렌더 + **옵션 그룹 탭(Nivo D6)** + 스타일 프리셋 + 코드=현재 상태(sbchart 동급, 인라인로 상회) + **표로 보기(data 탭 동형=접근성)** | 카드 갤러리 정문(전 차트 일람 — ECharts 양적 전시 D5) + 대용량(Canvas/LTTB) 샘플 = SVG 전용 SBChart 구조적 상회축 |

비고: NOVA UI(템플릿)·Dashboard는 확정 아키텍처상 독립 데모 사이트 대상 아님(UI=복사 갤러리, Dashboard=포털 내 데모 D6) — 본 문서 범위 외. NOVA Doc = 데모 없음(소개만, 확정).

---

## §6. 미확인 · 리스크

| # | 항목 | 상태 |
|---|---|---|
| N1 | SBUx 개별 데모 27페이지 중 **input 1페이지만 정밀 해부** — 나머지 페이지가 동일 템플릿(sg-demo 공통 클래스)인지의 전수 확인은 미실시(썸네일·LNB 구조로 동일 추정) | 부분 확인 |
| N2 | SBChart `demoSource.html` 팝업의 실제 표시 스타일(코드 하이라이트 여부) | 메커니즘만 확증(demo.js), 실화면 미열람 |
| N3 | sbgrid.co.kr `/v2_5/resources` 루트 fetch가 v3 메인 콘텐츠를 반환(리다이렉트 추정) — v2.5 포털 항목명은 2026-07-27 실측(checklist §2-5)으로 대체 | 미확인 |
| N4 | Godly(→recent.design 403)·Awwwards 목록 페이지·Dribbble — 갤러리 큐레이션 내용 열람 실패 | 미확인(개별 수상 페이지 1건은 열람 성공) |
| N5 | ECharts 예제 카드의 개별 표시 정보(썸네일 구성) — 번들 계수(37카테고리·378예제)만 실측 | 부분 확인 |
| N6 | 벤치마크 3사이트의 시각 토큰(정확 HEX·폰트) — 마크다운 변환 fetch 한계. 단 SBUx 테마명(오렌지 코어/아쿠아 베일)·3사이트 다크모드 부재(화면 텍스트상)는 확인 | 미확인 |
| R1 | SBGrid v3 데모의 "레이지로딩" 주석 처리 — 항목이 향후 부활할 수 있음(v2.5엔 실존) | 관찰 |
| R2 | 본 문서의 "적용점"은 근거 매핑이며 채택·우선순위 확정은 planner/architect/ui-designer 게이트 소관 | 범위 고지 |

---

## Sources

**조사 A — 1차 실측 (2026-07-29, 원시 HTML/JS 직접 다운로드·해부)**
- https://www.sbux.co.kr/demo/thumbnail/thumbnail (WebFetch — 썸네일 카탈로그·설명문)
- https://www.sbux.co.kr/demo/inputCompo/input (curl 34KB — 테마 탭 3종·옵션 7종·코드 동기 메커니즘·API 표·연계 "준비중" alert)
- https://www.sbgrid.co.kr/demo/basic/columnType (curl 45KB — 설명 3문장·조작 안내·코드뷰 부재 원문·레이지로딩 주석·MCP 모달)
- https://sbchart.co.kr/demo/line/line (curl 43KB — LNB 42항목·옵션 10/애니 3/스타일 4·chartConfig 인라인)
- https://sbchart.co.kr/SBChart_new/js/demo.js (curl 106KB — View/Copy Code=`chart._userConf` 직렬화·heartbeat 예외)
- https://www.sbgrid.co.kr/v2_5/resources (WebFetch — v3 메인 반환, N3)

**조사 A — 재인용 (2026-07-27~28 실측 사내 정본)**
- `nova-feature-coverage-checklist.md` (인벤토리·API 가이드 Monaco·릴리즈노트 계수·MCP 실호출)
- `nova-superiority-benchmark.md` [G3][G4] (v2.5 서버 샘플·Lazy 100건)
- `nova-platform-spec.md` / `nova-platform-architecture.md` / 메모리 `project_nova_platform`

**조사 B — 디자인 벤치마크 (2026-07-29)**
- https://ui.shadcn.com/ · https://ui.shadcn.com/docs/components/button (WebFetch)
- https://www.ag-grid.com/example/ (WebFetch)
- https://echarts.apache.org/examples/en/index.html + https://echarts.apache.org/examples/js/example-bundle.js (curl 415KB — 카테고리·예제 계수)
- https://nivo.rocks/line/ (WebFetch)
- https://tanstack.com/table/latest (WebFetch)
- https://www.awwwards.com/sites/design-system-yellow (WebFetch — HM 2025-01-17·#FBC701)
- 트렌드 검색(WebSearch 2026-07-29): figma.com/resource-library/web-design-trends · tech-rz.com(dark mode 2026) · mintlify.com/library(문서 도구 2026) · gitbook.com/blog(문서 도구 2026)
- 게이트 실패: https://godly.website/ (301→ http://recent.design 403) · Awwwards 목록·Dribbble [미확인]
