export function useNovaTheme() {
  const theme = useCookie<'dark' | 'light'>('nova-theme', {
    default: () => 'dark', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365,
    encode: value => value,
    decode: value => value === 'light' ? 'light' : 'dark',
  })
  useHead(() => ({ htmlAttrs: { 'data-theme': theme.value, class: theme.value === 'dark' ? 'dark' : '' } }))
  function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark' }
  return { theme, toggleTheme }
}
