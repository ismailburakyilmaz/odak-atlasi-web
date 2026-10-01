import {games,initialStore,localDate,dailyGames,STORE_KEY,type Stored,type Result} from "./atlas";
export function parseStore(text:string|null):Stored{
 const fresh=initialStore();if(!text)return fresh;const x=JSON.parse(text);
 if(x?.version!==1||!Array.isArray(x.results))throw new Error("Kayıt biçimi okunamadı.");
 const valid=(r:Result)=>r&&games.some(g=>g.id===r.gameId)&&typeof r.id==="string"&&Number.isFinite(Date.parse(r.date))&&["normal","zen"].includes(r.mode)&&[1,2,3].includes(r.level)&&[r.correct,r.wrong,r.score,r.duration].every(v=>Number.isFinite(v)&&v>=0);
 return {version:1,results:x.results.filter(valid).slice(-5000),settings:{sound:x.settings?.sound===true,reducedMotion:x.settings?.reducedMotion===true},daily:x.daily?.date===localDate()&&Array.isArray(x.daily.ids)&&x.daily.ids.length===3&&new Set(x.daily.ids).size===3&&x.daily.ids.every((id:string)=>games.some(g=>g.id===id))?x.daily:{date:localDate(),ids:dailyGames(localDate())}};
}
export function readStore(){return parseStore(window.localStorage.getItem(STORE_KEY));}
export function saveStore(store:Stored){window.localStorage.setItem(STORE_KEY,JSON.stringify(store));}
