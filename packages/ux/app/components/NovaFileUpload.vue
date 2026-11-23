<script setup lang="ts">
import { validateNovaFiles } from '../../shared/files'
const props = withDefaults(defineProps<{ multiple?: boolean; accept?: string; maxBytes?: number; maxFiles?: number; disabled?: boolean; label?: string; dropzone?: boolean; preview?: boolean }>(), {
  accept: '*', maxBytes: 5 * 1024 * 1024, maxFiles: 5, label: '파일을 선택하거나 끌어다 놓으세요', dropzone: true, preview: true,
})
const model = defineModel<File[]>({ default: () => [] })
const error = ref('')
const emit = defineEmits<{ reject: [message: string] }>()
const uiModel = computed({
  get: () => props.multiple ? model.value : (model.value[0] ?? null),
  set: (value: File | File[] | null | undefined) => {
    const files = value ? (Array.isArray(value) ? value : [value]) : []
    const message = validateNovaFiles(files, { maxBytes: props.maxBytes, maxFiles: props.multiple ? props.maxFiles : 1, accept: props.accept })
    error.value = message ?? ''
    if (message) emit('reject', message)
    else model.value = files
  },
})
function rejectFile() { error.value = '허용된 형식의 파일만 선택할 수 있습니다.'; emit('reject', error.value) }
</script>
<template>
  <div>
    <UFileUpload v-model="uiModel" :multiple="multiple" :accept="accept" :disabled="disabled" :label="label" :dropzone="dropzone" :preview="preview" :description="`최대 ${Math.round(maxBytes / 1024 / 1024)}MB · 브라우저에서만 처리`" @reject="rejectFile" />
    <p v-if="error" class="mt-2 text-sm text-error" role="alert">{{ error }}</p>
  </div>
</template>
