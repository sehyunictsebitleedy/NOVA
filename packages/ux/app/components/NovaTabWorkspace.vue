<script setup lang="ts">
import { normalizeWorkspaceState, moveWorkspaceTab, type WorkspaceState } from '../../shared/workspace'
export interface NovaWorkspaceItem { id: string; label: string; disabled?: boolean }
const prefix = `nova-workspace-${useId()}`
const props = withDefaults(defineProps<{ items: NovaWorkspaceItem[]; homeId?: string; storageKey?: string; initialIds?: string[] }>(), { homeId: 'home', initialIds: () => [] })
const model = defineModel<string>({ default: 'home' })
const allowed = computed(() => props.items.filter(item => !item.disabled).map(item => item.id))
const home = computed(() => allowed.value.includes(props.homeId) ? props.homeId : allowed.value[0] ?? '')
const initial = () => normalizeWorkspaceState({ opened: props.initialIds, active: home.value, pinned: [] }, allowed.value, home.value)
const state = ref<WorkspaceState>(initial())
const ready = ref(false), notice = ref(''), dragging = ref('')
const root = ref<HTMLElement | null>(null)
const openedItems = computed(() => state.value.opened.map(id => props.items.find(item => item.id === id)).filter((item): item is NovaWorkspaceItem => !!item))
function commit(next: WorkspaceState) { state.value = normalizeWorkspaceState(next, allowed.value, home.value); model.value = state.value.active }
function select(id: string) {
  if (!allowed.value.includes(id)) return
  commit({ ...state.value, opened: state.value.opened.includes(id) ? state.value.opened : [...state.value.opened, id], active: id })
}
function close(id: string) {
  if (id === home.value || state.value.pinned.includes(id)) return
  const index = state.value.opened.indexOf(id), opened = state.value.opened.filter(value => value !== id)
  commit({ ...state.value, opened, active: state.value.active === id ? opened[Math.max(0, index - 1)] ?? home.value : state.value.active })
}
function pin(id: string) {
  if (id === home.value) return
  commit({ ...state.value, pinned: state.value.pinned.includes(id) ? state.value.pinned.filter(value => value !== id) : [...state.value.pinned, id] })
}
function closeOther(id: string) { commit({ ...state.value, opened: state.value.opened.filter(value => value === home.value || value === id || state.value.pinned.includes(value)), active: id }) }
function closeRight(id: string) { const index = state.value.opened.indexOf(id); commit({ ...state.value, opened: state.value.opened.filter((value, i) => i <= index || state.value.pinned.includes(value) || value === home.value), active: id }) }
function closeAll() { commit({ ...state.value, opened: state.value.opened.filter(value => value === home.value || state.value.pinned.includes(value)), active: home.value }) }
function actions(id: string) { return [
  { label: state.value.pinned.includes(id) ? '고정 해제' : '탭 고정', disabled: id === home.value, onSelect: () => pin(id) },
  { label: '왼쪽으로 이동', disabled: id === home.value, onSelect: () => commit(moveWorkspaceTab(state.value, id, -1, home.value)) },
  { label: '오른쪽으로 이동', disabled: id === home.value, onSelect: () => commit(moveWorkspaceTab(state.value, id, 1, home.value)) },
  { label: '다른 탭 닫기', onSelect: () => closeOther(id) }, { label: '오른쪽 탭 닫기', onSelect: () => closeRight(id) },
  { label: '탭 닫기', disabled: id === home.value || state.value.pinned.includes(id), onSelect: () => close(id) },
] }
async function focus(id: string) { await nextTick(); root.value?.querySelector<HTMLButtonElement>(`[role="tab"][data-tab-id="${CSS.escape(id)}"]`)?.focus() }
async function onKey(event: KeyboardEvent, id: string) {
  if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { event.preventDefault(); commit(moveWorkspaceTab(state.value, id, event.key === 'ArrowLeft' ? -1 : 1, home.value)); await focus(id); return }
  const list = state.value.opened, index = list.indexOf(id)
  let target: string | undefined
  if (event.key === 'ArrowLeft') target = list[(index + list.length - 1) % list.length]
  if (event.key === 'ArrowRight') target = list[(index + 1) % list.length]
  if (event.key === 'Home') target = list[0]
  if (event.key === 'End') target = list[list.length - 1]
  if (event.key === 'Delete') { event.preventDefault(); close(id); await focus(state.value.active); return }
  if (target) { event.preventDefault(); select(target); await focus(target) }
}
function drop(target: string) {
  const from = dragging.value; dragging.value = ''
  if (!from || from === home.value || target === home.value || state.value.pinned.includes(from) !== state.value.pinned.includes(target)) return
  const opened = state.value.opened.filter(id => id !== from), index = opened.indexOf(target)
  if (index < 0) return
  opened.splice(index, 0, from); commit({ ...state.value, opened })
}
function reset() { commit(initial()); notice.value = '탭 구성을 초기화했습니다.' }
watch(() => props.items, () => commit(state.value), { deep: true })
watch(model, id => { if (id !== state.value.active) select(id) })
watch(state, value => {
  if (!ready.value || !props.storageKey) return
  try { localStorage.setItem(props.storageKey, JSON.stringify(value)) }
  catch { notice.value = '브라우저 저장소를 사용할 수 없어 현재 화면에서만 유지됩니다.' }
}, { deep: true })
onMounted(() => {
  if (props.storageKey) {
    try { const saved = localStorage.getItem(props.storageKey); if (saved) commit(normalizeWorkspaceState(JSON.parse(saved), allowed.value, home.value)) }
    catch { notice.value = '저장된 탭을 읽지 못해 기본 구성으로 시작합니다.' }
  }
  ready.value = true; model.value = state.value.active
})
defineExpose({ open: select, close, reset })
</script>

