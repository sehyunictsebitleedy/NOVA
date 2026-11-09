# ADR-006: NOVA Chart — 코어 래퍼 하베스트 + 실운영 차별화 시각화 3종 탭 + 손코딩 SVG 부채 커버

- **날짜**: 2026-07-29
- **상태**: accepted (refines ADR-005 §3-5 Chart 채움 귀속)
- **결정자**: architect (사용자 결정 반영: 차별화 3종 전시 · 부채 흡수 지금 착수)

## Context (맥락)

ADR-005는 "데이터 시각화 = NOVA Chart" 귀속을 **하위 항목으로만** 명시했고(§3-5 채움 근거 = 분석 §2-c native/custom 커버리지), NOVA Chart의 **코어 래퍼가 무엇인지·차별화가 무엇인지·기존 부채를 어떻게 흡수하는지**는 비어 있었다.

그 사이 **Track C 하베스트**(`../../01-plan/nova-viz-asset-inventory.md`, 2026-07-29 research 실코드 실사)가 완료돼, NOVA Chart를 **실코드 근거(파일:라인)**로 구체화할 재료가 확보됐다:

1. **코어 후보 실물** — Canvas `CanvasChartWrapper.vue`(`:21,29,47-85`)가 **테마 자동 동기화 + dispose 안전 + 등록형 레지스트리**를 이미 완성 = NOVA Chart Wrapper 아키텍처의 사실상 프로토타입(하베스트 §1-8·§2 #1). 버전 정본 후보 = ECharts **6계열**(Origin/PROVE `echarts ^6.0.0`, 하베스트 §1-1·§1-2).
2. **softbowl엔 없고 우리만 가진 시각화 3종**(하베스트 §4-D) — Nexus AI 워크플로우 노드 그래프(19종, Vue Flow)·Stock 금융 인터랙션 라인(`SkEquityChart` dataZoom·markLine·손익툴팁)·Sentinel 온톨로지 인과 그래프(animated edge).
3. **부채** — Nexus·Sentinel·API-On 3개 플래그십이 echarts를 `package.json`에 **선언만 하고 손코딩 인라인 SVG**(애니 도넛·시계열·임계선 라인)로 우회(하베스트 §1-5~§1-7·§4-B, grep 렌더 0건).

**사용자 결정**: (a) 차별화 3종을 **모두 탭으로 전시**, (b) 부채 흡수를 **지금 착수**(NOVA Chart 컴포넌트 커버 요구로 명시). 이는 ADR-005(TabWorkspace 제품 귀속)의 관심사가 아니라 **NOVA Chart 제품의 코어·차별화·부채 흡수**라는 별개 관심사 → 신규 ADR.

## Decision (결정)

**NOVA Chart를 우리 완성 자산 하베스트로 구체화한다. 새로 짜지 않는다.**

1. **코어 래퍼 하베스트(§3-5-A)**: NOVA Chart Wrapper 코어 = Canvas **`CanvasChartWrapper.vue` 차용**(테마 자동동기화 + dispose 안전 + 등록형 레지스트리). **버전 정본 = ECharts 6계열**(Origin/PROVE 래퍼). Stock `SkEquityChart` 금융 인터랙션·PROVE `LineChart`/`DonutChart` 프리셋을 흡수. ⛔ 재구현이 아니라 완성 자산 승격.
2. **실운영 차별화 3종 탭 편입(§3-5-D·§4 T15~T17)**: softbowl SBChart에 없는 3축을 NOVA Chart 차별화 탭으로 노출. 각 **X-ray 태그·NOVA 제품 귀속·자산 출처(파일)** 명시:
   - T15 AI 워크플로우 그래프 — `chart:graph/ai-workflow`(실자산 엔진 Vue Flow) · Nexus `flow-builder/index.vue`+`nodes/*`(19)
   - T16 트레이딩 라인 — `chart:ECharts6/line-equity` · Stock `SkEquityChart.vue`
   - T17 온톨로지 그래프 — `chart:graph/ontology`(실자산 엔진 Vue Flow) · Sentinel `admin/ontology.vue`
   - §6 상회축에 "우리만의 실운영 시각화 3종" 추가. **실자산이므로 노출 정당**(§4-2 미준비 비노출 원칙과 충돌 없음).
3. **손코딩 SVG 부채 = NOVA Chart 컴포넌트 커버리지 요구(§3-5-C)**: NOVA Chart 컴포넌트가 Nexus/Sentinel/API-On 손코딩 SVG **4패턴(애니 도넛·임계선 라인·2계열 시계열·단순 라인)을 커버하는 옵션을 제공**하도록 **설계 요구**만 박제. ⛔ 실제 SVG 교체 **WBS/스케줄은 planner 별도**(부채 정리 과제).

⛔ 구조(멀티탭·셸 5층·상황실 편입·5카테고리 매핑)는 **불변**. 본 ADR은 **NOVA Chart 코어 근거·차별화 노출·부채 커버 요구**만 추가 — 임의 구조 확장 아님. 근거는 전부 하베스트 카탈로그 실코드(파일:라인), 발명 0.

## Alternatives Considered (대안과 기각 사유)

| 대안 | 내용 | 기각 사유 |
|---|---|---|
| **A. NOVA Chart Wrapper 새로 구현** | 코어 래퍼를 밑바닥부터 신규 작성 | 완성 자산(`CanvasChartWrapper` 테마동기화·dispose·레지스트리) 폐기 = SEbit 메타룰 §0("1:1 차용·새로짜기 금지") 정면 위배. **기각** |
| **B. 차별화 3종 미노출**(softbowl 카탈로그만 미러) | ECharts 6.0 커버리지 표만 전시, 우리 실자산은 숨김 | softbowl에 **없는** 우리 상회 축(Nexus 워크플로우·Stock 금융라인·Sentinel 온톨로지) 상실 → 데모가 "softbowl 따라하기"로 축소. breadth·차별화 손실. **기각**(사용자 결정 = 3종 모두 전시) |
| **C. Vue Flow 그래프 2종을 신제품으로 분리** | 그래프 시각화를 NOVA 6제품 밖 신규 제품으로 | [[project_nova_platform]] 라인업 임의 확장. 그래프 = 시각화 → NOVA Chart 그래프 계열로 귀속(ECharts `series:'graph'` native·Origin 이미 등록, 하베스트 §1-1). **기각**(엔진은 X-ray로 정직 표기) |
| **D. 부채 실교체까지 본 설계에서 WBS화** | 3개 서비스 SVG → NOVA Chart 교체 스케줄까지 이 문서에 | architect 범위 밖(구현 스케줄·자원배분 = planner). 설계 문서에 실행 WBS 혼입 = 관심사 오염. **기각**(커버리지 요구까지만·실교체는 planner 로드맵) |
| **E. 코어 하베스트 + 차별화 3탭 + 부채 커버 요구(채택)** | CanvasChartWrapper 차용 + 3종 탭 편입 + 4패턴 커버 요구 | 하베스트 실코드 100% 정합·구조 불변·발명 0·사용자 결정 반영. **채택** |

## Consequences (결과)

**Positive**
- NOVA Chart 코어가 "새로 짤 것"에서 **우리 완성 자산(`CanvasChartWrapper`) 승격**으로 확정 → 재구현 0·리스크·공수 절감(메타룰 §0 실현).
- softbowl에 없는 **실운영 시각화 3종**이 세일즈/데모 차별화 축으로 노출 → "따라하기"가 아니라 "상회" 증명(§6).
- 손코딩 SVG 부채(4처)가 NOVA Chart 단일 엔진(ECharts 6.0)으로 흡수 가능한 경로 확보 → 3개 플래그십 유지보수 부채 감축 근거("공통으로 관리").
- 차별화·부채 커버가 하베스트 실코드(파일:라인)에 1:1 매여 spec-integrity 재검증 통과 가능(발명 0).

**Negative / Risks**
- Nexus·Sentinel 2종은 실자산이 **Vue Flow**(ECharts 아님) → 자체완결 데모 HTML(CDN 0)에서 **인라인 SVG 대표 렌더 + X-ray로 실자산 엔진 표기**로 정직 처리(§7-2). 픽셀 동등성은 레이어2 제품 데모에서 검증.
- 버전 파편화(ECharts 6 vs 5.6·vue-echarts 8 vs 7, 하베스트 §5) → **6 정본**, 5.6 계열은 옵션만 이식 시 **API 호환 확인 필요**(리스크로 명시).
- 부채 커버는 **요구까지만** — 실교체 WBS 부재. planner가 별도 과제로 받지 않으면 부채가 요구 단계에 정체될 위험(로드맵 인계 필요).

**Refines**: ADR-005 §3-5(데이터 시각화 = NOVA Chart 채움) 귀속을 **코어(A)·커버리지(B)·부채(C)·차별화(D)** 4축으로 구체화한다. ADR-005의 TabWorkspace 제품 귀속·상회 6종은 **전부 유효**(supersede 아님·부분 refine). ADR-002 카테고리 매핑도 유효(③ 데이터 시각화에 차별화 3탭 additive).
