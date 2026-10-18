// Здесь регистрируются все модули EngTools.
// Чтобы добавить новый модуль — импортируйте его и добавьте в массив.
import { renderHydraulics } from './modules/hydraulics.js';
import { renderLMTD } from './modules/lmtd.js';
import { renderThermo } from './modules/thermo.js';
import { renderConverter } from './modules/converter.js';

export const MODULES = [
  {
    id: 'hydraulics',
    title: 'Гидравлика',
    icon: '💧',
    desc: 'Расчёт диаметров, скоростей и потерь напора',
    render: renderHydraulics,
    enabled: true,
  },
  {
    id: 'lmtd',
    title: 'LMTD',
    icon: '🌡️',
    desc: 'Температурный напор и тепловая мощность',
    render: renderLMTD,
    enabled: true,
  },
  {
    id: 'thermo',
    title: 'Теплофизика',
    icon: '🔥',
    desc: 'Свойства воды: ρ, cp, μ, λ, Pr',
    render: renderThermo,
    enabled: true,
  },
  {
    id: 'converter',
    title: 'Конвертер',
    icon: '↔️',
    desc: 'Перевод единиц измерения',
    render: renderConverter,
    enabled: true,
  },
];

export function getModule(id) {
  return MODULES.find(m => m.id === id);
}