<script setup lang="ts">
import type {NovaUxEntry} from '@sebit-nova/ux/catalog'
useSeoMeta({title:'NOVA UX | 컴포넌트와 워크스페이스',description:'NOVA UX의 필수 컴포넌트와 멀티탭 워크스페이스를 직접 조작하고 사용 코드와 API를 확인하세요.'})
const route=useRoute(),router=useRouter()
const {theme,toggleTheme}=useNovaTheme()
const {data:catalog,error,refresh}=await useFetch<NovaUxEntry[]>('/api/ux/components')
const query=ref(''),sideOpen=ref(false),disabled=ref(false),view=ref<string|number>('preview'),copyStatus=ref('')
const entries=computed(()=>catalog.value??[])
const active=computed(()=>entries.value.find(entry=>entry.id===route.query.component)??entries.value[0])
const groups=computed(()=>[...new Set(entries.value.map(entry=>entry.category))].map(category=>({category,items:entries.value.filter(entry=>entry.category===category&&`${entry.name} ${entry.title} ${entry.description}`.toLowerCase().includes(query.value.toLowerCase().trim()))})).filter(group=>group.items.length))
const count=computed(()=>groups.value.reduce((sum,group)=>sum+group.items.length,0))
const sections=[{label:'미리보기',value:'preview'},{label:'사용 코드',value:'code'},{label:'API',value:'api'}]
function choose(id:string){router.replace({query:{...route.query,component:id}});view.value='preview';disabled.value=false;sideOpen.value=false;copyStatus.value=''}
async function copy(){if(!active.value)return;try{await navigator.clipboard.writeText(active.value.code);copyStatus.value='코드를 복사했습니다.'}catch{copyStatus.value='복사 권한이 없어 자동 복사하지 못했습니다. 코드를 직접 선택해 주세요.'}}
</script>

<template>
  <div class="ux-gallery" @keydown.esc="sideOpen=false">
    <a class="skip" href="#ux-main">본문으로 이동</a>
    <header class="ux-top"><NuxtLink to="/" class="brand" aria-label="NOVA 소개 사이트"><span>SEbit</span>NOVA<i aria-hidden="true">✳</i></NuxtLink><strong>NOVA UX</strong><div class="ux-top-actions"><NuxtLink to="/grid">Grid</NuxtLink><NuxtLink to="/">소개 사이트</NuxtLink><button class="theme" :aria-label="`${theme==='dark'?'라이트':'다크'} 모드로 변경`" @click="toggleTheme">{{theme==='dark'?'라이트':'다크'}}</button><button class="ux-menu" :aria-expanded="sideOpen" aria-controls="ux-sidebar" @click="sideOpen=!sideOpen">컴포넌트 목록</button></div></header>
    <div class="ux-layout">
      <aside id="ux-sidebar" class="ux-sidebar" :class="{open:sideOpen}"><label for="ux-search">컴포넌트 검색</label><UInput id="ux-search" v-model="query" placeholder="이름 또는 기능 검색" icon="i-ph-magnifying-glass" class="w-full" /><p class="ux-count">{{count}} / {{entries.length}}개 데모</p><nav aria-label="UX 컴포넌트"><section v-for="group in groups" :key="group.category"><h2>{{group.category}}</h2><button v-for="entry in group.items" :key="entry.id" :aria-current="active?.id===entry.id?'page':undefined" :class="{selected:active?.id===entry.id}" @click="choose(entry.id)"><span>{{entry.name}}</span><small>{{entry.title}}</small></button></section></nav><div v-if="!count" class="ux-empty"><p>검색 결과가 없습니다.</p><UButton label="검색 초기화" variant="ghost" @click="query=''" /></div></aside>
      <main id="ux-main" class="ux-main">
        <div v-if="error" role="alert"><h1>컴포넌트 목록을 불러오지 못했습니다.</h1><NovaButton label="다시 불러오기" @click="refresh()" /></div>
        <template v-else-if="active"><div class="ux-heading"><p>NOVA UX / {{active.category}}</p><h1>{{active.name}}</h1><h2>{{active.title}}</h2><p>{{active.description}}</p></div>
          <div class="ux-demo-toolbar"><span>Nuxt UI v4 기반의 재사용 컴포넌트</span><NovaCheckbox v-if="active.supportsDisabled" v-model="disabled" label="비활성화" /></div>
          <NovaTabs v-model="view" :items="sections"><template #default="{item}">
            <div v-if="item.value==='preview'" class="ux-preview"><UxComponentDemo :key="active.id" :component-id="active.id" :disabled="disabled" /></div>
            <div v-else-if="item.value==='code'" class="ux-code"><div class="ux-code-top"><span>{{active.component}} 사용 예시</span><NovaButton label="코드 복사" variant="outline" @click="copy" /></div><pre><code>{{active.code}}</code></pre><p role="status">{{copyStatus}}</p><p>이 컴포넌트는 @sebit-nova/ux Layer를 상속하면 자동 등록됩니다.</p></div>
            <div v-else class="ux-api"><div class="ux-table-scroll"><table><caption>{{active.component}} 주요 API</caption><thead><tr><th>속성·이벤트</th><th>타입</th><th>설명</th></tr></thead><tbody><tr v-for="prop in active.props" :key="prop.name"><td><code>{{prop.name}}</code></td><td><code>{{prop.type}}</code></td><td>{{prop.description}}</td></tr></tbody></table></div><p>설명은 NOVA 래퍼의 공개 계약입니다. 다른 Nuxt UI 속성과 이벤트는 단일 루트 컴포넌트에 전달할 수 있습니다.</p></div>
          </template></NovaTabs>
          <div class="ux-demo-note"><p>이 화면은 실제 Vue 컴포넌트입니다. 예시 입력은 외부 서버에 전송하지 않습니다.</p><p>필수 19종과 TabWorkspace의 기본 구현을 제공합니다. 전체 변형·공통 업무 API의 완성을 의미하지 않습니다.</p></div>
        </template>
      </main>
    </div>
  </div>
</template>
<style src="../assets/css/ux.css"></style>
