<script setup lang="ts">
import type {TabsItem} from '@nuxt/ui'
defineProps<{items:TabsItem[]}>()
const model=defineModel<string|number>({default:''})
</script><template><UTabs v-model="model" :items="items" :unmount-on-hide="false"><template #content="{item}"><slot :item="item">{{item.content}}</slot></template></UTabs></template>
