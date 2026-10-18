import { fmt, parseNum, bindPersist } from '../utils.js';

export function renderHydraulics(root) {
  root.innerHTML = `
    <form class="module-form" id="hyd-form" autocomplete="off">
      <div class="form-row">
        <div class="field">
          <label for="h-flow">Расход, м³/ч</label>
          <input type="number" id="h-flow" step="any" value="10">
        </div>
        <div class="field">
          <label for="h-d">Внутренний диаметр, мм</label>
          <input type="number" id="h-d" step="any" value="50">
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="h-l">Длина участка, м</label>
          <input type="number" id="h-l" step="any" value="10">
        </div>
        <div class="field">
          <label for="h-rough">Шероховатость, мм</label>
          <input type="number" id="h-rough" step="any" value="0.05">
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="h-rho">Плотность, кг/м³</label>
          <input type="number" id="h-rho" step="any" value="998">
        </div>
        <div class="field">
          <label for="h-mu">Вязкость, мПа·с</label>
          <input type="number" id="h-mu" step="any" value="1.0">
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="h-zeta">Σ местных сопротивлений, ζ</label>
          <input type="number" id="h-zeta" step="any" value="0">
        </div>
        <div class="field">
          <label for="h-elev">Перепад высот, м</label>
          <input type="number" id="h-elev" step="any" value="0">
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Рассчитать</button>
    </form>
    <div id="hyd-result"></div>
  `;

  bindPersist(root, 'hydraulics');

  const form = root.querySelector('#hyd-form');
  const out = root.querySelector('#hyd-result');

  form.addEventListener('submit', e => {
    e.preventDefault();
    try {
      out.innerHTML = calc();
    } catch (err) {
      out.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
}

function calc() {
  const Q = parseNum(document.getElementById('h-flow').value) / 3600; // м³/с
  const d = parseNum(document.getElementById('h-d').value) / 1000;    // м
  const L = parseNum(document.getElementById('h-l').value);
  const rough = parseNum(document.getElementById('h-rough').value) / 1000; // м
  const rho = parseNum(document.getElementById('h-rho').value);
  const mu = parseNum(document.getElementById('h-mu').value) / 1000;   // Па·с
  const zeta = parseNum(document.getElementById('h-zeta').value) || 0;
  const dz = parseNum(document.getElementById('h-elev').value) || 0;

  if ([Q, d, L, rho, mu].some(v => !isFinite(v) || v <= 0)) {
    throw new Error('Проверьте входные данные: расход, диаметр, длина, ρ и μ должны быть > 0.');
  }

  const A = Math.PI * d * d / 4;
  const w = Q / A;
  const Re = rho * w * d / mu;
  const relRough = rough / d;

  // Коэффициент трения: Лам. / Блазиус / Колбрук (итерации)
  let lambda;
  if (Re < 2300) {
    lambda = 64 / Re;
  } else {
    // Колбрук–Уайт итерациями
    let f = 0.02;
    for (let i = 0; i < 30; i++) {
      const inv = -2 * Math.log10(relRough / 3.7 + 2.51 / (Re * Math.sqrt(f)));
      const fNew = 1 / (inv * inv);
      if (Math.abs(fNew - f) < 1e-10) { f = fNew; break; }
      f = fNew;
    }
    lambda = f;
  }

  const dpFriction = lambda * (L / d) * rho * w * w / 2;
  const dpLocal = zeta * rho * w * w / 2;
  const dpElev = rho * 9.80665 * dz;
  const dpTotal = dpFriction + dpLocal + dpElev;

  const regime = Re < 2300 ? 'ламинарный' : (Re > 4000 ? 'турбулентный' : 'переходный');

  return `
    <div class="result-box">
      <h3>Результаты расчёта</h3>
      <div class="result-row"><span class="label">Скорость потока</span><span class="value">${fmt(w, 3)} м/с</span></div>
      <div class="result-row"><span class="label">Число Рейнольдса</span><span class="value">${fmt(Re, 0)} (${regime})</span></div>
      <div class="result-row"><span class="label">Коэф. трения λ</span><span class="value">${fmt(lambda, 5)}</span></div>
      <div class="result-row"><span class="label">Потери на трение</span><span class="value">${fmt(dpFriction / 1000, 3)} кПа</span></div>
      <div class="result-row"><span class="label">Местные потери</span><span class="value">${fmt(dpLocal / 1000, 3)} кПа</span></div>
      <div class="result-row"><span class="label">Нивелирный столб</span><span class="value">${fmt(dpElev / 1000, 3)} кПа</span></div>
      <div class="result-row highlight"><span class="label">Полные потери</span><span class="value">${fmt(dpTotal / 1000, 3)} кПа</span></div>
      <div class="result-row"><span class="label">Напор</span><span class="value">${fmt(dpTotal / (rho * 9.80665), 3)} м вод. ст.</span></div>
    </div>
  `;
}