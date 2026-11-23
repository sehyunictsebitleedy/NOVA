import type {GridColumn,GridRecord} from '@sebit-nova/grid/types'
export const gridColumns:GridColumn[]=[
  {key:'id',label:'문서 ID',readonly:true,required:true,width:150},
  {key:'title',label:'업무명',required:true,width:240},
  {key:'department',label:'부서',type:'select',required:true,options:['개발팀','디자인팀','운영팀','경영지원팀'],width:140},
  {key:'owner',label:'담당자',required:true,width:130},
  {key:'status',label:'상태',type:'select',required:true,options:['검토 대기','진행 중','승인','보류'],width:130},
  {key:'amount',label:'금액',type:'number',required:true,min:0,max:1000000000,format:'currency',width:170},
  {key:'dueDate',label:'예정일',type:'date',required:true,width:150},
  {key:'active',label:'활성',type:'boolean',required:true,width:100},
]
export function makeGridRows(count:number):GridRecord[]{
  const departments=['개발팀','디자인팀','운영팀','경영지원팀'],names=['김서연','이도현','박지우','최민준','정하은','강서준'],titles=['플랫폼 운영','디자인 시스템 정비','서비스 품질 점검','업무 자동화','고객 지원 개선','인프라 확장'],statuses=['검토 대기','진행 중','승인','보류']
  return Array.from({length:count},(_,index)=>({id:`NOVA-${String(index+1).padStart(6,'0')}`,title:`${titles[index%titles.length]} ${Math.floor(index/titles.length)+1}`,department:departments[index%4]!,owner:names[index%6]!,status:statuses[Math.floor(index/4)%4]!,amount:(150+(index*137)%1500)*10000,dueDate:`2026-12-${String(index%28+1).padStart(2,'0')}`,active:index%7!==0}))
}
export const gridFeatures=[
  {id:'basic',title:'조회와 탐색',description:'정렬과 검색으로 필요한 업무를 찾습니다. Shift를 누른 채 제목을 클릭하면 여러 열을 정렬합니다.',tags:['단일·다중 정렬','검색·조건 필터','페이지 이동','선택·합계']},
  {id:'editing',title:'데이터 편집',description:'셀 편집부터 행 추가·삭제까지. 검증된 변경분을 업무 API에 전달할 수 있는 payload로 확인합니다.',tags:['셀 검증','행 추가·삭제','표 붙여넣기','변경분 추출']},
  {id:'columns',title:'열과 스타일',description:'필요한 열만 남기고 너비를 조정하세요. 문서 ID 열과 헤더는 스크롤 중에도 고정됩니다.',tags:['열 표시','너비 조절','고정 열·헤더','조건부 스타일']},
  {id:'exchange',title:'Excel과 CSV',description:'조회 결과를 내려받고 수정한 Excel을 가져옵니다. 가져오기 전 전체 행을 검증하고 변경을 적용합니다.',tags:['CSV 내보내기','Excel 내보내기','Excel 가져오기','형식·값 검증']},
  {id:'virtual',title:'대용량 탐색',description:'브라우저에서 생성한 10만 행을 가상 스크롤로 탐색합니다. 화면 주변의 행만 DOM에 표시합니다.',tags:['100,000행 예시','행 가상화','검색·정렬','DOM 행 수 확인']},
]
