"use client";
import { useRef, useState } from "react";
import { patternChallenge } from "@/lib/new-games";
import { RoundFeedback, type MiniGameProps } from "./shared";

export default function PatternLogic(p: MiniGameProps) {
  const [challenge] = useState(() => patternChallenge(p.level, p.round));
  const [answer, setAnswer] = useState<number | null>(null);
  const lock = useRef(false);
  const correct = answer === challenge.answer;
  function choose(value: number) {
    if (p.paused || lock.current) return;
    lock.current = true;setAnswer(value);p.onScore(value === challenge.answer ? 1 : 0, value === challenge.answer ? 0 : 1);
  }
  return <div className="round-content pattern-game">
    <div className="pattern-title"><span>ÖRÜNTÜ DOSYASI / {String(p.round + 1).padStart(2, "0")}</span><h3>Eksik sayının izini sür.</h3></div>
    <div className="pattern-series" aria-label="Sayı dizisi">{challenge.values.map((value, i) => <div key={i} className={"pattern-term " + (i === challenge.hidden ? "missing-term" : "")}><small>{i + 1}.</small><strong>{i === challenge.hidden && answer === null ? "?" : value}</strong></div>)}</div>
    <p className="board-hint">{p.level === 1 ? "Komşu sayılar arasındaki işlemi bul." : "Artışlar değişebilir; iki ayrı dizi iç içe de olabilir."}</p>
    <div className="pattern-options">{challenge.options.map((value, i) => <button key={value} className={"pattern-option " + (answer === value ? correct ? "selected" : "miss" : "")} disabled={p.paused || answer !== null} onClick={() => choose(value)}><small>{String.fromCharCode(65 + i)}</small><strong>{value}</strong></button>)}</div>
    {answer !== null && <RoundFeedback correct={correct} next={p.next} last={p.round === 7}>{correct ? "Doğru. " : `Beklenen sayı ${challenge.answer}. `}{challenge.explanation}</RoundFeedback>}
  </div>;
}
