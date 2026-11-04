import { renderGeneral } from './corrosion/general.js';
import { renderPitting } from './corrosion/pitting.js';
import { renderAluminum } from './corrosion/aluminum.js';
import { renderElastomers } from './corrosion/elastomers.js'; // <-- ВАЖНО: импорт эластомеров

const SUB_MODULES = [
  { id: 'general', title: 'Общая таблица', icon: '📋', desc: 'Стойкость металлов и эластомеров к типовым средам', render: renderGeneral },
  { id: 'pitting', title: 'Питтинговая коррозия', icon: '🎯', desc: 'Расчёт стойкости нержавеющих сталей к хлоридам', render: renderPitting },
  { id: 'aluminum', title: 'Коррозия алюминия', icon: '🥫', desc: 'Химическая совместимость алюминия', render: renderAluminum },
  // ВОТ ОНА, НАША НОВАЯ КНОПКА:
  { id: 'elastomers', title: 'Эластомеры', icon: '⭕', desc: 'Химстойкость резин и уплотнений', render: renderElastomers },
];

export function renderCorrosion(root) {
  root.innerHTML = `
    <style>
      .submodules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; max-width: 900px; margin: 0 auto 30px; }
      .submodule-card { background: var(--surface); border-radius: var(--radius); padding: 26px 20px 22px; text-align: center; cursor: pointer; border: 1px solid var(--border); box-shadow: var(--shadow); transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s; display: flex; flex-direction: column; align-items: center; user-select: none; }
      .submodule-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); border-color: var(--accent); }
      .submodule-icon { font-size: 48px; line-height: 1; margin-bottom: 14px; }
      .submodule-name { font-size: 18px; font-weight: 600; color: var(--primary); margin-bottom: 8px; }
      .submodule-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.45; }
      
      .btn-back-sub { margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f1f5f9; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-weight: 600; color: var(--primary); font-family: inherit; font-size: 14px; transition: 0.2s; }
      .btn-back-sub:hover { background: #e2e8f0; }

      /* Стили для контента (перенесены из старого файла) */
      .corr-controls { display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; align-items: center; }
      .corr-table-container { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); max-height: 70vh; }
      .corr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: center; white-space: nowrap; }
      .corr-table th, .corr-table td { border: 1px solid var(--border); padding: 8px 10px; }
      .corr-table th:first-child, .corr-table td:first-child { position: sticky; left: 0; background: #fff; z-index: 2; text-align: left; font-weight: 600; border-right: 2px solid var(--border); box-shadow: 2px 0 5px rgba(0,0,0,0.05); min-width: 180px; }
      .corr-table th { background: #f8fafc; position: sticky; top: 0; z-index: 3; color: var(--primary); font-weight: 600; }
      .corr-table th:first-child { z-index: 4; }
      .rating-A { background: #dcfce7; color: #166534; font-weight: bold; }
      .rating-B { background: #fef9c3; color: #854d0e; font-weight: bold; }
      .rating-C { background: #ffedd5; color: #9a3412; font-weight: bold; }
      .rating-D { background: #fee2e2; color: #991b1b; font-weight: bold; }
      .rating-NA { background: #f1f5f9; color: #64748b; font-weight: bold; }
      .legend { display: flex; gap: 15px; font-size: 12px; margin-top: 15px; flex-wrap: wrap; }
      .legend-item { display: flex; align-items: center; gap: 5px; }
      .legend-box { width: 16px; height: 16px; border-radius: 3px; border: 1px solid #ccc; display: flex; justify-content: center; align-items: center; font-size: 10px; }
      .graph-layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start; }
      @media (max-width: 900px) { .graph-layout { grid-template-columns: 1fr; } }
      .graph-controls { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
      .graph-svg-container { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); display: flex; justify-content: center; overflow-x: auto; }
      .verdict-box { margin-top: 15px; padding: 12px; border-radius: 6px; font-size: 14px; font-weight: 600; text-align: center; display: none; line-height: 1.4; }
      .verdict-safe { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; display: block !important; }
      .verdict-risk { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; display: block !important; }
      details.pren-box { background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-top: 20px; cursor: pointer; }
      summary.pren-title { font-weight: 600; color: var(--primary); font-size: 15px; outline: none; }
      .pren-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; cursor: default; }
      .pren-table th, .pren-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: center; }
      .pren-table th { background: #f1f5f9; }
      .formula-box { background: #fffbeb; border: 1px solid #fde68a; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 15px 0; text-align: center; color: #92400e; }
      .alu-table-container { overflow-y: auto; border: 1px solid var(--border); border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); max-height: 70vh; }
      .alu-table { width: 100%; border-collapse: collapse; font-size: 14px; }
      .alu-table th, .alu-table td { border-bottom: 1px solid var(--border); padding: 10px 15px; text-align: left; }
      .alu-table th { background: #f8fafc; position: sticky; top: 0; z-index: 1; font-weight: 600; color: var(--primary); }
      .alu-table td:nth-child(2) { text-align: center; font-weight: bold; width: 150px; }
    </style>

    <div id="corr-menu-view">
      <h3 class="page-title" style="font-size: 18px; margin-bottom: 20px;">Выберите раздел коррозии</h3>
      <div class="submodules-grid">
        ${SUB_MODULES.map(m => `
          <div class="submodule-card" data-id="${m.id}">
            <div class="submodule-icon">${m.icon}</div>
            <div class="submodule-name">${m.title}</div>
            <div class="submodule-desc">${m.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div id="corr-content-view" style="display: none;">
      <button class="btn-back-sub" id="btn-corr-back">← Назад в меню Коррозии</button>
      <div id="corr-module-root"></div>
    </div>
  `;

  const menuView = document.getElementById('corr-menu-view');
  const contentView = document.getElementById('corr-content-view');
  const moduleRoot = document.getElementById('corr-module-root');

  function showMenu() {
    menuView.style.display = 'block';
    contentView.style.display = 'none';
    moduleRoot.innerHTML = '';
  }

  function showModule(id) {
    const mod = SUB_MODULES.find(m => m.id === id);
    if (!mod) return;
    
    menuView.style.display = 'none';
    contentView.style.display = 'block';
    mod.render(moduleRoot);
  }

  // Обработчики кликов по карточкам
  root.querySelectorAll('.submodule-card').forEach(card => {
    card.addEventListener('click', () => showModule(card.dataset.id));
  });

  // Кнопка "Назад"
  document.getElementById('btn-corr-back').addEventListener('click', showMenu);
}