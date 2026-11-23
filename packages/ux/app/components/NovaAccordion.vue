<script setup lang="ts">
import type {AccordionItem} from '@nuxt/ui'
defineProps<{items:AccordionItem[];multiple?:boolean;disabled?:boolean}>()
const model=defineModel<string|string[]>()
</script><template><UAccordion v-model="model" :items="items" :type="multiple?'multiple':'single'" :disabled="disabled" :unmount-on-hide="false" /></template>
