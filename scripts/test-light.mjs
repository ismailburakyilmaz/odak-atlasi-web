import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import assert from 'node:assert/strict';
const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/light-game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,Set,Math});const light=module.exports;
let candidates=0;
for(const level of [1,2,3])for(let round=0;round<3;round++){
 const b=light.lightBoard(level,round);assert.equal(b.mirrors.length,level*2+2);assert.equal(new Set(b.crystals.map(p=>p.x+','+p.y)).size,3);assert(!light.traceLight(b,b.initial).success);
 // Independent ray tracer: reflect coordinate vectors directly instead of using production's lookup table.
 const solve=ms=>{let {x,y}=b.source,[dx,dy]=[[1,0],[0,1],[-1,0],[0,-1]][b.direction];const seen=new Set(),lit=new Set();for(let step=0;step<200;step++){const k=[x,y,dx,dy].join();if(seen.has(k))return false;seen.add(k);b.crystals.forEach((c,i)=>{if(c.x===x&&c.y===y)lit.add(i);});if(x===b.receiver.x&&y===b.receiver.y)return lit.size===3;if(x<0||y<0||x>=b.size||y>=b.size||b.walls.some(w=>w.x===x&&w.y===y))return false;const i=b.mirrors.findIndex(m=>m.x===x&&m.y===y);if(i>=0)[dx,dy]=ms[i]===0?[-dy,-dx]:[dy,dx];x+=dx;y+=dy;}return false;};
 let solutions=0;
 for(let mask=0;mask<2**b.mirrors.length;mask++){const ms=b.mirrors.map((_,i)=>(mask>>i)&1);const expected=solve(ms),actual=light.traceLight(b,ms);assert.equal(actual.success,expected);assert(actual.path.length<=197);if(expected)solutions++;candidates++;}
 assert.equal(solutions,1,'Each authored board has exactly one solution');assert(solve(b.solution));assert(light.traceLight(b,b.solution).success);
}
console.log(`PASS: 9 optical boards; ${candidates} mirror arrangements checked by independent vector tracing; unique solutions; unsolved starts; bounded paths.`);
