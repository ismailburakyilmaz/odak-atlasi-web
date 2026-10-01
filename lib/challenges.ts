import type { GameId, Level } from "./atlas";

export const symbols = ["◆", "●", "▲", "■", "✦", "⬟"];
export const symbolNames = ["Elmas", "Daire", "Üçgen", "Kare", "Yıldız", "Altıgen"];
export const colorNames = ["Orman", "Kiremit", "Mürekkep", "Hardal"];
export const colors = ["#42784c", "#af573b", "#42647c", "#927221"];
export const drinks = ["Espresso", "Filtre", "Çay", "Kakao"];
export const extras = ["Sade", "Süt", "Tarçın", "Bal"];
export const sizes = ["Küçük", "Büyük"];
export type Tile = { symbol:number; color:number; filled:boolean };
export type Order = { drink:number; extra:number; size:number };
export type Challenge = {
 kind:GameId; answer:number[]; tiles:Tile[]; numbers:number[];
 target?:Tile; criterion?:"color"|"symbol"; reverse?:boolean;
 direction?:number; rotation?:number; go?:boolean; wait?:number;
 size?:number; blocked?:number[]; limit?:number; orders?:Order[];
 paths?:number[][]; checkpoints?:number[]; required?:number;
 priority?:number[]; shown?:number[]; targetIndices?:number[];
};
export const rand = (n:number) => Math.floor(Math.random()*n);
export function shuffled<T>(items:T[]):T[] {
 const a=[...items];
 for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
const tile = ():Tile => ({symbol:rand(6),color:rand(4),filled:rand(2)===0});
export function shortestPath(size:number,blocked:number[],start=0,goal=size*size-1):number[] {
 const queue:number[][]=[[start]],seen=new Set([start]);
 while(queue.length) {
  const path=queue.shift()!,last=path[path.length-1];
  if(last===goal)return path;
  for(const n of [last-size,last+size,last-1,last+1]) {
   if(n<0||n>=size*size||blocked.includes(n)||seen.has(n)||
    Math.abs(Math.floor(n/size)-Math.floor(last/size))+Math.abs(n%size-last%size)!==1)continue;
   seen.add(n);queue.push([...path,n]);
  }
 }
 return [];
}
export function createChallenge(kind:GameId,level:Level,round:number):Challenge {
 const c:Challenge={kind,answer:[],tiles:[],numbers:[]};
 switch(kind) {
  case "sequence": {
   c.shown=Array.from({length:3+level+Math.floor(round/3)},()=>rand(6));
   c.reverse=level>1&&round%2===1;
   c.answer=c.reverse?[...c.shown].reverse():[...c.shown];
   break;
  }
  case "shelf": {
   c.numbers=shuffled(Array.from({length:9},(_,i)=>i<3+level?i:-1));
   c.targetIndices=shuffled(c.numbers.map((n,i)=>n>=0?i:-1).filter(i=>i>=0)).slice(0,level===1?2:3);
   c.answer=[...c.targetIndices];break;
  }
  case "search": {
   const n=level===1?30:level===2?36:48,target=tile();
   c.target=target;
   c.answer=shuffled(Array.from({length:n},(_,i)=>i)).slice(0,3+level);
   c.tiles=Array.from({length:n},(_,i)=>{
    if(c.answer.includes(i))return {...target,color:level===3?rand(4):target.color};
    let t=tile();while(t.symbol===target.symbol&&t.filled===target.filled)t=tile();
    return {...t,color:level===3?rand(4):target.color};
   });break;
  }
  case "track": {
   const n=5+level;c.numbers=Array.from({length:n},(_,i)=>i);
   c.answer=shuffled(c.numbers).slice(0,level+1);
   // Neighbour exchanges keep the paths short and readable.
   c.paths=[shuffled(c.numbers)];
   for(let step=0;step<6;step++){
    const previous:number[]=[...c.paths[c.paths.length-1]];
    const a=rand(n),b=(a+1)%n;
    const ia=previous.indexOf(a),ib=previous.indexOf(b);
    [previous[ia],previous[ib]]=[previous[ib],previous[ia]];
    if(level>1){const d=(a+3)%n,e=(d+1)%n;const id=previous.indexOf(d),ie=previous.indexOf(e);[previous[id],previous[ie]]=[previous[ie],previous[id]];}
    c.paths.push(previous);
   }break;
  }
  case "compare": {
   const count=level===1?2:level===2?3:4;
   const left=Array.from({length:count},tile);
   const right=left.map(t=>({...t,color:level===3?rand(4):t.color}));
   const same=rand(2)===0;
   if(!same){const i=rand(count);if(rand(2))right[i].symbol=(right[i].symbol+1+rand(5))%6;else right[i].filled=!right[i].filled;}
   c.tiles=[...left,...right];c.required=count;c.answer=[same?0:1];break;
  }
  case "signal": c.go=rand(3)>0;c.wait=800+rand(1900);c.answer=[c.go?1:0];break;
  case "path": {
   const size=level===3?7:6;c.size=size;
   let attempts=0;
   while(true) {
    const blocked=shuffled(Array.from({length:size*size-2},(_,i)=>i+1)).slice(0,5+level*2);
    const available=shuffled(Array.from({length:size*size-2},(_,i)=>i+1).filter(i=>!blocked.includes(i)));
    const checkpoints=available.slice(0,level===1?2:3);
    const destinations=[...checkpoints,size*size-1];
    let current=0,route=[0],solvable=true;
    for(const destination of destinations){
     const leg=shortestPath(size,blocked,current,destination);
     if(!leg.length){solvable=false;break;}
     route.push(...leg.slice(1));current=destination;
    }
    attempts++;
    if(solvable&&(route.length>size*2||attempts>100)){
     c.blocked=blocked;c.checkpoints=checkpoints;c.answer=route;
     c.limit=route.length-1+(4-level);break;
    }
   }break;
  }
  case "sum": {
   c.numbers=Array.from({length:7+level},(_,i)=>(level>1&&i%3===0?-1:1)*(2+rand(9+level*3)));
   c.required=level+2;
   // Avoid trivial all-zero totals but retain a known exact-card-count solution.
   do{c.answer=shuffled(c.numbers.map((_,i)=>i)).slice(0,c.required);}while(sumTarget(c)===0);
   break;
  }
  case "rule": {
   const target=tile();c.target=target;
   c.criterion=(level===1?Math.floor(round/3)%2:rand(2))?"color":"symbol";
   c.tiles=[{...target,symbol:(target.symbol+1)%6},{...target,color:(target.color+1)%4}];
   for(let i=0;i<level;i++)c.tiles.push({symbol:(target.symbol+2+i)%6,color:(target.color+2+i%2)%4,filled:rand(2)===0});
   c.tiles=shuffled(c.tiles);c.answer=[c.tiles.findIndex(t=>t[c.criterion!]===target[c.criterion!])];break;
  }
  case "reverse": {
   c.direction=rand(4);c.rotation=level===3?rand(4):level===2?(rand(3)===0?1:rand(2)*2):Math.floor(round/3)%2*2;
   c.reverse=c.rotation===2;c.answer=[(c.direction+c.rotation)%4];break;
  }
  case "post": {
   c.numbers=shuffled(Array.from({length:9},(_,i)=>10+i*8+rand(5)));
   const addresses=shuffled(c.numbers).slice(0,3+level);
   c.priority=shuffled(addresses).slice(0,level===1?1:2).sort((a,b)=>a-b);
   c.answer=[...c.priority,...addresses.filter(n=>!c.priority!.includes(n)).sort((a,b)=>a-b)];
   c.shown=shuffled(addresses);break;
  }
  case "cafe":c.orders=Array.from({length:2+level},()=>({drink:rand(level===1?3:4),extra:rand(4),size:rand(2)}));break;
 }
 return c;
}
export const roundCounts:Record<GameId,number>={air:1,light:3,orbit:3,cube:6,harbor:3,rover:3,railway:1,sequence:6,shelf:6,search:5,track:4,compare:24,signal:24,path:3,sum:6,rule:24,reverse:24,post:4,cafe:4,matrix:6,reaction:30,pattern:8,simon:6};
export function sumTarget(c:Challenge){return c.answer.reduce((s,i)=>s+c.numbers[i],0);}
export function validSum(c:Challenge,picks:number[]){
 return picks.length===c.required&&new Set(picks).size===picks.length&&picks.every(i=>i>=0&&i<c.numbers.length)&&picks.reduce((s,i)=>s+c.numbers[i],0)===sumTarget(c);
}
export function validMove(c:Challenge,from:number,to:number){
 const size=c.size!;
 return to>=0&&to<size*size&&!c.blocked!.includes(to)&&Math.abs(Math.floor(to/size)-Math.floor(from/size))+Math.abs(to%size-from%size)===1;
}
