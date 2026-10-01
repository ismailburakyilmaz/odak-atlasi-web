export type Point = { x: number; y: number };
export type Runway = "A" | "B";
export type Flight = Point & { id: number; target: Runway; born: number; heading: number; route: Point[]; runway?: Runway; gate: number };
export type AirConfig = { count: number; gap: number; speed: number; fuel: number; storms: (Point & { radius: number })[] };
export type AirEvent = { id: number; correct: boolean; reason: string };
export type AirState = { time: number; released: number; planes: Flight[]; landed: number; failed: number; finished: boolean };
export const gates = [12, 50, 88];
export const runwayY = { A: 20, B: 80 };
export function airConfig(level: 1 | 2 | 3): AirConfig {
  return { count: [8, 10, 12][level-1], gap: [9, 7, 5.5][level-1], speed: [6, 7, 8][level-1], fuel: [42, 36, 31][level-1], storms: level === 1 ? [{ x: 50, y: 50, radius: 12 }] : level === 2 ? [{ x: 48, y: 47, radius: 12 }, { x: 68, y: 64, radius: 7 }] : [{ x: 48, y: 50, radius: 14 }, { x: 31, y: 28, radius: 7 }] };
}
export const flightTarget = (id: number): Runway => ["A", "B", "A", "B", "B", "A"][id % 6] as Runway;
export const initialAir = (): AirState => ({ time: 0, released: 0, planes: [], landed: 0, failed: 0, finished: false });
export const distance = (a: Point, b: Point) => Math.hypot(a.x-b.x,a.y-b.y);
export function routeAir(state: AirState, id: number, points: Point[], runway: Runway): AirState {
  if (state.finished || points.length > 4 || !["A","B"].includes(runway) || points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<2||p.x>98||p.y<2||p.y>98)) return state;
  return { ...state, planes: state.planes.map(p=>p.id===id ? { ...p, runway, route: [...points.map(p=>({...p})), {x:78,y:runwayY[runway]}, {x:92,y:runwayY[runway]}] } : p) };
}
/** Small simulation steps keep collision checks consistent even in manual mode. */
export function advanceAir(input: AirState, config: AirConfig, dt: number): { state: AirState; events: AirEvent[] } {
  if (input.finished || !Number.isFinite(dt) || dt<=0) return {state:input,events:[]};
  const state: AirState = {...input,planes:input.planes.map(p=>({...p,route:p.route.map(q=>({...q}))}))};
  const events: AirEvent[] = [];
  let remaining = Math.min(dt, 120);
  while (remaining > 1e-8 && !state.finished) {
    const step = Math.min(remaining, .05); remaining -= step; state.time += step;
    while (state.released < config.count && state.time >= state.released*config.gap) {
      const id = state.released++, gate = id%3;
      state.planes.push({id,target:flightTarget(id),born:state.time,x:17,y:gates[gate],gate,heading:90,route:[]});
    }
    const resolved = new Map<number,AirEvent>();
    for (const p of state.planes) {
      if (!p.runway) {
        const angle = (state.time-p.born)*.55;
        p.x=13+4*Math.cos(angle); p.y=gates[p.gate]+4*Math.sin(angle); p.heading=angle*180/Math.PI+90;
      } else {
        let travel=config.speed*step;
        while(travel>1e-8 && p.route.length) {
          const next=p.route[0], d=distance(p,next);
          if(d>1e-8) p.heading=Math.atan2(next.y-p.y,next.x-p.x)*180/Math.PI;
          if(d<=travel) {p.x=next.x;p.y=next.y;p.route.shift();travel-=d;} else {p.x+=(next.x-p.x)/d*travel;p.y+=(next.y-p.y)/d*travel;travel=0;}
        }
      }
      if(config.storms.some(s=>distance(s,p)<s.radius)) resolved.set(p.id,{id:p.id,correct:false,reason:"Fırtına alanı: uçuş başka meydana yönlendirildi."});
      else if(state.time-p.born>=config.fuel) resolved.set(p.id,{id:p.id,correct:false,reason:"Yakıt süresi doldu: uçuş başka meydana yönlendirildi."});
      else if(p.runway && !p.route.length) resolved.set(p.id,{id:p.id,correct:p.runway===p.target,reason:p.runway===p.target?"Doğru piste güvenli iniş.":"Yanlış pist seçildi."});
    }
    // Evaluate all pairs before removing any plane, including three-way conflicts.
    for(let i=0;i<state.planes.length;i++) for(let j=i+1;j<state.planes.length;j++) {
      const a=state.planes[i], b=state.planes[j];
      if(distance(a,b)<4) for(const p of [a,b]) resolved.set(p.id,{id:p.id,correct:false,reason:"Güvenli mesafe aşıldı: uçuş iptal edildi."});
    }
    for(const e of resolved.values()) {events.push(e);if(e.correct)state.landed++;else state.failed++;}
    state.planes=state.planes.filter(p=>!resolved.has(p.id));
    state.finished=state.released===config.count && state.planes.length===0;
  }
  return {state,events};
}
