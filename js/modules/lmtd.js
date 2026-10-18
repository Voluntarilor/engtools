import { fmt, parseNum, bindPersist, saveState, loadState } from '../utils.js';

export function renderLMTD(root) {
  root.innerHTML = `
    <style>
      .input-calculated {
        font-style: italic !important;
        font-weight: 700 !important;
        color: #475569 !important;
        background-color: #f8fafc !important;
        border-color: #cbd5e1 !important;
      }
      .input-with-unit {
        display: grid;
        grid-template-columns: 1fr 80px;
        gap: 6px;
        align-items: stretch;
      }
      .input-with-unit input {
        width: 100%;
        min-width: 0;
      }
      .input-with-unit select {
        width: 100%;
        padding: 0 4px;
        font-size: 13px;
      }
      .mode-card {
        background: #fff;
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 16px;
        margin-bottom: 16px;
        position: relative;
      }
      .mode-card h4 {
        margin: 0 0 12px;
        color: var(--primary);
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btn-remove {
        background: #fee2e2;
        color: #b91c1c;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 600;
      }
      .btn-remove:hover { background: #fecaca; }
    </style>

    <form class="module-form" id="lmtd-form" autocomplete="off">
      <div class="form-row">
        <div class="field">
          <label for="l-k">Коэф. теплопередачи k, Вт/(м²·К)</label>
          <input type="number" id="l-k" step="any" value="1000">
        </div>
      </div>
      
      <div class="section-gap"></div>
      <div id="modes-container"></div>

      <button type="button" id="btn-add-mode" class="btn btn-secondary" style="width: 100%; margin-bottom: 20px;">
        + Добавить режим
      </button>

      <button type="submit" class="btn btn-primary">Рассчитать и сравнить</button>
      <p class="hint">Заполняйте только те поля, которые знаете. Программа досчитает остальное.</p>
    </form>
    <div id="lmtd-result"></div>
  `;

  const container = root.querySelector('#modes-container');
  const form = root.querySelector('#lmtd-form');
  const out = root.querySelector('#lmtd-result');
  
  let modeCount = 0;

  // Функция создания HTML одного режима
  function createModeHTML(index) {
    return `
      <div class="mode-card" data-index="${index}">
        <h4>
          <span>Режим ${index}</span>
          <button type="button" class="btn-remove" onclick="this.closest('.mode-card').remove()">Удалить</button>
        </h4>
        
        <div class="form-row">
          <div class="field">
            <label>Схема течения</label>
            <select class="m-flow">
              <option value="counter">Противоток</option>
              <option value="parallel">Прямоток</option>
            </select>
          </div>
          <div class="field"></div>
        </div>

        <h5 style="margin: 10px 0 6px; color: #c0392b; font-size: 13px;">Горячая сторона</h5>
        <div class="form-row">
          <div class="field" style="background: #fdf2f2; padding: 8px; border-radius: 6px;">
            <label>T1 (вход), °C</label>
            <input type="number" class="m-th1" step="any">
          </div>
          <div class="field" style="background: #fdf2f2; padding: 8px; border-radius: 6px;">
            <label>T2 (выход), °C</label>
            <input type="number" class="m-th2" step="any">
          </div>
        </div>
        <div class="form-row">
          <div class="field" style="background: #fdf2f2; padding: 8px; border-radius: 6px;">
            <label>Расход G, кг/ч</label>
            <input type="number" class="m-Gh" step="any">
          </div>
          <div class="field" style="background: #fdf2f2; padding: 8px; border-radius: 6px;">
            <label>cp, кДж/(кг·К)</label>
            <input type="number" class="m-cph" step="any" value="4.18">
          </div>
        </div>

        <h5 style="margin: 10px 0 6px; color: #2980b9; font-size: 13px;">Холодная сторона</h5>
        <div class="form-row">
          <div class="field" style="background: #f0f7ff; padding: 8px; border-radius: 6px;">
            <label>t1 (вход), °C</label>
            <input type="number" class="m-tc1" step="any">
          </div>
          <div class="field" style="background: #f0f7ff; padding: 8px; border-radius: 6px;">
            <label>t2 (выход), °C</label>
            <input type="number" class="m-tc2" step="any">
          </div>
        </div>
        <div class="form-row">
          <div class="field" style="background: #f0f7ff; padding: 8px; border-radius: 6px;">
            <label>Расход G, кг/ч</label>
            <input type="number" class="m-Gc" step="any">
          </div>
          <div class="field" style="background: #f0f7ff; padding: 8px; border-radius: 6px;">
            <label>cp, кДж/(кг·К)</label>
            <input type="number" class="m-cpc" step="any" value="4.18">
          </div>
        </div>

        <h5 style="margin: 10px 0 6px; color: var(--primary); font-size: 13px;">Тепловая мощность</h5>
        <div class="form-row">
          <div class="field">
            <label>Мощность Q, кВт</label>
            <input type="number" class="m-Q" step="any">
          </div>
          <div class="field"></div>
        </div>
      </div>
    `;
  }

  function addMode() {
    modeCount++;
    container.insertAdjacentHTML('beforeend', createModeHTML(modeCount));
  }

  // Добавляем два режима по умолчанию
  addMode();
  addMode();

  root.querySelector('#btn-add-mode').addEventListener('click', addMode);

  form.addEventListener('submit', e => {
    e.preventDefault();
    try {
      out.innerHTML = calc(root);
    } catch (err) {
      out.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
}

// Вспомогательная функция для чтения значения из карточки
function getVal(card, selector, isCp = false) {
  const val = parseNum(card.querySelector(selector).value);
  if (isCp && isFinite(val)) return val * 1000;
  return val;
}

function calc(root) {
  const k = parseNum(document.getElementById('l-k').value);
  if (!isFinite(k) || k <= 0) throw new Error('Коэф. теплопередачи k должен быть > 0.');

  const cards = root.querySelectorAll('.mode-card');
  const results = [];

  cards.forEach((card, idx) => {
    // Собираем элементы
    const el = {
      th1: card.querySelector('.m-th1'),
      th2: card.querySelector('.m-th2'),
      tc1: card.querySelector('.m-tc1'),
      tc2: card.querySelector('.m-tc2'),
      Gh: card.querySelector('.m-Gh'),
      Gc: card.querySelector('.m-Gc'),
      Q: card.querySelector('.m-Q')
    };

    const flow = card.querySelector('.m-flow').value;
    
    let cph = getVal(card, '.m-cph', true) || 4180;
    let cpc = getVal(card, '.m-cpc', true) || 4180;

    let th1 = getVal(card, '.m-th1');
    let th2 = getVal(card, '.m-th2');
    let tc1 = getVal(card, '.m-tc1');
    let tc2 = getVal(card, '.m-tc2');
    let Gh = getVal(card, '.m-Gh') / 3600; // переводим в кг/с
    let Gc = getVal(card, '.m-Gc') / 3600; // переводим в кг/с
    let Q = getVal(card, '.m-Q') * 1000;   // переводим в Вт

    const initial = {
      th1: isFinite(th1), th2: isFinite(th2), tc1: isFinite(tc1), tc2: isFinite(tc2),
      Gh: isFinite(Gh), Gc: isFinite(Gc), Q: isFinite(Q)
    };

    // РЕШАТЕЛЬ
    let changed = true;
    let iterations = 0;
    while (changed && iterations < 10) {
      changed = false;
      iterations++;
      if (isFinite(Q)) {
        if (isFinite(th1) && isFinite(th2) && !isFinite(Gh)) { Gh = Q / (cph * (th1 - th2)); changed = true; }
        if (isFinite(tc1) && isFinite(tc2) && !isFinite(Gc)) { Gc = Q / (cpc * (tc2 - tc1)); changed = true; }
        if (isFinite(Gh) && isFinite(th1) && !isFinite(th2)) { th2 = th1 - Q / (Gh * cph); changed = true; }
        if (isFinite(Gh) && isFinite(th2) && !isFinite(th1)) { th1 = th2 + Q / (Gh * cph); changed = true; }
        if (isFinite(Gc) && isFinite(tc1) && !isFinite(tc2)) { tc2 = tc1 + Q / (Gc * cpc); changed = true; }
        if (isFinite(Gc) && isFinite(tc2) && !isFinite(tc1)) { tc1 = tc2 - Q / (Gc * cpc); changed = true; }
      }
      if (!isFinite(Q)) {
        if (isFinite(Gh) && isFinite(th1) && isFinite(th2)) { Q = Gh * cph * (th1 - th2); changed = true; }
        else if (isFinite(Gc) && isFinite(tc1) && isFinite(tc2)) { Q = Gc * cpc * (tc2 - tc1); changed = true; }
      }
    }

    // Если данных не хватает — кидаем ошибку с указанием режима
    if (![th1, th2, tc1, tc2, Gh, Gc, Q].every(isFinite)) {
      let missing = [];
      if (!isFinite(th1)) missing.push('T1');
      if (!isFinite(th2)) missing.push('T2');
      if (!isFinite(tc1)) missing.push('t1');
      if (!isFinite(tc2)) missing.push('t2');
      if (!isFinite(Gh)) missing.push('G_гор');
      if (!isFinite(Gc)) missing.push('G_хол');
      if (!isFinite(Q)) missing.push('Q');
      throw new Error(`Режим ${idx + 1}: недостаточно данных. Не хватает: ${missing.join(', ')}.`);
    }

    // Проверка на пересечение
    let dt1, dt2;
    if (flow === 'counter') {
      dt1 = th1 - tc2; dt2 = th2 - tc1;
    } else {
      dt1 = th1 - tc1; dt2 = th2 - tc2;
    }

    const dtBig = Math.max(dt1, dt2);
    const dtSmall = Math.min(dt1, dt2);
    let lmtd = NaN;
    let hasIntersection = false;

    if (dt1 <= 0 || dt2 <= 0) {
      hasIntersection = true;
    } else if (Math.abs(dtBig - dtSmall) < 1e-6) {
      lmtd = dtBig;
    } else {
      lmtd = (dtBig - dtSmall) / Math.log(dtBig / dtSmall);
    }

    const A = isNaN(lmtd) ? NaN : Q / (k * lmtd);

    results.push({
      idx: idx + 1, flow, th1, th2, tc1, tc2, Gh, Gc, Q, lmtd, A, hasIntersection,
      initial, el
    });
  });

  // Подсветка рассчитанных полей
  results.forEach(res => {
    Object.values(res.el).forEach(input => {
      input.classList.remove('input-calculated');
      input.removeAttribute('title');
    });

    const updateField = (inputEl, currentVal, wasInitial, unitMultiplier = 1) => {
      if (!wasInitial && isFinite(currentVal)) {
        inputEl.value = (currentVal * unitMultiplier).toFixed(2).replace(/\.00$/, '');
        inputEl.classList.add('input-calculated');
        inputEl.title = 'Рассчитано автоматически';
      }
    };

    updateField(res.el.th1, res.th1, res.initial.th1);
    updateField(res.el.th2, res.th2, res.initial.th2);
    updateField(res.el.tc1, res.tc1, res.initial.tc1);
    updateField(res.el.tc2, res.tc2, res.initial.tc2);
    updateField(res.el.Gh, res.Gh, res.initial.Gh, 3600); // обратно в кг/ч
    updateField(res.el.Gc, res.Gc, res.initial.Gc, 3600); // обратно в кг/ч
    updateField(res.el.Q, res.Q, res.initial.Q, 1/1000);  // обратно в кВт
  });

  // Находим "самый тяжелый" режим (наибольшая площадь A)
  let maxA = -1;
  let maxAIdx = -1;
  results.forEach((res, i) => {
    if (!res.hasIntersection && res.A > maxA) {
      maxA = res.A;
      maxAIdx = i;
    }
  });

  // Генерация таблицы
  let tableHeaders = `<tr style="border-bottom: 2px solid var(--border); text-align: left;">
    <th style="padding: 8px 4px; color: var(--text-muted); font-weight: 500;">Параметр</th>`;
  results.forEach(r => {
    const isHeavy = r.idx === (maxAIdx + 1);
    tableHeaders += `<th style="padding: 8px 4px; font-weight: 500; ${isHeavy ? 'color: #b91c1c; background: #fef2f2;' : 'color: var(--text-muted);'}">
      Режим ${r.idx} ${isHeavy ? '🏆' : ''}
    </th>`;
  });
  tableHeaders += `</tr>`;

  const createRow = (label, valFn, isHighlight = false) => {
    let row = `<tr style="border-bottom: 1px dashed var(--border); ${isHighlight ? 'background: #f0f7ff;' : ''}">
      <td style="padding: 8px 4px;">${label}</td>`;
    results.forEach(r => {
      const isHeavy = r.idx === (maxAIdx + 1);
      const style = isHeavy ? 'color: #b91c1c; background: #fef2f2; font-weight: 600;' : 'font-weight: 600;';
      row += `<td style="padding: 8px 4px; ${style}">${valFn(r)}</td>`;
    });
    row += `</tr>`;
    return row;
  };

  const tableHTML = `
    <div class="result-box">
      <h3>Сводная таблица режимов</h3>
      ${maxAIdx !== -1 ? `<p style="margin-top: -10px; margin-bottom: 15px; color: #b91c1c; font-size: 13.5px;">
        🏆 Самый тяжелый режим: <b>Режим ${maxAIdx + 1}</b> (наибольшая требуемая площадь поверхности).
      </p>` : ''}
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; min-width: 450px;">
          <thead>${tableHeaders}</thead>
          <tbody>
            ${createRow('Схема', r => r.flow === 'counter' ? 'Противоток' : 'Прямоток')}
            ${createRow('Q, кВт', r => fmt(r.Q / 1000, 2))}
            ${createRow('LMTD, K', r => r.hasIntersection ? '<span style="color: #b91c1c;">NaN</span>' : fmt(r.lmtd, 2), true)}
            ${createRow('Площадь A, м²', r => r.hasIntersection ? '—' : fmt(r.A, 3))}
            ${createRow('Пересечение', r => r.hasIntersection ? '❌ Да' : '✅ Нет')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Графики для каждого режима
  let graphsHTML = '';
  results.forEach(r => {
    const isHeavy = r.idx === (maxAIdx + 1);
    const title = `Режим ${r.idx} ${isHeavy ? '🏆' : ''}`;
    graphsHTML += `
      <div style="border: ${isHeavy ? '2px solid #fca5a5' : '1px solid #eee'}; border-radius: 8px; padding: 10px; background: ${isHeavy ? '#fef2f2' : '#fff'};">
        ${drawGraph(r, title)}
      </div>
    `;
  });

  const graphsBoxHTML = `
    <div class="result-box">
      <h3>Температурные кривые</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        ${graphsHTML}
      </div>
    </div>
  `;

  return tableHTML + graphsBoxHTML;
}

// График остается без изменений
function niceStep(rawStep) {
  const exp = Math.floor(Math.log10(rawStep));
  const f = rawStep / Math.pow(10, exp);
  let niceF;
  if (f <= 1) niceF = 1;
  else if (f <= 2) niceF = 2;
  else if (f <= 5) niceF = 5;
  else niceF = 10;
  return niceF * Math.pow(10, exp);
}

function drawGraph(m, title) {
  const W = 360, H = 280;
  const padL = 40, padR = 40, padT = 40, padB = 50;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const minTemp = Math.min(m.th2, m.tc1);
  const tMin = Math.floor(minTemp - 15); 
  const tMax = Math.ceil(Math.max(m.th1, m.tc2) + 15);
  const tRange = tMax - tMin;

  const mapY = t => padT + plotH - ((t - tMin) / tRange) * plotH;
  const mapX = x => padL + x * plotW;

  let hotX1, hotY1, hotX2, hotY2;
  let coldX1, coldY1, coldX2, coldY2;

  if (m.flow === 'counter') {
    hotX1 = 0; hotY1 = m.th1; hotX2 = 1; hotY2 = m.th2;
    coldX1 = 0; coldY1 = m.tc2; coldX2 = 1; coldY2 = m.tc1;
  } else {
    hotX1 = 0; hotY1 = m.th1; hotX2 = 1; hotY2 = m.th2;
    coldX1 = 0; coldY1 = m.tc1; coldX2 = 1; coldY2 = m.tc2;
  }

  let crossT = null;
  const dyHot = hotY2 - hotY1;
  const dyCold = coldY2 - coldY1;
  
  if (Math.abs(dyHot - dyCold) > 1e-9) {
    const t = (coldY1 - hotY1) / (dyHot - dyCold);
    if (t > 0 && t < 1) crossT = t;
  }

  let paths = '';
  
  if (crossT !== null) {
    const hxMid = mapX(hotX1 + (hotX2 - hotX1) * crossT);
    const hyMid = mapY(hotY1 + dyHot * crossT);
    paths += `<line x1="${mapX(hotX1)}" y1="${mapY(hotY1)}" x2="${hxMid}" y2="${hyMid}" stroke="#e74c3c" stroke-width="3" stroke-linecap="round" />`;
    paths += `<line x1="${hxMid}" y1="${hyMid}" x2="${mapX(hotX2)}" y2="${mapY(hotY2)}" stroke="#e74c3c" stroke-width="3" stroke-dasharray="6,4" stroke-linecap="round" />`;
    
    const cxMid = mapX(coldX1 + (coldX2 - coldX1) * crossT);
    const cyMid = mapY(coldY1 + dyCold * crossT);
    paths += `<line x1="${mapX(coldX1)}" y1="${mapY(coldY1)}" x2="${cxMid}" y2="${cyMid}" stroke="#3498db" stroke-width="3" stroke-linecap="round" />`;
    paths += `<line x1="${cxMid}" y1="${cyMid}" x2="${mapX(coldX2)}" y2="${mapY(coldY2)}" stroke="#3498db" stroke-width="3" stroke-dasharray="6,4" stroke-linecap="round" />`;
    
    paths += `<circle cx="${hxMid}" cy="${hyMid}" r="4" fill="#f39c12" stroke="#fff" stroke-width="2" />`;
  } else {
    paths += `<line x1="${mapX(hotX1)}" y1="${mapY(hotY1)}" x2="${mapX(hotX2)}" y2="${mapY(hotY2)}" stroke="#e74c3c" stroke-width="3" stroke-linecap="round" />`;
    paths += `<line x1="${mapX(coldX1)}" y1="${mapY(coldY1)}" x2="${mapX(coldX2)}" y2="${mapY(coldY2)}" stroke="#3498db" stroke-width="3" stroke-linecap="round" />`;
  }

  const step = niceStep(tRange / 8);
  const startTick = Math.ceil(tMin / step) * step;
  let grid = '';
  for (let tick = startTick; tick <= tMax; tick += step) {
    const yPos = mapY(tick);
    grid += `<line x1="${padL}" y1="${yPos}" x2="${W - padR}" y2="${yPos}" stroke="#e0e4e8" stroke-width="1" />`;
    grid += `<text x="${padL - 8}" y="${yPos + 4}" text-anchor="end" font-size="11" fill="#6b7684">${fmt(tick, 1)}</text>`;
    grid += `<text x="${W - padR + 8}" y="${yPos + 4}" text-anchor="start" font-size="11" fill="#6b7684">${fmt(tick, 1)}</text>`;
  }

  const axes = `
    <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1.5" />
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1.5" />
    <line x1="${W - padR}" y1="${padT}" x2="${W - padR}" y2="${padT + plotH}" stroke="#6b7684" stroke-width="1.5" />
  `;

  let arrows = '';
  if (m.flow === 'counter') {
    arrows += `<text x="${padL + plotW/2}" y="${padT + plotH + 18}" text-anchor="middle" font-size="12" fill="#e74c3c">T1 ➔ T2</text>`;
    arrows += `<text x="${padL + plotW/2}" y="${padT + plotH + 34}" text-anchor="middle" font-size="12" fill="#3498db">t2 ➔ t1</text>`;
  } else {
    arrows += `<text x="${padL + plotW/2}" y="${padT + plotH + 18}" text-anchor="middle" font-size="12" fill="#e74c3c">T1 ➔ T2</text>`;
    arrows += `<text x="${padL + plotW/2}" y="${padT + plotH + 34}" text-anchor="middle" font-size="12" fill="#3498db">t1 ➔ t2</text>`;
  }

  const labelX = `<text x="${padL + plotW/2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="#6b7684">Длина поверхности</text>`;
  const labelYLeft = `<text x="12" y="${padT + plotH/2}" text-anchor="middle" transform="rotate(-90, 12, ${padT + plotH/2})" font-size="11" fill="#6b7684">Температура, °C</text>`;
  const labelYRight = `<text x="${W - 8}" y="${padT + plotH/2}" text-anchor="middle" transform="rotate(90, ${W - 8}, ${padT + plotH/2})" font-size="11" fill="#6b7684">Температура, °C</text>`;

  let labels = '';
  if (m.flow === 'counter') {
    labels += `<text x="${mapX(0) + 6}" y="${mapY(m.th1) - 6}" text-anchor="start" font-size="12" font-weight="bold" fill="#e74c3c">T1</text>`;
    labels += `<text x="${mapX(0) + 6}" y="${mapY(m.tc2) + 14}" text-anchor="start" font-size="12" font-weight="bold" fill="#3498db">t2</text>`;
    labels += `<text x="${mapX(1) - 6}" y="${mapY(m.th2) - 6}" text-anchor="end" font-size="12" font-weight="bold" fill="#e74c3c">T2</text>`;
    labels += `<text x="${mapX(1) - 6}" y="${mapY(m.tc1) + 14}" text-anchor="end" font-size="12" font-weight="bold" fill="#3498db">t1</text>`;
  } else {
    labels += `<text x="${mapX(0) + 6}" y="${mapY(m.th1) - 6}" text-anchor="start" font-size="12" font-weight="bold" fill="#e74c3c">T1</text>`;
    labels += `<text x="${mapX(0) + 6}" y="${mapY(m.tc1) + 14}" text-anchor="start" font-size="12" font-weight="bold" fill="#3498db">t1</text>`;
    labels += `<text x="${mapX(1) - 6}" y="${mapY(m.th2) - 6}" text-anchor="end" font-size="12" font-weight="bold" fill="#e74c3c">T2</text>`;
    labels += `<text x="${mapX(1) - 6}" y="${mapY(m.tc2) + 14}" text-anchor="end" font-size="12" font-weight="bold" fill="#3498db">t2</text>`;
  }

  return `
    <div style="text-align: center;">
      <div style="font-weight: 600; margin-bottom: 8px; color: var(--primary);">${title}</div>
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="max-width: 100%; height: auto; background: #fff; border-radius: 8px; border: 1px solid #eee;">
        ${grid}
        ${axes}
        ${paths}
        ${labels}
        ${arrows}
        ${labelX}
        ${labelYLeft}
        ${labelYRight}
      </svg>
      <div style="margin-top: 8px; font-size: 12px; color: var(--text-muted);">
        <span style="color: #e74c3c; font-weight: 600;">—</span> горячий &nbsp;
        <span style="color: #3498db; font-weight: 600;">—</span> холодный
      </div>
    </div>
  `;
}