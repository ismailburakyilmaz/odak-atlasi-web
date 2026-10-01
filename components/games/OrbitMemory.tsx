"use client";
import { useEffect, useRef, useState } from 'react';
import { dockPoint, fleet, orbitChallenge } from '@/lib/orbit-game';
import { ShipMark } from './OrbitArt';
import { RoundFeedback, useActiveClock, type MiniGameProps } from './shared';

type Phase = 'ready' | 'study' | 'transfer' | 'recall' | 'result';
const TRANSFER_MS = 2600;
const label = (dock: number) => String(dock + 1).padStart(2, '0');

export default function OrbitMemory(p: MiniGameProps) {
  const [c] = useState(() => orbitChallenge(p.level));
  const [phase, setPhase] = useState<Phase>('ready');
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const { elapsed, read } = useActiveClock(!p.paused && (phase === 'study' || phase === 'transfer'));
  const stageStart = useRef(0), locked = useRef(false), stageButton = useRef<HTMLButtonElement>(null), firstDock = useRef<HTMLButtonElement>(null);
  const manual = p.mode === 'zen' || p.reduced;
  const stageElapsed = Math.max(0, elapsed - stageStart.current);
  const pair = c.transfers[step];
  const target = c.targets[picks.length];
  const correctCount = picks.filter((dock, i) => c.final[dock] === c.targets[i]).length;

  function beginTransfers() { if (p.paused || phase !== 'study') return; stageStart.current = read(); setPhase('transfer'); }
  function advanceTransfer() {
    if (p.paused || phase !== 'transfer') return;
    stageStart.current = read();
    if (step + 1 === c.transfers.length) setPhase('recall'); else setStep(step + 1);
  }
  function answer(dock: number) {
    if (p.paused || phase !== 'recall' || locked.current) return;
    locked.current = true;
    const updated = [...picks, dock]; setPicks(updated);
    const correct = c.final[dock] === c.targets[picks.length];
    p.onScore(correct ? 1 : 0, correct ? 0 : 1);
    if (updated.length === c.targets.length) {
      setPhase('result');
    }
  }
  useEffect(() => { locked.current = false; }, [picks.length]);
  useEffect(() => {
    if (p.paused) return;
    if (phase === 'study' && p.mode === 'normal' && stageElapsed >= c.studyMs) { stageStart.current = read(); setPhase('transfer'); }
    if (phase === 'transfer' && !manual && stageElapsed >= TRANSFER_MS) {
      stageStart.current = read();
      if (step + 1 === c.transfers.length) setPhase('recall'); else setStep(s => s + 1);
    }
  }, [phase, stageElapsed, c.studyMs, c.transfers.length, p.paused, p.mode, manual, step, read]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || !/^[0-9]$/.test(e.key)) return;
      const dock = Number(e.key) === 0 ? 9 : Number(e.key) - 1;
      if (dock < c.initial.length && phase === 'recall' && !p.paused) { e.preventDefault(); answer(dock); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  });
  useEffect(() => { if (!p.paused) { if (phase === 'recall') firstDock.current?.focus({ preventScroll: true }); else stageButton.current?.focus({ preventScroll: true }); } }, [phase, step, p.paused]);

  return <div className="deep-game orbit-memory-game">
    <div className="orbit-heading"><div><span>KONUM + GÜNCELLEME / VARDİYA {p.round + 1}</span><h3>Yerler değişir. İz sende kalır.</h3></div><span>{c.initial.length} iskele<br/><b>{c.transfers.length} aktarım</b></span></div>
    <div className={'orbit-observatory phase-' + phase}>
      <div className="orbit-planet"/><div className="orbit-stars"/>
      <div className="orbit-scene-top"><span><i/> YILDIZ LİMANI</span><span>SEKTÖR 0{p.round + 1}</span></div>
      <div className="orbit-station" role="group" aria-label="Numaralı uzay istasyonu iskeleleri">
        <svg viewBox="0 0 100 100" className="orbit-structure" aria-hidden="true"><circle cx="50" cy="50" r="37" className="orbit-ring-outer"/><circle cx="50" cy="50" r="37" className="orbit-ring-ticks"/><circle cx="50" cy="50" r="23" className="orbit-ring-inner"/>{c.initial.map((_,i)=>{const a=dockPoint(i,c.initial.length);return <line key={i} x1="50" y1="50" x2={a.x} y2={a.y}/>;})}
          {phase === 'transfer' && (() => { const a=dockPoint(pair[0],c.initial.length), b=dockPoint(pair[1],c.initial.length); return <><path className="orbit-transfer-route" d={`M${a.x} ${a.y} Q50 50 ${b.x} ${b.y}`}/>{!manual && [0,1].map(direction=>{const t=Math.min(1,stageElapsed/TRANSFER_MS), u=direction?1-t:t;return <circle key={direction} className="orbit-shuttle" r="1.5" cx={(1-u)**2*a.x+2*(1-u)*u*50+u*u*b.x} cy={(1-u)**2*a.y+2*(1-u)*u*50+u*u*b.y}/>;})}</>; })()}
        </svg>
        <div className="orbit-core" aria-hidden="true"><span>OA / {String(p.round + 1).padStart(2,'0')}</span><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="28"/><circle cx="40" cy="40" r="18"/><path d="M40 5v15m0 40v15M5 40h15m40 0h15M32 40h16m-8-8v16"/></svg><small>{phase==='study'?'GÖZLEM':phase==='transfer'?'AKTARIM':phase==='recall'?'HATIRLA':phase==='result'?'KAYIT':'BEKLEME'}</small></div>
        {c.initial.map((ship,dock)=>{const pos=dockPoint(dock,c.initial.length), visible=phase==='study'||phase==='result', highlighted=phase==='transfer'&&pair.includes(dock); const shown=phase==='result'?c.final[dock]:ship; return <button key={dock} ref={dock===0?firstDock:undefined} className={'orbit-dock '+(highlighted?'transferring ':'')+(visible?'open':'closed')} style={{left:pos.x+'%',top:pos.y+'%'}} disabled={phase!=='recall'||p.paused} onClick={()=>answer(dock)} aria-label={'İskele '+label(dock)+(visible?' · '+fleet[shown].name:'')}><span className="orbit-dock-number">{label(dock)}</span>{visible?<><ShipMark ship={shown}/><span className="orbit-ship-name">{fleet[shown].name}</span></>:<span className="orbit-shutter" aria-hidden="true"><i/><i/><i/></span>}</button>;})}
      </div>
      <div className="orbit-scene-bottom"><span>{phase==='study'?'ARAÇLARIN YERLERİNİ EZBERLE':phase==='transfer'?'KAPAKLAR KAPALI · İKİ ARAÇ YER DEĞİŞTİRİYOR':phase==='recall'?'İSKELEYE DOKUN VEYA NUMARASINA BAS':phase==='result'?'SON YERLEŞİM · TÜM KAPAKLAR AÇIK':'BAŞLATINCA ARAÇLAR GÖRÜNECEK'}</span><b>{phase==='study'?(p.mode==='zen'?'∞':Math.max(0,(c.studyMs-stageElapsed)/1000).toFixed(1)+' sn'):phase==='recall'?`${picks.length+1} / ${c.targets.length}`:'●'}</b></div>
      {phase==='study'&&p.mode==='normal'&&<div className="orbit-time-track"><i style={{width:Math.max(0,100-stageElapsed/c.studyMs*100)+'%'}}/></div>}
    </div>
    <div className="orbit-console">
      {phase==='ready'&&<><div><small>01 / GÖZLEM</small><h4>Her aracın bir yeri var. Şimdilik.</h4><p>{p.mode==='zen'?'İstasyonu istediğin kadar incele.':`İstasyonu ${c.studyMs/1000} saniye incele.`} Ardından {c.transfers.length} yer değişimini aklından takip et; {c.targets.length} aracın son yerini bul.</p></div><button ref={stageButton} className="primary" disabled={p.paused} onClick={()=>{stageStart.current=read();setPhase('study');}}>İstasyonu aç →</button></>}
      {phase==='study'&&<><div><small>01 / GÖZLEM</small><h4>İsim, şekil, iskele.</h4><p>Numaralar sabit kalır; kapaklar kapanınca yalnızca araçlar yer değiştirir.</p></div><button ref={stageButton} className="secondary" disabled={p.paused} onClick={beginTransfers}>Hazırım, kapakları kapat</button></>}
      {phase==='transfer'&&<><div role="status"><small>02 / AKTARIM {step+1} / {c.transfers.length}</small><h4 className="orbit-transfer-label">{label(pair[0])}<span>↔</span>{label(pair[1])}</h4><p>Bu iki iskeledeki araçlar yer değiştiriyor. Diğerleri yerinde kalıyor.</p></div>{manual?<button ref={stageButton} className="primary" disabled={p.paused} onClick={advanceTransfer}>{step+1===c.transfers.length?'Tamam, sorulara geç':'Aktarımı tamamla →'}</button>:<div className="orbit-transfer-meter"><span>AKTARILIYOR</span><div><i style={{width:Math.min(100,stageElapsed/TRANSFER_MS*100)+'%'}}/></div></div>}</>}
      {phase==='recall'&&<><div className="orbit-query" role="status"><ShipMark ship={target}/><div><small>03 / BUL · {picks.length+1} / {c.targets.length}</small><h4>{fleet[target].name} şimdi nerede?</h4><p>{picks.length>0?'Önceki seçimin alındı. ':''}Son yerleşim tüm seçimlerden sonra açılacak.</p></div></div><span className="orbit-key-hint">İskeleye dokun<br/><kbd>1–{Math.min(9,c.initial.length)}{c.initial.length===10?' · 0 = 10':''}</kbd></span></>}
      {phase==='result'&&<div className="orbit-review"><div><small>VARDİYA RAPORU</small><h4>{correctCount} / {c.targets.length} araç doğru iskelede.</h4></div><ul>{c.targets.map((ship,i)=>{const dock=c.final.indexOf(ship), ok=picks[i]===dock;return <li key={ship}><span className={ok?'orbit-answer-good':'orbit-answer-bad'}>{ok?'✓':'×'}</span><b>{fleet[ship].name}</b><span>{ok?`İskele ${label(dock)}`:`Seçimin ${label(picks[i])} → Doğrusu ${label(dock)}`}</span></li>;})}</ul></div>}
    </div>
    {phase==='result'&&<RoundFeedback correct={correctCount===c.targets.length} next={p.next} last={p.round===2}>{correctCount} doğru, {c.targets.length-correctCount} yanlış. Her araç için tek seçim puanlanır.</RoundFeedback>}
  </div>;
}
