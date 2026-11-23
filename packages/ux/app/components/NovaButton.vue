<script setup lang="ts">
withDefaults(defineProps<{ label?:string; variant?:'solid'|'outline'|'soft'|'ghost'; loading?:boolean; disabled?:boolean; type?:'button'|'submit'|'reset'; to?:string }>(),{variant:'solid',type:'button'})
</script><template><UButton :variant="variant" :loading="loading" :disabled="disabled" :type="type" :to="to"><slot>{{label}}</slot></UButton></template>
