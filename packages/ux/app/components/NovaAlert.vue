<script setup lang="ts">
withDefaults(defineProps<{title:string;description?:string;color?:'info'|'success'|'warning'|'error';dismissible?:boolean}>(),{color:'info'})
const open=defineModel<boolean>('open',{default:true})
</script><template><UAlert v-if="open" :title="title" :description="description" :color="color" variant="soft" :close="dismissible" @update:open="open=$event" /></template>
