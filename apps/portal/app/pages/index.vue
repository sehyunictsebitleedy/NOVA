<script setup lang="ts">
import type { NovaProduct } from '#shared/types/product'
definePageMeta({ alias: ['/design/'] })
const { data: products, error, refresh } = await useFetch<NovaProduct[]>('/api/products')
</script>

<template>
  <div>
    <a class="skip" href="#main">본문으로 이동</a>
    <NovaSiteHeader />
    <main id="main">
      <section id="about" class="hero container" aria-labelledby="hero-title">
        <h1 id="hero-title">업무 화면의<br><span>공통 언어, NOVA.</span></h1>
        <div class="hero-bottom"><p>화면을 만들고, 데이터를 읽고, 정보를 다루는 일.<br>UX, Chart, Grid로 하나의 경험을 만듭니다.</p><a class="text-link" href="#products">제품 살펴보기 <span aria-hidden="true">↓</span></a></div>
      </section>
      <div v-if="error" id="products" class="container catalog-error" role="alert"><p>제품 정보를 불러오지 못했습니다.</p><button class="button" @click="refresh()">다시 불러오기</button></div>
      <NovaProductExplorer v-else-if="products" :products="products" />
      <section id="workspace" class="workspace container" aria-labelledby="workspace-title">
        <div class="workspace-top"><h2 id="workspace-title">각각의 도구가,<br>하나의 업무 공간으로.</h2><p>UX로 화면을 선택하고, Chart로 현황을 읽고,<br>Grid로 상세 정보를 다룹니다.</p></div>
        <div id="next" class="workspace-bottom"><div><strong>통합 업무 포털</strong><p>예시 데이터로 구성한 프로토타입을 살펴보세요.</p></div><a class="button" href="/prototype/" target="_blank" rel="noopener">프로토타입 보기 <span aria-hidden="true">↗</span></a></div>
        <p class="demo-note">UX, Chart, Grid의 상세 기능별 데모는 다음 단계에서 제공합니다.</p>
      </section>
    </main>
    <NovaSiteFooter />
  </div>
</template>
