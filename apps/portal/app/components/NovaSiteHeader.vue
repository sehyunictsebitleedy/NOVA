<script setup lang="ts">
const { theme, toggleTheme } = useNovaTheme()
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const header = ref<HTMLElement | null>(null)
function closeMenu(restore = false) { menuOpen.value = false; if (restore) menuButton.value?.focus() }
function outsideClick(event: MouseEvent) { if (header.value && !header.value.contains(event.target as Node)) closeMenu() }
function onEscape(event: KeyboardEvent) { if (event.key === 'Escape' && menuOpen.value) closeMenu(true) }
function onWideScreen() { closeMenu() }
onMounted(() => {
  const query = matchMedia('(min-width:761px)')
  document.addEventListener('click', outsideClick)
  document.addEventListener('keydown', onEscape)
  query.addEventListener('change', onWideScreen)
  onBeforeUnmount(() => {
    document.removeEventListener('click', outsideClick)
    document.removeEventListener('keydown', onEscape)
    query.removeEventListener('change', onWideScreen)
  })
})
</script>

<template>
  <header ref="header" class="header container">
    <a class="brand" href="#" aria-label="SEbit NOVA 홈"><span>SEbit</span>NOVA<i aria-hidden="true">✳</i></a>
    <nav id="nav" :class="{ open: menuOpen }" aria-label="주 메뉴" @click="closeMenu()">
      <a href="#about">NOVA 소개</a><a href="#products">제품</a><a href="#workspace">활용 화면</a><a href="#next">데모 안내</a>
    </nav>
    <button class="theme" :aria-label="`${theme === 'dark' ? '라이트' : '다크'} 모드로 변경`" @click="toggleTheme">{{ theme === 'dark' ? '라이트' : '다크' }}</button>
    <button ref="menuButton" class="menu" aria-controls="nav" :aria-expanded="menuOpen" :aria-label="menuOpen ? '메뉴 닫기' : '메뉴 열기'" @click="menuOpen = !menuOpen">메뉴</button>
  </header>
</template>
