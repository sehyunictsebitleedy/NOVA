# NOVA Chart 도입 마이그레이션 프로그램 — 기획서

> 대상: Nexus · Sentinel · API-On 3개 서비스의 **손코딩 SVG 대시보드 + 선언만 하고 안 쓰는 echarts**를
> **NOVA Chart(ECharts 6.0 등록형 래퍼)** 로 대체.
> ⛔ 이 문서 = 무엇을·왜·범위·WBS·수용기준·리스크(planner 소관). **구조/코드/아키텍처/패키지 API 결정은 architect 소관** — 여기서 정하지 않는다.
> 근거: 실코드 grep·Read (기준시각 2026-07-29) + `nova-viz-asset-inventory.md` + 메모리 `project_nova_platform`(D5 ECharts6.0·D8 GH Packages)·`feedback_optimize_no_regression`.
> 작성: planner. main 검증 후 사용자 보고 → 착수는 NOVA Chart 실물 존재(P1) 후.

---

## 1. 무엇을 · 왜

**무엇** — Nexus·Sentinel·API-On 3개 플래그십이 대시보드 시각화를 (a) **손으로 짠 인라인 SVG**(도넛·라인·시계열)로 그리고, (b) 동시에 `package.json`엔 **echarts를 선언만 하고 app에서 단 1건도 안 쓴다**. 이 이중 부채를 NOVA Chart 단일 엔진으로 흡수한다.

**왜** — 실코드로 확인된 3가지 실제 문제:
1. **유지보수 부채**: 도넛 세그먼트·임계선·듀얼스케일 시계열을 손 SVG path 산술로 구현 → 다크/라이트 테마·접근성(alt)·반응형을 서비스마다 각자 재구현. (SEbit 메타룰 §0 "공통으로 관리" 위반 상태)
2. **죽은 의존성**: echarts 5.6 + vue-echarts 7이 3 서비스에 설치돼 있으나 렌더 0건 → 번들·설치 낭비 + 버전 파편화의 원인.
3. **버전 파편화**: ECharts 6.0(Origin/PROVE 계열, NOVA 正本) vs 5.6(이 3 서비스). NOVA 확정 D5=6.0 → 통일 대상.

**근거(실코드 실측 2026-07-29)**:
- 3 서비스 `app/` 내 `VChart|vue-echarts` 렌더 = **0건** (grep count 0/0/0).
- `package.json`: Nexus echarts `^5.6.0`/vue-echarts `^7.0.3`, Sentinel `^5.6.0`/`^7.0.0`, API-On `^5.6.0`/`^7.0.3`. (正本: Origin/PROVE = `^6.0.0`/`^8.0.1`)

---

## 2. 부채 대상 전수 목록 (파일:라인 — 실코드 확정)

### 2-A. 데이터 차트 SVG (마이그레이션 1순위 = 이번 프로그램 핵심 대상)

| # | 서비스 | 파일:라인 | 차트 성격 | NOVA Chart 치환(방향만·구현=architect) | 인벤토리 |
|---|---|---|---|---|---|
| C1 | Sentinel | `app/pages/dashboard/index.vue:485-497` | 애니메이션 도넛(원인별 분포). `<circle>` stroke-dasharray 세그먼트 + cubic-bezier 순차(idx*0.15s) + hover 굵기 | pie/donut | ✅ 수록 |
| C2 | Sentinel | `app/pages/cases/trends.vue:245-274` | 라인 + min/max 임계선(dashed 2,1) + 그리드 + hover | line + markLine | ✅ 수록 |
| C3 | API-On | `app/pages/sla.vue:344-385` | 듀얼스케일 2계열 시계열(req `--nx-primary`/err `--nx-danger`) + Y그리드 + data point circle | line 2계열 | ✅ 수록 |
| C4 | **Nexus** | `app/pages/index.vue:335-343` | **트래픽 area 라인**(`chartPath` fill=gradient + `chartLine`), linearGradient(0.3→0.02) | area line | ⛔ **인벤토리 누락** |
| C5 | **API-On** | `app/pages/index.vue:620-628` | **트래픽 area 라인**(C4와 동일 패턴·동일 gradient id `trafficGrad`) | area line | ⛔ **인벤토리 누락** |

> ⛔ 발견: 인벤토리는 C1~C3만 수록. **C4·C5(대시보드 홈의 트래픽 area 라인)는 실코드에 존재하나 인벤토리 미수록** → 이번 전수조사에서 추가 확정. Nexus·API-On의 홈 대시보드가 동일 손코딩 area 라인을 각자 보유(복제 패턴).

