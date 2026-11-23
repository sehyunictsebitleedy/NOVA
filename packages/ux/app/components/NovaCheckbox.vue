<script setup lang="ts">
defineProps<{label?:string;description?:string;disabled?:boolean;required?:boolean}>()
const model=defineModel<boolean|'indeterminate'>({default:false})
</script><template><UCheckbox v-model="model" :label="label" :description="description" :disabled="disabled" :required="required" /></template>
