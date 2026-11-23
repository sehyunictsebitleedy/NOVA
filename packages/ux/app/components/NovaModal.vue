<script setup lang="ts">
withDefaults(defineProps<{title:string;description:string;size?:'sm'|'md'|'lg';dismissible?:boolean}>(),{size:'md',dismissible:true})
const open=defineModel<boolean>('open',{default:false})
const sizes={sm:'sm:max-w-sm',md:'sm:max-w-xl',lg:'sm:max-w-3xl'}
</script><template><UModal v-model:open="open" :title="title" :description="description" :dismissible="dismissible" :ui="{content:sizes[size]}" :close="true"><template #body><slot /></template><template v-if="$slots.footer" #footer><slot name="footer" /></template></UModal></template>
