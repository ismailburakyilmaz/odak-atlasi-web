import type { Level } from './atlas';

export const fleet = [
  { name: 'Mekik', color: '#a4dcd4' }, { name: 'Uydu', color: '#f0c98a' },
  { name: 'Sonda', color: '#acbdf2' }, { name: 'Kargo', color: '#d9b8a1' },
  { name: 'Kapsül', color: '#c3dba7' }, { name: 'Yelken', color: '#e5b1c0' },
  { name: 'Radar', color: '#9ecbdc' }, { name: 'Gezgin', color: '#dfd3a2' },
  { name: 'İkiz', color: '#cbbce2' }, { name: 'İstasyon', color: '#b8d5ca' },
] as const;
export type Transfer = readonly [number, number];
export type OrbitChallenge = { initial: number[]; transfers: Transfer[]; final: number[]; targets: number[]; studyMs: number };

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function transferFleet(slots: readonly number[], [a, b]: Transfer): number[] {
  const result = [...slots]; [result[a], result[b]] = [result[b], result[a]]; return result;
}
export function orbitChallenge(level: Level, random = Math.random): OrbitChallenge {
  const count = 4 + level * 2;
  const initial = shuffled(fleet.map((_, i) => i), random).slice(0, count);
  // A chain of distinct berths keeps transfers meaningful: no immediate undo and
  // at least one craft moves more than once. Unchanged berths are also queried.
  const chain = shuffled(Array.from({ length: count }, (_, i) => i), random).slice(0, level + 2);
  const transfers: Transfer[] = chain.slice(1).map((dock, i) => [chain[i], dock]);
  const final = transfers.reduce((slots, transfer) => transferFleet(slots, transfer), [...initial]);
  const moved = shuffled(initial.filter((ship, dock) => final[dock] !== ship), random);
  const unchanged = shuffled(initial.filter((ship, dock) => final[dock] === ship), random);
  const traveller = initial[chain[0]];
  const targets = shuffled([traveller, ...moved.filter(ship => ship !== traveller).slice(0, level), unchanged[0]], random);
  return { initial, transfers, final, targets, studyMs: 8000 + level * 2000 };
}
export function dockPoint(index: number, count: number) {
  const angle = -Math.PI / 2 + index / count * Math.PI * 2;
  return { x: 50 + 37 * Math.cos(angle), y: 50 + 37 * Math.sin(angle) };
}
