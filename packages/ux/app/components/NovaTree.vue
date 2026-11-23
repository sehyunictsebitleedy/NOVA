<script setup lang="ts">
import type {TreeItem} from '@nuxt/ui'
defineProps<{items:TreeItem[];disabled?:boolean}>()
const model=defineModel<TreeItem[]>({default:()=>[]})
</script><template><UTree :as="{root:'ul',link:'div'}" v-model="model" :items="items" multiple :propagate-select="true" :bubble-select="true" :disabled="disabled" :get-key="item=>String(item.id??item.label)" aria-label="체크박스 트리"><template #item-leading="{selected,indeterminate}"><div aria-hidden="true" class="pointer-events-none"><UCheckbox :model-value="indeterminate?'indeterminate':selected" :tabindex="-1" /></div></template></UTree></template>
