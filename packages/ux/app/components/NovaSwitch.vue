<script setup lang="ts">
defineProps<{label?:string;description?:string;disabled?:boolean}>()
const model=defineModel<boolean>({default:false})
</script><template><USwitch v-model="model" :label="label" :description="description" :disabled="disabled" /></template>
