import type {Level} from './atlas';
export type CubeCell={id:number;x:number;y:number;z:number};
export type CubeChallenge={size:3|4;cells:CubeCell[];missing:number[];studyMs:number};
export function cubeCells(size:3|4):CubeCell[]{return Array.from({length:size**3},(_,id)=>({id,x:id%size,y:Math.floor(id/size)%size,z:Math.floor(id/(size*size))}));}
export const visibleCubeCell=(c:CubeCell,size:number)=>c.y===0||c.x===size-1||c.z===size-1;
export function cubeConnected(cells:CubeCell[],missing:number[]){
 const remaining=cells.filter(c=>!missing.includes(c.id));if(!remaining.length)return false;
 const seen=new Set([remaining[0].id]),queue=[remaining[0]];
 for(let i=0;i<queue.length;i++)for(const c of remaining)if(!seen.has(c.id)&&Math.abs(c.x-queue[i].x)+Math.abs(c.y-queue[i].y)+Math.abs(c.z-queue[i].z)===1){seen.add(c.id);queue.push(c);}
 return seen.size===remaining.length;
}
export function cubeChallenge(level:Level,round:number,random:()=>number=Math.random):CubeChallenge {
 const size=level===1?3:4,cells=cubeCells(size);const min=level===1?1:level===2?3:5,max=level===1?3:level===2?6:9;
 const count=min+Math.floor(random()*(max-min+1));
 const candidates=cells.filter(c=>visibleCubeCell(c,size));
 // Fisher–Yates avoids a biased random comparator. Higher levels mix face centres with edges.
 for(let i=candidates.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}
 if(level===1)candidates.sort((a,b)=>Number(b.z===size-1)-Number(a.z===size-1));
 const missing:number[]=[];
 for(const c of candidates){if(cubeConnected(cells,[...missing,c.id]))missing.push(c.id);if(missing.length===count)break;}
 return {size,cells,missing,studyMs:[0,8000,7000,5500][level]-Math.min(round,5)*200};
}
export const validCubeAnswer=(value:string,total:number)=>/^\d{1,2}$/.test(value)&&Number(value)<=total;
