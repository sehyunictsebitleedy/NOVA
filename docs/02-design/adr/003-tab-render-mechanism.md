# ADR-003: 탭 렌더 방식 — in-page 컴포넌트 렌더 (iframe 기각)

- **날짜**: 2026-07-29
- **상태**: accepted
- **결정자**: architect

## Context (맥락)

멀티탭 워크스페이스(ADR-001)에서 각 탭의 콘텐츠를 **어떻게 스테이지에 렌더할지** 정해야 한다. 벤치마크 home.sb는 **탭 콘텐츠 = iframe으로 정적 HTML 로드**(분석 §1-1: "탭 콘텐츠=iframe height 962px", URL 규칙 `/html/<category>/<id>.html`)다. 우리의 상회 축(테마 실전환·X-ray·크로스필터)과 "자체완결 단일 HTML" 원칙이 렌더 방식에 직접 걸린다. 또한 NOVA는 2레이어(소개=Micro / 레이어2=제품별 독립 데모 사이트, project_nova_platform)이므로 워크스페이스 탭과 레이어2 데모 사이트의 관계도 정해야 한다.

## Decision (결정)

**워크스페이스 탭 = in-page 컴포넌트 렌더**(단일 JS 런타임이 탭 패널에 DOM을 마운트). **iframe 불채택.**

- 탭 콘텐츠는 product-demo와 **동일한 렌더러 함수**(`drawDashLine`·`renderDashGrid`·chart 드로어 등)를 탭 패널에 마운트해 재사용(코드 중복 0).
- **lazy-mount**(최초 오픈 시 렌더) + **keep-alive**(전환 시 `hidden` 토글, 상태 보존) + close 시 `cleanup` 해제.
- **레이어2(제품별 독립 데모 사이트, sbux.co.kr 대응)로의 깊이 = 새 창 링크**(iframe 아님): 프레임 바 `[전체 데모 ↗]` + 제품 탭 우상단 `[이 제품 전체 데모 ↗]`. 워크스페이스=맛보기+조립 증명, 레이어2=제품 전수.

## Alternatives Considered (대안과 기각 사유)

| 대안 | 내용 | 기각 사유 |
|---|---|---|
| **iframe(home.sb 방식)** | 탭마다 별도 HTML을 iframe 로드 | ⛔ **테마 토큰이 iframe 경계를 못 넘음** → home.sb 테마 미구현의 구조적 원인을 그대로 답습. ⛔ X-ray가 iframe 내부 DOM 계수 불가. ⛔ 크로스필터/상태 공유에 postMessage 필요(취약·복잡). ⛔ 자체완결 단일 HTML 원칙 위배(다파일). **기각** |
| **외부 링크만** | 탭 클릭 = 제품 데모 사이트로 이동 | 워크스페이스 안에서 아무것도 안 보임 → "살아있는 업무 시스템" 서사 붕괴. 멀티탭의 의미 상실. **기각** |
| Web Components(shadow DOM) | 탭을 커스텀 엘리먼트로 | shadow DOM이 토큰 캐스케이드·X-ray outline을 재차 단절(iframe과 유사 문제). project_nova_platform D11=WC 빌드 보류. 데모 과잉. **기각** |
| **in-page 컴포넌트 렌더(채택)** | 단일 런타임 마운트 + lazy/keep-alive | 테마·X-ray·상태 전 탭 관통 + 자체완결 + 렌더러 재사용. **채택** |

## Consequences (결과)

**Positive**
- 테마 실전환·X-ray·크로스필터가 **전 탭을 관통**(home.sb가 iframe 때문에 못 한 것을 구조적으로 확보) → 상회 축 3개가 한 결정으로 성립.
- product-demo 렌더러 재사용 → 신규 작성 최소화(설계 §7-2 자산 맵).
- 자체완결 단일 HTML 유지(외부 요청 0).

**Negative / Risks**
- 단일 문서에 14탭 DOM/JS → 파일 커짐(예산 ≤ 480KB로 통제) + 메모리 관리 필요 → lazy-mount + close cleanup + 비활성 탭 타이머 0 규율로 대응(설계 §5-4·§7-3).
- 탭 간 CSS 격리가 iframe만큼 강하지 않음 → 탭 스코프 클래스 프리픽스(`.tabpane[data-tab]`)로 스타일 충돌 차단.
