export type GridValue = string | number | boolean | null
export interface GridRecord { id: string; [key: string]: GridValue }
export interface GridColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean'
  width?: number
  readonly?: boolean
  required?: boolean
  min?: number
  max?: number
  options?: string[]
  format?: 'currency' | 'percent'
}
export interface GridChanges { inserted: GridRecord[]; updated: GridRecord[]; deleted: GridRecord[] }
