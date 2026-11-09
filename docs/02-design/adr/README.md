# NOVA 통합 워크스페이스 — Architecture Decision Records

> 결정의 근거를 코드 옆에 박제한다("왜 이렇게 했지?"에 답하기 위해). 포맷 = Nygard 경량(Context·Decision·Alternatives Considered[기각사유]·Consequences). 표준 = `SEbit-Creator/docs/templates/ADR.md` · 스킬 `sebit-adr`.
> 대상 설계: `../nova-integrated-workspace-design.md`

## 인덱스

| ADR | 제목 | 상태 | 날짜 |
|---|---|---|---|
| [001](001-multitab-workspace-vs-single-dashboard.md) | 멀티탭 워크스페이스 vs 단일 대시보드 | accepted | 2026-07-29 |
| [002](002-gnb-category-nova-product-mapping.md) | GNB 카테고리 ↔ NOVA 제품 매핑 & 범위 현실화 | accepted | 2026-07-29 |
| [003](003-tab-render-mechanism.md) | 탭 렌더 방식 (iframe vs 컴포넌트 vs 링크) | accepted | 2026-07-29 |
| [004](004-real-korea-boundary-map.md) | 대한민국 지도 (실경계 vs 저폴리곤/헥스) | accepted | 2026-07-29 |
| [005](005-tabworkspace-nova-ux-flagship.md) | 탭 워크스페이스 = NOVA UX 간판 기능 (`TabWorkspace`) | accepted | 2026-07-29 |
| [006](006-nova-chart-harvest-differentiation-svg-debt.md) | NOVA Chart 코어 하베스트 + 차별화 시각화 3종 + 손코딩 SVG 부채 커버 | accepted | 2026-07-29 |

## 관계

- ADR-001은 이전 설계 `../nova-integrated-demo-design.md`의 **범위(단일 대시보드 압축) 결정을 supersede**. 이전 설계의 위젯·크로스필터·원장 등 상세는 유효(ADR-001에서 T1 탭으로 편입).
- ADR-004는 이전 설계 §1 결정 C-1/C-2(저해상 path + 헥스 폴백)를 **supersede**(사용자 명시 기각).
- ADR-005는 ADR-002의 **셸 제품 귀속(NOVA UI=셸)** 중 **층③ 멀티탭 바 부분을 NOVA UX `TabWorkspace`로 refine**(부분 정밀화·supersede 아님). ADR-002 카테고리 매핑·범위 현실화는 전부 유효. 근거 = 분석 §1-6(탭=UX 제품 컴포넌트)·§2-c(Chart 채움).
- ADR-006은 ADR-005 §3-5(데이터 시각화 = NOVA Chart 채움)를 **코어(A CanvasChartWrapper 하베스트)·커버리지(B ECharts 6.0)·부채(C 손코딩 SVG 커버 요구)·차별화(D 실운영 3종 T15~T17)** 4축으로 **refine**(부분 정밀화·supersede 아님). ADR-002 카테고리 매핑도 유효(③에 차별화 3탭 additive). 근거 = Track C 하베스트 카탈로그 `../../01-plan/nova-viz-asset-inventory.md`(§1-8 코어·§4-D 차별화·§4-B 부채, 실코드 파일:라인).
