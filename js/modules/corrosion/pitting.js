import { fmt, parseNum } from '../../utils.js';

const PITTING_DATA = {
  '304': { name: 'AISI 304 (12Х18Н10Т)', curves: { '3': [ {c: 2, t: 100}, {c: 5, t: 60}, {c: 15, t: 30}, {c: 40, t: 10} ], '5': [ {c: 15, t: 100}, {c: 40, t: 60}, {c: 80, t: 35}, {c: 150, t: 15} ], '7': [ {c: 100, t: 100}, {c: 250, t: 60}, {c: 500, t: 35}, {c: 1000, t: 10} ], '9': [ {c: 1000, t: 100}, {c: 2500, t: 60}, {c: 5000, t: 35}, {c: 10000, t: 10} ], '11': [ {c: 5000, t: 100}, {c: 15000, t: 60}, {c: 30000, t: 35}, {c: 50000, t: 15} ] } },
  '316': { name: 'AISI 316 (10Х17Н13М2Т)', curves: { '3': [ {c: 4, t: 100}, {c: 12, t: 60}, {c: 25, t: 35}, {c: 60, t: 15} ], '5': [ {c: 30, t: 100}, {c: 70, t: 60}, {c: 150, t: 35}, {c: 300, t: 15} ], '7': [ {c: 100, t: 100}, {c: 300, t: 60}, {c: 800, t: 35}, {c: 2000, t: 10} ], '9': [ {c: 1000, t: 100}, {c: 4000, t: 60}, {c: 10000, t: 35}, {c: 30000, t: 10} ], '11': [ {c: 8000, t: 100}, {c: 30000, t: 60}, {c: 80000, t: 35}, {c: 150000, t: 15} ] } },
  '254SMO': { name: '254 SMO', curves: { '3': [ {c: 50, t: 120}, {c: 100, t: 80}, {c: 200, t: 50}, {c: 500, t: 25} ], '5': [ {c: 150, t: 120}, {c: 300, t: 80}, {c: 800, t: 50}, {c: 2000, t: 25} ], '7': [ {c: 1000, t: 120}, {c: 3000, t: 80}, {c: 10000, t: 50}, {c: 50000, t: 25} ], '9': [ {c: 10000, t: 120}, {c: 40000, t: 80}, {c: 100000, t: 50}, {c: 200000, t: 25} ], '11': [ {c: 50000, t: 120}, {c: 200000, t: 80}, {c: 500000, t: 50}, {c: 800000, t: 25} ] } },
  'C276': { name: 'Hastelloy C-276', curves: { '3': [ {c: 6000, t: 120}, {c: 15000, t: 80}, {c: 50000, t: 50}, {c: 200000, t: 40} ], '5': [ {c: 10000, t: 120}, {c: 30000, t: 80}, {c: 100000, t: 60}, {c: 200000, t: 50} ], '7': [ {c: 10000, t: 120}, {c: 50000, t: 90}, {c: 200000, t: 70} ], '9': [ {c: 15000, t: 120}, {c: 80000, t: 100}, {c: 200000, t: 90} ], '11': [ {c: 20000, t: 120}, {c: 100000, t: 110}, {c: 200000, t: 105} ] } },
  'Ti': { name: 'Титан (Gr. 2)', curves: { '3': [ {c: 5000, t: 90}, {c: 20000, t: 70}, {c: 50000, t: 50}, {c: 100000, t: 40} ], '5': [ {c: 5000, t: 120}, {c: 20000, t: 90}, {c: 50000, t: 70}, {c: 100000, t: 60} ], '7': [ {c: 8000, t: 150}, {c: 30000, t: 130}, {c: 100000, t: 110}, {c: 200000, t: 100} ], '9': [ {c: 10000, t: 160}, {c: 50000, t: 140}, {c: 150000, t: 120} ], '11': [ {c: 15000, t: 160}, {c: 100000, t: 150}, {c: 200000, t: 140} ] } },
  'PdTi': { name: 'Pd-Титан (Gr. 7)', curves: { '1': [ {c: 50000, t: 160}, {c: 200000, t: 140} ], '7': [ {c: 20000, t: 160}, {c: 100000, t: 140}, {c: 200000, t: 120} ], '11': [ {c: 30000, t: 160}, {c: 150000, t: 140}, {c: 300000, t: 130} ] } }
};

