import type {GridColumn, GridRecord, GridChanges, GridValue} from './types'

export function parseGridValue(raw: unknown, column: GridColumn): {value:GridValue;error?:string} {
  const text=String(raw??'').trim()
  if(column.required && text==='')return {value:null,error:`${column.label}은(는) 필수입니다.`}
  if(text==='')return {value:null}
  if(column.type==='number'){
    const value=Number(text)
    if(!Number.isFinite(value))return {value:null,error:'유효한 숫자를 입력하세요.'}
    if(column.min!==undefined&&value<column.min)return {value,error:`${column.min} 이상 입력하세요.`}
    if(column.max!==undefined&&value>column.max)return {value,error:`${column.max} 이하 입력하세요.`}
    return {value}
  }
  if(column.type==='boolean'){
    if(['true','1','예'].includes(text.toLowerCase()))return {value:true}
    if(['false','0','아니오'].includes(text.toLowerCase()))return {value:false}
    return {value:null,error:'true 또는 false를 입력하세요.'}
  }
  if(column.type==='date'){
    const date=new Date(`${text}T00:00:00Z`)
    if(!/^\d{4}-\d{2}-\d{2}$/.test(text)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==text)return {value:null,error:'올바른 날짜(YYYY-MM-DD)를 입력하세요.'}
  }
  if(column.type==='select'&&!column.options?.includes(text))return {value:text,error:'목록에 있는 값을 선택하세요.'}
  if(text.length>500)return {value:text,error:'500자 이하로 입력하세요.'}
  return {value:text}
}
export function getGridChanges(original:GridRecord[],current:GridRecord[]):GridChanges {
  const before=new Map(original.map(row=>[row.id,row])),after=new Map(current.map(row=>[row.id,row]))
  return {
    inserted:current.filter(row=>!before.has(row.id)),
    updated:current.filter(row=>{const old=before.get(row.id);return old && Object.keys(row).some(key=>row[key]!==old[key])}),
    deleted:original.filter(row=>!after.has(row.id)),
  }
}
export function applyGridPaste(rows:GridRecord[],startId:string,startColumn:string,text:string,columns:GridColumn[]):{rows:GridRecord[];error?:string} {
  const start=rows.findIndex(row=>row.id===startId),columnIndex=columns.findIndex(column=>column.key===startColumn)
  if(start<0||columnIndex<0)return {rows,error:'붙여넣기 시작 셀을 찾지 못했습니다.'}
  const values=text.replace(/\r\n?/g,'\n').replace(/\n$/,'').split('\n').map(line=>line.split('\t'))
  if(values.length>1000)return {rows,error:'한 번에 최대 1,000행을 붙여넣을 수 있습니다.'}
  if(start+values.length>rows.length||values.some(line=>columnIndex+line.length>columns.length))return {rows,error:'붙여넣을 영역이 현재 표를 벗어납니다.'}
  const updates=new Map<string,GridRecord>()
  for(let y=0;y<values.length;y++){
    const target=rows[start+y]!,updated={...target}
    for(let x=0;x<values[y]!.length;x++){
      const column=columns[columnIndex+x]!
      if(column.readonly)return {rows,error:`${column.label}은(는) 읽기 전용입니다.`}
      const result=parseGridValue(values[y]![x],column)
      if(result.error)return {rows,error:`${y+1}행 ${column.label}: ${result.error}`}
      updated[column.key]=result.value
    }
    updates.set(target.id,updated)
  }
  return {rows:rows.map(row=>updates.get(row.id)??row)}
}
// Spreadsheet apps must treat user text as text, never as a formula.
export function safeCsvCell(value:GridValue):string {
  let text=String(value??'')
  if(typeof value==='string'&&/^[\s]*[=+\-@]/.test(text))text="'"+text
  return '"'+text.replaceAll('"','""')+'"'
}
export function gridCsv(rows:GridRecord[],columns:GridColumn[]):string {
  return '\uFEFF'+[columns.map(c=>safeCsvCell(c.label)).join(','),...rows.map(row=>columns.map(c=>safeCsvCell(row[c.key]??null)).join(','))].join('\r\n')
}
