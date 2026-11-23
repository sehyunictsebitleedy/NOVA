# NOVA UX

Nuxt Layer `@sebit-nova/ux`가 제공하는 공통 UI와 `/ux` 기능 갤러리입니다. 2026-11-15 기준 필수 19종의 기본 기능과 TabWorkspace를 구현했습니다. Nuxt UI v4를 기반으로 구성하며, 기존 HTML 시안의 모든 변형이나 업무 화면 전체를 이식한 상태는 아닙니다.

## 사이트 구조 기준

2026-11-15 사용자 지정 기준: [Softbowl](https://www.softbowl.co.kr/front/main.do). 제품별 소개와 데모 진입 구조를 NOVA의 기본 정보 구조로 삼는다. UX 세부 개발자 동선은 연결된 [SBUx](https://sbux.co.kr/)의 튜토리얼·API가이드·Demo 분리도 참고한다.

- NOVA 소개 → NOVA UX / Chart / Grid 제품 선택 → 제품 설명 → 기능 데모·사용법·API로 이어진다.
- 제품 소개에는 역할을 설명하는 짧은 문장, 대표 기능, 실제 화면, 데모 진입을 배치한다.
- UX 기능 화면은 카테고리와 검색으로 탐색하고, 기능별 실제 예제·코드·props를 같은 위치에서 확인한다. 변형은 각 기능의 하위 예제로 확장한다.
- 현재 `/ux`는 기능 데모 영역이다. 제품 개요·시작하기·가이드 등은 후속 확장 범위이며 구현 완료로 표기하지 않는다.
- 다음 개발 순서는 UX 기능과 변형 보강 → 업무 화면에서 조합 검증 → Chart·Grid이다. 메인 시안 수정은 뒤로 둔다.
- NOVA의 Vue/Nuxt 기반, 브랜드와 문구를 유지한다. 참고 사이트의 고객사·인증·성능 수치를 NOVA의 사실로 사용하지 않는다.

## 실행과 확인

루트에서 `npm.cmd ci`, `npm.cmd run dev` 후 http://127.0.0.1:4000/ux 를 엽니다. 외부 API 키는 필요하지 않습니다. 검색·분류 목록에서 컴포넌트를 선택하면 실제 미리보기, 사용 코드, 공개 props를 확인할 수 있습니다. 선택 경로는 `/ux?component=workspace`처럼 공유할 수 있습니다. `GET /api/ux/components`는 같은 카탈로그를 반환합니다.

## 구현 범위

| 분류 | 컴포넌트 | 기본 동작 |
|---|---|---|
| 기본 | Button | 스타일 4종, 로딩, 비활성, 제출·초기화·링크 |
| 입력 | Input, Textarea | 양방향 바인딩, FormField 연결, 제출 시 스키마 검증, 글자 수 제한 |
| 입력 | Select, RadioGroup | 단일·다중 선택, 비활성 항목 |
| 입력 | Checkbox, Switch | 선택·부분 선택, 토글 |
| 입력 | DatePicker | 단일 날짜·기간, ISO 문자열 모델, 최소·최대 날짜 |
| 입력 | FileUpload | 단일·다중·드롭존·이미지 선택, 형식·개수·크기 검증 |
| 탐색 | Dropdown, Tabs | 메뉴 선택·분할 버튼, 콘텐츠 탭·상태 유지 |
| 탐색 | Menu, SideMenu, Breadcrumb | 상단·측면·경로 탐색, 실제 링크 |
| 탐색 | Tree, Accordion | 계층 선택·전파, 여러 항목 펼치기 |
| 피드백 | Alert, Modal, Progress | 상태 알림·닫기, 대화상자·포커스 복귀, 확정·불확정 진행 |
| 업무 | TabWorkspace | 화면 열기·중복 방지·고정·닫기·순서 변경·구성 복원 |

`NovaFormField`는 19종에 추가된 폼 레이블·설명·오류 연결용 보조 컴포넌트입니다. 공유 소스는 `packages/ux/app/components`, 화면별 예제는 `apps/portal/app/components/ux`에 있습니다.

## Layer 사용

Portal의 `nuxt.config.ts`처럼 `extends: ['@sebit-nova/ux']`로 상속하면 `Nova*` 컴포넌트를 자동으로 사용할 수 있습니다. 루트는 `<UApp>`으로 감싸고 한국어 로케일은 `@sebit-nova/ux/locale`의 `ko`를 전달합니다. 현재는 내부 workspace이며 패키지 레지스트리에는 배포하지 않았습니다.

```vue
<script setup lang="ts">
const enabled = ref(true)
const active = ref('home')
const screens = [{id:'home',label:'홈'},{id:'draft',label:'작성'}]
</script>
<template>
  <NovaSwitch v-model="enabled" label="업무 알림" />
  <NovaTabWorkspace v-model="active" :items="screens" :initial-ids="['home','draft']" storage-key="my-workspace-v1">
    <template #content="{item}"><MyScreen :key="item.id" :screen-id="item.id" /></template>
  </NovaTabWorkspace>
</template>
```

## TabWorkspace 계약

항목의 `id`는 고유하고 안정적인 값이어야 합니다. 기본 홈 ID는 `home`이며 홈은 닫거나 이동할 수 없습니다. 고정한 탭은 닫기에서 보호되고, 고정 그룹 안에서만 순서를 바꿀 수 있습니다. 마우스 드래그, 우클릭 메뉴, Alt+좌우 방향키로 순서를 변경합니다. 좌우/Home/End로 활성 탭 이동, Delete로 닫기가 가능합니다.

`content` 슬롯 내부 상태는 탭 전환 중 유지되지만 닫으면 사라집니다. `storage-key`를 지정하면 열린 ID·고정·순서·활성 ID만 localStorage에 복원합니다. 각 인스턴스에는 서로 다른 키를 사용하세요. 입력값·업무 데이터는 저장하지 않습니다. 저장소 오류나 알 수 없는 ID는 기본값으로 정리합니다. 노출 메서드는 `open(id)`, `close(id)`, `reset()`입니다.

## 경계

파일 컴포넌트는 브라우저 파일 선택기입니다. 파일을 서버로 전송하지 않으며 운영 업로드에는 서버 검증·저장 API가 추가로 필요합니다. 폼·메뉴·데모 데이터도 외부 시스템에 저장하지 않습니다. 날짜는 시간대가 없는 ISO 날짜로 취급합니다. Chart·Grid 전용 Vue 구현과 Hub 로그인은 후속 작업입니다.

`npm.cmd test`는 파일 정책과 워크스페이스 상태 규칙 및 기존 서버 테스트를 실행합니다. `npm.cmd run typecheck`, `npm.cmd run build`, 빌드 후 `npm.cmd run test:integration`으로 타입·서버 경계를 확인합니다.

브라우저 회귀 검사는 서버 실행 후 별도 터미널에서 `npm.cmd run test:ux`로 실행합니다. 최초 1회 `npx.cmd playwright install chromium`이 필요할 수 있습니다. 다른 포트는 `$env:NOVA_TEST_URL="http://127.0.0.1:4001"`로 지정합니다. 검사는 별도 브라우저에서 파일 fixture와 로컬 탭 설정을 사용하며 스크린샷은 무시된 `test-artifacts/ux`에 저장합니다.

## 검증 기록

2026-11-15: 타입 검사, 단위 테스트 30개, 프로덕션 빌드, Nitro/upstream 통합 테스트 통과. Chromium에서 20개 미리보기와 폼·선택·날짜·트리·파일·모달 포커스·탭 상태·복원·검색·코드/API 및 360~1440px 여섯 너비를 검증했습니다. 최종 선택 탭/버튼의 글자 대비를 보정하고 재빌드 및 색상·화면 확인을 완료했습니다. Firefox·Safari와 실제 외부 서비스는 검증하지 않았습니다.
