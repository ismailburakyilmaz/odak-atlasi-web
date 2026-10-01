import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const module={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/air-game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,Math,Map,Set,Number});
const {initialAir,airConfig,advanceAir,routeAir,flightTarget}=module.exports;
const plane=(id,x,y,target='A')=>({id,x,y,target,born:0,heading:0,route:[],gate:id%3});
const state=(planes)=>({...initialAir(),released:planes.length,planes});
const quiet={count:1,gap:9,speed:10,fuel:100,storms:[]};
let s=state([plane(0,10,20)]), immutable=JSON.stringify(s);
let routed=routeAir(s,0,[{x:30,y:20}],'A');assert.equal(JSON.stringify(s),immutable);
let out=advanceAir(routed,quiet,9);assert.equal(out.state.landed,1);assert.equal(out.state.finished,true);assert.equal(out.events.length,1);assert.equal(advanceAir(out.state,quiet,10).events.length,0);
out=advanceAir(routeAir(s,0,[],'B'),quiet,12);assert.equal(out.state.failed,1);assert.match(out.events[0].reason,/Yanlış/);
for(const points of [[{x:NaN,y:3}],[{x:-1,y:10}],Array.from({length:5},()=>({x:20,y:20}))])assert.equal(routeAir(s,0,points,'A'),s);
const collision=state([plane(0,40,20),plane(1,43,20),plane(2,46,20)]);collision.planes.forEach(p=>{p.runway='A';p.route=[{x:90,y:20}];});
out=advanceAir(collision,{...quiet,count:3},.05);assert.equal(out.state.failed,3);assert.equal(new Set(out.events.map(e=>e.id)).size,3);
out=advanceAir(routeAir(s,0,[],'A'),{...quiet,storms:[{x:35,y:20,radius:4}]},10);assert.equal(out.state.failed,1);assert.match(out.events[0].reason,/Fırtına/);
out=advanceAir(s,{...quiet,fuel:1},2);assert.equal(out.state.failed,1);assert.match(out.events[0].reason,/Yakıt/);
const routedAgain=routeAir(routed,0,[{x:25,y:10}],'B');assert.equal(routedAgain.planes[0].route.length,3);assert.equal(routed.planes[0].route[0].x,30);
let small=routed;for(let i=0;i<100;i++)small=advanceAir(small,quiet,.05).state;
const large=advanceAir(routed,quiet,5).state;assert(Math.hypot(small.planes[0].x-large.planes[0].x,small.planes[0].y-large.planes[0].y)<1e-6);
// Real scheduled flights: route immediately around the storms, then assert all three shifts are solvable.
for(const level of [1,2,3]){
 const config=airConfig(level);let game=initialAir();let ticks=0;
 while(!game.finished&&ticks++<2400){
  for(const p of game.planes.filter(p=>!p.runway)){
   const y=p.target==='A'?10:90; const lane=p.target==='A'?24:19;
   game=routeAir(game,p.id,[{x:lane,y:p.y},{x:lane,y},{x:73,y}],p.target);
  }
  game=advanceAir(game,config,.05).state;
 }
 assert(game.finished,`level ${level} did not finish`);
 assert.equal(game.landed,config.count,`level ${level} safe routes must succeed`);
 assert.equal(game.failed,0);
 const abandoned=advanceAir(initialAir(),config,120);
 assert(abandoned.state.finished);assert.equal(abandoned.state.failed,config.count);
 assert.equal(abandoned.events.length,config.count);
}
assert.equal(flightTarget(0),'A');
console.log('Air: correct/wrong landing, storm, fuel, 3-plane conflict, route replacement, immutable state, step consistency and 30 successful scheduled flights passed.');
