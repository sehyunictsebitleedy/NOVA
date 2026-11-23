<script setup lang="ts">
defineOptions({inheritAttrs:false})
defineProps<{items:{label:string;value:string;disabled?:boolean}[];multiple?:boolean;placeholder?:string;disabled?:boolean}>()
const model=defineModel<string|string[]>({default:''})
const single=computed({get:()=>typeof model.value==='string'?model.value:'',set:(value:string)=>{model.value=value}})
const many=computed({get:()=>Array.isArray(model.value)?model.value:[],set:(value:string[])=>{model.value=value}})
</script><template><USelectMenu v-if="multiple" v-model="many" v-bind="$attrs" :items="items" multiple value-key="value" :placeholder="placeholder" :disabled="disabled" class="w-full" /><USelect v-else v-model="single" v-bind="$attrs" :items="items" value-key="value" :placeholder="placeholder" :disabled="disabled" class="w-full" /></template>