<template>
  <div ref="root" class="nova-workspace">
    <div class="nova-workspace-tools"><span>화면 열기</span><UButton v-for="item in items" :key="item.id" :label="item.label" size="xs" variant="ghost" :disabled="item.disabled" @click="select(item.id)" /><UDropdownMenu :items="[{label:'닫을 수 있는 탭 모두 닫기',onSelect:closeAll},{label:'탭 구성 초기화',onSelect:reset}]"><UButton class="ml-auto" label="탭 관리" size="xs" variant="outline" /></UDropdownMenu></div>
    <div class="nova-workspace-bar" role="tablist" aria-label="업무 화면 탭">
      <UContextMenu v-for="item in openedItems" :key="item.id" :items="actions(item.id)">
        <div class="nova-workspace-tab" :class="{active:state.active===item.id}" :draggable="item.id!==home" @dragstart="dragging=item.id" @dragend="dragging=''" @dragover.prevent @drop.prevent="drop(item.id)">
          <button role="tab" :data-tab-id="item.id" :id="`${prefix}-tab-${item.id}`" :aria-controls="`${prefix}-panel-${item.id}`" :aria-selected="state.active===item.id" :tabindex="state.active===item.id?0:-1" @click="select(item.id)" @keydown="onKey($event,item.id)">{{item.label}}</button>
          <button v-if="item.id!==home" class="nova-workspace-icon" :aria-label="`${item.label} ${state.pinned.includes(item.id)?'고정 해제':'고정'}`" :aria-pressed="state.pinned.includes(item.id)" @click="pin(item.id)"><UIcon name="i-ph-push-pin" /></button>
          <button v-if="item.id!==home&&!state.pinned.includes(item.id)" class="nova-workspace-icon" :aria-label="`${item.label} 닫기`" @click="close(item.id)"><UIcon name="i-ph-x" /></button>
        </div>
      </UContextMenu>
    </div>
    <div v-for="item in openedItems" v-show="state.active===item.id" :key="item.id" :id="`${prefix}-panel-${item.id}`" role="tabpanel" :aria-labelledby="`${prefix}-tab-${item.id}`" tabindex="0" class="nova-workspace-pane"><slot name="content" :item="item">{{item.label}}</slot></div>
    <p v-if="!openedItems.length" class="p-5 text-sm">표시할 화면이 없습니다.</p>
    <p class="nova-workspace-help">우클릭: 탭 관리 / Alt + 방향키: 순서 이동 / Delete: 탭 닫기</p><p v-if="notice" class="nova-workspace-help" role="status">{{notice}}</p>
  </div>
</template>

<style>
.nova-workspace{border:1px solid var(--nova-border);border-radius:7px;min-width:0;overflow:hidden}.nova-workspace-tools{display:flex;gap:7px;align-items:center;padding:10px;flex-wrap:wrap;border-bottom:1px solid var(--nova-border)}.nova-workspace-tools>span{font-size:10px;color:var(--nova-text-muted);margin-right:5px}.nova-workspace-bar{display:flex;overflow-x:auto;background:var(--nova-surface);border-bottom:1px solid var(--nova-border);min-height:46px}.nova-workspace-tab{display:flex;align-items:center;flex-shrink:0;border-bottom:2px solid transparent;padding-right:7px}.nova-workspace-tab.active{border-bottom-color:var(--nova-primary);background:var(--nova-bg)}.nova-workspace-tab>[role=tab]{font-size:12px;padding:13px 12px;white-space:nowrap;background:none;border:0;color:var(--nova-text)}.nova-workspace-icon{display:inline-flex;align-items:center;justify-content:center;padding:5px;color:var(--nova-text-muted);border:0;background:none;font-size:13px}.nova-workspace-icon[aria-pressed=true]{color:var(--nova-primary)}.nova-workspace-pane{padding:25px;min-height:260px}.nova-workspace-help{font-size:10px;color:var(--nova-text-muted);padding:9px 12px;border-top:1px solid var(--nova-border);margin:0}

@media(max-width:760px){.nova-workspace-pane{padding:17px}.nova-workspace-tools>span{width:100%}.nova-workspace-help{font-size:9px}.nova-workspace-tab>[role=tab]{padding-inline:10px;font-size:11px}}
</style>
