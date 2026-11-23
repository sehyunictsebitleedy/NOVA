<script setup lang="ts">
import {useVirtualizer} from '@tanstack/vue-virtual'
import type {GridColumn,GridRecord} from '../../shared/types'
import {parseGridValue,applyGridPaste} from '../../shared/core'
const props=withDefaults(defineProps<{columns:GridColumn[];virtual?:boolean;readonly?:boolean;label?:string;pinned?:boolean;invalidRows?:string[]}>(),{label:'데이터 그리드',pinned:true})
const model=defineModel<GridRecord[]>({required:true})
const emit=defineEmits<{selection:[ids:string[]];edit:[id:string,key:string];view:[rows:GridRecord[]]}>()
const {table,sorting,selection,search}=useNovaGridTable(model,()=>props.columns,()=>props.virtual)
const scroller=ref<HTMLElement|null>(null),root=ref<HTMLElement|null>(null)
const rows=computed(()=>table.getRowModel().rows)
const rowVirtualizer=useVirtualizer(computed(()=>({count:props.virtual?rows.value.length:0,getScrollElement:()=>scroller.value,estimateSize:()=>44,overscan:7,scrollMargin:44,initialRect:{width:1000,height:420}})))
const virtualItems=computed(()=>rowVirtualizer.value.getVirtualItems())
const visibleRows=computed(()=>props.virtual?virtualItems.value.map(item=>({row:rows.value[item.index]!,index:item.index})):rows.value.map((row,index)=>({row,index})))
const topSpace=computed(()=>props.virtual&&virtualItems.value.length?Math.max(0,virtualItems.value[0]!.start-44):0)
const bottomSpace=computed(()=>props.virtual&&virtualItems.value.length?Math.max(0,rowVirtualizer.value.getTotalSize()-(virtualItems.value.at(-1)!.end-44)):0)
const columnsVisible=computed(()=>table.getVisibleLeafColumns())
const editing=ref<{id:string;key:string}|null>(null),draft=ref(''),error=ref(''),notice=ref('')
const uid=useId(),errorId=`${uid}-cell-error`
const selectedIds=computed(()=>Object.entries(selection.value).filter(([,selected])=>selected).map(([id])=>id))
const total=computed(()=>table.getFilteredRowModel().rows.reduce((sum,row)=>sum+(Number(row.original.amount)||0),0))
watch(selectedIds,ids=>emit('selection',ids))
watch(()=>table.getSortedRowModel().rows,value=>emit('view',value.map(row=>row.original)),{immediate:true})
watch(()=>props.virtual,()=>{editing.value=null;rowVirtualizer.value.scrollToOffset(0)})
watch(()=>model.value,()=>{if(editing.value&&!model.value.some(row=>row.id===editing.value!.id))editing.value=null})
function config(key:string){return props.columns.find(column=>column.key===key)!}
function display(value:unknown,column:GridColumn){
  if(value===null||value===undefined||value==='')return '—'
  if(column.type==='boolean')return value?'예':'아니오'
  if(column.type==='number')return new Intl.NumberFormat('ko-KR',{maximumFractionDigits:2}).format(Number(value))+(column.format==='currency'?'원':column.format==='percent'?'%':'')
  return String(value)
}
function start(id:string,key:string){if(props.readonly||config(key).readonly)return;editing.value={id,key};draft.value=String(model.value.find(row=>row.id===id)?.[key]??'');error.value='';nextTick(()=>root.value?.querySelector<HTMLInputElement>('[data-editor]')?.focus())}
function cancel(){const cell=editing.value;editing.value=null;error.value='';if(cell)focusCell(cell.id,cell.key)}
function save(){
  if(!editing.value)return true
  const {id,key}=editing.value,result=parseGridValue(draft.value,config(key))
  if(result.error){error.value=result.error;return false}
  model.value=model.value.map(row=>row.id===id?{...row,[key]:result.value}:row)
  emit('edit',id,key);editing.value=null;error.value='';notice.value=`${config(key).label}을(를) 변경했습니다.`;focusCell(id,key);return true
}
function focusCell(id:string,key:string){nextTick(()=>root.value?.querySelector<HTMLElement>(`[data-row-id="${CSS.escape(id)}"][data-column="${CSS.escape(key)}"]`)?.focus())}
function navigate(event:KeyboardEvent,id:string,key:string){
  if(editing.value)return
  if(event.key==='Enter'||event.key==='F2'){event.preventDefault();start(id,key);return}
  const rowIndex=rows.value.findIndex(row=>row.id===id),columnIndex=columnsVisible.value.findIndex(column=>column.id===key)
  let nextRow=rowIndex,nextColumn=columnIndex
  if(event.key==='ArrowDown')nextRow++;else if(event.key==='ArrowUp')nextRow--;else if(event.key==='ArrowLeft')nextColumn--;else if(event.key==='ArrowRight')nextColumn++;else return
  event.preventDefault();const row=rows.value[nextRow],column=columnsVisible.value[nextColumn]
  if(!row||!column)return
  if(props.virtual)rowVirtualizer.value.scrollToIndex(nextRow)
  focusCell(row.id,column.id)
}
function paste(event:ClipboardEvent,id:string,key:string){
  if(props.readonly||editing.value)return
  event.preventDefault();const ordered=table.getSortedRowModel().rows.map(row=>row.original)
  const result=applyGridPaste(ordered,id,key,event.clipboardData?.getData('text/plain')??'',columnsVisible.value.map(column=>config(column.id)))
  if(result.error){notice.value=result.error;return}
  const changed=new Map(result.rows.map(row=>[row.id,row]));model.value=model.value.map(row=>changed.get(row.id)??row);notice.value='붙여넣기를 적용했습니다.'
}
function resize(key:string,event:MouseEvent|TouchEvent){table.getHeaderGroups()[0]?.headers.find(header=>header.column.id===key)?.getResizeHandler()(event)}
function clearSelection(){table.resetRowSelection()}
function reset(){notice.value='';search.value='';table.resetSorting();table.resetColumnVisibility();table.resetColumnSizing();table.setPageIndex(0);clearSelection();cancel()}
function resetView(){table.setPageIndex(0);scroller.value?.scrollTo({top:0})}
defineExpose({reset,resetView,clearSelection,getVisibleRows:()=>table.getSortedRowModel().rows.map(row=>row.original)})
</script>

