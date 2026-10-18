import { fmt, parseNum } from '../utils.js';

const UNITS = {
  length: {
    label: 'Длина',
    base: 'm',
    units: { 'мм': 0.001, 'см': 0.01, 'м': 1, 'км': 1000, 'дюйм': 0.0254, 'фут': 0.3048 },
  },
  mass: {
    label: 'Масса',
    base: 'kg',
    units: { 'г': 0.001, 'кг': 1, 'т': 1000, 'фунт': 0.45359237 },
  },
  pressure: {
    label: 'Давление',
    base: 'Pa',
    units: { 'Па': 1, 'кПа': 1000, 'МПа': 1e6, 'бар': 1e5, 'атм': 101325, 'мм рт.ст.': 133.322, 'psi': 6894.757 },
  },
  power: {
    label: 'Мощность',
    base: 'W',
    units: { 'Вт': 1, 'кВт': 1000, 'МВт': 1e6, 'л.с.': 735.49875, 'кал/с': 4.184 },
  },
  energy: {
    label: 'Энергия',
    base: 'J',
    units: { 'Дж': 1, 'кДж': 1000, 'ккал': 4184, 'кВт·ч': 3.6e6, 'BTU': 1055.06 },
  },
  flow: {
    label: 'Объёмный расход',
    base: 'm3/s',
    units: { 'л/с': 0.001, 'л/мин': 1 / 60000, 'м³/ч': 1 / 3600, 'м³/с': 1, 'гал/мин (US)': 6.30902e-5 },
  },
  temperature: {
    label: 'Температура',
    base: 'C',
    // Температура требует смещения, обрабатывается отдельно
    units: { '°C': 1, '°F': 'F', 'K': 'K' },
  },
};

export function renderConverter(root) {
  const options = Object.entries(UNITS)
    .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

  root.innerHTML = `
    <form class="module-form" id="conv-form" autocomplete="off">
      <div class="form-row">
        <div class="field">
          <label for="c-cat">Категория</label>
          <select id="c-cat">${options}</select>
        </div>
        <div class="field">
          <label for="c-val">Значение</label>
          <input type="number" id="c-val" step="any" value="1">
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="c-from">Из</label>
          <select id="c-from"></select>
        </div>
        <div class="field">
          <label for="c-to">В</label>
          <select id="c-to"></select>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Перевести</button>
    </form>
    <div id="conv-result"></div>
  `;

  const catSel = root.querySelector('#c-cat');
  const fromSel = root.querySelector('#c-from');
  const toSel = root.querySelector('#c-to');
  const form = root.querySelector('#conv-form');
  const out = root.querySelector('#conv-result');

  function fillUnits() {
    const cat = UNITS[catSel.value];
    const opts = Object.keys(cat.units)
      .map(u => `<option value="${u}">${u}</option>`).join('');
    fromSel.innerHTML = opts;
    toSel.innerHTML = opts;
    // По умолчанию — разные единицы
    const keys = Object.keys(cat.units);
    if (keys.length > 1) toSel.value = keys[1];
  }

  catSel.addEventListener('change', () => { fillUnits(); out.innerHTML = ''; });
  fillUnits();

  form.addEventListener('submit', e => {
    e.preventDefault();
    try {
      out.innerHTML = calc();
    } catch (err) {
      out.innerHTML = `<div class="error-msg">${err.message}</div>`;
    }
  });
}

function toBase(catKey, unitKey, value) {
  const cat = UNITS[catKey];
  if (catKey === 'temperature') {
    if (unitKey === '°C') return value;
    if (unitKey === 'K') return value - 273.15;
    if (unitKey === '°F') return (value - 32) * 5 / 9;
  }
  return value * cat.units[unitKey];
}

function fromBase(catKey, unitKey, baseVal) {
  const cat = UNITS[catKey];
  if (catKey === 'temperature') {
    if (unitKey === '°C') return baseVal;
    if (unitKey === 'K') return baseVal + 273.15;
    if (unitKey === '°F') return baseVal * 9 / 5 + 32;
  }
  return baseVal / cat.units[unitKey];
}

function calc() {
  const catKey = document.getElementById('c-cat').value;
  const fromU = document.getElementById('c-from').value;
  const toU = document.getElementById('c-to').value;
  const val = parseNum(document.getElementById('c-val').value);

  if (!isFinite(val)) throw new Error('Введите число.');

  const baseVal = toBase(catKey, fromU, val);
  const result = fromBase(catKey, toU, baseVal);

  return `
    <div class="result-box">
      <h3>Результат перевода</h3>
      <div class="result-row highlight">
        <span class="label">${fmt(val, 6)} ${fromU}</span>
        <span class="value">${fmt(result, 6)} ${toU}</span>
      </div>
    </div>
  `;
}