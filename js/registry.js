import { renderHydraulics } from './modules/hydraulics.js';
import { renderLMTD } from './modules/lmtd.js';
import { renderThermo } from './modules/thermo.js';
import { renderSteam } from './modules/steam.js';
import { renderMoistAir } from './modules/moist_air.js';
import { renderCorrosion } from './modules/corrosion.js';
import { renderConverter } from './modules/converter.js';

export const MODULES = [
  { id: 'hydraulics', title: 'Гидравлика', icon: '💧', desc: 'Расчёт диаметров, скоростей и потерь напора', render: renderHydraulics, enabled: true },
  { id: 'lmtd', title: 'LMTD', icon: '🌡️', desc: 'Температурный напор и тепловая мощность', render: renderLMTD, enabled: true },
  { id: 'thermo', title: 'Теплофизика', icon: '🔥', desc: 'Свойства жидкостей: ρ, cp, μ, λ, Pr', render: renderThermo, enabled: true },
  { id: 'steam', title: 'Пар-вода', icon: '💨', desc: 'Свойства воды и пара (IAPWS-IF97)', render: renderSteam, enabled: true },
  { id: 'moist_air', title: 'Влажный воздух', icon: '🌬️', desc: 'Психрометрия, охлаждение, увлажнение', render: renderMoistAir, enabled: true },
  { id: 'corrosion', title: 'Коррозия', icon: '🧪', desc: 'Химстойкость металлов и эластомеров', render: renderCorrosion, enabled: true },
  { id: 'converter', title: 'Конвертер', icon: '↔️', desc: 'Перевод единиц измерения', render: renderConverter, enabled: true },
];

export function getModule(id) {
  return MODULES.find(m => m.id === id);
}
