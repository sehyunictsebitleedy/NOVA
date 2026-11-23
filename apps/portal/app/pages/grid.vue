<script setup lang="ts">
import type {GridRecord,GridChanges} from '@sebit-nova/grid/types'
import {getGridChanges,gridCsv,parseGridValue} from '@sebit-nova/grid/core'
import {gridColumns,gridFeatures,makeGridRows} from '../data/grid-demo'
useSeoMeta({title:'NOVA Grid | 데이터 업무를 다루는 표',description:'NOVA Grid의 정렬·검색·편집·Excel 입출력·가상 스크롤을 실제 Vue 예제로 확인하세요.'})
const {theme,toggleTheme}=useNovaTheme(),route=useRoute(),router=useRouter()
const active=computed(()=>gridFeatures.find(feature=>feature.id===route.query.feature)??gridFeatures[0]!)
const featureSearch=ref(''),sidebarOpen=ref(false)
const features=computed(()=>gridFeatures.filter(feature=>`${feature.title} ${feature.tags.join(' ')}`.toLowerCase().includes(featureSearch.value.trim().toLowerCase())))
const data=shallowRef<GridRecord[]>(makeGridRows(120)),original=shallowRef<GridRecord[]>(data.value),selected=ref<string[]>([])
const department=ref('전체'),status=ref('전체'),virtual=ref(false),busy=ref(false),message=ref(''),dataset=ref('120'),pinned=ref(true)
const grid=ref<{reset:()=>void;resetView:()=>void;clearSelection:()=>void;getVisibleRows:()=>GridRecord[]}|null>(null)
const displayed=computed({get:()=>data.value.filter(row=>(department.value==='전체'||row.department===department.value)&&(status.value==='전체'||row.status===status.value)),set:(rows:GridRecord[])=>{const updated=new Map(rows.map(row=>[row.id,row]));data.value=data.value.map(row=>updated.get(row.id)??row)}})
const changes=computed(()=>getGridChanges(original.value,data.value))
const dirty=computed(()=>changes.value.inserted.length+changes.value.updated.length+changes.value.deleted.length)
const invalidRows=computed(()=>data.value.filter(row=>gridColumns.some(column=>parseGridValue(row[column.key],column).error)).map(row=>row.id))
const tabs=[{label:'미리보기',value:'preview'},{label:'사용 코드',value:'code'},{label:'API · 구현 범위',value:'api'}],view=ref<string|number>('preview')
const payloadOpen=ref(false),deleteOpen=ref(false),resetOpen=ref(false),importOpen=ref(false),imported=shallowRef<GridRecord[]>([]),fileInput=ref<HTMLInputElement|null>(null)
const code=`<script setup lang="ts">\nimport type { GridRecord, GridColumn } from '@sebit-nova/grid/types'\nimport { getGridChanges } from '@sebit-nova/grid/core'\nconst rows = ref<GridRecord[]>([\n  { id: 'NOVA-001', title: '서비스 점검', amount: 1500000 }\n])\nconst columns: GridColumn[] = [\n  { key: 'id', label: '문서 ID', readonly: true },\n  { key: 'title', label: '업무명', required: true },\n  { key: 'amount', label: '금액', type: 'number', min: 0 }\n]\n<\/script>\n<template>\n  <NovaGrid v-model="rows" :columns="columns" label="업무 목록"\n    @selection="ids => console.log(ids)" />\n</template>\n\n// Layer: extends: ['@sebit-nova/grid']\n// 대용량 탐색: :virtual="true" :readonly="true"\n// 변경분: getGridChanges(originalRows, rows.value)`
async function choose(id:string){
  if((id==='virtual')!==virtual.value && dirty.value && !window.confirm('샘플 전환 시 현재 편집 내용이 사라집니다. 전환할까요?'))return
  await router.replace({query:{feature:id}});view.value='preview';sidebarOpen.value=false
  if(id==='virtual'&&!virtual.value)await load('100000')
  if(id!=='virtual'&&virtual.value)await load('120')
}
async function load(value:string){
  busy.value=true;message.value='샘플 데이터를 준비하고 있습니다.'
  await new Promise(resolve=>setTimeout(resolve,20))
  const rows=makeGridRows(Number(value));data.value=rows;original.value=rows;virtual.value=value==='100000';dataset.value=value;department.value='전체';status.value='전체';selected.value=[]
  grid.value?.reset();busy.value=false;message.value=`${rows.length.toLocaleString()}행의 생성 예시 데이터를 불러왔습니다. 실서버 조회가 아닙니다.`
}
async function changeDataset(event:Event){const value=(event.target as HTMLSelectElement).value;if(dirty.value&&!window.confirm('샘플 전환 시 현재 편집 내용이 사라집니다. 전환할까요?')){(event.target as HTMLSelectElement).value=dataset.value;return}await load(value)}
onMounted(()=>{if(active.value.id==='virtual')load('100000')})
watch([department,status],()=>{selected.value=[];grid.value?.clearSelection();grid.value?.resetView()})
let nextDraftId=1
function add(){
  let id:string;do{id=`NEW-${String(nextDraftId++).padStart(6,'0')}`}while(data.value.some(row=>row.id===id))
  data.value=[{id,title:'새 업무',department:'개발팀',owner:'담당자',status:'검토 대기',amount:0,dueDate:'2026-12-01',active:true},...data.value]
  department.value='전체';status.value='전체';grid.value?.reset();message.value='새 행을 추가했습니다. 업무명을 더블클릭해 편집하세요.'
}
function remove(){const ids=new Set(selected.value);data.value=data.value.filter(row=>!ids.has(row.id));grid.value?.clearSelection();deleteOpen.value=false;message.value=`${ids.size}행을 삭제했습니다. 변경분에서 삭제 목록을 확인하세요.`}
function resetEdits(){data.value=original.value;grid.value?.reset();selected.value=[];resetOpen.value=false;message.value='편집 내용을 초기 데이터로 되돌렸습니다.'}
function payload(){if(invalidRows.value.length){message.value='잘못된 값이 있는 행을 수정해 주세요.';return}payloadOpen.value=true}
const payloadText=computed(()=>JSON.stringify(changes.value,null,2))
async function copyPayload(){try{await navigator.clipboard.writeText(payloadText.value);message.value='변경분 JSON을 복사했습니다.'}catch{message.value='복사 권한을 확인하거나 JSON을 직접 선택해 주세요.'}}
function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function exportFile(format:'csv'|'xlsx'){
  if(busy.value)return
  busy.value=true
  try{const rows=grid.value?.getVisibleRows()??displayed.value;if(format==='csv')download(new Blob([gridCsv(rows,gridColumns)],{type:'text/csv;charset=utf-8'}),'nova-grid.csv');else{const {exportGridExcel}=await import('@sebit-nova/grid/exchange');download(await exportGridExcel(rows,gridColumns),'nova-grid.xlsx')}message.value=`조회 결과 ${rows.length.toLocaleString()}행을 ${format.toUpperCase()}로 내보냈습니다.`}catch(error){message.value=error instanceof Error?error.message:'내보내지 못했습니다.'}finally{busy.value=false}
}
async function importFile(event:Event){
  const input=event.target as HTMLInputElement,file=input.files?.[0];input.value='';if(!file)return
  busy.value=true
  try{const {importGridExcel}=await import('@sebit-nova/grid/exchange');imported.value=await importGridExcel(file,gridColumns);importOpen.value=true;message.value='파일 검증을 완료했습니다. 적용 전에 교체 내용을 확인하세요.'}catch(error){message.value=error instanceof Error?error.message:'파일을 가져오지 못했습니다.'}finally{busy.value=false}
}
function applyImport(){data.value=imported.value;virtual.value=false;dataset.value='import';department.value='전체';status.value='전체';grid.value?.reset();importOpen.value=false;message.value=`검증한 ${data.value.length}행으로 현재 데이터를 교체했습니다. 서버에는 저장하지 않았습니다.`}
</script>

