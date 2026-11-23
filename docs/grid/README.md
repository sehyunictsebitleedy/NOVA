# NOVA Grid

2026-11-23 기준 Grid 코어 1차 구현입니다. `/grid`에서 생성 예시 데이터로 정렬·필터·편집·입출력·가상화를 직접 확인합니다. Softbowl의 제품별 설명과 데모 탐색 구조를 참고하며, 현재 소개 메인 시안은 유지합니다.

## 실행

Node.js 24 이상에서 루트 `npm.cmd ci`, `npm.cmd run dev` 후 http://127.0.0.1:4000/grid 를 엽니다. 기존 UX는 `/ux`입니다. 외부 API 키 없이 동작합니다.

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:integration
# 서버를 실행한 상태의 별도 터미널
npm.cmd run test:grid
```

브라우저 최초 설정은 `npx.cmd playwright install chromium`입니다. 다른 로컬 주소는 `$env:NOVA_TEST_URL="http://127.0.0.1:4001"`로 지정합니다. 테스트 파일과 캡처는 Git에서 제외한 `test-artifacts/grid`에 저장합니다.

## 구성

| 계층 | 위치 | 책임 |
|---|---|---|
| 데이터 엔진 | `@tanstack/vue-table`, `@tanstack/vue-virtual` | 정렬·검색·페이지·선택·열 설정·행 가상화 |
| NOVA 어댑터 | `packages/grid/shared`, `app/composables` | 열·행 계약, 값 검증, 변경분, 붙여넣기, 파일 변환 |
| Vue 렌더러 | `packages/grid/app/components/NovaGrid.vue` | 셀 편집·키보드·고정·상태·슬롯 |
| 데모 앱 | `apps/portal/app/pages/grid.vue` | 예시 데이터와 업무 시나리오, 조회 조건, 확인 대화상자 |

`@sebit-nova/grid` Layer는 기존 UX Layer를 상속하며 Portal은 Grid Layer를 상속합니다. 패키지는 내부 npm workspace로 사용하고 레지스트리에는 배포하지 않았습니다. 기술 기준은 [TanStack Vue Table](https://tanstack.com/table/v8/docs/framework/vue/vue-table)과 [Vue Virtual](https://tanstack.com/virtual/latest/docs/framework/vue/vue-virtual)입니다.

## 이번에 구현한 기능

| 기능군 | 동작 |
|---|---|
| 탐색 | 단일·Shift 다중 정렬, 전 열 검색, 부서·상태 조건, 20/50/100행 페이지, 빈 결과 |
| 편집 | 텍스트·숫자·날짜·목록·boolean 셀, 필수·형식·범위 검증, Enter 적용·Esc 취소 |
| 변경 관리 | 행 추가·선택 삭제, 추가/수정/삭제 payload, 전체 편집 되돌리기 |
| 붙여넣기 | TSV 사각형, 최대 1,000행, 읽기 전용·범위·값 검사 후 원자적 적용 |
| 열 | 표시/숨김, 마우스·터치 크기 조절, 분리선 방향키로 20px 조절, 첫 데이터 열 고정 |
| 표시 | 고정 헤더·행번호·체크 선택, 조회 금액 합계, 조건부 금액 강조, 라이트/다크 |
| 파일 | 검색·조건·정렬 결과 전체 페이지의 8개 데이터 열 CSV/Excel, Excel 검증·확인 후 전체 교체 |
| 대용량 | 생성 데이터 100,000행의 읽기 전용 행 가상화, 실제 DOM 행 수 표시 |
| 개발자 사용 | 기능별 설명, 사용 코드, 공개 API와 구현 범위 |

화살표는 셀 이동, Enter/F2 또는 더블클릭은 편집, Enter/Tab은 적용, Esc는 취소입니다. Tab으로 적용한 뒤에는 현재 셀에 포커스가 돌아갑니다. 전체 스프레드시트식 키보드 모델이나 셀 범위 복사는 후속 범위입니다. 붙여넣기는 현재 검색·정렬 순서를 따릅니다.

## 공개 계약

```ts
interface GridRecord { id: string; [key: string]: string | number | boolean | null }
interface GridChanges { inserted: GridRecord[]; updated: GridRecord[]; deleted: GridRecord[] }
```

`id`는 고유하고 안정적인 문자열이며 편집할 수 없는 열로 구성합니다. `columns`의 key도 고유해야 합니다. `GridColumn`은 text/number/date/select/boolean, required, readonly, min/max, options, width, currency/percent 표시 형식을 지원합니다. 날짜는 시간대 없는 ISO 날짜입니다. 라디오·암호·트리 등 기획의 다른 셀 유형은 추가 예정입니다.

```vue
<script setup lang="ts">
import type {GridRecord, GridColumn} from '@sebit-nova/grid/types'
const rows = ref<GridRecord[]>([{id:'TASK-001',title:'업무 점검',amount:1500000}])
const columns:GridColumn[] = [
  {key:'id',label:'ID',readonly:true},
  {key:'title',label:'업무명',required:true},
  {key:'amount',label:'금액',type:'number',min:0}
]
</script>
<template><NovaGrid v-model="rows" :columns="columns" label="업무 목록" /></template>
```

props: `virtual`, `readonly`, `pinned`, `label`, `invalidRows`. 이벤트: `selection(ids)`, `edit(id,key)`, `view(rows)`. `cell` 슬롯은 row/column/value를 받습니다. ref는 reset/resetView/clearSelection/getVisibleRows를 노출합니다. `getVisibleRows`는 현재 페이지가 아니라 검색·정렬 결과의 모든 행을 반환합니다. `getGridChanges(before,after)`는 순서 변경을 수정으로 취급하지 않습니다.

## 파일과 데이터 경계

CSV는 UTF-8 BOM·따옴표 escaping과 수식으로 해석될 수 있는 텍스트 보호를 적용합니다. ExcelJS는 필요할 때만 로드하며 숫자·문자·boolean과 헤더 스타일·고정을 내보냅니다. Excel 내보내기는 최대 10,000행입니다. 50,000행 스트리밍·수식 내보내기는 아직 지원하지 않습니다.

Excel 가져오기는 `.xlsx` 최대 5MB, 첫 시트의 데이터 10,000행·100열까지 지원합니다. 내보낸 파일과 같은 8개 열 제목이 필요합니다. 중복 ID·헤더, 잘못된 값, 수식·링크·rich text 셀은 거부합니다. 모든 행을 검증한 후 사용자가 확인하면 현재 데이터 전체를 교체하며 추가/수정/삭제 변경분에 반영합니다. 원본 파일 자체는 서버에 업로드하지 않습니다.

현재 예제는 생성한 업무 데이터이며 세션 메모리에서만 유지합니다. 새로고침·페이지 이동 시 편집이 사라집니다. 저장 버튼처럼 보이는 가짜 성공 처리는 없고, 변경분 확인만 제공합니다. Gateway 기반 서버 조회·저장과 인증된 운영 데이터 적용은 별도 계약 후 연결합니다.

## 기획과 남은 범위

이번 구현은 P3 코어 1차이며 **Must 26/26 완료가 아닙니다**. 기획의 다단 헤더·고급 캡션 메뉴, 셀/행 병합, 고정 행·푸터·소계, 추가 셀 유형, 서버 페이징·정렬·필터·저장, UX↔Grid↔Chart 연계, 실서비스 적용은 후속입니다. 트리·그룹핑·피봇·개인화·Undo/Redo·열 가상화 등 P6 항목도 남아 있습니다.

10만 행은 기능 검증용 클라이언트 생성 데이터입니다. DOM 행 제한과 마지막 행 탐색을 확인했으며 60fps, 50만 행 서버 바인딩, 50,000행 Excel 성능 목표를 달성했다는 의미는 아닙니다.

## 검증 기록

2026-11-23: Nuxt 타입 검사·프로덕션 빌드·단위 테스트 42개·기존 Nitro 통합 검증을 통과했습니다. Chromium 프로덕션 QA에서 페이징·숫자/다중 정렬·필터·텍스트/날짜/boolean/목록 편집·검증·붙여넣기·행 추가/삭제·변경분·되돌리기·열 표시/크기/고정·정렬 순서 CSV·Excel 왕복과 교체 확인을 검증했습니다. 생성 데이터 10만 행의 DOM 제한·마지막 행 탐색·검색, 여섯 화면 폭(360~1500px), 라이트/다크와 모바일 탐색도 통과했습니다. 기존 UX 20개 미리보기와 조작 회귀도 통과했습니다. Firefox/Safari·실제 Gateway 데이터·프레임 성능 수치는 검증 범위 밖입니다.
