export interface WorkspaceState { opened: string[]; pinned: string[]; active: string }
export function normalizeWorkspaceState(raw: unknown, allowed: string[], home: string): WorkspaceState {
  const valid = new Set(allowed)
  const source = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
  const clean = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && valid.has(id)))] : []
  const opened = [home, ...clean(source.opened).filter(id => id !== home)].filter(id => valid.has(id))
  const pinned = clean(source.pinned).filter(id => opened.includes(id) && id !== home)
  const active = typeof source.active === 'string' && opened.includes(source.active) ? source.active : opened[0] ?? ''
  return { opened: [...opened.filter(id => id === home || pinned.includes(id)), ...opened.filter(id => id !== home && !pinned.includes(id))], pinned, active }
}
export function moveWorkspaceTab(state: WorkspaceState, id: string, direction: -1 | 1, home: string): WorkspaceState {
  const index = state.opened.indexOf(id), target = index + direction
  const other = state.opened[target]
  if (id === home || index < 0 || target < 0 || !other || other === home || state.pinned.includes(id) !== state.pinned.includes(other)) return state
  const opened = [...state.opened]; [opened[index], opened[target]] = [opened[target]!, opened[index]!]
  return { ...state, opened }
}