### 2-B. 그래프/토폴로지 SVG (⚠️ 별도 클래스 — 이번 핵심 범위 밖, 3-2 참조)

| 서비스 | 파일:라인 | 성격 |
|---|---|---|
| Nexus | `app/pages/index.vue:437-465` | 노드 토폴로지 그래프(900x400, glow filter, animated edge) |
| API-On | `app/pages/index.vue:770-798` | 노드 토폴로지 그래프(Nexus와 동일 패턴) |
| Sentinel | `app/pages/monitoring/threads.vue:405,481` | 도메인 상세 + 전체 흐름 토폴로지(glow, edge) |

> 이들은 데이터 차트가 아니라 **노드/인과 토폴로지**(Vue Flow/ECharts-graph 영역). 인벤토리 §4-D는 이 계열을 NOVA **차별화 축**으로 분류. 손 SVG→ECharts graph 이관 여부는 별도 판단 → **이번 프로그램 코어 미포함**, research 재확인 후 별건 상정 권고.

### 2-C. 죽은 의존성 (선언만·미사용 — 부채 해소 대상)

| 서비스 | 선언 | app 사용 | 조치(방향만) |
|---|---|---|---|
| Nexus | echarts `^5.6.0` + vue-echarts `^7.0.3` | 0건 | NOVA Chart 도입 후 직접 선언 제거(6.0은 NOVA Chart 경유) |
| Sentinel | echarts `^5.6.0` + vue-echarts `^7.0.0` | 0건 | 동일 |
| API-On | echarts `^5.6.0` + vue-echarts `^7.0.3` | 0건 | 동일 |

> ⛔ 제거 vs NOVA Chart transitive 유지의 최종 방식 = architect 결정(peerDependency 여부 등).

### 2-D. 손대지 않는 것 (범위 밖 — 명확히 제외)

| 대상 | 파일 | 제외 사유 |
|---|---|---|
| Vue Flow 노드 에디터 | Nexus `flow-builder/index.vue`, API-On `designer/index.vue` | 차트 아님·差별화 자산(§4-D) |
| 로그인 장식 SVG | 3 서비스 `login.vue` | 로고/배경 장식, 차트 아님 |
| Origin/PROVE/PROVES | — | 이미 ECharts 6.0(正本)·이번 대상 아님 |
| Stock/Canvas | `SkEquityChart`·`CanvasChartWrapper` | echarts 5.6 **실사용 중** → 이번 프로그램 밖(3-2 별건 통일) |

### ⚠️ research 재확인 권고 (불명확분)
- **인벤토리 stale**: 인벤토리는 Nexus 손 SVG 라인을 `monitor/index.vue`(reqPath/errPath)로 인용했으나, 현 실코드 `monitor/index.vue`엔 해당 chart SVG **없음**(grep 0). 실제 Nexus 트래픽 라인 = `index.vue:335-343`(C4). → 인벤토리 citation 교정 필요. 착수 전 research가 Nexus monitor 페이지 현 상태 1회 재확인.
- **API-On `.npmrc` 부재**: Nexus·Sentinel은 `@sebit-ai-infra` GH Packages `.npmrc` 보유, **API-On은 없음**. Phase A에서 추가 필요.

---

## 3. 범위 (하는 것 / 안 하는 것)

### 3-1. 하는 것
- C1~C5 데이터 차트 SVG **5건**을 NOVA Chart로 대체 (Sentinel 2·API-On 2·Nexus 1).
- 3 서비스의 죽은 echarts 5.6/vue-echarts 7 선언 정리(2-C).
- 3 서비스 ECharts 6.0 통일(NOVA Chart 경유).
- API-On `.npmrc`(GH Packages) 추가.

### 3-2. 안 하는 것 (경계)
- **통합 데모/워크스페이스 빌드와 분리** — 이 프로그램 ⊂ NOVA, 통합데모(`nova-integrated-workspace`)는 **별개 진행**. 여기선 운영 3 서비스 부채 해소만.
- **토폴로지/그래프 SVG(2-B)** — 별도 클래스, research 재확인 후 별건.
- **Stock·Canvas echarts 5.6 통일** — 실사용 중이라 회귀 위험 별도. 이번 밖, 향후 별건 통일.
- **Origin 대시보드 실연결** — OriginChart 래퍼 미연결은 별도 이슈(인벤토리 §5).
- **NOVA Chart 자체 설계·구현** — architect/frontend 소관. 이 문서는 "대체 프로그램"만.