export function renderPitting(container) {
  container.innerHTML = `
    <style>
      /* Красивое оформление таблиц */
      .nice-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; cursor: default; }
      .nice-table th { background-color: #334155; color: #ffffff; font-weight: 600; padding: 10px 8px; border: 1px solid #475569; }
      .nice-table td { border: 1px solid #e2e8f0; padding: 8px; text-align: center; }
      
      /* Зебра для строк */
      .nice-table tbody tr:nth-child(even) { background-color: #f8fafc; }
      .nice-table tbody tr:nth-child(odd) { background-color: #ffffff; }
      
      /* Подсветка при наведении */
      .nice-table tbody tr:hover { background-color: #e2e8f0; }
      
      /* Выделяем первый столбец (название) */
      .nice-table td:first-child { text-align: left; font-weight: 600; color: var(--primary); }
    </style>

    <div class="graph-layout">
      <div class="graph-controls">
        <h4 style="margin-top: 0; color: var(--primary);">Проверка точки</h4>
        <div class="field" style="margin-top: 10px;">
          <label>Температура, °C</label>
          <input type="number" id="pit-t" step="any" value="50">
        </div>
        <div class="field" style="margin-top: 10px;">
          <label>Хлориды (Cl⁻), ppm</label>
          <input type="number" id="pit-cl" step="any" value="500">
        </div>
        <div class="field" style="margin-top: 10px;">
          <label>pH среды</label>
          <select id="pit-ph">
            <option value="1">pH = 1 (только для Pd-Ti)</option>
            <option value="3">pH = 3</option>
            <option value="5">pH = 5</option>
            <option value="7" selected>pH = 7</option>
            <option value="9">pH = 9</option>
            <option value="11">pH = 11</option>
          </select>
        </div>
        <button type="button" class="btn btn-primary" id="btn-pit-check" style="margin-top: 20px; width: 100%;">Проверить выбранный сплав</button>
        <button type="button" class="btn btn-secondary" id="btn-pit-check-all" style="margin-top: 10px; width: 100%; background: #f1f5f9;">Проверить ВСЕ сплавы</button>
        
        <div class="field" style="margin-top: 20px;">
          <label>Отображаемый сплав:</label>
          <select id="pit-material" style="font-weight: bold;">
            ${Object.entries(PITTING_DATA).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
          </select>
        </div>
        <div id="pit-verdict" class="verdict-box"></div>
        <div id="pit-all-verdict" style="margin-top: 15px; font-size: 13px;"></div>
      </div>
      <div class="graph-svg-container">
        <div id="pit-diagram" style="position: relative;"></div>
      </div>
    </div>

    <details class="pren-box">
      <summary class="pren-title">📊 Справочник: Значения PREN (Pitting Resistance Equivalent Number)</summary>
      <p style="font-size: 13px; color: var(--text-muted); margin-top: 10px;">PREN — условный индекс стойкости к питтинговой коррозии. Для морской воды обычно требуется > 40.</p>
      <div class="formula-box">PREN = %Cr + 3.3 × %Mo + 16 × %N</div>
      <table class="nice-table">
        <thead><tr><th>Сталь / Сплав</th><th>Cr</th><th>Mo</th><th>N</th><th>PREN</th></tr></thead>
        <tbody>
          <tr><td>304 / 304L</td><td>18.0</td><td>-</td><td>-</td><td>18.0</td></tr>
          <tr><td>321 (12Х18Н10Т)</td><td>17.5</td><td>-</td><td>-</td><td>17.5</td></tr>
          <tr><td>316 / 316L</td><td>16.5</td><td>2.1</td><td>-</td><td>23.4</td></tr>
          <tr><td>316Ti</td><td>16.5</td><td>2.1</td><td>-</td><td>23.4</td></tr>
          <tr><td>904L</td><td>20.0</td><td>4.5</td><td>-</td><td>34.8</td></tr>
          <tr><td>254 SMO</td><td>20.0</td><td>6.1</td><td>0.2</td><td>43.3</td></tr>
          <tr><td>C-276 (Хастеллой)</td><td>15.5</td><td>16.0</td><td>-</td><td>68.3</td></tr>
        </tbody>
      </table>
    </details>

    <details class="pren-box" style="margin-top: 10px;">
      <summary class="pren-title">🧪 Полный химический состав сплавов (мас. %)</summary>
      <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 10px;">Данные по каталогам Outokumpu, Alleima и стандартам ASTM. Fe — остаток (Balance).</p>
      <div style="overflow-x: auto; padding-bottom: 5px;">
        <table class="nice-table" style="min-width: 650px; font-size: 12px;">
          <thead>
            <tr>
              <th>Марка</th><th>C</th><th>Mn</th><th>Si</th><th>P</th><th>S</th><th>Cr</th><th>Ni</th><th>Mo</th><th>N</th><th>Другие</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>304</td><td>≤0.07</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>17.5-19.5</td><td>8.0-10.5</td><td>-</td><td>-</td><td>Fe: Bal.</td></tr>
            <tr><td>304L</td><td>≤0.030</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>17.5-19.5</td><td>8.0-12.0</td><td>-</td><td>-</td><td>Fe: Bal.</td></tr>
            <tr><td>321</td><td>≤0.08</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>17.0-19.0</td><td>9.0-12.0</td><td>-</td><td>-</td><td>Ti: 5×(C+N) – 0.70</td></tr>
            <tr><td>316</td><td>≤0.08</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>16.0-18.0</td><td>10.0-14.0</td><td>2.0-3.0</td><td>-</td><td>Fe: Bal.</td></tr>
            <tr><td>316L</td><td>≤0.030</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>16.0-18.0</td><td>10.0-14.0</td><td>2.0-3.0</td><td>-</td><td>Fe: Bal.</td></tr>
            <tr><td>316Ti</td><td>≤0.08</td><td>≤2.00</td><td>≤0.75</td><td>≤0.045</td><td>≤0.030</td><td>16.5-18.5</td><td>10.5-13.5</td><td>2.0-2.5</td><td>-</td><td>Ti: 5×C – 0.70</td></tr>
            <tr><td>904L</td><td>≤0.020</td><td>≤2.00</td><td>≤1.00</td><td>≤0.045</td><td>≤0.035</td><td>19.0-23.0</td><td>23.0-28.0</td><td>4.0-5.0</td><td>≤0.10</td><td>Cu: 1.0-2.0; Fe: Bal.</td></tr>
            <tr><td>254 SMO</td><td>≤0.020</td><td>≤1.00</td><td>≤0.80</td><td>≤0.030</td><td>≤0.010</td><td>19.5-20.5</td><td>17.5-18.5</td><td>6.0-6.5</td><td>0.18-0.22</td><td>Cu: 0.5-1.0; Fe: Bal.</td></tr>
            <tr><td>C-276</td><td>≤0.010</td><td>≤1.00</td><td>≤0.08</td><td>≤0.015</td><td>≤0.010</td><td>14.5-16.5</td><td>Bal. (50-57)</td><td>15.0-17.0</td><td>-</td><td>W: 3.0-4.5; Fe: 4.0-7.0; Co: ≤2.5</td></tr>
            <tr><td>Ti Gr. 2</td><td>≤0.08</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>≤0.03</td><td>Fe: ≤0.30; O: ≤0.25; H: ≤0.015; Ti: Bal.</td></tr>
            <tr><td>Ti Gr. 7</td><td>≤0.08</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>≤0.03</td><td>Pd: 0.12-0.25; Fe: ≤0.30; O: ≤0.25; H: ≤0.015; Ti: Bal.</td></tr>
          </tbody>
        </table>
      </div>
    </details>
  `;

  const materialSel = document.getElementById('pit-material');
  materialSel.addEventListener('change', () => {
    document.getElementById('pit-verdict').style.display = 'none';
    document.getElementById('pit-all-verdict').innerHTML = '';
    drawPittingChart();
  });

  document.getElementById('btn-pit-check').addEventListener('click', () => {
    const t = parseNum(document.getElementById('pit-t').value);
    const cl = parseNum(document.getElementById('pit-cl').value);
    const ph = document.getElementById('pit-ph').value;
    if (!isFinite(t) || !isFinite(cl) || t < 0 || cl <= 0) return alert('Проверьте данные.');
    drawPittingChart({ t, cl, ph, mat: materialSel.value });
  });

  document.getElementById('btn-pit-check-all').addEventListener('click', () => {
    const t = parseNum(document.getElementById('pit-t').value);
    const cl = parseNum(document.getElementById('pit-cl').value);
    const ph = document.getElementById('pit-ph').value;
    if (!isFinite(t) || !isFinite(cl) || t < 0 || cl <= 0) return alert('Проверьте данные.');
    checkAllMaterials(t, cl, ph);
  });

  drawPittingChart();

  function drawPittingChart(userPoint = null) {
    const activeMat = materialSel.value;
    const matData = PITTING_DATA[activeMat];
    const W = 550, H = 400, padL = 50, padR = 20, padT = 20, padB = 50;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const minCl = 1, maxCl = 1000000, minT = 0, maxT = 180;

    const mapX = cl => padL + (Math.log10(cl) - Math.log10(minCl)) / (Math.log10(maxCl) - Math.log10(minCl)) * plotW;
    const mapY = t => padT + plotH - ((t - minT) / (maxT - minT)) * plotH;

    let curvesSvg = '';
    const styles = { '1': 'stroke-dasharray="1,4"', '3': 'stroke-dasharray="8,4"', '5': 'stroke-dasharray="4,4"', '7': '', '9': 'stroke-dasharray="10,5"', '11': 'stroke-dasharray="2,4"' };

    Object.keys(matData.curves).forEach(ph => {
      const pts = matData.curves[ph];
      let path = '';
      pts.forEach((p, i) => { path += (i === 0 ? `M ${mapX(p.c)} ${mapY(p.t)}` : ` L ${mapX(p.c)} ${mapY(p.t)}`); });
      curvesSvg += `<path d="${path}" fill="none" stroke="#475569" stroke-width="2" ${styles[ph] || ''} />`;
      const lastPt = pts[pts.length - 1];
      curvesSvg += `<text x="${mapX(lastPt.c) + 5}" y="${mapY(lastPt.t) - 5}" font-size="12" fill="#1e293b" font-weight="bold">pH=${ph}</text>`;
    });

    let gridSvg = '';
    for (let exp = 0; exp <= 6; exp++) {
      for (let i = 1; i <= 9; i++) {
        const c = i * Math.pow(10, exp);
        if (c > maxCl) break;
        const x = mapX(c);
        const isMajor = i === 1;
        gridSvg += `<line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="${isMajor ? '#cbd5e1' : '#f1f5f9'}" stroke-width="1" />`;
        if (isMajor) {
          const label = c >= 1000 ? `${c/1000} 000` : c.toString();
          gridSvg += `<text x="${x}" y="${padT + plotH + 15}" text-anchor="middle" font-size="10" fill="#64748b">${label}</text>`;
        }
      }
    }
    for (let t = 0; t <= maxT; t += 10) {
      const y = mapY(t);
      const isMajor = t % 20 === 0;
      gridSvg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="${isMajor ? '#cbd5e1' : '#f1f5f9'}" stroke-width="1" />`;
      if (isMajor) gridSvg += `<text x="${padL - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748b">${t}</text>`;
    }

    let pointSvg = '';
    if (userPoint && userPoint.mat === activeMat) {
      const px = mapX(userPoint.cl), py = mapY(userPoint.t);
      const isRisk = checkRisk(activeMat, userPoint.t, userPoint.cl, userPoint.ph);
      const color = isRisk ? '#ef4444' : '#22c55e';
      pointSvg = `<circle cx="${px}" cy="${py}" r="6" fill="${color}" stroke="#fff" stroke-width="2" />
                  <text x="${px + 10}" y="${py - 10}" font-size="12" fill="${color}" font-weight="bold">Ваша точка</text>`;
      const verdictEl = document.getElementById('pit-verdict');
      verdictEl.className = `verdict-box ${isRisk ? 'verdict-risk' : 'verdict-safe'}`;
      verdictEl.innerHTML = isRisk ? `⚠️ Риск коррозии для ${matData.name}!` : `✅ Безопасно для ${matData.name}.`;
    }

    document.getElementById('pit-diagram').innerHTML = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        ${gridSvg} ${curvesSvg} ${pointSvg}
        <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5" />
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#334155" stroke-width="1.5" />
        <text x="${padL + plotW/2}" y="${H - 10}" text-anchor="middle" font-size="12" fill="#334155" font-weight="bold">Концентрация хлоридов (Cl⁻), ppm</text>
        <text x="15" y="${padT + plotH/2}" text-anchor="middle" transform="rotate(-90, 15, ${padT + plotH/2})" font-size="12" fill="#334155" font-weight="bold">Температура, °C</text>
        <text x="${padL + 20}" y="${padT + 20}" font-size="12" font-weight="bold" fill="#166534">No corrosion</text>
        <text x="${W - padR - 150}" y="${padT + 20}" font-size="12" font-weight="bold" fill="#991b1b">Crevice corrosion</text>
      </svg>`;
  }

  function checkRisk(matKey, t, cl, ph) {
    const matData = PITTING_DATA[matKey];
    let curve = matData.curves[ph];
    if (!curve) {
      const availablePh = Object.keys(matData.curves).map(Number);
      const closestPh = availablePh.reduce((prev, curr) => Math.abs(curr - ph) < Math.abs(prev - ph) ? curr : prev);
      curve = matData.curves[closestPh];
    }
    if (!curve) return true;
    let t_limit = 200;
    if (cl <= curve[0].c) t_limit = curve[0].t;
    else if (cl >= curve[curve.length-1].c) t_limit = curve[curve.length-1].t;
    else {
      for (let i = 0; i < curve.length - 1; i++) {
        if (cl >= curve[i].c && cl <= curve[i+1].c) {
          const frac = (Math.log10(cl) - Math.log10(curve[i].c)) / (Math.log10(curve[i+1].c) - Math.log10(curve[i].c));
          t_limit = curve[i].t + frac * (curve[i+1].t - curve[i].t);
          break;
        }
      }
    }
    return t > t_limit;
  }

  function checkAllMaterials(t, cl, ph) {
    const allRes = Object.keys(PITTING_DATA).map(matKey => ({ matKey, name: PITTING_DATA[matKey].name, isRisk: checkRisk(matKey, t, cl, ph) }));
    allRes.sort((a, b) => a.isRisk - b.isRisk);
    let html = `<div style="font-weight: bold; margin-bottom: 8px;">Результаты для T=${t}°C, Cl=${cl} ppm, pH=${ph}:</div>`;
    if (allRes.filter(r => !r.isRisk).length === 0) html += `<div style="color: #991b1b; font-weight: bold; padding: 10px; background: #fee2e2; border-radius: 6px;">Ни один сплав не подходит!</div>`;
    allRes.forEach(res => {
      html += `<div style="padding: 6px 0; border-bottom: 1px dashed #e2e8f0; color: ${res.isRisk ? '#991b1b' : '#166534'}; opacity: ${res.isRisk ? '0.7' : '1'};">
        ${res.isRisk ? '❌' : '✅'} <b>${res.name}</b> — ${res.isRisk ? 'риск' : 'подходит'}</div>`;
    });
    document.getElementById('pit-all-verdict').innerHTML = html;
    const safeMat = allRes.find(r => !r.isRisk);
    if (safeMat) {
      materialSel.value = safeMat.matKey;
      drawPittingChart({ t, cl, ph, mat: safeMat.matKey });
    } else {
      materialSel.value = 'C276';
      drawPittingChart({ t, cl, ph, mat: 'C276' });
    }
  }
}