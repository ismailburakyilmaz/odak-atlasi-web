"use client";
import { useEffect, useRef, useState } from "react";
import { reactionChallenge } from "@/lib/new-games";
import { RoundFeedback, useActiveClock, type MiniGameProps } from "./shared";

export default function ReactionGrid(p: MiniGameProps) {
  const [challenge] = useState(() => reactionChallenge(p.level, p.round));
  const [phase, setPhase] = useState<"waiting" | "live" | "feedback">("waiting");
  const [correct, setCorrect] = useState(false);
  const [response, setResponse] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const onset = useRef(0), finished = useRef(false), advanced = useRef(false);
  const clock = useActiveClock(!p.paused && phase !== "feedback");
  const feedbackClock = useActiveClock(!p.paused && phase === "feedback" && p.mode === "normal");
  function resolve(index: number, timedOut = false) {
    if (p.paused || phase !== "live" || finished.current) return;
    finished.current = true;
    const success = index === challenge.target;
    const reaction = success && index >= 0 ? Math.max(1, Math.round(clock.read() - onset.current)) : undefined;
    p.onScore(success ? 1 : 0, success ? 0 : 1, reaction);
    setCorrect(success);setResponse(reaction ?? null);
    setMessage(success ? index < 0 ? "Doğru: bu alanda hedef yoktu." : `${reaction} ms · Hedefi yakaladın.` : timedOut ? "Hedefin süresi doldu." : "Bu turdaki hedef işaretine yeniden bak.");
    setPhase("feedback");
  }
  useEffect(() => {
    if (p.paused) return;
    if (phase === "waiting" && clock.elapsed >= challenge.waitMs) { onset.current = clock.read();setPhase("live"); }
    if (phase === "live" && p.mode === "normal" && clock.elapsed - onset.current >= challenge.responseMs) resolve(-1, true);
  }, [clock.elapsed, phase, p.paused, p.mode, challenge.waitMs, challenge.responseMs]);
  useEffect(() => {
    if (p.mode === "normal" && phase === "feedback" && feedbackClock.elapsed >= 750 && !advanced.current) { advanced.current = true;p.next(); }
  }, [feedbackClock.elapsed, p.mode, phase, p.next]);
  function next() { if (!advanced.current) { advanced.current = true;p.next(); } }
  const targetName = challenge.goal === "circle" ? "DAİRE ●" : "ELMAS ◆";
  return <div className="round-content reaction-game">
    <div className="reaction-instruction"><span>YALNIZCA</span><strong>{targetName}</strong><span>İŞARETİNE DOKUN</span></div>
    <div className="reaction-grid" style={{ gridTemplateColumns: `repeat(${challenge.size}, 1fr)` }}>
      {Array.from({ length: challenge.size ** 2 }, (_, i) => {
        const visible = phase !== "waiting";
        const target = i === challenge.target;
        const distractor = challenge.distractors.includes(i);
        const shape = visible && (target || distractor) ? (target ? challenge.goal : challenge.goal === "circle" ? "diamond" : "circle") : null;
        return <button key={i} className={"reaction-cell " + (shape ? "has-signal " : "") + (shape === "circle" ? "signal-circle" : shape === "diamond" ? "signal-diamond" : "")}
          disabled={p.paused || phase !== "live"} onClick={() => resolve(i)} aria-label={`${Math.floor(i / challenge.size) + 1}. satır ${i % challenge.size + 1}. sütun${shape ? shape === "circle" ? " daire" : " elmas" : " boş"}`}>
          {shape ? <span aria-hidden>{shape === "circle" ? "●" : "◆"}</span> : <small>+</small>}
        </button>;
      })}
    </div>
    {phase !== "feedback" && <><p className="board-hint" role="status">{phase === "waiting" ? "Hazır ol. Hedef birazdan belirecek." : p.mode === "zen" ? "Süre sınırı yok. Doğru şekli bul; hedef yoksa geç." : "Hedef yoksa bekle veya Hedef yok düğmesini kullan."}</p><button className="secondary" disabled={p.paused || phase !== "live"} onClick={() => resolve(-1)}>Hedef yok</button></>}
    {phase === "feedback" && <><span className="reaction-time">{response === null ? correct ? "✓" : "—" : response}<small>{response === null ? "" : "ms"}</small></span>{p.mode === "zen" ? <RoundFeedback correct={correct} next={next} last={p.round === 29}>{message}</RoundFeedback> : <p role="status" className={correct ? "reaction-good" : "reaction-bad"}>{message} Sonraki hedef hazırlanıyor.</p>}</>}
    <small className="reaction-note">Tab ve Enter ile de oynanır. Giriş cihazı ve ekran hızı tepki süresini etkiler.</small>
  </div>;
}
