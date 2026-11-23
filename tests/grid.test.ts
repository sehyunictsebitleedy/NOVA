import {describe,it,expect} from 'vitest'
import {parseGridValue,getGridChanges,applyGridPaste,gridCsv} from '../packages/grid/shared/core'
import {exportGridExcel,importGridExcel} from '../packages/grid/shared/exchange'
import type {GridColumn,GridRecord} from '../packages/grid/shared/types'
const columns:GridColumn[]=[{key:'id',label:'ID',readonly:true,required:true},{key:'name',label:'이름',required:true},{key:'amount',label:'금액',type:'number',required:true,min:0,max:100},{key:'date',label:'날짜',type:'date',required:true},{key:'active',label:'활성',type:'boolean',required:true}]
const initial:GridRecord[]=[{id:'a',name:'첫 행',amount:10,date:'2026-12-01',active:false},{id:'b',name:'둘째 행',amount:20,date:'2026-12-02',active:true}]
describe('Grid value contracts',()=>{
  it('rejects missing, nonfinite and out-of-bounds numeric values',()=>{for(const value of ['', 'NaN', 'Infinity','-1','101'])expect(parseGridValue(value,columns[2]!).error).toBeTruthy();expect(parseGridValue('0',columns[2]!)).toEqual({value:0})})
  it('validates actual calendar days rather than a date-shaped string',()=>{expect(parseGridValue('2026-02-30',columns[3]!).error).toBeTruthy();expect(parseGridValue('2028-02-29',columns[3]!)).toEqual({value:'2028-02-29'})})
  it('keeps false and rejects unrecognized booleans and select options',()=>{expect(parseGridValue(false,columns[4]!)).toEqual({value:false});expect(parseGridValue('yes',columns[4]!).error).toBeTruthy();expect(parseGridValue('unknown',{key:'s',label:'상태',type:'select',options:['승인']}).error).toBeTruthy()})
})
describe('Grid change protocol',()=>{
  it('separates insert/update/delete independent of order',()=>{const current=[{...initial[1]!,amount:30},{...initial[0]!,id:'c'}];expect(getGridChanges(initial,current)).toEqual({inserted:[current[1]],updated:[current[0]],deleted:[initial[0]]});expect(getGridChanges(initial,[...initial].reverse())).toEqual({inserted:[],updated:[],deleted:[]})})
  it('reverted edits and inserted-then-deleted rows produce no changes',()=>{expect(getGridChanges(initial,initial.map(row=>({...row})))).toEqual({inserted:[],updated:[],deleted:[]})})
})
describe('Grid clipboard transaction',()=>{
  it('applies a rectangle by stable row ID without mutating original rows',()=>{const result=applyGridPaste(initial,'a','name','새 이름\t30\n다음 이름\t40',columns);expect(result.error).toBeUndefined();expect(result.rows[0]?.name).toBe('새 이름');expect(result.rows[1]?.amount).toBe(40);expect(initial[0]?.name).toBe('첫 행')})
  it('rejects the entire rectangle if any value is invalid',()=>{const result=applyGridPaste(initial,'a','name','변경\t30\n오류\t-1',columns);expect(result.rows).toBe(initial);expect(result.error).toContain('2행')})
  it('protects read-only columns and forbids clipping outside the data',()=>{expect(applyGridPaste(initial,'a','id','changed',columns).error).toContain('읽기 전용');expect(applyGridPaste(initial,'b','name','a\nb',columns).error).toContain('벗어납니다')})
})
describe('Grid spreadsheet exchange',()=>{
  it('escapes quotes/newlines and neutralizes formula text in CSV while preserving numeric negatives',()=>{const text=gridCsv([{id:'a',name:'=SUM(1,2)',amount:-10},{id:'b',name:'a"b\nc',amount:0}],columns.slice(0,3));expect(text.startsWith('\uFEFF')).toBe(true);expect(text).toContain('"\'=SUM(1,2)"');expect(text).toContain('"-10"');expect(text).toContain('"a""b\nc"')})
  it('round-trips validated Excel values and preserves booleans',async()=>{const blob=await exportGridExcel(initial,columns);const rows=await importGridExcel(new File([blob],'roundtrip.xlsx'),columns);expect(rows).toEqual(initial)})
  it('rejects file types and oversize exports before processing',async()=>{await expect(importGridExcel(new File(['x'],'bad.csv'),columns)).rejects.toThrow('.xlsx');await expect(exportGridExcel(Array.from({length:10001},()=>initial[0]!),columns)).rejects.toThrow('10,000')})
  it('rejects invalid or duplicate Excel IDs without partially importing',async()=>{const duplicate=await exportGridExcel([initial[0]!,initial[0]!],columns);await expect(importGridExcel(new File([duplicate],'bad.xlsx'),columns)).rejects.toThrow('고유한')})
})
