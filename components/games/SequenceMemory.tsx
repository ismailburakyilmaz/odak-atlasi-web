"use client";
import { useEffect, useRef, useState } from "react";
import { simonChallenge } from "@/lib/new-games";
import { RoundFeedback, useActiveClock, type MiniGameProps } from "./shared";

const marks = ["●", "▲", "◆", "■", "✦", "⬟"];
export default function SequenceMemory(p: MiniGameProps) {
  const [challenge] = useState(() => simonChallenge(p.level, p.round));
  const [phase, setPhase] = useState<"watch" | "repeat" | "result">("watch");
  const [manualStep, setManualStep] = useState(-1);
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [message, setMessage] = useState("");
  const [last, setLast] = useState(-1);
  const locked = useRef(false), accepted = useRef(0);
  const { elapsed } = useActiveClock(!p.paused && phase === "watch" && p.mode === "normal");
  const pulse = p.reduced ? Math.max(1000, challenge.pulseMs) : challenge.pulseMs;
  const litDuration = p.reduced ? 750 : challenge.litMs;
  const time = Math.max(0, elapsed - 600);
  const step = p.mode === "zen" ? manualStep : elapsed < 600 ? -1 : Math.floor(time / pulse);
  const lit = phase === "watch" && step >= 0 && step < challenge.sequence.length && (p.mode === "zen" || time % pulse < litDuration) ? challenge.sequence[step] : -1;
  useEffect(() => { if (p.mode === "normal" && !p.paused && phase === "watch" && elapsed >= 600 + challenge.sequence.length * pulse) setPhase("repeat"); }, [elapsed, phase, p.mode, p.paused, challenge.sequence.length, pulse]);
  function answer(index: number) {
    if (p.paused || phase !== "repeat" || locked.current) return;
    const expected = challenge.sequence[accepted.current];
    setLast(index);
    if (index !== expected) {
      locked.current = true;p.onScore(0, 1);setCorrect(false);
      setMessage(`${accepted.current + 1}. ışık ${expected + 1} numaralı düğmeydi.`);setPhase("result");return;
    }
    accepted.current++;setCount(accepted.current);p.onScore(1, 0);
    if (accepted.current === challenge.sequence.length) {
      locked.current = true;setCorrect(true);setMessage("Işık dizisinin tamamını doğru tekrarladın.");setPhase("result");
    }
  }
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || !/^[1-6]$/.test(event.key)) return;
      const value = Number(event.key) - 1;
      if (value < challenge.pads) { event.preventDefault();answer(value); }
    };
    window.addEventListener("keydown", handler);return () => window.removeEventListener("keydown", handler);
  });
  return <div className="round-content simon-game">
    <div className="simon-status" role="status"><span>{phase === "watch" ? "İZLE" : phase === "repeat" ? "ŞİMDİ SEN" : "DİZİ TAMAMLANDI"}</span><strong>{phase === "watch" ? `${Math.min(challenge.sequence.length, Math.max(0, step + 1))} / ${challenge.sequence.length} ışık` : `${count} / ${challenge.sequence.length} doğru adım`}</strong></div>
    <div className={"simon-console " + (challenge.pads === 4 ? "four-pads" : "six-pads")}>
      {Array.from({ length: challenge.pads }, (_, i) => <button key={i} className={"simon-pad pad-" + i + (lit === i ? " is-lit" : "") + (phase !== "watch" && last === i ? " last-pressed" : "")}
        disabled={p.paused || phase !== "repeat"} onClick={() => answer(i)} aria-label={`Düğme ${i + 1}${lit === i ? " yanıyor" : ""}`}>
        <span aria-hidden>{marks[i]}</span><small>{i + 1}</small>
      </button>)}
    </div>
    {phase === "watch" && p.mode === "zen" && <button className="primary" disabled={p.paused} onClick={() => manualStep + 1 < challenge.sequence.length ? setManualStep(s => s + 1) : setPhase("repeat")}>{manualStep + 1 < challenge.sequence.length ? "Sıradaki ışığı göster" : "Diziyi tekrar et"}</button>}
    <p className="board-hint">{phase === "watch" ? "Her ışığın yerini ve sırasını hatırla." : "Düğmelere dokun veya klavyede üzerlerindeki rakamları kullan."}</p>
    {phase === "result" && <><p className="simon-solution">Doğru sıra: {challenge.sequence.map(i => i + 1).join(" → ")}</p><RoundFeedback correct={correct} next={p.next} last={p.round === 5}>{message}</RoundFeedback></>}
  </div>;
}
