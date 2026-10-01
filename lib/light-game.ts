import type {Level} from './atlas';
export type Point = {x:number;y:number};
export type LightBoard = {size:number;source:Point;direction:number;receiver:Point;mirrors:Point[];initial:number[];solution:number[];crystals:Point[];walls:Point[]};
export const directions = [{x:1,y:0},{x:0,y:1},{x:-1,y:0},{x:0,y:-1}];
const key=(p:Point)=>`${p.x},${p.y}`;
export function reflect(direction:number,mirror:number){return mirror===0?[3,2,1,0][direction]:[1,0,3,2][direction];}
export function lightBoard(level:Level,round:number):LightBoard {
 const size=7;
 const routes=[
  [ [[0,1],[2,1],[2,5],[5,5],[5,2],[6,2]], [[0,5],[4,5],[4,1],[1,1],[1,3],[6,3]], [[0,3],[2,3],[2,0],[5,0],[5,5],[6,5]] ],
  [ [[0,0],[3,0],[3,4],[1,4],[1,6],[5,6],[5,2],[6,2]], [[0,5],[2,5],[2,1],[5,1],[5,3],[4,3],[4,6],[6,6]], [[0,2],[1,2],[1,5],[4,5],[4,0],[6,0],[6,4],[0,4]] ],
  [ [[0,0],[3,0],[3,3],[0,3],[0,6],[5,6],[5,4],[4,4],[4,1],[6,1]], [[0,6],[3,6],[3,4],[0,4],[0,1],[5,1],[5,5],[4,5],[4,2],[6,2]], [[0,0],[2,0],[2,3],[5,3],[5,6],[1,6],[1,4],[3,4],[3,1],[6,1]] ]
 ];
 const rotate=(p:Point):Point=>{let v=p;for(let i=0;i<round%4;i++)v={x:size-1-v.y,y:v.x};return v;};
 const route=routes[level-1][round%3].map(([x,y])=>rotate({x,y}));
 const mirrors=route.slice(1,-1), solution:number[]=[];
 const path:Point[]=[];
 const directionOf=(a:Point,b:Point)=>directions.findIndex(d=>Math.sign(b.x-a.x)===d.x&&Math.sign(b.y-a.y)===d.y);
 for(let i=0;i<route.length-1;i++){
  const d=directionOf(route[i],route[i+1]);let p={...route[i]};
  if(i===0)path.push(p);
  while(key(p)!==key(route[i+1])){p={x:p.x+directions[d].x,y:p.y+directions[d].y};path.push(p);}
  if(i<route.length-2)solution.push(reflect(d,0)===directionOf(route[i+1],route[i+2])?0:1);
 }
 const open=path.slice(1,-1).filter(p=>!mirrors.some(m=>key(m)===key(p)));
 const crystals=[open[0],open[Math.floor(open.length/2)],open[open.length-1]];
 const walls:Point[]=[];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!path.some(p=>p.x===x&&p.y===y)&&(x*3+y*5+round)%4===0)walls.push({x,y});
 return {size,source:route[0],receiver:route.at(-1)!,direction:directionOf(route[0],route[1]),mirrors,solution,initial:solution.map((m,i)=>(i+round)%3===0?m:1-m),crystals,walls};
}
export function traceLight(board:LightBoard,orientations:readonly number[]){
 let p={...board.source},direction=board.direction;
 const path:Point[]=[p],seen=new Set<string>(),collected=new Set<number>();
 for(let step=0;step<board.size*board.size*4+1;step++){
  const state=key(p)+','+direction;
  if(seen.has(state))return {path,collected:[...collected],success:false,reason:'Işın kapalı bir döngüye girdi.'};
  seen.add(state);
  const crystal=board.crystals.findIndex(c=>key(c)===key(p));if(crystal>=0)collected.add(crystal);
  if(key(p)===key(board.receiver))return {path,collected:[...collected],success:collected.size===board.crystals.length,reason:collected.size===board.crystals.length?'Üç enerji noktası ve alıcı bağlandı.':'Alıcıya ulaştın, fakat bazı enerji noktaları eksik.'};
  if(board.walls.some(w=>key(w)===key(p)))return {path,collected:[...collected],success:false,reason:'Işın bir engelde kesildi.'};
  const mirror=board.mirrors.findIndex(m=>key(m)===key(p));if(mirror>=0)direction=reflect(direction,orientations[mirror]);
  p={x:p.x+directions[direction].x,y:p.y+directions[direction].y};path.push(p);
  if(p.x<0||p.y<0||p.x>=board.size||p.y>=board.size)return {path,collected:[...collected],success:false,reason:'Işın atölyenin dışına çıktı.'};
 }
 return {path,collected:[...collected],success:false,reason:'Işın yolu tamamlanamadı.'};
}
