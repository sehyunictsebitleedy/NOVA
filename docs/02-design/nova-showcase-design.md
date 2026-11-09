# NOVA 통합 쇼케이스(멀티 서비스 갤러리) — 디자인 스펙

> **작성**: 2026-07-27 · ui-designer · **상태**: 제안(프로토타입 구현 기준)
> **근거**: `nova-platform-architecture.md` §14 ADR-M1(통합 쇼케이스)·ADR-A3(`--nova-*` 토큰 계약) · 세계관 정본 `project_sebit_brand_universe`(딥 퍼플·오로라·카피) · `project_facility_viz_platform`(씬 9 자산)
> **소비자**: frontend(순수 HTML/CSS/JS 자체완결 프로토타입, 외부 CDN 0) → 이후 `@sebit-nova/tokens` css의 시드
> **⛔ 본 문서의 HEX 팔레트가 ADR-A3 "[ui-designer 위임]"의 확정본이다.** 변수 이름·단계 수는 ADR-A3 계약(50~950 + semantic + radius/shadow/font)을 그대로 따른다.

---

## 0. 디자인 방향 선언 (안티 슬롭 가드레일)

NOVA는 "우주적 포용·데이터의 빛"이다. 흔한 AI 디폴트(보라→핑크 그라디언트 남발·유리모피즘 도배·중앙정렬 히어로·의미 없는 3분할 카드)를 다음 규칙으로 차단한다.

