<script setup lang="ts">
withDefaults(defineProps<{placeholder?:string;disabled?:boolean;rows?:number;maxlength?:number}>(),{rows:4})
const model=defineModel<string>({default:''})
</script><template><UTextarea v-model="model" :placeholder="placeholder" :disabled="disabled" :rows="rows" :maxlength="maxlength" class="w-full" /></template>
