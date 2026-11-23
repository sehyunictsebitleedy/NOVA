<script setup lang="ts">
withDefaults(defineProps<{label:string;name?:string;description?:string;help?:string;error?:boolean|string;required?:boolean}>(),{error:undefined})
</script><template><UFormField :label="label" :name="name" :description="description" :help="help" :error="error" :required="required"><slot /></UFormField></template>
