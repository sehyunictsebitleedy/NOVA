<script setup lang="ts">
import { parseDate, type DateValue } from '@internationalized/date'
interface DateRange { start?: string; end?: string }
defineProps<{ range?: boolean; disabled?: boolean; min?: string; max?: string; referenceDate?: string }>()
const model = defineModel<string | DateRange>()
function parsed(value?: string) { if (!value) return undefined; try { return parseDate(value) } catch { return undefined } }
const single = computed<DateValue | undefined>({ get: () => typeof model.value === 'string' ? parsed(model.value) : undefined, set: value => { model.value = value?.toString() } })
const dates = computed<{ start: DateValue | undefined; end: DateValue | undefined }>({
  get: () => typeof model.value === 'object' ? { start: parsed(model.value.start), end: parsed(model.value.end) } : { start: undefined, end: undefined },
  set: value => { model.value = { start: value.start?.toString(), end: value.end?.toString() } },
})
</script>
<template>
  <UCalendar v-if="range" v-model="dates" range :disabled="disabled" :min-value="parsed(min)" :max-value="parsed(max)" :default-placeholder="parsed(referenceDate)" :week-starts-on="1" aria-label="기간 선택" />
  <UCalendar v-else v-model="single" :disabled="disabled" :min-value="parsed(min)" :max-value="parsed(max)" :default-placeholder="parsed(referenceDate)" :week-starts-on="1" aria-label="날짜 선택" />
</template>