| # | 규칙 | 근거 |
|---|------|------|
| G1 | **오로라 그라디언트는 화면당 최대 2곳** — 히어로 배경 1 + 라이브 액센트(펄스·언더라인) 1. 카드 배경·버튼 채움에 그라디언트 금지 | 세련미=절제. 오로라는 "귀한 빛"이어야 우주가 산다 |
| G2 | **히어로는 좌정렬 비대칭** — 좌측 카피/우측 라이브 비주얼. 중앙정렬 대칭 히어로 금지 | AI 슬롭 1호 회피 |
| G3 | 데이터 숫자는 전부 `tabular-nums` — KPI·그리드·시세 흔들림 0 | 엔터프라이즈 신뢰감 |
| G4 | 버튼 affordance 최소 2종(border/shadow/hover) 필수 | 정문의 조작감 |
| G5 | 다크가 기본 테마(우주 정체성), 라이트는 **동등 품질**(계산된 AA 대비, §7) | 다크모드 필수 룰 |
| G6 | 씬 내부는 해당 서비스 고유 브랜딩 허용(Daily #f37021 등), **셸·GNB·갤러리는 `--nova-*`만** | 전시물과 전시장 구분 |
| G7 | 샘플/시뮬 데이터는 주황 계열 정직 배지(§5 3단계) — 가짜를 진짜로 위장 금지 | ADR-M1 정직 표기 |

---

## 1. 컬러 팔레트 — `--nova-*` 토큰 세트 (확정 HEX)

### 1-1. Primary 스케일 (딥 퍼플 — "우주적 포용")

Tailwind violet 디폴트(#8B5CF6)보다 깊고 차가운 방향으로 조정. 600이 라이트 모드 primary, 400이 다크 모드 primary.

| 토큰 | HEX | 용도 |
|------|-----|------|
| `--nova-primary-50`  | `#F3F1FC` | 라이트 tint 배경 |
| `--nova-primary-100` | `#E7E2FA` | 라이트 hover tint |
| `--nova-primary-200` | `#CFC5F4` | 라이트 보더 액센트 |
| `--nova-primary-300` | `#B3A3EC` | 다크 텍스트 액센트(보조) |
| `--nova-primary-400` | `#9678E2` | **다크 모드 primary** (버튼 fill·활성 상태) |
| `--nova-primary-500` | `#7C52D6` | 오로라 시작점·중간 강조 |
| `--nova-primary-600` | `#6636C4` | **라이트 모드 primary** (흰 배경 위 텍스트/버튼) |
| `--nova-primary-700` | `#532AA3` | 라이트 hover/active |
| `--nova-primary-800` | `#422383` | 딥 배경 액센트 |
| `--nova-primary-900` | `#351E68` | 히어로 심연층 |
| `--nova-primary-950` | `#211244` | 최심층(오로라 배경 베이스) |

### 1-2. 오로라 그라디언트 (모티브 정본 — 퍼플→블루→틸)

보라→핑크(AI 슬롭)가 아니라 실제 오로라의 스펙트럼(보라→청→청록)을 따른다.

```css
--nova-aurora-from: #7C52D6;  /* 퍼플 (primary-500) */
--nova-aurora-via:  #3E7DE0;  /* 심우주 블루 */
--nova-aurora-to:   #2BC8B4;  /* 오로라 틸 = "라이브"의 색 */
--nova-aurora: linear-gradient(120deg, var(--nova-aurora-from), var(--nova-aurora-via) 45%, var(--nova-aurora-to));
```

- `--nova-aurora-to`(틸)는 **"라이브/실시간"의 시그니처 컬러**로 겸용(§5). 오로라의 끝 = 살아있는 데이터, 라는 서사.

### 1-3. 중립 스케일 (바이올렛 틴트 잉크 — 순수 무채색 금지)

다크: GNB → Page → Card → Surface가 같은 바이올렛 계열 안에서 계단식으로 밝아진다(3층 레이어 일관성).

| 역할 | 다크 토큰=HEX | 라이트 토큰=HEX |
|------|--------------|----------------|
| GNB(최심층) | `--nova-bg-gnb: #0B0817` | `--nova-bg-gnb: #FFFFFF` (보더로만 분리) |
| Page 배경 | `--nova-bg-page: #120E22` | `--nova-bg-page: #F7F6FB` |
| Card/LNB | `--nova-bg-card: #1A1530` | `--nova-bg-card: #FFFFFF` |
| Surface(입력·그리드 헤더) | `--nova-bg-surface: #251E40` | `--nova-bg-surface: #F1EFF8` |
| Border 기본 | `--nova-border: #2E2650` | `--nova-border: #E2DFF0` |
| Border 강조/hover | `--nova-border-strong: #3A3160` | `--nova-border-strong: #CCC7E0` |
| Text Primary | `--nova-text: #F2F0FA` | `--nova-text: #17132B` |
| Text Secondary | `--nova-text-sub: #A9A3C4` | `--nova-text-sub: #4E4868` |
| Text Muted(캡션) | `--nova-text-muted: #8B84AD` | `--nova-text-muted: #6E6791` |
| Disabled/placeholder | `--nova-text-faint: #6F6893` | `--nova-text-faint: #9C96BC` |

### 1-4. 시맨틱 (good / warn / critical / info / live / sample)

각각 3형태: `-fg`(해당 배경 위 텍스트·AA 통과), `-base`(채움·아이콘), `-bg`(tint 배경).

| 시맨틱 | 다크 fg | 라이트 fg | base(공통) | bg(다크/라이트) |
|--------|---------|-----------|-----------|-----------------|
| `good`(정상·운전) | `#34D399` | `#0B7A54` | `#12A66F` | `rgba(52,211,153,.12)` / `#E4F7EE` |
| `warn`(경고) | `#FBBF24` | `#B45309` | `#F59E0B` | `rgba(251,191,36,.12)` / `#FDF3E1` |
| `critical`(알람·불량) | `#F87171` | `#B91C1C` | `#EF4444` | `rgba(248,113,113,.12)` / `#FCE9E9` |
| `info` | `#7FA8EC` | `#2857B8` | `#3E7DE0` | `rgba(62,125,224,.12)` / `#E7EEFB` |
| `live`(실시간 시그니처) | `#2BC8B4` | `#0B7D70` | `#2BC8B4` | `rgba(43,200,180,.12)` / `#E2F6F3` |
| `sample`(예시 데이터 정직 배지) | `#FB923C` | `#C2410C` | `#F97316` | `rgba(251,146,60,.12)` / `#FDEEE3` |

- ⛔ `#F97316` 원색은 아이콘·보더 전용. 텍스트는 반드시 fg 단계(-400/-700)를 쓴다(라이트에서 원색은 흰 배경 대비 2.8:1로 AA 미달).
- 씬 내부 설비 상태 매핑: 운전=good, 정지=neutral(text-muted), 경고=warn, 알람=critical.

### 1-5. 포커스·모션·기타 토큰

```css
--nova-focus: 0 0 0 2px var(--nova-bg-page), 0 0 0 4px var(--nova-aurora-to); /* 2px offset + 틸 링 */
--nova-radius-sm: 6px;  --nova-radius-md: 10px;  --nova-radius-lg: 14px;  --nova-radius-xl: 20px;
--nova-shadow-sm: 0 1px 2px rgba(8,6,20,.35);          /* 라이트: rgba(23,19,43,.06) */
--nova-shadow-md: 0 4px 16px rgba(8,6,20,.45);         /* 라이트: rgba(23,19,43,.10) */
--nova-glow-live: 0 0 0 4px rgba(43,200,180,.15);      /* 라이브 펄스 링 */
--nova-dur-fast: 120ms;  --nova-dur-base: 200ms;  --nova-dur-slow: 400ms;
--nova-ease: cubic-bezier(.2, 0, 0, 1);
```

---

## 2. 타이포그래피·간격 스케일

### 2-1. 폰트 스택

```css
--nova-font-sans: "Pretendard Variable", Pretendard, -apple-system, "Segoe UI",
                  "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
--nova-font-mono: ui-monospace, "Cascadia Mono", Consolas, monospace; /* ID·코드·로그 */
```

- ⛔ 프로토타입은 외부 CDN 0 → Pretendard를 **로드하지 않는다**. 스택 첫 자리에 선언만 하고 시스템 폰트로 우아하게 폴백(로컬 설치 시 자동 적용). 프로덕션(@sebit-nova/tokens)에서 셀프호스팅 woff2로 전환.
- 모든 데이터 숫자 요소에 `font-variant-numeric: tabular-nums` (G3).

### 2-2. 역할별 스케일 (SEbit T1~T5 계승 + 쇼케이스 확장)

| 토큰 | 크기/행간/굵기 | 용도 | 비고 |
|------|---------------|------|------|
| `--nova-type-display` | `clamp(32px,4.5vw,48px)` / 1.15 / 700 | 히어로 카피 전용 | `letter-spacing:-.02em`, `word-break:keep-all` |
| `--nova-type-t1` | 24/32 / 600 | 씬 타이틀·페이지 헤딩 | `-.01em` |
| `--nova-type-t2` | 20/28 / 600 | 섹션 헤딩 | |
| `--nova-type-t3` | 16/24 / 600 | 카드 타이틀·그리드 헤더 강조 | |
| `--nova-type-t4` | 14/22 / 400 | 본문 기본 | 한글 본문 행간 1.57 |
| `--nova-type-t5` | 12/18 / 400 | 캡션·배지·라벨 | 라벨은 500 허용 |
| `--nova-type-data-lg` | 28/34 / 700 | KPI 수치 | tabular-nums 필수 |
| `--nova-type-data-sm` | 13/20 / 450* | 그리드 셀·시세 | *가변폰트 없으면 500 |

- 강조 수단은 크기·굵기·색 3단계 이내. 씬 안에서 컬러 강조는 시맨틱 컬러만 사용(장식 컬러 금지).

### 2-3. 간격·레이아웃 상수

```css
--nova-space-1:4px; -2:8px; -3:12px; -4:16px; -5:20px; -6:24px; -7:32px; -8:40px; -9:48px; -10:64px;
```

| 상수 | 값 |
|------|-----|
| GNB 높이 | 60px |
| LNB(씬 레일) 폭 | 240px, 접힘 64px(아이콘 레일) |
| 갤러리 콘텐츠 max-width | 1280px |
| 씬 스테이지 max-width | 1440px |
| 카드 그리드 | `repeat(auto-fill, minmax(320px,1fr))`, gap 20px |
| 카드 썸네일 비율 | 16:10 |
| 그리드 행 높이 | 40px (헤더 44px sticky) |
| 섹션 수직 리듬 | 48px (히어로↔갤러리 64px) |

---

## 3. IA / 레이아웃

### 3-1. 구조 결정 (옵션 2안 비교)

| | 옵션 A (보수) | 옵션 B (공격) |
|---|---|---|
| 구조 | 히어로 → 카드 그리드 갤러리 → 클릭 시 씬 풀뷰 전환 | 히어로 자체가 라이브 씬 스테이지, 갤러리는 하단 필름스트립 |
| 장점 | 인지 부담 낮음·10개 스캔 용이·모바일 안정 | 정문에서 즉시 "움직임" 증명, 몰입 최대 |
| 단점 | 첫 화면이 정적으로 보일 위험 | 첫 로딩 무거움·10개 탐색성 저하·모바일 취약 |

**권장(하이브리드·채택)**: 옵션 A 골격 + B의 핵심 한 조각 — **히어로 우측에 라이브 미니 프리뷰 1개**(FEMS AHU mimic 축소판, 팬 회전+수치 틱)를 임베드한다. 정문에서 이미 "우리는 움직인다"를 증명하되, 탐색은 갤러리가 담당.

### 3-2. 화면 흐름 (해시 라우팅)

```
#/            히어로(정문) + 서비스 갤러리 (한 페이지, 스크롤)
#/scene/<id>  씬 뷰 (stock·origin·nexus·apion·prove·sentinel·agend·ehs·fems·daily)
```

### 3-3. 히어로 (정문)

- **레이아웃**: 좌 55% 카피 / 우 45% 라이브 미니 프리뷰 (G2 좌정렬 비대칭).
- **배경**: `--nova-bg-page` 위에 오로라 레이어 1개 — `radial-gradient` 2겹(primary-900 심연 + aurora 틸 광원) + `filter:blur(60px)` + opacity .22, 60s 저속 드리프트. `prefers-reduced-motion`이면 정지. (G1: 여기가 그라디언트 1/2)
- **카피(정본)**:
  - Display: "모든 시스템이 연결되는 새로운 웹 표준의 지평"
  - Sub(T4·text-sub): "가상 시나리오가 아닙니다. SEbit가 실제로 만든 10개 서비스가 NOVA 표준 위에서 그대로 구동됩니다."
  - CTA: `[갤러리 입장]`(primary fill) + `[NOVA 제품 보기]`(outline) — 프로토타입에서 죽은 링크 금지, 앵커 스크롤로 연결.
- **스탯 스트립**(히어로 하단, T5 + data-lg): `10 Services · 6 Products · 1 Standard` + 라이브 펄스 도트.

### 3-4. 서비스 갤러리

- **헤더 행**: T2 "Service Gallery" + 우측 **제품 필터 칩** 7개(전체·UX·UI·Grid·Chart·Dashboard·Doc).
  - 필터 = 단일 선택. 선택 시 해당 제품을 쓰지 않는 카드는 **opacity .35 + 비활성**(숨기지 않음 — 레이아웃 안정 + "몇 개 씬이 이 제품을 쓰는지"가 그 자체로 전시). 활성 칩 = primary fill, 나머지 = outline.
- **카드 구성**(위→아래):
  1. 썸네일(16:10) — 씬의 **미니어처 SVG/CSS 컴포지션**(스크린샷 아님: Stock=미니 캔들, Nexus=미니 노드그래프…). 라이브 씬은 우상단 틸 펄스 도트.
  2. 바디: 서비스명(T3) + 한 줄 설명(T5·text-sub) + **NOVA 제품 배지 행**.
- **제품 배지 규칙**: 씬당 **주연 제품 최대 3개**만 표기(배지 수프 금지). UX(셸)는 전 씬 공통이므로 배지 생략하고 갤러리 하단에 각주 1줄: "모든 씬의 셸·테마는 NOVA UX". 배지는 **모노크롬**(border + text-sub) — 무지개 금지, 색은 시맨틱 전용이라는 원칙 유지.
- **카드 인터랙션**: hover = `translateY(-2px)` + border-strong→primary-400 + shadow-md (affordance 3종). focus = `--nova-focus` 링. Enter/클릭 = 씬 진입.

### 3-5. 씬 뷰

```
┌ GNB (60px) ──────────────────────────────────────────────┐
│ SEbit NOVA 워드마크 │ Showcase │      다크토글 · 갤러리로 │
├──────┬───────────────────────────────────────────────────┤
│ LNB  │ 씬 헤더: 서비스명(T1) + 한줄 + [제품배지] [데이터  │
│ 씬   │         상태배지] [X-ray 토글] [정적/라이브 비교]  │
│ 레일 ├───────────────────────────────────────────────────┤
│ 10개 │ 씬 스테이지 (서비스별 §4)                          │
└──────┴───────────────────────────────────────────────────┘
```

- **LNB 씬 레일**: 10개 서비스 세로 목록(아이콘+이름). 현재 씬 = primary-bg tint + 좌측 3px 오로라 바(그라디언트 2/2 — 씬 뷰에서). 갤러리 복귀 없이 씬 간 즉시 전환.
- **씬 헤더 우측 컨트롤 3종**:
  - **데이터 상태 배지**(§5) — 항상 같은 위치(씬 브랜딩과 혼동 방지).
  - **X-ray 토글**: ON이면 씬의 각 영역에 대시 아웃라인(1.5px, primary-400) + 모서리 태그 칩(제품명: "NOVA Grid", "NOVA Chart"…)이 오버레이. "이 화면의 어느 부분이 어느 제품인가"를 즉물적으로 전시 — 요구사항 '씬 안 제품 라벨'의 구현체.
  - **정적/라이브 비교 토글**: OFF(라이브)가 기본. ON이면 모든 타이머 정지 + 화면 채도 20% 감소 + "정적 샘플 모드 — 일반 데모의 상태입니다" 배너. 벤치마크 대비 우위를 **사용자가 직접 조작해 체감**하는 장치.
- 다크/라이트 토글은 GNB 우측 고정. `data-theme` 속성 + localStorage `sebit-theme` 키 승계(ADR-E4 storageKey).

---

## 4. 씬 10종 스펙 (스테이지 구성 · 배지 · 라이브 요소 · 목업 지침)

공통: 차트 자리는 인라인 SVG/Canvas 목업 + 좌하단 T5 캡션 `NOVA Chart 자리 — 프로토타입 SVG 목업` (ECharts는 인라인 불가). 그리드 = 시맨틱 `<table>` + sticky header.

| # | 씬 id | 서비스·한 줄 | 스테이지 구성 | 주연 배지 | 라이브 요소(프로토타입 = JS 틱) |
|---|-------|-------------|--------------|-----------|-------------------------------|
| 1 | `origin` | Origin — 원천 데이터 플랫폼 | KPI 카드 4(수집 레코드·연결 소스·API 키·저장 용량) + 수집 트렌드 라인차트 + 소스별 도넛 + `[현황 리포트 생성]` Doc 버튼(문서 미리보기 패널 오픈) | Chart·Dashboard·Doc | KPI 카운트업, 라인차트 우측 신규 포인트 |
| 2 | `nexus` | Nexus — AI iPaaS 플로우 | SVG 노드 에디터 캔버스(Trigger→AI→Transform→Gateway→Notify 5노드, 베지어 엣지) + 우측 노드 속성 패널 | UX·UI | 엣지 위 데이터 펄스 이동(stroke-dashoffset), 노드 상태등 |
| 3 | `apion` | API-On — 통합 게이트웨이 | 상단 트래픽 스파크라인 + 서비스별 상태 타일(12) + 요청 로그 그리드 | Grid·Dashboard | 로그 행 실시간 prepend + 행 플래시 |
| 4 | `prove` | PROVE — 공정 검증 | BOP L1→L2→L3 브레드크럼 + 공정 흐름 스텝 + 불량률 추이 라인 + 파레토 차트 | Chart | 검증 진행률 게이지 스텝 |
| 5 | `sentinel` | Sentinel — 이상 탐지 | 이상 스코어 타임라인(임계선 + 이상 마커) + 심각도 도넛 + 우하단 알람 토스트 스택 | Chart·UX | 이상 발생 시 토스트 슬라이드인 + 타임라인 critical 마커 |
| 6 | `stock` | Stock — 자동매매 | 캔들차트 + 주문 체결 그리드 + 포지션 KPI 3 | Chart·Grid | 가격 틱 갱신·체결 행 플래시. ⛔ 전 수치에 "가상 시세" 라벨(돈 수치 발명 오해 차단) |
| 7 | `agend` | Agen-D — 도면 변환 | 2D 도면 SVG 라인워크 + `2D/3D` 뷰 토글(3D=아이소메트릭 SVG) + 레이어 패널(체크박스로 레이어 on/off) | UX·UI | 뷰 전환 트랜지션, 레이어 토글 즉시 반영 |
| 8 | `ehs` | EHS — 안전보건 | 점검 현황 그리드 + 위험성평가 매트릭스(5×5 히트맵) + 법규 개정 Doc 카드 + `[보고서 생성]` | Grid·Dashboard·Doc | 점검 상태 칩 갱신 |
| 9 | `fems` | 설비시각화 — FEMS/AHU 실시간 mimic | AHU 동적 심볼 SVG(팬 blade 회전·OA/RA/SA/EA 방향 화살표·온도 표시) + 전력 계통 미니 다이어그램 + 실시간 KPI(RPM·풍량·kW) | Dashboard·Chart | 팬 CSS 회전, RPM/온도 틱, 운전/정지 클릭 인터랙션. 기존 Artifact 시연 자산 이식 |
| 10 | `daily` | Daily — F1 모바일 업무 | **폰 프레임**(375×720 스케일) 속 업무일지 리스트/작성 화면 + 옆에 주간보고 Doc 미리보기 | UI·Doc | 알림 배지 카운트. 씬 내부 포인트 컬러 #f37021 허용(G6) — 데이터 상태 배지는 씬 헤더 고정 위치라 혼동 없음 |

- 씬 9는 `project_facility_viz_platform` 시연 자산(팬 회전·계통도)의 이식 — 시연 자산 이중 활용(ADR-M1 취지).
- 씬별 스테이지 그리드: 데스크톱 12컬럼 기준 자유 배치, 1024px 미만 = 세로 스택.

---

## 5. "정적 vs 라이브" 상회 장치 + 데이터 정직 3단계

### 5-1. 데이터 상태 배지 (전 씬 헤더 고정 위치 · 3단계 승격 체계)

| 단계 | 배지 | 컬러 | 조건 |
|------|------|------|------|
| A | `예시 데이터 · 클라이언트 시뮬레이션` | sample(주황) outline | **프로토타입 전 씬** — 틱이 돌아도 원천은 JS 생성이므로 정직하게 A |
| B | `라이브 배선 · 시뮬 원천` | live(틸) outline + 펄스 | backend 단계: Gateway 경유 실배선 + Origin 시뮬 축 (ADR-M1 정직 표기 문구 그대로) |
| C | `LIVE · 실데이터` | live(틸) solid + 펄스 | 실데이터 축 확정 후 |

- 프로토타입은 **전 씬 A 고정**. 단계 시스템을 지금 디자인에 박아두면 backend 단계에서 배지 상태만 승격하면 된다(화면 구조 불변).

### 5-2. 라이브 시각 언어 (틸 = 오로라의 끝)

| 장치 | 스펙 |
|------|------|
| 펄스 도트 | 8px 원, `--nova-aurora-to` + `--nova-glow-live` 링이 1.6s 주기로 확산(scale 1→1.8, opacity .6→0). reduced-motion 시 정적 도트 |
| 값 갱신 플래시 | 갱신 셀/행에 `rgba(43,200,180,.12)` 배경 600ms 페이드아웃. 색약 대비 이중 채널: 값 옆 ▲▼ 델타 글리프 병행 |
| 갱신 타임스탬프 | 씬 헤더 T5 muted: "마지막 갱신 3초 전" (5s 간격 갱신) |
| 정적 비교 토글 | §3-5 — 타이머 전면 정지 + 채도 하강 + 안내 배너. "라이브가 아닌 상태"를 직접 보여주는 것이 최고의 대비 광고 |

---

## 6. 인지 위계·접근성

### 6-1. 정보 위계 3원칙

1. 화면당 T1은 1개(씬 타이틀). KPI 수치(data-lg)가 시각적 1순위, 타이틀이 2순위, 컨트롤이 3순위.
2. 컬러는 의미가 있을 때만: 시맨틱 6종 + primary. 장식 목적 유채색 금지.
3. 배지·칩·라벨(T5)은 화면당 3계열 이내(제품 배지·데이터 상태·시맨틱 상태).

### 6-2. WCAG AA 대비 — 계산 확정치 (상대휘도 공식 산출)

| 조합 | 대비 | 판정 |
|------|------|------|
| 다크 text `#F2F0FA` / card `#1A1530` | 14.9:1 | AAA |
| 다크 text-sub `#A9A3C4` / card | 7.3:1 | AAA |
| 다크 text-muted `#8B84AD` / card | 5.0:1 | AA |
| 다크 primary-400 `#9678E2` / card | 5.1:1 | AA |
| 다크 live `#2BC8B4` / card | 8.4:1 | AAA |
| 다크 critical-fg `#F87171` / card | 6.4:1 | AA+ |
| 라이트 primary-600 `#6636C4` / white | 7.3:1 | AAA |
| 라이트 text-sub `#4E4868` / white | 8.6:1 | AAA |
| 라이트 text-muted `#6E6791` / white | 5.2:1 | AA |
| 라이트 live-fg `#0B7D70` / white | 5.0:1 | AA |
| 라이트 good-fg `#0B7A54` / white | 5.4:1 | AA |
| 다크 버튼: primary-400 fill + text `#17132B` | 5.1:1 | AA |

- `--nova-text-faint`는 disabled 전용(대비 3.4:1, WCAG disabled 예외) — 정보 전달 텍스트에 사용 금지.
- 상태 전달은 항상 색+형태 이중 채널(도트+텍스트, 델타 글리프, 아웃라인 스타일 차이).

### 6-3. 키보드 내비게이션 (ECharts 키보드 갭 보강 취지)

| 영역 | 패턴 |
|------|------|
| 문서 최상단 | Skip link("본문 바로가기") — 포커스 시 표시 |
| 갤러리 그리드 | roving tabindex + 화살표 4방향 이동, Enter=씬 진입, 카드에 `--nova-focus` 링 |
| 씬 레일(LNB) | `role="listbox"` 패턴, ↑↓ 이동 + Enter 전환, Esc=갤러리 복귀 |
| 씬 간 순환 | `[` `]` 이전/다음 씬 (씬 헤더에 힌트 표기) |
| 차트 목업 | `tabindex="0"` + `role="img"` + aria-label 데이터 요약("최근 24시간 수집 추이, 최고 1,240건…") + **`[표로 보기]` 버튼** → 동일 데이터의 `<table>` 다이얼로그. 이것이 NOVA Chart 접근성 축(G2 SA)의 프로토타입 표현 |
| 토글류 | `aria-pressed`, 다크토글 `aria-label="테마 전환"` |
| 라이브 갱신 | KPI 영역 `aria-live="polite"` + 5초 스로틀(스크린리더 폭주 방지). 그리드 행 추가는 aria-live 제외, 요약 카운터만 통지 |
| 모션 | `prefers-reduced-motion: reduce` → 펄스·오로라 드리프트·팬 회전 전부 정지(정적 상태 표시로 대체) |

---

## 7. frontend 구현 가이드 (자체완결 프로토타입 → Artifact 게시)

### 7-1. 파일 구조 (단일 HTML, 외부 요청 0)

```
nova-showcase.html
├─ <style>  ① 토큰 블록: :root(라이트) + [data-theme="dark"](다크, §1 그대로)
│           ② 베이스(리셋·타이포 유틸 .t1~.t5 .data-lg)
│           ③ 셸(GNB·LNB·갤러리·씬 헤더)  ④ 씬별 스코프(.scene-stock …)
├─ <body>   히어로 + 갤러리 <section> / 씬 10개 = <template id="scene-*">
└─ <script> IIFE 1개 — state { theme, filter, sceneId, xray, frozen }
            해시 라우터(#/, #/scene/*) · 씬 mount/unmount(타이머 정리 필수) · 틱 엔진
```

### 7-2. 구현 규칙

1. **토큰 강제**: 컴포넌트 CSS에 HEX 직접 사용 금지 — 전부 `var(--nova-*)`. (예외: 씬 내부 서비스 브랜딩 G6·미니어처 SVG 내부 소품.) 이 파일의 토큰 블록이 이후 `@sebit-nova/tokens/css/nova.css` 초안으로 승격된다.
2. **테마**: `<html data-theme="dark">` 기본. 토글 시 속성 교체 + `localStorage['sebit-theme']` 저장, 로드 시 복원(FOUC 방지 위해 head 인라인 스크립트 1줄).
3. **오로라 배경**: 이미지 금지 — `position:absolute` 의사요소 2개에 radial-gradient + `blur(60px)`. 배경 밴딩이 보이면 인라인 SVG `feTurbulence` 노이즈 오버레이(opacity .03) 허용.
4. **차트 목업**: 인라인 SVG `<polyline>`/`<rect>`/`<path>`. 라이브 틱 = points 배열 shift+push 후 속성 재기록. Canvas는 캔들차트(Stock)만 허용. 모든 차트에 §4 캡션 + §6-3 접근성 세트.
5. **그리드**: `<table>` + `position:sticky` 헤더. 행 플래시 = class 부여 후 `animationend`에 제거.
6. **씬 전환**: `<template>` clone mount. unmount 시 `clearInterval` 전수(타이머 누수 = 프리즈 토글 오동작 원인). frozen 상태는 전역 1곳에서 관장.
7. **성능 예산**: 총 파일 ≤ 250KB·의존성 0·`setInterval` 동시 실행 ≤ 4개(활성 씬만 구동, 갤러리 미니어처는 CSS 애니메이션만).
8. **정직 표기**: 전 씬 데이터 상태 배지 = A단계 고정(§5-1) + 푸터 1줄 "본 쇼케이스의 데이터는 예시이며, 실데이터 바인딩은 NOVA Portal 정식판에서 제공됩니다."
9. **반응형**: 1024px 미만 — LNB→상단 가로 스크롤 칩, 씬 스테이지 세로 스택, 히어로 미니 프리뷰는 카피 아래로. 갤러리 카드 min 280px. 터치 타깃 최소 44px.
10. **금지**: 외부 폰트/아이콘 CDN·프레임워크·빌드 도구. 아이콘은 인라인 SVG 16/20px 스트로크 1.5px 자체 제작(최소 세트: 서비스 10 + 컨트롤 6).

---

## 8. 검증 체크리스트 (frontend 완료 조건)

- [ ] 다크/라이트 양 모드에서 §6-2 대비표 전 항목 육안+계측 재확인 (모드 전환 시 오로라·펄스·배지 모두 정상)
- [ ] 1280/1024/768/375px 4단 반응형 — 씬 10개 전부 가로 스크롤 0
- [ ] 키보드만으로: 갤러리 진입→필터→씬 진입→씬 전환→표로 보기→갤러리 복귀 전 경로 완주
- [ ] `prefers-reduced-motion` 에뮬레이션 시 움직임 0
- [ ] 전 씬 데이터 상태 배지(A단계) + 차트 캡션 노출
- [ ] X-ray 토글 시 제품 태그가 10씬 전부에서 정확한 영역에 표시
- [ ] 정적/라이브 비교 토글 후 재개 시 타이머 중복 없음(콘솔 카운트 확인)
- [ ] grep 검사: `#[0-9a-fA-F]` 하드코딩이 토큰 블록·씬 브랜딩 예외 외 0건

---

## 부록 A. 토큰 CSS 초안 (frontend가 그대로 붙여넣는 시드)

```css
:root { /* light */
  --nova-primary-50:#F3F1FC; --nova-primary-100:#E7E2FA; --nova-primary-200:#CFC5F4;
  --nova-primary-300:#B3A3EC; --nova-primary-400:#9678E2; --nova-primary-500:#7C52D6;
  --nova-primary-600:#6636C4; --nova-primary-700:#532AA3; --nova-primary-800:#422383;
  --nova-primary-900:#351E68; --nova-primary-950:#211244;
  --nova-primary:var(--nova-primary-600); --nova-primary-hover:var(--nova-primary-700);
  --nova-aurora-from:#7C52D6; --nova-aurora-via:#3E7DE0; --nova-aurora-to:#2BC8B4;
  --nova-aurora:linear-gradient(120deg,var(--nova-aurora-from),var(--nova-aurora-via) 45%,var(--nova-aurora-to));
  --nova-bg-gnb:#FFFFFF; --nova-bg-page:#F7F6FB; --nova-bg-card:#FFFFFF; --nova-bg-surface:#F1EFF8;
  --nova-border:#E2DFF0; --nova-border-strong:#CCC7E0;
  --nova-text:#17132B; --nova-text-sub:#4E4868; --nova-text-muted:#6E6791; --nova-text-faint:#9C96BC;
  --nova-good-fg:#0B7A54; --nova-good-base:#12A66F; --nova-good-bg:#E4F7EE;
  --nova-warn-fg:#B45309; --nova-warn-base:#F59E0B; --nova-warn-bg:#FDF3E1;
  --nova-critical-fg:#B91C1C; --nova-critical-base:#EF4444; --nova-critical-bg:#FCE9E9;
  --nova-info-fg:#2857B8; --nova-info-base:#3E7DE0; --nova-info-bg:#E7EEFB;
  --nova-live-fg:#0B7D70; --nova-live-base:#2BC8B4; --nova-live-bg:#E2F6F3;
  --nova-sample-fg:#C2410C; --nova-sample-base:#F97316; --nova-sample-bg:#FDEEE3;
  --nova-radius-sm:6px; --nova-radius-md:10px; --nova-radius-lg:14px; --nova-radius-xl:20px;
  --nova-shadow-sm:0 1px 2px rgba(23,19,43,.06); --nova-shadow-md:0 4px 16px rgba(23,19,43,.10);
  --nova-glow-live:0 0 0 4px rgba(43,200,180,.15);
  --nova-focus:0 0 0 2px var(--nova-bg-page),0 0 0 4px var(--nova-aurora-to);
  --nova-dur-fast:120ms; --nova-dur-base:200ms; --nova-dur-slow:400ms; --nova-ease:cubic-bezier(.2,0,0,1);
  --nova-font-sans:"Pretendard Variable",Pretendard,-apple-system,"Segoe UI","Malgun Gothic","Apple SD Gothic Neo",sans-serif;
  --nova-font-mono:ui-monospace,"Cascadia Mono",Consolas,monospace;
}
[data-theme="dark"] {
  --nova-primary:var(--nova-primary-400); --nova-primary-hover:var(--nova-primary-300);
  --nova-bg-gnb:#0B0817; --nova-bg-page:#120E22; --nova-bg-card:#1A1530; --nova-bg-surface:#251E40;
  --nova-border:#2E2650; --nova-border-strong:#3A3160;
  --nova-text:#F2F0FA; --nova-text-sub:#A9A3C4; --nova-text-muted:#8B84AD; --nova-text-faint:#6F6893;
  --nova-good-fg:#34D399; --nova-good-bg:rgba(52,211,153,.12);
  --nova-warn-fg:#FBBF24; --nova-warn-bg:rgba(251,191,36,.12);
  --nova-critical-fg:#F87171; --nova-critical-bg:rgba(248,113,113,.12);
  --nova-info-fg:#7FA8EC; --nova-info-bg:rgba(62,125,224,.12);
  --nova-live-fg:#2BC8B4; --nova-live-bg:rgba(43,200,180,.12);
  --nova-sample-fg:#FB923C; --nova-sample-bg:rgba(251,146,60,.12);
  --nova-shadow-sm:0 1px 2px rgba(8,6,20,.35); --nova-shadow-md:0 4px 16px rgba(8,6,20,.45);
}
```

## 부록 B. 미결·후속 (backend/정식판 단계)

| 항목 | 담당 | 비고 |
|------|------|------|
| 데이터 상태 배지 B/C 승격 | backend | Gateway 배선 + Origin 원천 실사(ADR-M1 [실측 필요]) |
| Pretendard 셀프호스팅 woff2 | frontend(정식판) | tokens 패키지에 동봉, CDN 금지 유지 |
| 차트 목업 → NOVA Chart(ECharts) 교체 | frontend(정식판) | `[표로 보기]` 접근성 세트는 제품 스펙으로 승계 |
| 본 팔레트의 `@sebit-nova/tokens` 승격 | architect+frontend | ADR-A3 계약 충족 확인 후 패키지화 |
| 서비스 아이콘 10종 정식 제작 | ui-designer | 프로토타입은 자체 스트로크 아이콘으로 선행 |
