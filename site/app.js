const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
function closeMenu(restore = false) {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  if (restore) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.nav')) closeMenu(); });
matchMedia('(min-width:761px)').addEventListener('change', () => closeMenu());

const themeButton = document.querySelector('.theme-button');
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.textContent = dark ? '라이트' : '다크';
  themeButton.setAttribute('aria-label', `${dark ? '라이트' : '다크'} 모드로 변경`);
}
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('nova-site-theme', theme); } catch {}
  updateThemeLabel();
});
updateThemeLabel();

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next]); tabs[next].focus(); }
  });
});

document.querySelector('#ux-example').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#project-name').value.trim();
  const type = document.querySelector('#project-type').value;
  document.querySelector('#ux-status').textContent = name ? `‘${name}’ · ${type} 선택을 확인했습니다. 설명용 예시로, 서버에 저장되지 않습니다.` : '프로젝트 이름을 입력해 주세요.';
});
const chartData = { first: [68, 52, 43, 35], second: [87, 71, 58, 49] };
const divisionNames = ['생산', '영업', '연구', '서비스'];
function renderChart() {
  const values = chartData[document.querySelector('#chart-period').value];
  const plot = document.querySelector('#chart-bars');
  plot.replaceChildren(...values.map((value, index) => {
    const row = document.createElement('div'); row.className = 'bar-row';
    const label = document.createElement('span'); label.textContent = divisionNames[index];
    const track = document.createElement('div'); track.className = 'bar-plot';
    const bar = document.createElement('div'); bar.className = 'bar-fill'; bar.style.setProperty('--size', `${value}%`); track.append(bar);
    const number = document.createElement('span'); number.textContent = value;
    row.append(label, track, number); return row;
  }));
  plot.setAttribute('aria-label', `예시 사업부별 매출, 백만원 단위: ${values.map((v, i) => `${divisionNames[i]} ${v}`).join(', ')}`);
}
document.querySelector('#chart-period').addEventListener('change', renderChart);
renderChart();

const projects = [ ['업무 포털', '운영 관리', '진행 중'], ['매출 분석', '데이터 분석', '검토 중'], ['인사 관리', '인사 업무', '진행 중'] ];
let ascending = true;
function renderGrid() {
  const query = document.querySelector('#grid-search').value.trim().toLocaleLowerCase();
  const rows = projects.filter(row => row[0].toLocaleLowerCase().includes(query)).sort((a, b) => a[0].localeCompare(b[0], 'ko') * (ascending ? 1 : -1));
  const body = document.querySelector('#grid-rows');
  body.replaceChildren();
  for (const row of rows) {
    const tr = document.createElement('tr');
    row.forEach((text, index) => { const td = document.createElement('td'); td.textContent = text; if (index === 2) td.className = 'status-text'; tr.append(td); });
    body.append(tr);
  }
  if (!rows.length) { const tr = document.createElement('tr'); const td = document.createElement('td'); td.colSpan = 3; td.textContent = '검색 결과가 없습니다.'; tr.append(td); body.append(tr); }
  document.querySelector('#grid-status').textContent = `예시 데이터 ${rows.length}건`;
  const sort = document.querySelector('#grid-sort');
  sort.setAttribute('aria-label', `프로젝트 이름 ${ascending ? '내림' : '오름'}차순 정렬`);
  sort.closest('th').setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
}
document.querySelector('#grid-search').addEventListener('input', renderGrid);
document.querySelector('#grid-sort').addEventListener('click', () => { ascending = !ascending; renderGrid(); });
renderGrid();

for (const frame of document.querySelectorAll('[data-preview]')) {
  const observer = new ResizeObserver(() => {
    const scale = frame.clientWidth / 1260;
    frame.style.height = `${820 * scale}px`;
    frame.querySelector('iframe').style.transform = `scale(${scale})`;
  });
  observer.observe(frame);
}
