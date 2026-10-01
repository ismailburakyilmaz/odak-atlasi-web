import type { Level } from "./atlas";
import { rand, shuffled } from "./challenges";

export function matrixChallenge(level: Level, round: number) {
  const count = Math.min(9, 3 + level + Math.floor(round / 2));
  const shown = shuffled(Array.from({ length: 16 }, (_, i) => i)).slice(0, count);
  const mirrored = level === 3 && round % 2 === 1;
  const answer = shown.map(i => mirrored ? Math.floor(i / 4) * 4 + 3 - i % 4 : i);
  return { shown, answer, mirrored, studyMs: 3600 - level * 500 };
}

export function reactionChallenge(level: Level, round: number) {
  const size = level === 3 ? 4 : 3;
  const goal = level === 3 && round % 3 === 2 ? "diamond" : "circle";
  const noTarget = level > 1 && round % 5 === 3;
  const positions = shuffled(Array.from({ length: size * size }, (_, i) => i));
  const target = noTarget ? -1 : positions[0];
  const distractors = positions.slice(noTarget ? 0 : 1, noTarget ? level + 1 : level + 2);
  return { size, goal, target, distractors, waitMs: 600 + rand(1000), responseMs: 2200 - level * 300 };
}

export function simonChallenge(level: Level, round: number) {
  const pads = level === 1 ? 4 : 6;
  const length = 3 + level + Math.floor(round / 2);
  const sequence: number[] = [];
  for (let i = 0; i < length; i++) {
    let next = rand(pads);
    // No immediate repeats: each separate pulse is unambiguous.
    while (next === sequence[i - 1]) next = rand(pads);
    sequence.push(next);
  }
  return { pads, sequence, pulseMs: 1000 - level * 150, litMs: 630 - level * 70 };
}

export type Pattern = { values: number[]; hidden: number; answer: number; options: number[]; explanation: string; family: string };
export function patternChallenge(level: Level, round: number): Pattern {
  const start = 2 + rand(8), a = 2 + rand(5), b = 2 + rand(4);
  const family = level === 1 ? round % 3 : level === 2 ? 3 + round % 3 : 6 + round % 4;
  const values: number[] = [start];
  let explanation = "";
  for (let i = 1; i < 7; i++) {
    const previous = values[i - 1];
    if (family === 0) values.push(previous + a);
    if (family === 1) values.push(previous * 2);
    if (family === 2) values.push(previous - a);
    if (family === 3 || family === 6) values.push(previous + a + (i - 1) * (family === 6 ? b : 1));
    if (family === 4) values.push(i % 2 ? previous + a : previous * 2);
    if (family === 5) values.push(i === 1 ? start + 15 : values[i - 2] + (i % 2 ? b : a));
    if (family === 7) values.push(i % 2 ? previous * 2 : previous - a);
    if (family === 8) values.push(previous + [a, -b, a + b][(i - 1) % 3]);
    if (family === 9) values.push(i === 1 ? start + 3 : i % 2 ? values[i - 2] + a : values[i - 2] * 2);
  }
  const rules = [
    `Her adımda ${a} ekleniyor.`, "Her adımda sayı iki katına çıkıyor.", `Her adımda ${a} çıkarılıyor.`,
    `Artışlar ${a}, ${a + 1}, ${a + 2}…; her artış bir büyüyor.`, `Sırayla ${a} ekle, ikiyle çarp.`,
    `İki dizi iç içe: 1., 3., 5., 7. terimlerde +${a}; 2., 4., 6. terimlerde +${b}.`,
    `Artışlar ${a} ile başlıyor; her sonraki artış ${b} büyüyor.`, `Sırayla ikiyle çarp, ${a} çıkar.`,
    `Üçlü döngü: +${a}, −${b}, +${a + b}; ardından döngü yeniden başlıyor.`,
    `İki dizi iç içe: 1., 3., 5., 7. terimler iki katına çıkıyor; 2., 4., 6. terimlere ${a} ekleniyor.`,
  ];
  explanation = rules[family];
  const hidden = level === 3 && round % 2 ? 3 : 6;
  const answer = values[hidden];
  const candidates = new Set([answer]);
  for (const value of shuffled([answer + a, answer - a, answer + b, answer - b, values[Math.max(0, hidden - 1)], answer + 1, answer - 1, answer + 2, answer - 2])) {
    if (candidates.size < 4) candidates.add(value);
  }
  return { values, hidden, answer, options: shuffled([...candidates]), explanation, family: String(family) };
}