<template>
  <div ref="root" class="nova-grid">
    <div class="ng-tools"><label :for="`${uid}-search`">표 검색</label><input :id="`${uid}-search`" v-model="search" type="search" placeholder="모든 열에서 검색" /><details class="ng-column-menu"><summary>열 표시</summary><div><label v-for="column in table.getAllLeafColumns()" :key="column.id"><input type="checkbox" :checked="column.getIsVisible()" :disabled="column.getIsVisible()&&columnsVisible.length===1" @change="column.toggleVisibility()" />{{config(column.id).label}}</label><button type="button" @click="table.resetColumnSizing()">열 너비 초기화</button></div></details><button type="button" @click="reset">보기 초기화</button><span>{{selectedIds.length}}행 선택</span></div>
    <p class="ng-help">{{readonly?'읽기 전용':'더블클릭 또는 Enter로 편집 · Enter 적용 · Esc 취소 · 방향키 이동 · 셀에 표 형식 붙여넣기'}} · Shift + 제목 클릭: 다중 정렬</p>
    <div ref="scroller" class="ng-scroll" tabindex="0" :aria-label="`${label} 스크롤 영역`">
      <table role="grid" :aria-label="label" :aria-rowcount="table.getFilteredRowModel().rows.length+1" :aria-colcount="columnsVisible.length+2" :aria-readonly="readonly" :style="{width:`${table.getTotalSize()+94}px`}">
        <thead><tr role="row"><th class="ng-select" scope="col"><input type="checkbox" aria-label="현재 페이지 전체 선택" :checked="table.getIsAllPageRowsSelected()" :indeterminate="table.getIsSomePageRowsSelected()" @change="table.toggleAllPageRowsSelected()" /></th><th scope="col" class="ng-number">번호</th><th v-for="(column,index) in columnsVisible" :key="column.id" scope="col" :class="{pinned:pinned&&index===0}" :style="{width:column.getSize()+'px'}" :aria-sort="column.getIsSorted()==='asc'?'ascending':column.getIsSorted()==='desc'?'descending':'none'"><button type="button" :aria-label="`${config(column.id).label} 정렬`" @click="column.toggleSorting(undefined,$event.shiftKey)">{{config(column.id).label}}<span aria-hidden="true">{{column.getIsSorted()==='asc'?' ▲':column.getIsSorted()==='desc'?' ▼':' ↕'}}</span></button><span role="separator" tabindex="0" aria-orientation="vertical" :aria-label="`${config(column.id).label} 열 너비`" :aria-valuenow="column.getSize()" :aria-valuemin="90" :aria-valuemax="500" class="ng-resizer" @mousedown="resize(column.id,$event)" @touchstart="resize(column.id,$event)" @keydown.left.prevent="table.setColumnSizing(old=>({...old,[column.id]:Math.max(90,column.getSize()-20)}))" @keydown.right.prevent="table.setColumnSizing(old=>({...old,[column.id]:Math.min(500,column.getSize()+20)}))" /></th></tr></thead>
        <tbody>
          <tr v-if="topSpace" aria-hidden="true" class="ng-spacer"><td :colspan="columnsVisible.length+2" :style="{height:topSpace+'px'}" /></tr>
          <tr v-for="{row,index} in visibleRows" :key="row.id" :aria-rowindex="(virtual?index:table.getState().pagination.pageIndex*table.getState().pagination.pageSize+index)+2" :aria-selected="row.getIsSelected()" :class="{selected:row.getIsSelected(),invalid:invalidRows?.includes(row.id)}" data-grid-row>
            <td class="ng-select"><input type="checkbox" :aria-label="`${row.id} 행 선택`" :checked="row.getIsSelected()" @change="row.toggleSelected()" /></td><td class="ng-number">{{(virtual?index:table.getState().pagination.pageIndex*table.getState().pagination.pageSize+index)+1}}</td>
            <td v-for="(cell,cellIndex) in row.getVisibleCells()" :key="cell.id" :data-row-id="row.id" :data-column="cell.column.id" :class="{pinned:pinned&&cellIndex===0,numeric:config(cell.column.id).type==='number'}" tabindex="0" :aria-label="`${config(cell.column.id).label}: ${display(cell.getValue(),config(cell.column.id))}`" @dblclick="start(row.id,cell.column.id)" @keydown="navigate($event,row.id,cell.column.id)" @paste="paste($event,row.id,cell.column.id)">
              <div v-if="editing?.id===row.id&&editing.key===cell.column.id" class="ng-edit" @keydown.stop @keydown.esc.prevent="cancel" @keydown.enter.prevent="save" @keydown.tab.prevent="save">
                <select v-if="config(cell.column.id).type==='select'||config(cell.column.id).type==='boolean'" v-model="draft" data-editor :aria-label="`${config(cell.column.id).label} 편집`" :aria-invalid="!!error" :aria-describedby="error?errorId:undefined"><option v-for="option in config(cell.column.id).type==='boolean'?['true','false']:config(cell.column.id).options" :key="option" :value="option">{{option==='true'?'예':option==='false'?'아니오':option}}</option></select>
                <input v-else v-model="draft" data-editor :type="config(cell.column.id).type==='number'?'number':config(cell.column.id).type==='date'?'date':'text'" :aria-label="`${config(cell.column.id).label} 편집`" :aria-invalid="!!error" :aria-describedby="error?errorId:undefined" />
              </div><slot v-else name="cell" :row="row.original" :column="config(cell.column.id)" :value="cell.getValue()"><span :class="{'ng-status':cell.column.id==='status','ng-over-budget':cell.column.id==='amount'&&Number(cell.getValue())>=10000000}">{{display(cell.getValue(),config(cell.column.id))}}</span></slot>
            </td>
          </tr>
          <tr v-if="bottomSpace" aria-hidden="true" class="ng-spacer"><td :colspan="columnsVisible.length+2" :style="{height:bottomSpace+'px'}" /></tr>
          <tr v-if="!rows.length"><td :colspan="columnsVisible.length+2" class="ng-empty">조건에 맞는 데이터가 없습니다.</td></tr>
        </tbody>
      </table>
    </div>
    <div v-if="editing" class="ng-edit-actions"><span>셀 편집 중</span><button type="button" @click="save">편집 적용</button><button type="button" @click="cancel">편집 취소</button><p v-if="error" :id="errorId" role="alert">{{error}}</p></div>
    <div class="ng-footer"><span>조회 {{table.getFilteredRowModel().rows.length.toLocaleString()}} / 전체 {{model.length.toLocaleString()}}행</span><span v-if="columns.some(c=>c.key==='amount')">조회 금액 합계 <strong>{{total.toLocaleString('ko-KR')}}원</strong></span><span v-if="virtual">행 가상화 · DOM {{visibleRows.length}}행</span><div v-else class="ng-pagination"><label :for="`${uid}-size`">페이지 크기</label><select :id="`${uid}-size`" :value="table.getState().pagination.pageSize" @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"><option :value="20">20행</option><option :value="50">50행</option><option :value="100">100행</option></select><button type="button" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">이전</button><span>{{table.getState().pagination.pageIndex+1}} / {{Math.max(1,table.getPageCount())}}</span><button type="button" :disabled="!table.getCanNextPage()" @click="table.nextPage()">다음</button></div></div>
    <p class="ng-notice" role="status">{{notice}}</p>
  </div>
</template>
<style src="../assets/css/grid.css"></style>
