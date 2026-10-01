import type { Level } from './atlas';

export type Cargo = { x:number; y:number; length:number; vertical:boolean };
export type HarborBoard = { pieces:Cargo[]; par:number; solution:{piece:number;delta:number}[] };
export function cargoCells(p:Cargo){return Array.from({length:p.length},(_,i)=>(p.y+(p.vertical?i:0))*6+p.x+(p.vertical?0:i));}
export function slideCargo(pieces:Cargo[],index:number,delta:number):Cargo[]|null {
 const p=pieces[index];if(!p||!Number.isInteger(delta)||!delta)return null;
 const occupied=new Set(pieces.flatMap((q,i)=>i===index?[]:cargoCells(q)));
 for(let d=Math.sign(delta);Math.abs(d)<=Math.abs(delta);d+=Math.sign(delta)){
  const moved={...p,x:p.x+(p.vertical?0:d),y:p.y+(p.vertical?d:0)};
  if(moved.x<0||moved.y<0||moved.x+(p.vertical?1:p.length)>6||moved.y+(p.vertical?p.length:1)>6||cargoCells(moved).some(c=>occupied.has(c)))return null;
 }
 return pieces.map((q,i)=>i===index?{...q,x:q.x+(q.vertical?0:delta),y:q.y+(q.vertical?delta:0)}:q);
}
export const harborSolved=(pieces:Cargo[])=>pieces[0].x===4;
export function solveHarbor(start:Cargo[],cap=60000){
 const key=(ps:Cargo[])=>ps.map(p=>p.vertical?p.y:p.x).join('');
 const nodes=[{p:start,parent:-1,piece:-1,delta:0}],seen=new Set([key(start)]);
 for(let at=0;at<nodes.length&&nodes.length<cap;at++){
  const n=nodes[at];if(harborSolved(n.p)){const result:{piece:number;delta:number}[]=[];for(let k=at;nodes[k].parent>=0;k=nodes[k].parent)result.unshift({piece:nodes[k].piece,delta:nodes[k].delta});return result;}
  for(let i=0;i<n.p.length;i++)for(const d of [-1,1]){const p=slideCargo(n.p,i,d);if(p&&!seen.has(key(p))){seen.add(key(p));nodes.push({p,parent:at,piece:i,delta:d});}}
 }return null;
}

export type Command='F'|'L'|'R';
export type ProgramStep={command:Command;repeat:number};
export type RoverBoard={rows:string[];par:number;solution:Command[]};
export type RoverState={x:number;y:number;direction:number;key:boolean;collected:number[];failed:string|null};
export function roverStart(board:RoverBoard):RoverState {const y=board.rows.findIndex(r=>r.includes('S'));return {x:board.rows[y].indexOf('S'),y,direction:1,key:false,collected:[],failed:null};}
export function roverStep(board:RoverBoard,state:RoverState,cmd:Command):RoverState {
 if(state.failed)return state;
 if(cmd!=='F')return {...state,direction:(state.direction+(cmd==='L'?3:1))%4};
 const x=state.x+[0,1,0,-1][state.direction],y=state.y+[-1,0,1,0][state.direction],tile=board.rows[y]?.[x];
 if(!tile||tile==='#')return {...state,failed:'Duvara çarptın. Komut dizisini düzenleyip yeniden dene.'};
 if(tile==='D'&&!state.key)return {...state,failed:'Kapı kilitli. Önce K anahtarını al.'};
 const cell=y*7+x;return {...state,x,y,key:state.key||tile==='K',collected:tile==='*'&&!state.collected.includes(cell)?[...state.collected,cell]:state.collected};
}
export function roverSolved(board:RoverBoard,s:RoverState){return !s.failed&&board.rows[s.y][s.x]==='E'&&s.collected.length===board.rows.join('').split('*').length-1;}
export function solveRover(board:RoverBoard){
 const key=(s:RoverState)=>[s.x,s.y,s.direction,s.key,[...s.collected].sort().join(',')].join('/');
 const nodes=[{s:roverStart(board),parent:-1,cmd:'F' as Command}],seen=new Set([key(nodes[0].s)]);
 for(let at=0;at<nodes.length&&nodes.length<50000;at++){
  if(roverSolved(board,nodes[at].s)){const result:Command[]=[];for(let k=at;nodes[k].parent>=0;k=nodes[k].parent)result.unshift(nodes[k].cmd);return result;}
  for(const cmd of ['F','L','R'] as Command[]){const s=roverStep(board,nodes[at].s,cmd);if(!s.failed&&!seen.has(key(s))){seen.add(key(s));nodes.push({s,parent:at,cmd});}}
 }return null;
}
export const expandProgram=(program:ProgramStep[])=>program.flatMap(s=>Array.from({length:s.repeat},()=>s.command));

export type Train={id:number;destination:number;distance:number;branch:number|null;terminal:number|null;done:boolean};
export const terminals=['A · Arşiv','B · Bahçe','C · Çarşı','D · Dok'];
export function createTimetable(level:Level,round:number){return Array.from({length:12+level*4},(_,id)=>({id,destination:(id*3+Math.floor(id/3)+round+level)%4,distance:0,branch:null,terminal:null,done:false} satisfies Train));}
// Distances share a common trunk; each decision is latched when a train crosses a switch.
export function advanceTrain(train:Train,delta:number,switches:number[]):Train {
 if(train.done)return train;let t={...train,distance:train.distance+delta};
 if(t.branch===null&&t.distance>=32)t.branch=switches[0];
 if(t.terminal===null&&t.distance>=67)t.terminal=t.branch!*2+switches[t.branch!+1];
 if(t.distance>=100)t={...t,distance:100,done:true};return t;
}
export function trainPoint(t:Train){
 const points=t.distance<=32?[[30,220],[235,220]]:t.distance<=67?[[235,220],[430,t.branch===0?115:325]]:[[430,t.branch===0?115:325],[655,[55,170,270,385][t.terminal??(t.branch??0)*2]]];
 const k=t.distance<=32?t.distance/32:t.distance<=67?(t.distance-32)/35:(t.distance-67)/33;
 return {x:points[0][0]+(points[1][0]-points[0][0])*k,y:points[0][1]+(points[1][1]-points[0][1])*k};
}
