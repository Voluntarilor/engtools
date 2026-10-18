import { fmt, parseNum, bindPersist } from '../utils.js';

export function renderThermo(root) {
  root.innerHTML = `
    <form class="module-form" id="thermo-form" autocomplete="off">
      <div class="form-row">
        <div class="field">
          <label for="t-t">Температура воды, °C</label>
          <input type="number" id="t-t" step="any" value="20">
        </div>
        <div class="field">
          <label for="t-p">Давление (справочно), бар</label>
          <input type="number" id="t-p" step="any" value="1">
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Рассчитать</button>
      <p class="hint">Свойства воды по приближённым формулам, диапазон 0…150 °C. Для гликолей, масел и хладагентов — будут добавлены отдельные модули.</p>
    </form>
    <div id="thermo-result"></div>
  `;

  bindPersist(root, 'thermo');

  const form = root.querySelector('#thermo-form');
  const out = root.querySelector('#thermo-result');

  form.addEventListener('submit', e => {
    e.preventDefault();
    try {
      out.innerHTML = calc();
    } catch (err) {
      out.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
}

function waterProps(tc) {
  const rho = 1000 - 0.35 * (tc - 4);
  const cp = 4187 + 0.6 * tc; // Дж/(кг·К)
  const mu = 1.79e-3 / (1 + 0.0337 * tc + 0.000221 * tc * tc); // Па·с
  const lam = 0.555 + 0.0025 * tc - 1.6e-6 * tc * tc; // Вт/(м·К)
  const Pr = mu * cp / lam;
  return { rho, cp, mu, lam, Pr };
}

function calc() {
  const t = parseNum(document.getElementById('t-t').value);
  if (!isFinite(t)) throw new Error('Введите температуру.');
  if (t < 0 || t > 150) throw new Error('Диапазон применимости формул: 0…150 °C.');

  const p = waterProps(t);

  return `
    <div class="result-box">
      <h3>Свойства воды при ${fmt(t, 1)} °C</h3>
      <div class="result-row"><span class="label">Плотность ρ</span><span class="value">${fmt(p.rho, 2)} кг/м³</span></div>
      <div class="result-row"><span class="label">Теплоёмкость cp</span><span class="value">${fmt(p.cp, 1)} Дж/(кг·К)</span></div>
      <div class="result-row"><span class="label">Динамическая вязкость μ</span><span class="value">${fmt(p.mu * 1000, 4)} мПа·с</span></div>
      <div class="result-row"><span class="label">Кинематическая вязкость ν</span><span class="value">${fmt(p.mu / p.rho * 1e6, 4)} мм²/с</span></div>
      <div class="result-row"><span class="label">Теплопроводность λ</span><span class="value">${fmt(p.lam, 4)} Вт/(м·К)</span></div>
      <div class="result-row highlight"><span class="label">Число Прандтля Pr</span><span class="value">${fmt(p.Pr, 3)}</span></div>
    </div>
  `;
}