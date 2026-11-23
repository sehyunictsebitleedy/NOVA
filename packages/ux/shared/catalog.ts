export interface NovaUxEntry { id:string; name:string; title:string; category:string; description:string; supportsDisabled:boolean; component:string; props:{name:string;type:string;description:string}[]; code:string }
export const NOVA_UX_CATALOG: NovaUxEntry[] = [
  {
    "id": "workspace",
    "name": "TabWorkspace",
    "title": "멀티탭 워크스페이스",
    "category": "탐색",
    "description": "열기·전환·닫기·고정·순서 이동과 브라우저 탭 구성 복원.",
    "supportsDisabled": false,
    "component": "NovaTabWorkspace",
    "props": [
      {
        "name": "items",
        "type": "{ id, label, disabled? }[]",
        "description": "열 수 있는 화면 목록"
      },
      {
        "name": "v-model",
        "type": "string",
        "description": "활성 화면 ID"
      },
      {
        "name": "home-id",
        "type": "string",
        "description": "닫을 수 없는 기본 화면"
      },
      {
        "name": "storage-key",
        "type": "string?",
        "description": "탭 구성 저장 키"
      }
    ],
    "code": "<NovaTabWorkspace v-model=\"active\" :items=\"screens\" storage-key=\"my-workspace\">\n  <template #content=\"{ item }\">{{ item.label }}</template>\n</NovaTabWorkspace>"
  },
  {
    "id": "button",
    "name": "Button",
    "title": "버튼",
    "category": "기본",
    "description": "클릭·제출·초기화·링크와 로딩·비활성 상태.",
    "supportsDisabled": true,
    "component": "NovaButton",
    "props": [
      {
        "name": "label",
        "type": "string",
        "description": "버튼 이름"
      },
      {
        "name": "variant",
        "type": "solid | outline | soft | ghost",
        "description": "표현 방식"
      },
      {
        "name": "loading",
        "type": "boolean",
        "description": "진행 중 상태"
      },
      {
        "name": "to",
        "type": "string?",
        "description": "이동할 경로"
      },
      {
        "name": "type",
        "type": "button | submit | reset",
        "description": "네이티브 버튼 동작"
      }
    ],
    "code": "<NovaButton label=\"저장\" :loading=\"saving\" @click=\"save\" />"
  },
  {
    "id": "input",
    "name": "Input",
    "title": "입력·폼 검증",
    "category": "입력",
    "description": "텍스트·이메일 입력과 스키마 검증 오류 연결.",
    "supportsDisabled": true,
    "component": "NovaInput",
    "props": [
      {
        "name": "v-model",
        "type": "string",
        "description": "입력값"
      },
      {
        "name": "type",
        "type": "text | email | password | search",
        "description": "입력 형식"
      },
      {
        "name": "placeholder",
        "type": "string",
        "description": "입력 예시"
      },
      {
        "name": "readonly / disabled",
        "type": "boolean",
        "description": "읽기 전용·비활성화"
      }
    ],
    "code": "<NovaFormField label=\"이름\" name=\"name\" required>\n  <NovaInput v-model=\"name\" />\n</NovaFormField>"
  },
  {
    "id": "textarea",
    "name": "Textarea",
    "title": "여러 줄 입력",
    "category": "입력",
    "description": "여러 줄 입력과 최대 글자 수 제한.",
    "supportsDisabled": true,
    "component": "NovaTextarea",
    "props": [
      {
        "name": "v-model",
        "type": "string",
        "description": "입력값"
      },
      {
        "name": "rows",
        "type": "number",
        "description": "기본 줄 수"
      },
      {
        "name": "maxlength",
        "type": "number",
        "description": "최대 글자 수"
      }
    ],
    "code": "<NovaTextarea v-model=\"memo\" :maxlength=\"200\" />"
  },
  {
    "id": "select",
    "name": "Select",
    "title": "단일·다중 선택",
    "category": "입력",
    "description": "단일 선택과 검색 가능한 체크형 다중 선택.",
    "supportsDisabled": true,
    "component": "NovaSelect",
    "props": [
      {
        "name": "v-model",
        "type": "string | string[]",
        "description": "선택 값"
      },
      {
        "name": "items",
        "type": "{ label, value, disabled? }[]",
        "description": "선택 항목"
      },
      {
        "name": "multiple",
        "type": "boolean",
        "description": "다중 선택 여부"
      },
      {
        "name": "placeholder",
        "type": "string",
        "description": "선택 안내"
      }
    ],
    "code": "<NovaSelect v-model=\"departments\" :items=\"options\" multiple placeholder=\"부서 선택\" />"
  },
  {
    "id": "radio",
    "name": "RadioGroup",
    "title": "라디오 그룹",
    "category": "입력",
    "description": "하나의 값만 고르는 선택 그룹.",
    "supportsDisabled": true,
    "component": "NovaRadioGroup",
    "props": [
      {
        "name": "v-model",
        "type": "string",
        "description": "선택 값"
      },
      {
        "name": "items",
        "type": "{ label, value }[]",
        "description": "선택 항목"
      },
      {
        "name": "legend",
        "type": "string",
        "description": "그룹 이름"
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "description": "배치"
      }
    ],
    "code": "<NovaRadioGroup v-model=\"priority\" legend=\"우선순위\" :items=\"options\" />"
  },
  {
    "id": "checkbox",
    "name": "Checkbox",
    "title": "체크박스",
    "category": "입력",
    "description": "참·거짓·부분 선택과 폼 연결.",
    "supportsDisabled": true,
    "component": "NovaCheckbox",
    "props": [
      {
        "name": "v-model",
        "type": "boolean | 'indeterminate'",
        "description": "체크 상태"
      },
      {
        "name": "label",
        "type": "string",
        "description": "선택 항목 이름"
      },
      {
        "name": "required",
        "type": "boolean",
        "description": "필수 항목"
      }
    ],
    "code": "<NovaCheckbox v-model=\"agreed\" label=\"안내를 확인했습니다\" />"
  },
  {
    "id": "switch",
    "name": "Switch",
    "title": "스위치",
    "category": "입력",
    "description": "설정의 켜짐·꺼짐을 전환.",
    "supportsDisabled": true,
    "component": "NovaSwitch",
    "props": [
      {
        "name": "v-model",
        "type": "boolean",
        "description": "켜짐 여부"
      },
      {
        "name": "label",
        "type": "string",
        "description": "설정 이름"
      },
      {
        "name": "description",
        "type": "string",
        "description": "설정 설명"
      }
    ],
    "code": "<NovaSwitch v-model=\"enabled\" label=\"알림 받기\" />"
  },
  {
    "id": "date",
    "name": "DatePicker",
    "title": "날짜·기간 선택",
    "category": "입력",
    "description": "단일 날짜와 시작·종료 날짜 범위 선택.",
    "supportsDisabled": true,
    "component": "NovaDatePicker",
    "props": [
      {
        "name": "v-model",
        "type": "string | { start?, end? }",
        "description": "ISO 날짜 값"
      },
      {
        "name": "range",
        "type": "boolean",
        "description": "기간 선택 모드"
      },
      {
        "name": "min / max",
        "type": "string?",
        "description": "선택할 수 있는 날짜 경계"
      },
      {
        "name": "reference-date",
        "type": "string?",
        "description": "처음 표시할 월의 기준 날짜"
      }
    ],
    "code": "<NovaDatePicker v-model=\"period\" range min=\"2026-11-01\" max=\"2026-12-31\" reference-date=\"2026-11-14\" />"
  },
  {
    "id": "upload",
    "name": "FileUpload",
    "title": "파일 선택",
    "category": "입력",
    "description": "단일·다중·드롭존·이미지 선택과 크기·형식 검증. 서버 전송 없음.",
    "supportsDisabled": true,
    "component": "NovaFileUpload",
    "props": [
      {
        "name": "v-model",
        "type": "File[]",
        "description": "선택된 로컬 파일"
      },
      {
        "name": "multiple",
        "type": "boolean",
        "description": "여러 파일 선택"
      },
      {
        "name": "accept",
        "type": "string",
        "description": "MIME 또는 확장자"
      },
      {
        "name": "max-bytes / max-files",
        "type": "number",
        "description": "파일 크기·개수 제한"
      },
      {
        "name": "dropzone / preview",
        "type": "boolean",
        "description": "끌어놓기·미리보기"
      }
    ],
    "code": "<NovaFileUpload v-model=\"files\" accept=\".txt,.csv\" :max-bytes=\"5 * 1024 * 1024\" />"
  },
  {
    "id": "dropdown",
    "name": "Dropdown",
    "title": "드롭다운·스플릿 버튼",
    "category": "탐색",
    "description": "기본 작업과 추가 작업을 선택.",
    "supportsDisabled": true,
    "component": "NovaDropdown",
    "props": [
      {
        "name": "items",
        "type": "DropdownMenuItem[]",
        "description": "작업 목록과 onSelect"
      },
      {
        "name": "label",
        "type": "string",
        "description": "트리거 이름"
      },
      {
        "name": "split",
        "type": "boolean",
        "description": "기본 동작과 메뉴 분리"
      },
      {
        "name": "@action",
        "type": "event",
        "description": "스플릿 기본 동작"
      }
    ],
    "code": "<NovaDropdown label=\"저장\" :items=\"actions\" split @action=\"save\" />"
  },
  {
    "id": "tabs",
    "name": "Tabs",
    "title": "콘텐츠 탭",
    "category": "탐색",
    "description": "같은 화면 안의 콘텐츠 전환과 키보드 이동.",
    "supportsDisabled": false,
    "component": "NovaTabs",
    "props": [
      {
        "name": "v-model",
        "type": "string | number",
        "description": "활성 항목"
      },
      {
        "name": "items",
        "type": "TabsItem[]",
        "description": "value·label·content"
      },
      {
        "name": "#default",
        "type": "{ item }",
        "description": "직접 콘텐츠 구성"
      }
    ],
    "code": "<NovaTabs v-model=\"active\" :items=\"tabs\">\n  <template #default=\"{ item }\">{{ item.content }}</template>\n</NovaTabs>"
  },
  {
    "id": "menu",
    "name": "Menu",
    "title": "상단 메뉴",
    "category": "탐색",
    "description": "계층형 메뉴와 실제 섹션 이동.",
    "supportsDisabled": false,
    "component": "NovaMenu",
    "props": [
      {
        "name": "items",
        "type": "NavigationMenuItem[]",
        "description": "메뉴 목록"
      },
      {
        "name": "orientation",
        "type": "horizontal | vertical",
        "description": "배치"
      },
      {
        "name": "label",
        "type": "string",
        "description": "접근성 이름"
      }
    ],
    "code": "<NovaMenu :items=\"menuItems\" label=\"업무 메뉴\" />"
  },
  {
    "id": "sidemenu",
    "name": "SideMenu",
    "title": "사이드 메뉴",
    "category": "탐색",
    "description": "업무 영역과 하위 메뉴를 탐색.",
    "supportsDisabled": false,
    "component": "NovaSideMenu",
    "props": [
      {
        "name": "items",
        "type": "NavigationMenuItem[]",
        "description": "메뉴·하위 항목"
      },
      {
        "name": "label",
        "type": "string",
        "description": "메뉴 영역 이름"
      }
    ],
    "code": "<NovaSideMenu :items=\"menuItems\" label=\"내 업무\" />"
  },
  {
    "id": "breadcrumb",
    "name": "Breadcrumb",
    "title": "현재 위치",
    "category": "탐색",
    "description": "현재 화면의 위치와 상위 화면 이동.",
    "supportsDisabled": false,
    "component": "NovaBreadcrumb",
    "props": [
      {
        "name": "items",
        "type": "BreadcrumbItem[]",
        "description": "label·to 항목"
      }
    ],
    "code": "<NovaBreadcrumb :items=\"[{ label: 'UX', to: '/ux' }, { label: '현재 위치' }]\" />"
  },
  {
    "id": "tree",
    "name": "Tree",
    "title": "체크박스 트리",
    "category": "탐색",
    "description": "계층 펼치기·다중 선택·부모와 자식 선택 연결.",
    "supportsDisabled": true,
    "component": "NovaTree",
    "props": [
      {
        "name": "v-model",
        "type": "TreeItem[]",
        "description": "선택한 노드"
      },
      {
        "name": "items",
        "type": "TreeItem[]",
        "description": "고유 id·label·children"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "description": "조작 비활성화"
      }
    ],
    "code": "<NovaTree v-model=\"selectedNodes\" :items=\"treeItems\" />"
  },
  {
    "id": "accordion",
    "name": "Accordion",
    "title": "아코디언",
    "category": "표시",
    "description": "항목별 펼치기와 단일·다중 열기.",
    "supportsDisabled": true,
    "component": "NovaAccordion",
    "props": [
      {
        "name": "v-model",
        "type": "string | string[]",
        "description": "열린 항목"
      },
      {
        "name": "items",
        "type": "AccordionItem[]",
        "description": "value·label·content"
      },
      {
        "name": "multiple",
        "type": "boolean",
        "description": "여러 항목 펼치기"
      }
    ],
    "code": "<NovaAccordion v-model=\"opened\" :items=\"items\" multiple />"
  },
  {
    "id": "alert",
    "name": "Alert",
    "title": "상태 알림",
    "category": "피드백",
    "description": "안내·성공·주의·오류와 닫기.",
    "supportsDisabled": false,
    "component": "NovaAlert",
    "props": [
      {
        "name": "title / description",
        "type": "string",
        "description": "알림 내용"
      },
      {
        "name": "color",
        "type": "info | success | warning | error",
        "description": "상태"
      },
      {
        "name": "v-model:open",
        "type": "boolean",
        "description": "표시 상태"
      },
      {
        "name": "dismissible",
        "type": "boolean",
        "description": "닫기 허용"
      }
    ],
    "code": "<NovaAlert v-model:open=\"visible\" title=\"선택을 확인했습니다\" color=\"success\" dismissible />"
  },
  {
    "id": "modal",
    "name": "Modal",
    "title": "대화상자",
    "category": "피드백",
    "description": "세 가지 크기·포커스 보호·Escape 닫기.",
    "supportsDisabled": false,
    "component": "NovaModal",
    "props": [
      {
        "name": "v-model:open",
        "type": "boolean",
        "description": "열림 상태"
      },
      {
        "name": "title / description",
        "type": "string",
        "description": "접근성 제목·설명"
      },
      {
        "name": "size",
        "type": "sm | md | lg",
        "description": "크기"
      },
      {
        "name": "#default / #footer",
        "type": "slot",
        "description": "본문·하단 동작"
      }
    ],
    "code": "<NovaModal v-model:open=\"open\" title=\"변경 확인\" description=\"변경 내용을 확인합니다.\" size=\"md\">\n  <p>본문</p>\n</NovaModal>"
  },
  {
    "id": "progress",
    "name": "Progress",
    "title": "진행 상태",
    "category": "피드백",
    "description": "정해진 진행률과 불확정 진행 상태.",
    "supportsDisabled": false,
    "component": "NovaProgress",
    "props": [
      {
        "name": "v-model",
        "type": "number | null",
        "description": "진행률·불확정 상태"
      },
      {
        "name": "max",
        "type": "number",
        "description": "최댓값"
      },
      {
        "name": "label",
        "type": "string",
        "description": "접근성 이름"
      }
    ],
    "code": "<NovaProgress v-model=\"progress\" label=\"처리 진행률\" />"
  }
]