<template>
  <div class="grid-portal" @keydown.esc="sidebarOpen=false">
    <a class="skip" href="#grid-main">본문으로 이동</a>
    <header class="gp-header"><NuxtLink to="/" class="brand" aria-label="NOVA 소개 사이트"><span>SEbit</span>NOVA<i aria-hidden="true">✳</i></NuxtLink><nav aria-label="제품 탐색"><NuxtLink to="/ux">UX</NuxtLink><NuxtLink to="/grid" aria-current="page">Grid</NuxtLink></nav><button class="gp-theme" :aria-label="`${theme==='dark'?'라이트':'다크'} 모드로 변경`" @click="toggleTheme">{{theme==='dark'?'라이트':'다크'}}</button><button class="gp-mobile" :aria-expanded="sidebarOpen" aria-controls="grid-sidebar" @click="sidebarOpen=!sidebarOpen">기능 목록</button></header>
    <div class="gp-layout">
      <aside id="grid-sidebar" class="gp-sidebar" :class="{open:sidebarOpen}"><p class="gp-product">NOVA Grid</p><label for="grid-feature-search">기능 검색</label><input id="grid-feature-search" v-model="featureSearch" type="search" placeholder="예: 편집, Excel" /><nav aria-label="Grid 기능"><button v-for="feature in features" :key="feature.id" :class="{active:active.id===feature.id}" :aria-current="active.id===feature.id?'page':undefined" @click="choose(feature.id)">{{feature.title}}</button><p v-if="!features.length">검색 결과가 없습니다.</p></nav><div class="gp-sidebar-note"><strong>Vue 3 / Nuxt</strong><p>TanStack Table + Virtual</p><p>공통 API로 업무 화면에 연결합니다.</p></div></aside>
      <main id="grid-main" class="gp-main"><div class="gp-title"><p>제품 / NOVA Grid / {{active.title}}</p><h1>데이터 업무를 다루는 표</h1><p>찾고, 고치고, 내보내는 흐름을 하나로.</p></div>
        <section class="gp-feature"><h2>{{active.title}}</h2><p>{{active.description}}</p><ul><li v-for="tag in active.tags" :key="tag">{{tag}}</li></ul></section>
        <NovaTabs v-model="view" :items="tabs"><template #default="{item}">
          <div v-if="item.value==='preview'" class="gp-preview">
            <div class="gp-workbench"><div><h3>업무 현황</h3><p>생성 예시 데이터 · 브라우저 내부 편집</p></div><label>데이터 규모<select :value="dataset" :disabled="busy" @change="changeDataset"><option value="120">120행</option><option value="1000">1,000행</option><option value="100000">100,000행 · 읽기 전용</option><option v-if="dataset==='import'" value="import">가져온 데이터</option></select></label></div>
            <div class="gp-filters"><label>부서<select v-model="department" aria-label="부서 필터"><option>전체</option><option v-for="option in gridColumns.find(c=>c.key==='department')!.options" :key="option">{{option}}</option></select></label><label>상태<select v-model="status" aria-label="상태 필터"><option>전체</option><option v-for="option in gridColumns.find(c=>c.key==='status')!.options" :key="option">{{option}}</option></select></label><label class="gp-toggle"><input v-model="pinned" type="checkbox" />문서 ID 열 고정</label></div>
            <div class="gp-actions"><button :disabled="busy||virtual" @click="add">행 추가</button><button :disabled="busy||virtual||!selected.length" @click="deleteOpen=true">선택 삭제</button><button :disabled="busy||!dirty" @click="payload">변경분 확인 <span>{{dirty}}</span></button><button :disabled="busy||!dirty" @click="resetOpen=true">편집 되돌리기</button><div class="gp-export"><button :disabled="busy" @click="exportFile('csv')">CSV 내보내기</button><button :disabled="busy" @click="exportFile('xlsx')">Excel 내보내기</button><button :disabled="busy||virtual" @click="fileInput?.click()">Excel 가져오기</button><input ref="fileInput" class="sr-only" type="file" accept=".xlsx" aria-label="Excel 파일 선택" @change="importFile" /></div></div>
            <div :aria-busy="busy" class="gp-grid-wrap"><div v-if="busy" class="gp-busy" role="status">데이터를 처리하고 있습니다…</div><NovaGrid ref="grid" v-model="displayed" :columns="gridColumns" :virtual="virtual" :readonly="virtual||busy" :pinned="pinned" :invalid-rows="invalidRows" label="NOVA 업무 목록" @selection="selected=$event" /></div>
            <p class="gp-message" role="status">{{message||'예시 금액이 1,000만원 이상인 셀은 강조 표시합니다.'}}</p><div class="gp-contract"><span>추가 <strong>{{changes.inserted.length}}</strong></span><span>수정 <strong>{{changes.updated.length}}</strong></span><span>삭제 <strong>{{changes.deleted.length}}</strong></span><p>페이지를 이동하거나 새로고침하면 편집 내용이 사라집니다. 실제 저장 API는 연결 전입니다.</p></div>
            <p class="gp-limit">내보내기는 필터·검색·정렬을 적용한 모든 페이지의 8개 데이터 열입니다. Excel은 최대 10,000행, 가져오기는 .xlsx 5MB까지 지원합니다. 10만 행 모드는 기능 확인용이며 60fps 성능 인증을 의미하지 않습니다.</p>
          </div>
          <div v-else-if="item.value==='code'" class="gp-doc"><h3>Nuxt Layer로 연결하기</h3><p>앱에서 @sebit-nova/grid를 상속하면 NovaGrid가 자동 등록됩니다.</p><pre><code>{{code}}</code></pre></div>
          <div v-else class="gp-doc"><h3>NovaGrid 공개 API</h3><div class="gp-api-scroll"><table><thead><tr><th>이름</th><th>계약</th></tr></thead><tbody><tr><td>v-model</td><td>GridRecord[] · 고유한 문자열 id 필수</td></tr><tr><td>columns</td><td>GridColumn[] · key, label, type, required, readonly, min/max, options, width, format</td></tr><tr><td>virtual / readonly / pinned</td><td>행 가상화 / 편집 제한 / 첫 데이터 열 고정</td></tr><tr><td>label / invalidRows</td><td>접근성 이름 / 오류가 있는 행 ID 목록</td></tr><tr><td>@selection / @edit / @view</td><td>선택 ID[] / 변경된 id·key / 검색·정렬 결과 행[]</td></tr><tr><td>#cell</td><td>row, column, value를 받는 표시용 슬롯</td></tr><tr><td>ref 메서드</td><td>reset, resetView, clearSelection, getVisibleRows</td></tr><tr><td>getGridChanges(before, after)</td><td>{ inserted, updated, deleted } · 전송·저장은 호출 앱의 책임</td></tr></tbody></table></div><h3>이번 구현과 다음 단계</h3><p>현재: 클라이언트 조회·편집·검증·열 설정·Excel/CSV·행 가상화. 데이터 엔진 → NOVA 어댑터 → Vue 렌더러로 분리했습니다.</p><p>후속: Gateway 기반 서버 조회·저장, 다단 헤더·병합, 고정 행·소계, 트리·그룹핑·피봇, Chart 연동, 운영 데이터 적용과 성능 실측. 기획의 Must 26종 전체 완료 단계는 아닙니다.</p></div>
        </template></NovaTabs>
      </main>
    </div>
    <NovaModal v-model:open="payloadOpen" title="변경분 확인" description="서버에 전달할 변경분 구조입니다. 이 화면에서는 저장 요청을 보내지 않습니다." size="lg"><pre class="gp-payload">{{payloadText}}</pre><template #footer><NovaButton label="JSON 복사" @click="copyPayload" /><NovaButton label="닫기" variant="outline" @click="payloadOpen=false" /></template></NovaModal>
    <NovaModal v-model:open="deleteOpen" title="선택 행 삭제" :description="`선택한 ${selected.length}행을 현재 데이터에서 삭제합니다. 편집 되돌리기로 복구할 수 있습니다.`"><template #footer><NovaButton label="취소" variant="outline" @click="deleteOpen=false" /><NovaButton label="삭제 적용" @click="remove" /></template></NovaModal>
    <NovaModal v-model:open="resetOpen" title="편집 되돌리기" description="추가·수정·삭제한 모든 내용을 처음 불러온 데이터로 되돌립니다."><template #footer><NovaButton label="취소" variant="outline" @click="resetOpen=false" /><NovaButton label="되돌리기 적용" @click="resetEdits" /></template></NovaModal>
    <NovaModal v-model:open="importOpen" title="Excel 가져오기 확인" :description="`검증한 ${imported.length}행으로 현재 데이터 전체를 교체합니다. 기존 편집 내용은 교체되고 변경분에 반영됩니다.`"><p>첫 업무: {{imported[0]?.title}}</p><p>기존 {{data.length.toLocaleString()}}행 → 가져온 {{imported.length.toLocaleString()}}행</p><template #footer><NovaButton label="취소" variant="outline" @click="importOpen=false" /><NovaButton label="데이터 교체" @click="applyImport" /></template></NovaModal>
  </div>
</template>
<style src="../assets/css/grid-portal.css"></style>
