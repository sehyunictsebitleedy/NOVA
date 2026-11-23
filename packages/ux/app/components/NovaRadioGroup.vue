<script setup lang="ts">
withDefaults(defineProps<{items:{label:string;value:string;disabled?:boolean}[];legend?:string;disabled?:boolean;orientation?:'horizontal'|'vertical'}>(),{orientation:'vertical'})
const model=defineModel<string>({default:''})
</script><template><URadioGroup v-model="model" :items="items" :legend="legend" :disabled="disabled" :orientation="orientation" /></template>
