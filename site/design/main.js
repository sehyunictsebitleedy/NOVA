const theme=document.querySelector('.theme');
function labelTheme(){const dark=document.documentElement.dataset.theme==='dark';theme.textContent=dark?'라이트':'다크';theme.setAttribute('aria-label',`${dark?'라이트':'다크'} 모드로 변경`)}
theme.addEventListener('click',()=>{const value=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=value;try{localStorage.setItem('nova-design-theme',value)}catch{}labelTheme()});labelTheme();
const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
function closeMenu(restore=false){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');if(restore)menu.focus()}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');nav.classList.toggle('open',open)});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true)});document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});matchMedia('(min-width:761px)').addEventListener('change',()=>closeMenu());
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab,focus=false){tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active});if(focus)tab.focus()}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next],true)}})});
function applyHash(){const tab=tabs.find(t=>`#${t.id}`===location.hash);if(tab)selectTab(tab)}window.addEventListener('hashchange',applyHash);applyHash();
