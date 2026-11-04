import { fmt } from '../../utils.js';

const MEDIA = [
  { id: 'water', name: 'Вода (техн.)' },
  { id: 'seawater', name: 'Морская вода' },
  { id: 'steam', name: 'Пар' },
  { id: 'h2so4_10', name: 'H₂SO₄ 10%' },
  { id: 'h2so4_98', name: 'H₂SO₄ 98%' },
  { id: 'hcl_10', name: 'HCl 10%' },
  { id: 'naoh_50', name: 'NaOH 50%' },
  { id: 'ammonia', name: 'Аммиак (водн.)' },
  { id: 'methanol', name: 'Метанол' },
  { id: 'acetone', name: 'Ацетон' },
  { id: 'oil', name: 'Нефтепродукты' }
];

const MATERIALS_TABLE = [
  { name: 'Ст20 (Углеродистая сталь)', type: 'metal', r: { water: 'C', seawater: 'D', steam: 'C', h2so4_10: 'D', h2so4_98: 'C', hcl_10: 'D', naoh_50: 'B', ammonia: 'B', methanol: 'B', acetone: 'B', oil: 'A' } },
  { name: '12Х18Н10Т (AISI 304)', type: 'metal', r: { water: 'A', seawater: 'C', steam: 'A', h2so4_10: 'C', h2so4_98: 'C', hcl_10: 'D', naoh_50: 'A', ammonia: 'A', methanol: 'A', acetone: 'A', oil: 'A' } },
  { name: '10Х17Н13М2Т (AISI 316)', type: 'metal', r: { water: 'A', seawater: 'B', steam: 'A', h2so4_10: 'B', h2so4_98: 'C', hcl_10: 'D', naoh_50: 'A', ammonia: 'A', methanol: 'A', acetone: 'A', oil: 'A' } },
  { name: 'Титан (ВТ1-0)', type: 'metal', r: { water: 'A', seawater: 'A', steam: 'A', h2so4_10: 'C', h2so4_98: 'D', hcl_10: 'D', naoh_50: 'A', ammonia: 'A', methanol: 'A', acetone: 'A', oil: 'A' } },
  { name: 'Алюминий (АД0)', type: 'metal', r: { water: 'B', seawater: 'D', steam: 'C', h2so4_10: 'C', h2so4_98: 'D', hcl_10: 'D', naoh_50: 'D', ammonia: 'C', methanol: 'A', acetone: 'A', oil: 'A' } },
  { name: 'Медь (М1)', type: 'metal', r: { water: 'A', seawater: 'C', steam: 'A', h2so4_10: 'C', h2so4_98: 'D', hcl_10: 'D', naoh_50: 'B', ammonia: 'D', methanol: 'A', acetone: 'A', oil: 'A' } },
  { name: 'NBR (Нитрильный каучук)', type: 'elastomer', r: { water: 'A', seawater: 'B', steam: 'C', h2so4_10: 'C', h2so4_98: 'D', hcl_10: 'C', naoh_50: 'B', ammonia: 'B', methanol: 'B', acetone: 'D', oil: 'A' } },
  { name: 'EPDM (Этилен-пропилен)', type: 'elastomer', r: { water: 'A', seawater: 'A', steam: 'A', h2so4_10: 'B', h2so4_98: 'C', hcl_10: 'B', naoh_50: 'A', ammonia: 'A', methanol: 'A', acetone: 'C', oil: 'D' } },
  { name: 'FKM (Фторкаучук / Viton)', type: 'elastomer', r: { water: 'A', seawater: 'A', steam: 'C', h2so4_10: 'B', h2so4_98: 'B', hcl_10: 'B', naoh_50: 'C', ammonia: 'C', methanol: 'D', acetone: 'D', oil: 'A' } },
  { name: 'Силикон (VMQ)', type: 'elastomer', r: { water: 'B', seawater: 'C', steam: 'C', h2so4_10: 'C', h2so4_98: 'D', hcl_10: 'D', naoh_50: 'C', ammonia: 'C', methanol: 'A', acetone: 'C', oil: 'C' } },
  { name: 'PTFE (Фторопласт-4)', type: 'elastomer', r: { water: 'A', seawater: 'A', steam: 'A', h2so4_10: 'A', h2so4_98: 'A', hcl_10: 'A', naoh_50: 'A', ammonia: 'A', methanol: 'A', acetone: 'A', oil: 'A' } }
];

export function renderGeneral(container) {
  container.innerHTML = `
    <div class="corr-controls">
      <div class="field" style="flex: 1; min-width: 200px; margin-bottom: 0;">
        <input type="text" id="corr-search" placeholder="Поиск по материалу..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
      </div>
      <div class="field" style="margin-bottom: 0;">
        <select id="corr-type" style="padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
          <option value="all">Все материалы</option>
          <option value="metal">Только металлы</option>
          <option value="elastomer">Только эластомеры</option>
        </select>
      </div>
    </div>
    <div class="corr-table-container">
      <table class="corr-table" id="corr-table">
        <thead>
          <tr>
            <th>Материал</th>
            ${MEDIA.map(m => `<th>${m.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody id="corr-tbody"></tbody>
      </table>
    </div>
    <div class="legend">
      <div class="legend-item"><div class="legend-box rating-A"></div> A — Отлично</div>
      <div class="legend-item"><div class="legend-box rating-B"></div> B — Хорошо</div>
      <div class="legend-item"><div class="legend-box rating-C"></div> C — Ограниченно</div>
      <div class="legend-item"><div class="legend-box rating-D"></div> D — Не применять</div>
    </div>
  `;

  const tbody = document.getElementById('corr-tbody');
  const searchInput = document.getElementById('corr-search');
  const typeSelect = document.getElementById('corr-type');

  function renderTable() {
    const query = searchInput.value.toLowerCase();
    const typeFilter = typeSelect.value;
    const filtered = MATERIALS_TABLE.filter(mat => {
      const matchName = mat.name.toLowerCase().includes(query);
      const matchType = typeFilter === 'all' || mat.type === typeFilter;
      return matchName && matchType;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${MEDIA.length + 1}" style="padding: 20px; text-align: center; color: var(--text-muted);">Ничего не найдено</td></tr>`;
      return;
    }
    tbody.innerHTML = filtered.map(mat => `
      <tr>
        <td>${mat.name}</td>
        ${MEDIA.map(media => {
          const rate = mat.r[media.id] || 'D';
          return `<td class="rating-${rate}">${rate}</td>`;
        }).join('')}
      </tr>
    `).join('');
  }
  searchInput.addEventListener('input', renderTable);
  typeSelect.addEventListener('change', renderTable);
  renderTable();
}