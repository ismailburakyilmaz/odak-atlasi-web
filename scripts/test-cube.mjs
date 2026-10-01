import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import assert from 'node:assert/strict';
const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/cube-game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,Set,Math,Number,Array});const cube=module.exports;
let seed=92742;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let checked=0;const seen=new Set();
for(const level of [1,2,3])for(let round=0;round<6;round++)for(let i=0;i<100;i++){
 const c=cube.cubeChallenge(level,round,random);assert.equal(c.size,level===1?3:4);assert.equal(c.cells.length,c.size**3);assert.equal(new Set(c.cells.map(c=>[c.x,c.y,c.z].join(','))).size,c.size**3);assert.equal(new Set(c.missing).size,c.missing.length);assert(c.missing.length>=[0,1,3,5][level]&&c.missing.length<=[0,3,6,9][level]);
 for(const id of c.missing){const m=c.cells.find(c=>c.id===id);assert(m);assert(m.x===c.size-1||m.y===0||m.z===c.size-1,'Missing pieces must be on a visible face');}
 // Independently flood-fill the remaining voxel coordinates, not the production helper.
 const left=new Set(c.cells.filter(v=>!c.missing.includes(v.id)).map(v=>[v.x,v.y,v.z].join(',')));const queue=[[...left][0]],visited=new Set(queue);for(let j=0;j<queue.length;j++){const [x,y,z]=queue[j].split(',').map(Number);for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const k=[x+dx,y+dy,z+dz].join(',');if(left.has(k)&&!visited.has(k)){visited.add(k);queue.push(k);}}}assert.equal(visited.size,left.size,'No floating islands');assert(c.studyMs>=4500&&c.studyMs<=8000);seen.add(level+':'+[...c.missing].sort().join(','));checked++;
}
assert(seen.size>900);for(const bad of ['', '-1','2.5','abc','100','65'])assert(!cube.validCubeAnswer(bad,64));for(const good of ['0','1','27','64'])assert(cube.validCubeAnswer(good,64));assert(!cube.validCubeAnswer('28',27));
console.log(`PASS: ${checked} cube challenges; both dimensions; visible omissions; independent connectivity; timer bounds; input validation.`);
