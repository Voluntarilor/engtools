import { fmt, parseNum, saveState, loadState } from '../utils.js';
import { solvePT, solvePx, solveTx } from 'https://esm.sh/iapws-if97@2.2.0';

// Константы перевода давления в МПа
const PRESS_UNITS = {
  'bar': { name: 'бар', factor: 0.1, atm_equiv: 1.01325 },
  'MPa': { name: 'МПа', factor: 1.0, atm_equiv: 0.101325 },
  'kgf': { name: 'кгс/см²', factor: 0.0980665, atm_equiv: 1.0332 },
  'kPa': { name: 'кПа', factor: 0.001, atm_equiv: 101.325 },
  'atm': { name: 'атм', factor: 0.101325, atm_equiv: 1.0 }
};
const P_ATM_BAR = 1.01325; // Атмосферное давление в барах

export function renderSteam(root) {
  root.innerHTML = `
    <style>
      .steam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
      @media (max-width: 768px) { .steam-grid { grid-template-columns: 1fr; } }
      .input-with-unit { display: grid; grid-template-columns: 1fr 80px; gap: 6px; align-items: stretch; }
      .input-with-unit input { width: 100%; min-width: 0; }
      .input-with-unit select { width: 100%; padding: 0 4px; font-size: 13px; }
      .result-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
      .result-table td { padding: 8px 4px; border-bottom: 1px dashed var(--border); }
      .result-table td:last-child { text-align: right; font-weight: 600; font-family: monospace; }
      .phase-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: #fff; margin-bottom: 10px; }
      .phase-liquid { background: #3b82f6; }
      .phase-sat { background: #f59e0b; }
      .phase-super { background: #ef4444; }
      .btn-save { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 15px; width: 100%; transition: 0.2s; }
      .btn-save:hover { background: #bbf7d0; }
      .saved-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; border: 1px solid #e2e8f0; font-size: 14px; }
      .btn-del { background: #fee2e2; color: #b91c1c; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-weight: bold; }
    </style>

    <div class="steam-grid">
      <div class="module-form">
        <h3 style="margin-top: 0; color: var(--primary);">Свойства воды и пара</h3>
        
        <div class="form-row">
          <div class="field">
            <label>Режим ввода</label>
            <select id="st-mode">
              <option value="PT">Давление + Температура</option>
              <option value="P_sat">Насыщение (по давлению)</option>
              <option value="T_sat">Насыщение (по температуре)</option>
              <option value="Px">Влажный пар (P + сухость)</option>
            </select>
          </div>
          <div class="field">
            <label>Давление</label>
            <div class="input-with-unit">
              <input type="number" id="st-p" step="any" value="1">
              <select id="st-p-unit">
                <option value="bar">бар</option>
                <option value="MPa">МПа</option>
                <option value="kgf">кгс/см²</option>
                <option value="kPa">кПа</option>
                <option value="atm">атм</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="field">
            <label>Тип давления</label>
            <select id="st-p-type">
              <option value="abs">Абсолютное</option>
              <option value="gauge">Избыточное</option>
            </select>
          </div>
          <div class="field" id="st-temp-field">
            <label>Температура, °C</label>
            <input type="number" id="st-t" step="any" value="100">
          </div>
        </div>

        <div class="form-row" id="st-quality-field" style="display: none;">
          <div class="field">
            <label>Степень сухости (влажность) x, 0..1</label>
            <input type="number" id="st-x" step="0.01" min="0" max="1" value="0.95">
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="btn-calc-steam">Рассчитать</button>
        
        <div id="steam-result" style="margin-top: 20px;"></div>
      </div>

      <div>
        <div class="module-form">
          <h3 style="margin-top: 0; color: var(--primary);">Мощность при конденсации</h3>
          <div class="form-row">
            <div class="field">
              <label>Расход пара</label>
              <div class="input-with-unit">
                <input type="number" id="cond-G" step="any" value="1000">
                <select id="cond-G-unit">
                  <option value="kgh">кг/ч</option>
                  <option value="kgs">кг/с</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Температура конденсата, °C</label>
              <input type="number" id="cond-T-out" step="any" value="80">
            </div>
          </div>
          <p class="hint" style="margin-bottom: 10px;">Используются параметры пара из левого калькулятора.</p>
          <button type="button" class="btn btn-secondary" id="btn-calc-cond" style="width: 100%;">Рассчитать мощность</button>
          <div id="cond-result" style="margin-top: 15px;"></div>
        </div>

        <div class="module-form" style="margin-top: 20px;">
          <h3 style="margin-top: 0; color: var(--primary);">Фазовая диаграмма (P-T)</h3>
          <div id="diagram-container" style="text-align: center;"></div>
        </div>
      </div>
    </div>

    <div class="result-box" id="library-box" style="display: none; margin-top: 20px;">
      <h3>📚 Сохраненные среды (Пар/Вода)</h3>
      <div id="saved-steam-list"></div>
    </div>
  `;

  const modeSel = document.getElementById('st-mode');
  const pInput = document.getElementById('st-p');
  const pUnitSel = document.getElementById('st-p-unit');
  const pTypeSel = document.getElementById('st-p-type');
  const tInput = document.getElementById('st-t');
  const tempField = document.getElementById('st-temp-field');
  const qualityField = document.getElementById('st-quality-field');

  let lastResult = null;
  let lastPUnit = pUnitSel.value;
  let lastPType = pTypeSel.value;

  // Переключение видимости полей
  modeSel.addEventListener('change', () => {
    const mode = modeSel.value;
    if (mode === 'PT') {
      tempField.style.display = 'block';
      qualityField.style.display = 'none';
    } else if (mode === 'P_sat') {
      tempField.style.display = 'none';
      qualityField.style.display = 'none';
    } else if (mode === 'T_sat') {
      tempField.style.display = 'block';
      qualityField.style.display = 'none';
    } else if (mode === 'Px') {
      tempField.style.display = 'none';
      qualityField.style.display = 'block';
    }
  });

  // --- УМНЫЙ ПЕРЕВОД ЕДИНИЦ ДАВЛЕНИЯ ---
  pUnitSel.addEventListener('change', () => {
    const val = parseNum(pInput.value);
    if (!isFinite(val)) return;
    const oldFactor = PRESS_UNITS[lastPUnit].factor;
    const newFactor = PRESS_UNITS[pUnitSel.value].factor;
    // Переводим в МПа и обратно в новую единицу
    pInput.value = fmt((val * oldFactor) / newFactor, 5).replace(/\.?0+$/, '');
    lastPUnit = pUnitSel.value;
  });

  // --- ПЕРЕВОД АБСОЛЮТНОГО/ИЗБЫТОЧНОГО ---
  pTypeSel.addEventListener('change', () => {
    const val = parseNum(pInput.value);
    if (!isFinite(val)) return;
    const atm_in_unit = PRESS_UNITS[pUnitSel.value].atm_equiv;
    
    if (lastPType === 'abs' && pTypeSel.value === 'gauge') {
      pInput.value = fmt(val - atm_in_unit, 4);
    } else if (lastPType === 'gauge' && pTypeSel.value === 'abs') {
      pInput.value = fmt(val + atm_in_unit, 4);
    }
    lastPType = pTypeSel.value;
  });

  document.getElementById('btn-calc-steam').addEventListener('click', () => {
    try {
      const res = calcSteam();
      lastResult = res;
      document.getElementById('steam-result').innerHTML = renderSteamResult(res) + 
        `<button type="button" class="btn-save" id="btn-save-steam">💾 Сохранить в библиотеку</button>`;
      
      document.getElementById('btn-save-steam').addEventListener('click', () => saveToLibrary(res));
      drawDiagram(res);
    } catch (err) {
      document.getElementById('steam-result').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });

  document.getElementById('btn-calc-cond').addEventListener('click', () => {
    if (!lastResult) {
      document.getElementById('cond-result').innerHTML = `<div class="error-msg">Сначала рассчитайте свойства пара слева.</div>`;
      return;
    }
    try {
      const condRes = calcCondensation(lastResult);
      document.getElementById('cond-result').innerHTML = `
        <div class="result-row highlight">
          <span class="label">Тепловая мощность Q</span>
          <span class="value">${fmt(condRes.Q_kW, 2)} кВт</span>
        </div>
        <div class="result-row">
          <span class="label">Энтальпия пара (на входе)</span>
          <span class="value">${fmt(lastResult.h, 1)} кДж/кг</span>
        </div>
        <div class="result-row">
          <span class="label">Энтальпия конденсата</span>
          <span class="value">${fmt(condRes.h_out, 1)} кДж/кг</span>
        </div>
      `;
    } catch (err) {
      document.getElementById('cond-result').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });

  document.getElementById('btn-calc-steam').click();
  updateLibraryUI();
}

function calcSteam() {
  const mode = document.getElementById('st-mode').value;
  const pVal = parseNum(document.getElementById('st-p').value);
  const pUnit = document.getElementById('st-p-unit').value;
  const pType = document.getElementById('st-p-type').value;
  const tVal = parseNum(document.getElementById('st-t').value);
  const xVal = parseNum(document.getElementById('st-x').value);

  if (!isFinite(pVal) || pVal <= 0) throw new Error('Введите корректное давление.');

  let p_MPa = pVal * PRESS_UNITS[pUnit].factor;
  if (pType === 'gauge') p_MPa += (P_ATM_BAR * PRESS_UNITS['bar'].factor);

  let state, phaseName, phaseClass, t_C;

  try {
    if (mode === 'PT') {
      t_C = tVal;
      const T_K = t_C + 273.15;
      
      // ПРОВЕРКА НА ЛИНИЮ НАСЫЩЕНИЯ
      const satState = solvePx(p_MPa, 0.5);
      const tSat_C = satState.temperature - 273.15;
      
      if (Math.abs(t_C - tSat_C) < 0.15) {
        // Если мы близко к Tsat, принудительно считаем как насыщение
        const liq = solvePx(p_MPa, 0);
        const vap = solvePx(p_MPa, 1);
        return buildResult(p_MPa, tSat_C, 'На линии насыщения', 'phase-sat', liq, vap);
      }

      state = solvePT(p_MPa, T_K);
      if (state.region === 1) { phaseName = 'Жидкость'; phaseClass = 'phase-liquid'; }
      else if (state.region === 2) { phaseName = 'Перегретый пар'; phaseClass = 'phase-super'; }
      else { phaseName = `Регион ${state.region}`; phaseClass = 'phase-sat'; }
    } 
    else if (mode === 'P_sat') {
      const satState = solvePx(p_MPa, 0.5);
      t_C = satState.temperature - 273.15;
      const liq = solvePx(p_MPa, 0);
      const vap = solvePx(p_MPa, 1);
      return buildResult(p_MPa, t_C, 'Насыщение', 'phase-sat', liq, vap);
    } 
    else if (mode === 'T_sat') {
      t_C = tVal;
      const T_K = t_C + 273.15;
      const liq = solveTx(T_K, 0);
      const vap = solveTx(T_K, 1);
      p_MPa = liq.pressure;
      return buildResult(p_MPa, t_C, 'Насыщение', 'phase-sat', liq, vap);
    } 
    else if (mode === 'Px') {
      if (xVal < 0 || xVal > 1) throw new Error('Степень сухости должна быть от 0 до 1.');
      state = solvePx(p_MPa, xVal);
      t_C = state.temperature - 273.15;
      phaseName = `Влажный пар (x=${xVal})`;
      phaseClass = 'phase-sat';
    }
  } catch (e) {
    throw new Error('Ошибка расчета. Параметры вне диапазона IAPWS-IF97.');
  }

  return buildResult(p_MPa, t_C, phaseName, phaseClass, state, null);
}

function buildResult(p_MPa, t_C, phaseName, phaseClass, stateLiqOrSingle, stateVap = null) {
  const p_bar = p_MPa / 0.1;
  const isSat = stateVap !== null;
  const mainState = isSat ? stateVap : stateLiqOrSingle;
  
  return {
    p_MPa, p_bar, t_C, phaseName, phaseClass,
    v: mainState.specificVolume,
    rho: mainState.density,
    h: mainState.enthalpy,
    s: mainState.entropy,
    cp: mainState.cp,
    mu: mainState.viscosity,
    k: mainState.thermalConductivity,
    x: mainState.quality,
    isSat,
    h_liq: isSat ? stateLiqOrSingle.enthalpy : null,
    h_vap: isSat ? stateVap.enthalpy : null,
    stateLiq: stateLiqOrSingle,
    stateVap: mainState
  };
}

function renderSteamResult(r) {
  const hDisplay = r.isSat 
    ? `<div style="color: #3b82f6;">h' (жидкость): ${fmt(r.h_liq, 1)} кДж/кг</div>
       <div style="color: #ef4444;">h'' (пар): ${fmt(r.h_vap, 1)} кДж/кг</div>`
    : `<span class="value">${fmt(r.h, 1)} кДж/кг</span>`;

  return `
    <div class="phase-badge ${r.phaseClass}">${r.phaseName}</div>
    <table class="result-table">
      <tr><td>Давление (абс.)</td><td>${fmt(r.p_bar, 3)} бар (${fmt(r.p_MPa, 4)} МПа)</td></tr>
      <tr><td>Температура</td><td>${fmt(r.t_C, 2)} °C</td></tr>
      <tr><td>Удельный объем v</td><td>${fmt(r.v, 5)} м³/кг</td></tr>
      <tr><td>Плотность ρ</td><td>${fmt(r.rho, 4)} кг/м³</td></tr>
      <tr><td>Энтальпия h</td><td>${hDisplay}</td></tr>
      <tr><td>Энтропия s</td><td>${fmt(r.s, 4)} кДж/(кг·К)</td></tr>
      <tr><td>Теплоемкость Cp</td><td>${fmt(r.cp, 4)} кДж/(кг·К)</td></tr>
      <tr><td>Вязкость μ</td><td>${fmt(r.mu * 1e6, 2)} мкПа·с</td></tr>
      <tr><td>Теплопроводность λ</td><td>${fmt(r.k, 4)} Вт/(м·К)</td></tr>
      ${r.x !== null && r.x !== undefined ? `<tr><td>Степень сухости x</td><td>${fmt(r.x, 3)}</td></tr>` : ''}
    </table>
  `;
}

function calcCondensation(steamData) {
  const G_val = parseNum(document.getElementById('cond-G').value);
  const G_unit = document.getElementById('cond-G-unit').value;
  const T_out = parseNum(document.getElementById('cond-T-out').value);

  if (!isFinite(G_val) || G_val <= 0) throw new Error('Введите корректный расход пара.');
  let G_kgs = G_unit === 'kgh' ? G_val / 3600 : G_val;
  
  const h_in = steamData.h; 
  const T_out_K = T_out + 273.15;
  
  let state_out;
  try {
    state_out = solvePT(steamData.p_MPa, T_out_K);
  } catch (e) {
    throw new Error('Не удалось рассчитать конденсат. Возможно, T_out выше Tsat.');
  }

  const h_out = state_out.enthalpy;
  const Q_W = G_kgs * (h_in - h_out) * 1000;

  return { Q_kW: Q_W / 1000, h_out };
}

function drawDiagram(currentData) {
  const W = 300, H = 200;
  const padL = 40, padR = 20, padT = 20, padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const mapX = (T_C) => padL + ((T_C - 0) / 374) * plotW;
  const mapY = (P_bar) => padT + plotH - (Math.log10(P_bar + 0.01) / Math.log10(225)) * plotH;

  let satPath = '';
  for (let t = 0; t <= 374; t += 5) {
    try {
      const state = solveTx(t + 273.15, 0.5);
      const p = state.pressure / 0.1;
      const x = mapX(t);
      const y = mapY(p);
      satPath += (satPath === '' ? `M ${x} ${y}` : ` L ${x} ${y}`);
    } catch (e) { /* skip */ }
  }

  const cx = mapX(currentData.t_C);
  const cy = mapY(currentData.p_bar);

  document.getElementById('diagram-container').innerHTML = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background: #fff; border-radius: 8px; border: 1px solid #eee;">
      <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1" />
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1" />
      <path d="${satPath}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4" />
      <circle cx="${cx}" cy="${cy}" r="5" fill="#ef4444" stroke="#fff" stroke-width="2" />
      <text x="${padL + plotW/2}" y="${H - 5}" text-anchor="middle" font-size="10" fill="#6b7684">Температура, °C</text>
      <text x="10" y="${padT + plotH/2}" text-anchor="middle" transform="rotate(-90, 10, ${padT + plotH/2})" font-size="10" fill="#6b7684">Давление, бар (лог)</text>
    </svg>
  `;
}

function saveToLibrary(data) {
  let lib = loadState('fluid_library') || [];
  const name = `${data.phaseName} ${fmt(data.t_C, 1)}°C / ${fmt(data.p_bar, 2)} бар`;
  if (lib.some(item => item.name === name)) {
    alert('Эта среда уже есть в библиотеке!');
    return;
  }
  const saveData = {
    name: name,
    rho: data.rho,
    cp: data.cp,
    mu: data.mu,
    source: 'steam'
  };
  lib.push(saveData);
  saveState('fluid_library', lib);
  updateLibraryUI();
  alert(`Среда "${name}" сохранена!`);
}

function updateLibraryUI() {
  const box = document.getElementById('library-box');
  const list = document.getElementById('saved-steam-list');
  const lib = (loadState('fluid_library') || []).filter(item => item.source === 'steam');

  if (lib.length === 0) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  list.innerHTML = lib.map((item) => `
    <div class="saved-item">
      <div>
        <b>${item.name}</b><br>
        <span style="font-size:12px; color:var(--text-muted);">ρ=${fmt(item.rho,2)} кг/м³, cp=${fmt(item.cp,2)} кДж/(кг·К)</span>
      </div>
      <button class="btn-del" data-name="${item.name}">✕</button>
    </div>
  `).join('');

  list.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.target.dataset.name;
      let newLib = loadState('fluid_library') || [];
      newLib = newLib.filter(item => item.name !== name);
      saveState('fluid_library', newLib);
      updateLibraryUI();
    });
  });
}