<script setup lang="ts">
defineProps<{ item: { id:string;label:string } }>()
const memo=ref(''),count=ref(0)
</script>
<template>
  <div class="ux-pane-example">
    <h4>{{item.label}}</h4><p>다른 탭으로 이동해도 입력과 카운터가 유지됩니다.</p>
    <NovaFormField :label="`${item.label} 메모`"><NovaInput v-model="memo" :aria-label="`${item.label} 메모`" placeholder="탭별 메모를 입력하세요" /></NovaFormField>
    <div class="ux-inline"><NovaButton :label="`${item.label} 증가`" variant="outline" @click="count++" /><output>{{count}}</output></div>
  </div>
</template>
