"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Level, Mode } from "@/lib/atlas";

export type MiniGameProps = {
  level: Level; mode: Mode; paused: boolean; reduced: boolean; round: number;
  onScore: (correct: number, wrong: number, reaction?: number) => void;
  next: () => void;
};

/** The display ticks every 25 ms; event readings retain performance.now precision. */
export function useActiveClock(active: boolean) {
  const accumulated = useRef(0), started = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const read = useCallback(() => accumulated.current + (started.current === null ? 0 : performance.now() - started.current), []);
  useEffect(() => {
    if (!active) return;
    started.current = performance.now();
    const timer = setInterval(() => setElapsed(read()), 25);
    return () => { accumulated.current = read(); started.current = null; clearInterval(timer); };
  }, [active, read]);
  return { elapsed, read };
}

export function RoundFeedback({ correct, children, next, last }: { correct: boolean; children: React.ReactNode; next: () => void; last: boolean }) {
  return <div className={"feedback-panel " + (correct ? "feedback-good" : "feedback-bad")} role="status">
    <div><span aria-hidden>{correct ? "✓" : "×"}</span><span>{children}</span></div>
    <button className="secondary" onClick={next}>{last ? "Sonuçları gör" : "Sonraki tur"}</button>
  </div>;
}
