<script setup lang="ts">
withDefaults(defineProps<{max?:number;label?:string}>(),{max:100,label:'진행률'})
const model=defineModel<number|null>({default:0})
</script><template><UProgress :model-value="model===null?null:Math.max(0,Math.min(model,max))" :max="max" :aria-label="label" /></template>
