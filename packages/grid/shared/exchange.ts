import type {GridColumn,GridRecord} from './types'
import {parseGridValue} from './core'
const MAX_ROWS=10000,MAX_BYTES=5*1024*1024
export async function exportGridExcel(rows:GridRecord[],columns:GridColumn[]):Promise<Blob>{
  if(rows.length>MAX_ROWS)throw new Error('Excel 내보내기는 최대 10,000행입니다. 대용량은 CSV를 사용하세요.')
  const {default:ExcelJS}=await import('exceljs')
  const workbook=new ExcelJS.Workbook(),sheet=workbook.addWorksheet('NOVA Grid')
  sheet.columns=columns.map(column=>({header:column.label,key:column.key,width:column.type==='number'?20:24}))
  rows.forEach(row=>sheet.addRow(Object.fromEntries(columns.map(column=>[column.key,row[column.key]??null]))))
  sheet.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};sheet.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF67479A'}}
  sheet.views=[{state:'frozen',ySplit:1}]
  columns.forEach((column,index)=>{if(column.type==='number')sheet.getColumn(index+1).numFmt='#,##0.##'})
  const buffer=await workbook.xlsx.writeBuffer()
  return new Blob([new Uint8Array(buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
}
export async function importGridExcel(file:File,columns:GridColumn[]):Promise<GridRecord[]>{
  if(!/\.xlsx$/i.test(file.name))throw new Error('.xlsx 파일만 가져올 수 있습니다.')
  if(file.size>MAX_BYTES)throw new Error('파일 크기는 최대 5MB입니다.')
  const {default:ExcelJS}=await import('exceljs'),workbook=new ExcelJS.Workbook()
  await workbook.xlsx.load(await file.arrayBuffer())
  const sheet=workbook.worksheets[0]
  if(!sheet||sheet.rowCount<2)throw new Error('첫 시트에 헤더와 데이터가 필요합니다.')
  if(sheet.rowCount>MAX_ROWS+1||sheet.columnCount>100)throw new Error('최대 10,000행·100열까지 가져올 수 있습니다.')
  const indexes=new Map<string,number>()
  sheet.getRow(1).eachCell((cell,index)=>{if(typeof cell.value==='string'){if(indexes.has(cell.value))throw new Error('중복된 열 제목이 있습니다.');indexes.set(cell.value,index)}})
  for(const column of columns)if(!indexes.has(column.label))throw new Error(`필수 열 제목이 없습니다: ${column.label}`)
  const rows:GridRecord[]=[],ids=new Set<string>()
  for(let rowIndex=2;rowIndex<=sheet.rowCount;rowIndex++){
    const source=sheet.getRow(rowIndex)
    if(!source.hasValues)continue
    const row:GridRecord={id:''}
    for(const column of columns){
      const cell=source.getCell(indexes.get(column.label)!),value=cell.value
      if(value&&typeof value==='object'&&!(value instanceof Date))throw new Error(`${rowIndex}행 ${column.label}: 수식·서식 텍스트·링크는 지원하지 않습니다.`)
      const raw=value instanceof Date?value.toISOString().slice(0,10):value
      const result=parseGridValue(raw,column)
      if(result.error)throw new Error(`${rowIndex}행 ${column.label}: ${result.error}`)
      row[column.key]=result.value
    }
    row.id=String(row.id??'').trim()
    if(!row.id||ids.has(row.id))throw new Error(`${rowIndex}행: 고유한 문서 ID가 필요합니다.`)
    ids.add(row.id);rows.push(row)
  }
  if(!rows.length)throw new Error('가져올 데이터가 없습니다.')
  return rows
}