### 3-3. ⛔ 실행 선행 조건 (게이트)
- **NOVA Chart 컴포넌트 실물이 GH Packages로 소비 가능한 상태**여야 착수(Phase B). 현재 `SEbit-NOVA` 레포·`packages/chart` **미존재**(P1 pending 실측 확인). → Phase A가 절대 선행.

---

## 4. WBS (⛔ 순서 = ① NOVA Chart 소비가능화 선행 → ② 서비스 교체 → ③ 검증)

### Phase A — NOVA Chart 소비가능화 (선행 블로커, NOVA P1 의존)
| Step | 내용 | 완료 판정 |
|---|---|---|
| A1 | NOVA Chart 패키지 실물(`SEbit-NOVA/packages/chart`)에 C1~C5 대응 차트타입(area line·line+markLine·donut·2계열 line) + 테마 동기화 + alt 계약 확보 | NOVA Portal에서 5 유형 렌더 확인(architect/frontend 산출·planner 범위 아님) |
| A2 | GH Packages npm publish(D8) — `@sebit-ai-infra/nova-chart`[추정 정식명=architect] 게시 | `npm view` 조회 성공 |
| A3 | 3 서비스 소비 배선: API-On `.npmrc` 추가(Nexus/Sentinel은 보유 확인), 3 서비스 의존성 추가 | 3 서비스 각각 `npm i @sebit-ai-infra/nova-chart` 성공 + 최소 1차트 렌더 스모크 통과 |

> ⛔ A 미완 시 B 착수 금지. NOVA Chart 실물 없이 SVG 삭제 = 화면 사망.

### Phase B — 서비스별 교체 (A 완료 후·서비스 간 독립·병렬 가능)
| Step | 대상 | 교체 | 완료 판정 |
|---|---|---|---|
| B0(파일럿) | Nexus C4 (트래픽 area 라인, 최단순) | area line 1건으로 NOVA Chart 계약 E2E 검증 | before/after 시각 동등 + 회귀0 계측 통과 → 계약 확정 |
| B1 | Sentinel C1·C2 | 도넛(순차 애니 튜닝) + 라인+임계선 | 2차트 시각 동등 + 회귀0 + echarts 5.6 선언 제거 |
| B2 | API-On C3·C5 | 듀얼스케일 시계열 + 트래픽 area | 2차트 시각 동등 + 회귀0 + `.npmrc` 반영 + echarts 5.6 제거 |
| B3 | Nexus 마무리 | C4 정식 반영 + echarts 5.6 제거 | 회귀0 + 선언 제거 |

> B0을 파일럿으로 먼저 돌려 NOVA Chart 소비 계약(테마 CSS변수 매핑·SSR 가드·크기)을 1건으로 확정한 뒤 B1~B3 확산 권고(리스크↓). 서비스 간엔 의존성 없음(독립 커밋·독립 배포).

### Phase C — 통합 검증 (전 서비스 교체 후)
| Step | 내용 | 완료 판정 |
|---|---|---|
| C1v | 시각 동등 계측 | 5차트 전부 before/after Playwright 스크린샷(다크+라이트) 대조 통과 |
| C2v | 회귀 0 | 타 페이지·타 서비스 무영향 + 빌드·린트·테스트 통과(3 서비스) |
| C3v | 부채 해소 확인 | 3 서비스 손 SVG 차트 0건(grep) + echarts 5.6 선언 0건 + ECharts 6.0(NOVA Chart 경유) 통일 |
| C4v | 접근성 | NOVA Chart alt 계약 노출 확인(손 SVG엔 없던 개선) |

---

## 5. 수용 기준 (⛔ 검증 가능 — feedback_optimize_no_regression)

| # | 기준 | 판정 방법 |
|---|---|---|
| S1 | **시각 동등** | 5차트 각각 동일 데이터·동일 테마(다크/라이트)에서 교체 전/후 Playwright 스크린샷 대조 — 형태·색·라벨·임계선/기준선 동일 |
| S2 | **회귀 0** | 같은 입력→같은 출력. 교체 페이지의 타 위젯·타 페이지·타 서비스 무영향. 3 서비스 빌드·린트·`test:run` 통과 |
| S3 | **손코딩 SVG 해소** | 3 서비스 `app/pages`에서 데이터 차트용 인라인 SVG(`chartPath`/`chartLine`/도넛 dasharray/임계선 path) grep 0건 (토폴로지 2-B 제외) |
| S4 | **죽은 의존성 해소** | 3 서비스 `package.json`에서 직접 echarts 5.6/vue-echarts 7 선언 제거(또는 NOVA Chart transitive로 일원화) — 실사용 6.0 단일 |
| S5 | **버전 6.0 통일** | 최종 렌더 엔진 = ECharts 6.0(NOVA Chart 경유). `npm ls echarts` 6.x 단일 |
| S6 | **접근성 개선** | NOVA Chart alt 계약이 5차트에 적용(손 SVG엔 부재하던 접근성 확보) |

