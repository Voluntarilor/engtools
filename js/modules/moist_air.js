import { fmt, parseNum } from '../utils.js';

// Единицы давления (базовая - кПа)
const PRESS_UNITS = {
  'kPa': { name: 'кПа', factor: 1 },
  'bar': { name: 'бар', factor: 100 },
  'MPa': { name: 'МПа', factor: 1000 },
  'atm': { name: 'атм', factor: 101.325 },
  'kgf': { name: 'кгс/см²', factor: 98.0665 },
  'mmHg': { name: 'мм рт.ст.', factor: 0.133322 }
};

export function renderMoistAir(root) {
  root.innerHTML = `
    <style>
      .steam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; }
      @media (max-width: 900px) { .steam-grid { grid-template-columns: 1fr; } }
      .result-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
      .result-table td { padding: 8px 4px; border-bottom: 1px dashed var(--border); }
      .result-table td:last-child { text-align: right; font-weight: 600; font-family: monospace; }
      .input-with-unit { display: grid; grid-template-columns: 1fr 70px; gap: 6px; align-items: stretch; }
      .input-with-unit input { width: 100%; min-width: 0; }
      .input-with-unit select { width: 100%; padding: 0 4px; font-size: 13px; }
      .info-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px; font-size: 13px; color: #166534; margin-bottom: 15px; border-radius: 4px; line-height: 1.4; }
    </style>

    <div class="steam-grid">
      <!-- ЛЕВАЯ КОЛОНКА -->
      <div class="module-form">
        <h3 style="margin-top: 0; color: var(--primary);">Влажный воздух</h3>
        
        <div class="form-row">
          <div class="field">
            <label>Барометрическое давление</label>
            <div class="input-with-unit">
              <input type="number" id="ma-P" step="any" value="101.325">
              <select id="ma-P-unit">
                ${Object.entries(PRESS_UNITS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label>Расход воздуха</label>
            <div class="input-with-unit">
              <input type="number" id="ma-G" step="any" value="1000">
              <select id="ma-G-unit">
                <option value="kgh">кг/ч</option>
                <option value="kgs">кг/с</option>
                <option value="m3h">м³/ч</option>
                <option value="m3s">м³/с</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Расход относится к:</label>
            <select id="ma-G-base">
              <option value="dry">Сухому воздуху</option>
              <option value="moist">Влажному воздуху (смеси)</option>
            </select>
          </div>
        </div>

        <h4 style="margin: 15px 0 10px; color: #2980b9; font-size: 15px;">Вход (точка 1)</h4>
        <div class="form-row">
          <div class="field">
            <label>Температура, °C</label>
            <input type="number" id="ma-T1" step="any" value="30">
          </div>
          <div class="field">
            <label>Отн. влажность φ, %</label>
            <input type="number" id="ma-phi1" step="any" value="60" min="0" max="100">
          </div>
        </div>

        <h4 style="margin: 15px 0 10px; color: #2980b9; font-size: 15px;">Процесс</h4>
        <div class="field" style="margin-bottom: 10px;">
          <select id="ma-mode">
            <option value="props">1. Только параметры воздуха</option>
            <option value="cooling">2. Охлаждение (с конденсацией)</option>
            <option value="adiabatic_temp">3а. Увлажнение (задана T выхода)</option>
            <option value="adiabatic_phi">3б. Увлажнение (задана φ выхода)</option>
          </select>
        </div>

        <div class="form-row" id="ma-target-temp" style="display: none;">
          <div class="field">
            <label>Температура на выходе, °C</label>
            <input type="number" id="ma-T2" step="any" value="15">
          </div>
        </div>

        <div class="form-row" id="ma-target-phi" style="display: none;">
          <div class="field">
            <label>Отн. влажность на выходе, %</label>
            <input type="number" id="ma-phi2" step="any" value="90" min="0" max="100">
          </div>
        </div>

        <button type="button" class="btn btn-primary" id="btn-calc-ma">Рассчитать</button>
        <div id="ma-result" style="margin-top: 20px;"></div>
      </div>

      <!-- ПРАВАЯ КОЛОНКА (ДИАГРАММА) -->
      <div class="module-form">
        <h3 style="margin-top: 0; color: var(--primary);">I-d Диаграмма (Молье)</h3>
        <div id="ma-diagram" style="text-align: center; margin-top: 10px;"></div>
      </div>
    </div>
  `;

  const modeSel = document.getElementById('ma-mode');
  const targetTemp = document.getElementById('ma-target-temp');
  const targetPhi = document.getElementById('ma-target-phi');
  
  const pInput = document.getElementById('ma-P');
  const pUnitSel = document.getElementById('ma-P-unit');
  const gInput = document.getElementById('ma-G');
  const gUnitSel = document.getElementById('ma-G-unit');

  modeSel.addEventListener('change', () => {
    targetTemp.style.display = 'none';
    targetPhi.style.display = 'none';
    if (modeSel.value === 'cooling' || modeSel.value === 'adiabatic_temp') targetTemp.style.display = 'block';
    if (modeSel.value === 'adiabatic_phi') targetPhi.style.display = 'block';
  });

  // Конвертер давления
  let lastPUnit = 'kPa';
  pUnitSel.addEventListener('change', () => {
    const val = parseNum(pInput.value);
    if (!isFinite(val)) return;
    pInput.value = fmt((val * PRESS_UNITS[lastPUnit].factor) / PRESS_UNITS[pUnitSel.value].factor, 5);
    lastPUnit = pUnitSel.value;
  });

  // Конвертер расхода
  let lastGUnit = 'kgh';
  gUnitSel.addEventListener('change', () => {
    const val = parseNum(gInput.value);
    if (!isFinite(val)) return;
    
    const P_val = parseNum(pInput.value) * PRESS_UNITS[pUnitSel.value].factor;
    const T1 = parseNum(document.getElementById('ma-T1').value);
    const phi1 = parseNum(document.getElementById('ma-phi1').value);
    const base = document.getElementById('ma-G-base').value;
    
    if (!isFinite(P_val) || !isFinite(T1) || !isFinite(phi1)) return;
    const state1 = getAirState(T1, phi1, P_val);
    const rho = base === 'moist' ? state1.rho_moist : state1.rho_dry;

    let val_kg_s = 0;
    if (lastGUnit === 'kgh') val_kg_s = val / 3600;
    else if (lastGUnit === 'kgs') val_kg_s = val;
    else if (lastGUnit === 'm3h') val_kg_s = (val / 3600) * rho;
    else if (lastGUnit === 'm3s') val_kg_s = val * rho;

    let newVal = 0;
    if (gUnitSel.value === 'kgh') newVal = val_kg_s * 3600;
    else if (gUnitSel.value === 'kgs') newVal = val_kg_s;
    else if (gUnitSel.value === 'm3h') newVal = (val_kg_s / rho) * 3600;
    else if (gUnitSel.value === 'm3s') newVal = val_kg_s / rho;

    gInput.value = fmt(newVal, 3);
    lastGUnit = gUnitSel.value;
  });

  document.getElementById('btn-calc-ma').addEventListener('click', () => {
    try {
      const res = calcMoistAir();
      document.getElementById('ma-result').innerHTML = renderResult(res);
      drawDiagram(res);
    } catch (err) {
      document.getElementById('ma-result').innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
}

// --- ТЕРМОДИНАМИКА ---
function pSat(T) { return 0.6112 * Math.exp((17.67 * T) / (T + 243.5)); }
function dFromPv(pv, P) { return pv >= P ? 0 : 622 * (pv / (P - pv)); }
function pvFromD(d, P) { return (d * P) / (622 + d); }
function getDewPoint(pv) {
  if (pv <= 0) return -99;
  const alpha = Math.log(pv / 0.6112);
  return (243.5 * alpha) / (17.67 - alpha);
}
function enthalpy(T, d) { return 1.006 * T + (d / 1000) * (2501 + 1.86 * T); }

function getAirState(T, phi, P) {
  const p_sat = pSat(T);
  const pv = (phi / 100) * p_sat;
  const p_da = P - pv; // Парциальное давление сухого воздуха
  const d = dFromPv(pv, P);
  const h = enthalpy(T, d);
  const dewPoint = getDewPoint(pv);
  
  const T_K = T + 273.15;
  const rho_moist = (p_da * 1000) / (287.05 * T_K) + (pv * 1000) / (461.5 * T_K);
  const rho_dry = (p_da * 1000) / (287.05 * T_K);
  
  return { T, phi, p_sat, pv, p_da, d, h, dewPoint, rho_moist, rho_dry };
}

// --- РАСЧЕТ ---
function calcMoistAir() {
  const P_val = parseNum(document.getElementById('ma-P').value);
  const P_unit = document.getElementById('ma-P-unit').value;
  const P = P_val * PRESS_UNITS[P_unit].factor; // в кПа

  const G_val = parseNum(document.getElementById('ma-G').value);
  const G_unit = document.getElementById('ma-G-unit').value;
  const G_base = document.getElementById('ma-G-base').value;

  const T1 = parseNum(document.getElementById('ma-T1').value);
  const phi1 = parseNum(document.getElementById('ma-phi1').value);
  const mode = document.getElementById('ma-mode').value;

  if (P <= 0 || G_val <= 0 || !isFinite(T1) || !isFinite(phi1)) throw new Error('Проверьте входные данные.');
  if (phi1 < 0 || phi1 > 100) throw new Error('Влажность должна быть от 0 до 100%.');

  const state1 = getAirState(T1, phi1, P);
  
  // Перевод расхода в кг/с (база: сухой или влажный)
  let massFlow = 0; // кг/с
  if (G_unit === 'kgh') massFlow = G_val / 3600;
  else if (G_unit === 'kgs') massFlow = G_val;
  else if (G_unit === 'm3h') massFlow = (G_val / 3600) * (G_base === 'moist' ? state1.rho_moist : state1.rho_dry);
  else if (G_unit === 'm3s') massFlow = G_val * (G_base === 'moist' ? state1.rho_moist : state1.rho_dry);

  let G_s = 0; // кг/с сухого воздуха
  if (G_base === 'moist') {
    G_s = massFlow / (1 + state1.d / 1000);
  } else {
    G_s = massFlow;
  }

  let state2 = null;
  let Q_kW = 0;
  let G_cond = 0;
  let G_water = 0;
  let processName = 'Только параметры';

  if (mode === 'cooling') {
    const T2 = parseNum(document.getElementById('ma-T2').value);
    if (T2 >= T1) throw new Error('При охлаждении T2 должна быть меньше T1.');
    
    if (T2 < state1.dewPoint) {
      state2 = getAirState(T2, 100, P);
      G_cond = G_s * (state1.d - state2.d) / 1000;
      processName = 'Охлаждение с конденсацией';
    } else {
      state2 = getAirState(T2, (state1.pv / pSat(T2)) * 100, P);
      G_cond = 0;
      processName = 'Сухое охлаждение';
    }
    Q_kW = G_s * (state1.h - state2.h);

  } else if (mode === 'adiabatic_temp') {
    const T2 = parseNum(document.getElementById('ma-T2').value);
    if (T2 >= T1) throw new Error('При увлажнении T2 должна быть меньше T1.');
    
    const h2 = state1.h;
    const d2 = (h2 - 1.006 * T2) / (2501 + 1.86 * T2) * 1000;
    const pv2 = pvFromD(d2, P);
    
    if (pv2 > pSat(T2)) throw new Error('Невозможно: воздух перенасыщен. Задайте T2 повыше.');
    
    const phi2 = (pv2 / pSat(T2)) * 100;
    state2 = getAirState(T2, phi2, P);
    G_water = G_s * (state2.d - state1.d) / 1000;
    processName = 'Адиабатическое увлажнение';

  } else if (mode === 'adiabatic_phi') {
    const phi2 = parseNum(document.getElementById('ma-phi2').value);
    if (phi2 <= 0 || phi2 > 100) throw new Error('Влажность должна быть от 0 до 100%.');
    
    const h_target = state1.h;
    let t_min = -20, t_max = T1, T2 = 0;
    
    for (let i = 0; i < 50; i++) {
      T2 = (t_min + t_max) / 2;
      const p_sat = pSat(T2);
      const pv = (phi2 / 100) * p_sat;
      const d2 = dFromPv(pv, P);
      const h2 = enthalpy(T2, d2);
      
      if (h2 > h_target) t_max = T2;
      else t_min = T2;
    }
    
    state2 = getAirState(T2, phi2, P);
    G_water = G_s * (state2.d - state1.d) / 1000;
    processName = 'Адиабатическое увлажнение';
  }

  return { P, G_s, state1, state2, Q_kW, G_cond, G_water, mode, processName };
}

// --- ОТРИСОВКА РЕЗУЛЬТАТА ---
function renderResult(r) {
  const s1 = r.state1;
  let html = `
    <div class="result-box">
      <h3>Параметры воздуха (Точка 1)</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Расход сухого воздуха: <b>${fmt(r.G_s * 3600, 2)} кг/ч</b></p>
      <table class="result-table">
        <tr><td>Температура T1</td><td>${fmt(s1.T, 1)} °C</td></tr>
        <tr><td>Отн. влажность φ1</td><td>${fmt(s1.phi, 1)} %</td></tr>
        <tr><td>Влагосодержание d1</td><td>${fmt(s1.d, 2)} г/кг</td></tr>
        <tr><td>Энтальпия h1</td><td>${fmt(s1.h, 1)} кДж/кг</td></tr>
        <tr><td style="color: #ef4444; font-weight: 600;">Точка росы (вход)</td><td style="color: #ef4444;">${fmt(s1.dewPoint, 1)} °C</td></tr>
        <tr><td>Плотность влаж. воздуха</td><td>${fmt(s1.rho_moist, 3)} кг/м³</td></tr>
      </table>
    </div>
  `;

  if (r.mode !== 'props' && r.state2) {
    const s2 = r.state2;
    
    // Диагностический блок
    let diagnosis = '';
    if (r.mode === 'cooling') {
      if (r.G_cond > 0) {
        diagnosis = `<div class="info-box" style="background:#fef2f2; border-color:#ef4444; color:#991b1b;">
          ⚠️ <b>Идёт конденсация:</b> Конечная температура (${fmt(s2.T, 1)} °C) ниже точки росы (${fmt(s1.dewPoint, 1)} °C). Воздух на выходе 100% насыщен, выпадает конденсат.
        </div>`;
      } else {
        diagnosis = `<div class="info-box" style="background:#f0fdf4; border-color:#22c55e; color:#166534;">
          ✅ <b>Без конденсации:</b> Конечная температура (${fmt(s2.T, 1)} °C) выше точки росы (${fmt(s1.dewPoint, 1)} °C). Влага не выпадает, относительная влажность падает до ${fmt(s2.phi, 1)}%.
        </div>`;
      }
    } else {
      diagnosis = `<div class="info-box">Процесс: ${r.processName}. Влага не выпадает, а поглощается воздухом.</div>`;
    }

    html += `
      <div class="result-box" style="border: 2px solid var(--accent);">
        <h3>Результат: ${r.processName}</h3>
        ${diagnosis}
        
        ${r.Q_kW !== 0 ? `<div class="result-row highlight"><span class="label">Тепловая мощность</span><span class="value">${fmt(Math.abs(r.Q_kW), 2)} кВт</span></div>` : ''}
        ${r.G_cond > 0 ? `<div class="result-row"><span class="label">Выпало конденсата</span><span class="value">${fmt(r.G_cond * 3600, 2)} кг/ч</span></div>` : ''}
        ${r.G_water > 0 ? `<div class="result-row"><span class="label">Добавлено воды</span><span class="value">${fmt(r.G_water * 3600, 2)} кг/ч</span></div>` : ''}
        
        <h4 style="margin-top: 15px;">Параметры на выходе (Точка 2)</h4>
        <table class="result-table">
          <tr><td>Температура T2</td><td>${fmt(s2.T, 1)} °C</td></tr>
          <tr><td>Отн. влажность φ2</td><td>${fmt(s2.phi, 1)} %</td></tr>
          <tr><td>Влагосодержание d2</td><td>${fmt(s2.d, 2)} г/кг</td></tr>
          <tr><td>Энтальпия h2</td><td>${fmt(s2.h, 1)} кДж/кг</td></tr>
          <tr><td style="color: #ef4444; font-weight: 600;">Точка росы (выход)</td><td style="color: #ef4444;">${fmt(s2.dewPoint, 1)} °C</td></tr>
        </table>
      </div>
    `;
  }
  return html;
}

// --- УМНАЯ ДИАГРАММА ---
function drawDiagram(r) {
  const W = 380, H = 300;
  const padL = 50, padR = 30, padT = 20, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 1. УМНЫЙ МАСШТАБ (чтобы точки всегда помещались)
  let maxD = 30;
  let maxH = 100;
  if (r.state2) {
    maxD = Math.max(maxD, r.state1.d, r.state2.d) * 1.15;
    maxH = Math.max(maxH, r.state1.h, r.state2.h) * 1.15;
  } else {
    maxD = Math.max(maxD, r.state1.d * 1.2);
    maxH = Math.max(maxH, r.state1.h * 1.2);
  }

  const mapX = d => padL + (d / maxD) * plotW;
  const mapY = h => padT + plotH - (h / maxH) * plotH;

  // 2. СЕТКА (Серая, на фоне)
  let gridSvg = '';
  for (let d = 0; d <= maxD; d += maxD / 5) {
    gridSvg += `<line x1="${mapX(d)}" y1="${padT}" x2="${mapX(d)}" y2="${padT + plotH}" stroke="#f1f5f9" stroke-width="1" />`;
    gridSvg += `<text x="${mapX(d)}" y="${padT + plotH + 15}" text-anchor="middle" font-size="10" fill="#94a3b8">${fmt(d, 0)}</text>`;
  }
  for (let h = 0; h <= maxH; h += maxH / 5) {
    gridSvg += `<line x1="${padL}" y1="${mapY(h)}" x2="${W - padR}" y2="${mapY(h)}" stroke="#f1f5f9" stroke-width="1" />`;
    gridSvg += `<text x="${padL - 8}" y="${mapY(h) + 4}" text-anchor="end" font-size="10" fill="#94a3b8">${fmt(h, 0)}</text>`;
  }

  // 3. КРИВЫЕ ОТНОСИТЕЛЬНОЙ ВЛАЖНОСТИ (φ)
  let phiPaths = '';
  const phiValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  phiValues.forEach(phi => {
    let path = '';
    for (let t = 0; t <= 60; t += 2) {
      const p_sat = pSat(t);
      const pv = (phi / 100) * p_sat;
      const d = dFromPv(pv, r.P);
      const h = enthalpy(t, d);
      
      if (d <= maxD && h <= maxH) {
        path += (path === '' ? `M ${mapX(d)} ${mapY(h)}` : ` L ${mapX(d)} ${mapY(h)}`);
      }
    }
    if (path) {
      const isSat = phi === 100;
      phiPaths += `<path d="${path}" fill="none" stroke="${isSat ? '#64748b' : '#e2e8f0'}" stroke-width="${isSat ? '2' : '1.5'}" />`;
      
      // Подпись в конце кривой
      if (phi % 20 === 0) {
         const labelT = Math.min(40, 60); // Высота подписи
         const p_sat_lbl = pSat(labelT);
         const d_lbl = dFromPv((phi/100)*p_sat_lbl, r.P);
         const h_lbl = enthalpy(labelT, d_lbl);
         if (d_lbl < maxD && h_lbl < maxH) {
             phiPaths += `<text x="${mapX(d_lbl)}" y="${mapY(h_lbl) - 4}" font-size="9" fill="#94a3b8">φ=${phi}%</text>`;
         }
      }
    }
  });

  // 4. ЛИНИИ ПОСТОЯННОЙ ТЕМПЕРАТУРЫ (Изотермы)
  let isoPaths = '';
  const temps = [0, 10, 20, 30, 40, 50];
  temps.forEach(t => {
    const h_at_0 = enthalpy(t, 0);
    const p_sat = pSat(t);
    const d_max = dFromPv(p_sat, r.P);
    const h_max = enthalpy(t, d_max);
    
    if (d_max <= maxD && h_max <= maxH) {
      isoPaths += `<line x1="${mapX(0)}" y1="${mapY(h_at_0)}" x2="${mapX(d_max)}" y2="${mapY(h_max)}" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" />`;
      isoPaths += `<text x="${mapX(d_max) + 5}" y="${mapY(h_max) + 3}" font-size="10" fill="#f59e0b">t=${t}°C</text>`;
    }
  });

  // 5. ПРОЦЕСС
  const p1x = mapX(r.state1.d);
  const p1y = mapY(r.state1.h);
  let processSvg = `
    <circle cx="${p1x}" cy="${p1y}" r="5" fill="#3b82f6" stroke="#fff" stroke-width="2" />
    <text x="${p1x + 8}" y="${p1y - 8}" font-size="12" fill="#3b82f6" font-weight="bold">1</text>
  `;

  if (r.state2) {
    const p2x = mapX(r.state2.d);
    const p2y = mapY(r.state2.h);
    
    processSvg += `<line x1="${p1x}" y1="${p1y}" x2="${p2x}" y2="${p2y}" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />`;
    processSvg += `<circle cx="${p2x}" cy="${p2y}" r="5" fill="#ef4444" stroke="#fff" stroke-width="2" />`;
    processSvg += `<text x="${p2x + 8}" y="${p2y - 8}" font-size="12" fill="#ef4444" font-weight="bold">2</text>`;
  }

  // Отрисовка SVG
  document.getElementById('ma-diagram').innerHTML = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background: #fff; border-radius: 8px; border: 1px solid #eee;">
      ${gridSvg}
      ${phiPaths}
      ${isoPaths}
      ${processSvg}
      
      <!-- Оси -->
      <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1.5" />
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1.5" />
      
      <text x="${padL + plotW/2}" y="${H - 5}" text-anchor="middle" font-size="11" fill="#475569" font-weight="bold">Влагосодержание d, г/кг</text>
      <text x="12" y="${padT + plotH/2}" text-anchor="middle" transform="rotate(-90, 12, ${padT + plotH/2})" font-size="11" fill="#475569" font-weight="bold">Энтальпия h, кДж/кг</text>
    </svg>
    <div style="font-size: 11px; color: var(--text-muted); margin-top: 10px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
      <span><span style="color:#64748b; font-weight:bold;">—</span> φ=100% (насыщение)</span>
      <span><span style="color:#f59e0b;">---</span> Изотермы</span>
      <span><span style="color:#ef4444;">---</span> Процесс</span>
    </div>
  `;
}