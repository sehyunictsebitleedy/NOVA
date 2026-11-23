<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'
withDefaults(defineProps<{label?:string;items:DropdownMenuItem[];split?:boolean;disabled?:boolean}>(),{label:'작업 선택'})
const emit=defineEmits<{action:[]}>()
</script><template><div v-if="split" class="inline-flex gap-px"><NovaButton :label="label" :disabled="disabled" @click="emit('action')" /><UDropdownMenu :items="items"><UButton icon="i-ph-caret-down" :disabled="disabled" aria-label="추가 작업 열기" /></UDropdownMenu></div><UDropdownMenu v-else :items="items"><UButton :label="label" trailing-icon="i-ph-caret-down" :disabled="disabled" variant="outline" /></UDropdownMenu></template>