---

## 6. 리스크 · 영향

| 리스크 | 영향 | 완화 |
|---|---|---|
| **NOVA Chart 실물 미존재**(P1 pending·실측 `SEbit-NOVA` 없음) | Phase B 착수 불가 = 프로그램 최대 블로커 | Phase A 절대 선행. A 완료 게이트 전 B 금지 |
| **테마 CSS변수 매핑**(C3·C4·C5가 `--nx-primary`/`--nx-danger` 사용) | 색 불일치 시 시각 동등 실패 | NOVA Chart 테마 동기화(Canvas `CanvasChartWrapper` prior art) 소비 계약을 B0 파일럿에서 확정 |
| **도넛 순차 애니(C1 cubic-bezier idx*0.15s)** | ECharts animationDelay로 재현 시 미세 차이 | S1 시각 동등에서 애니 종료 상태 기준 대조(움직임 완전동일은 비목표·정직) |
| **인벤토리 stale**(Nexus monitor citation 오류) | 잘못된 파일 수정 위험 | 착수 전 research 1회 재확인(4-2 권고) |
| **API-On `.npmrc` 부재** | GH Packages 설치 실패 | A3에서 추가(Nexus/Sentinel 패턴 복사) |
| **3 서비스 운영 배포**(IDC Docker) | 교체 후 재배포 필요 | 서비스별 독립 커밋·독립 배포. 배포 전 3요소 보고+승인(CLAUDE.md 룰) |
| **롤백** | NOVA Chart 결함 시 | 서비스별 독립 커밋 → 해당 커밋 원복으로 손 SVG 복귀. B0 파일럿으로 조기 감지 |
| **테스트 범위** | 교체 페이지 외 회귀 | S2에 타 페이지/타 서비스 회귀 포함. Playwright before/after 필수 |

---

## 7. 범위 경계 (재확인)

```
[NOVA 프로그램군]
 ├─ NOVA Chart 설계/구현 .............. architect·frontend (P1, 별건)
 ├─ 통합 데모/워크스페이스 빌드 ......... 별건 진행 (이 프로그램 아님)
 └─ ★이 프로그램 = NOVA Chart 도입 마이그레이션★
      └─ Nexus·Sentinel·API-On 손 SVG 5건(C1~C5) + 죽은 echarts 정리
         (실행 = NOVA Chart 실물 존재 후 = Phase A 게이트)
```

- 이 프로그램 ⊂ NOVA. 통합데모와 **분리**.
- Stock/Canvas(실사용 5.6)·Origin/PROVE(正本 6.0)·토폴로지 SVG·Vue Flow = **범위 밖**.
- 구조/코드/패키지 API/의존성 처리방식 = **architect 결정**(이 문서 미정).

---

## 8. 결정이 필요한 것 (사용자/후속 게이트)

| # | 항목 | 선택지 | 추천 |
|---|---|---|---|
| Q1 | 착수 시점 | (a) NOVA P1(Chart 실물) 완료 즉시 / (b) 통합데모 마무리 후 | **(a)** — 프로그램은 P1 게이트에만 의존, 통합데모와 독립 |
| Q2 | 죽은 echarts 처리 | (a) 직접 선언 제거+NOVA Chart transitive / (b) peerDependency 유지 | architect 위임(구조결정) — planner 미정 |
| Q3 | 토폴로지 SVG(2-B) | (a) 이번 제외·별건 / (b) 함께 ECharts graph 이관 | **(a)** — 차별화 축·리스크 분리, research 재확인 후 별건 |

---

## Sources (실코드 실측 2026-07-29)
- `SEbit-Nexus/package.json`, `app/pages/index.vue:335-343,437-465`, `monitor/index.vue`(chart SVG 0 확인), `.npmrc`(@sebit-ai-infra 보유)
- `SEbit-Sentinel/package.json`, `app/pages/dashboard/index.vue:485-497`, `cases/trends.vue:245-274`, `monitoring/threads.vue:405,481`, `.npmrc`(보유)
- `SEbit-API-On/package.json`, `app/pages/sla.vue:344-385`, `app/pages/index.vue:620-628,770-798`, `.npmrc`(부재 확인)
- 대조: `nova-viz-asset-inventory.md`(§0 선언만·§4-B 손SVG·버전파편화), 메모리 `project_nova_platform`(D5 6.0·D8 GH Packages·P1 pending), `feedback_optimize_no_regression`
