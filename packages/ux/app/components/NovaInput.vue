<script setup lang="ts">
withDefaults(defineProps<{type?:'text'|'email'|'password'|'search';placeholder?:string;disabled?:boolean;readonly?:boolean}>(),{type:'text'})
const model=defineModel<string>({default:''})
</script><template><UInput v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" class="w-full" /></template>
