import {useVueTable,getCoreRowModel,getSortedRowModel,getFilteredRowModel,getPaginationRowModel,type ColumnDef,type SortingState,type VisibilityState,type RowSelectionState,type ColumnSizingState} from '@tanstack/vue-table'
import type {Ref} from 'vue'
import type {GridColumn,GridRecord} from '../../shared/types'

export function useNovaGridTable(data:Ref<GridRecord[]>,columns:()=>GridColumn[],virtual:()=>boolean){
  const sorting=ref<SortingState>([]),visibility=ref<VisibilityState>({}),selection=ref<RowSelectionState>({}),sizes=ref<ColumnSizingState>({}),search=ref('')
  const defs=computed<ColumnDef<GridRecord>[]>(()=>columns().map(column=>({id:column.key,accessorKey:column.key,header:column.label,size:column.width??150,minSize:90,maxSize:500,enableGlobalFilter:true,sortDescFirst:false})))
  const table=useVueTable({
    get data(){return data.value},get columns(){return defs.value},getRowId:row=>row.id,
    state:{get sorting(){return sorting.value},get columnVisibility(){return visibility.value},get rowSelection(){return selection.value},get globalFilter(){return search.value},get columnSizing(){return sizes.value}},
    onSortingChange:update=>{sorting.value=typeof update==='function'?update(sorting.value):update},
    onColumnVisibilityChange:update=>{visibility.value=typeof update==='function'?update(visibility.value):update},
    onRowSelectionChange:update=>{selection.value=typeof update==='function'?update(selection.value):update},
    onColumnSizingChange:update=>{sizes.value=typeof update==='function'?update(sizes.value):update},
    onGlobalFilterChange:update=>{search.value=typeof update==='function'?update(search.value):update},
    globalFilterFn:'includesString',columnResizeMode:'onChange',
    getCoreRowModel:getCoreRowModel(),getSortedRowModel:getSortedRowModel(),getFilteredRowModel:getFilteredRowModel(),getPaginationRowModel:getPaginationRowModel(),
    get manualPagination(){return virtual()},initialState:{pagination:{pageIndex:0,pageSize:20}},
  })
  watch(search,()=>table.setPageIndex(0))
  watch(virtual,()=>{table.setPageIndex(0);selection.value={}})
  return {table,sorting,visibility,selection,search}
}
