// Форматирование чисел
export function fmt(x, digits = 3) {
  if (!isFinite(x)) return '—';
  if (x === 0) return '0';
  const abs = Math.abs(x);
  if (abs >= 1e6 || abs < 1e-3) return x.toExponential(2);
  return Number(x.toFixed(digits)).toString();
}

// Безопасный парсинг числа из input (поддержка запятой)
export function parseNum(str) {
  if (str === null || str === undefined) return NaN;
  const s = String(str).trim().replace(',', '.');
  if (s === '') return NaN;
  return Number(s);
}

// Сохранение/загрузка состояния модуля в localStorage
export function saveState(key, data) {
  try {
    localStorage.setItem('engtools:' + key, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

export function loadState(key) {
  try {
    const raw = localStorage.getItem('engtools:' + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// Привязка input → сохранение значения при вводе
export function bindPersist(container, key) {
  const inputs = container.querySelectorAll('input, select');
  const saved = loadState(key) || {};
  inputs.forEach(el => {
    if (saved[el.id] !== undefined) el.value = saved[el.id];
    const ev = (el.tagName === 'SELECT') ? 'change' : 'input';
    el.addEventListener(ev, () => {
      const data = loadState(key) || {};
      data[el.id] = el.value;
      saveState(key, data);
    });
  });
}