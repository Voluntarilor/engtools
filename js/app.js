import { MODULES, getModule } from './registry.js';
import { getRoute, navigate, onRouteChange } from './router.js';

const appEl = document.getElementById('app');
const headerTitle = document.getElementById('header-title');
const btnBack = document.getElementById('btn-back');

// ---------- Главная страница ----------
function renderHome() {
  headerTitle.textContent = 'EngTools';
  btnBack.hidden = true;

  const cards = MODULES.map(m => `
    <div class="module-card ${m.enabled ? '' : 'disabled'}"
         data-id="${m.id}"
         role="button"
         tabindex="${m.enabled ? 0 : -1}">
      <div class="module-icon">${m.icon}</div>
      <div class="module-name">${m.title}</div>
      <div class="module-desc">${m.desc}</div>
    </div>
  `).join('');

  appEl.innerHTML = `
    <h2 class="page-title">Выберите инженерный модуль</h2>
    <div class="page-divider"></div>
    <div class="modules-grid">${cards}</div>
  `;

  appEl.querySelectorAll('.module-card').forEach(card => {
    if (card.classList.contains('disabled')) return;
    const go = () => navigate(card.dataset.id);
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
}

// ---------- Страница модуля ----------
function renderModule(id) {
  const mod = getModule(id);
  if (!mod || !mod.enabled) {
    navigate('home');
    return;
  }
  headerTitle.textContent = mod.title;
  btnBack.hidden = false;

  appEl.innerHTML = `
    <h2 class="page-title">${mod.icon} ${mod.title}</h2>
    <p class="page-subtitle">${mod.desc}</p>
    <div class="page-divider"></div>
    <div id="module-root"></div>
  `;

  const root = document.getElementById('module-root');
  mod.render(root);
}

// ---------- Роутинг ----------
function handleRoute() {
  const route = getRoute();
  window.scrollTo({ top: 0 });
  if (route === 'home') renderHome();
  else renderModule(route);
}

btnBack.addEventListener('click', () => navigate('home'));
onRouteChange(handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
handleRoute();