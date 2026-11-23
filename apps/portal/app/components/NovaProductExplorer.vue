<script setup lang="ts">
import type { NovaProduct } from '#shared/types/product'
const props = defineProps<{ products: NovaProduct[] }>()
const selected = ref('ux')
const tabList = ref<HTMLElement | null>(null)
function select(id: string) { selected.value = id }
async function onTabKey(event: KeyboardEvent, index: number) {
  const last = props.products.length - 1
  let next: number | undefined
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
  if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = last
  if (next === undefined) return
  event.preventDefault()
  const target = props.products[next]
  if (!target) return
  select(target.id)
  await nextTick()
  tabList.value?.querySelector<HTMLButtonElement>(`#${target.id}`)?.focus()
}
function onHashChange() {
  const product = props.products.find(product => `#${product.id}` === window.location.hash)
  if (product) select(product.id)
}
onMounted(() => {
  onHashChange()
  window.addEventListener('hashchange', onHashChange)
  onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))
})
</script>

<template>
  <section id="products" class="products container" aria-labelledby="products-title">
    <h2 id="products-title" class="sr-only">NOVA 제품 탐색</h2>
    <div ref="tabList" class="product-tabs" role="tablist" aria-label="제품 선택">
      <button v-for="(product, index) in products" :id="product.id" :key="product.id" role="tab" :aria-controls="`panel-${product.id}`" :aria-selected="selected === product.id" :tabindex="selected === product.id ? 0 : -1" @click="select(product.id)" @keydown="onTabKey($event, index)">
        <span>{{ product.name }}</span><small>{{ product.tagline }}</small>
      </button>
    </div>
    <div v-for="product in products" :id="`panel-${product.id}`" :key="product.id" class="product-panel" role="tabpanel" :aria-labelledby="product.id" tabindex="0" :hidden="selected !== product.id">
      <div class="product-copy">
        <h3><span v-for="line in product.headline" :key="line" class="copy-line">{{ line }}</span></h3>
        <p><span v-for="line in product.description" :key="line" class="copy-line">{{ line }}</span></p>
        <ul><li v-for="feature in product.features" :key="feature">{{ feature }}</li></ul>
        <a href="#workspace" class="text-link">함께 쓰는 모습 <span aria-hidden="true">↗</span></a>
      </div>
      <figure><img :src="product.image" width="1032" height="680" :alt="product.alt" :loading="product.id === 'ux' ? 'eager' : 'lazy'" :fetchpriority="product.id === 'ux' ? 'high' : 'auto'"><figcaption>{{ product.caption }}</figcaption></figure>
    </div>
  </section>
</template>
