const themeButton = document.querySelector('#theme');
function labelTheme() { const dark = document.documentElement.dataset.theme === 'dark'; themeButton.textContent = dark ? '라이트' : '다크'; themeButton.setAttribute('aria-label', `${dark ? '라이트' : '다크'} 모드로 변경`); }
themeButton.addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('nova-concept-theme', theme); } catch {} labelTheme(); });
labelTheme();
const menu = document.querySelector('#menu'), nav = document.querySelector('#navigation');
function closeMenu(restore = false) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); if (restore) menu.focus(); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
matchMedia('(min-width:801px)').addEventListener('change', () => closeMenu());
const details = [...document.querySelectorAll('.product')];
details.forEach(detail => detail.addEventListener('toggle', () => { if (detail.open) details.forEach(other => { if (other !== detail) other.open = false; }); }));
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const frame = document.querySelector('.workspace-preview');
new ResizeObserver(() => { const scale = frame.clientWidth / 1440; frame.style.height = `${930 * scale}px`; frame.querySelector('iframe').style.transform = `scale(${scale})`; }).observe(frame);
document.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { if (img.closest('.hero-art')) { img.hidden = true; document.querySelector('.asset-error').hidden = false; } else { img.alt = '이미지를 불러오지 못했습니다. 아래 프로토타입에서 화면을 확인하세요.'; } }));
