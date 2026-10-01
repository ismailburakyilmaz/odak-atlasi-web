import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
const module = {exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/orbit-game.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,Math});
const orbit = module.exports;
let seed=192801;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const seen=new Set();
for(const level of [1,2,3])for(let sample=0;sample<500;sample++){
  const c=orbit.orbitChallenge(level,random), n=4+level*2;
  assert.equal(c.initial.length,n);
  assert.equal(new Set(c.initial).size,n);
  assert(c.initial.every(ship=>Number.isInteger(ship)&&orbit.fleet[ship]));
  assert.equal(c.transfers.length,level+1);
  assert.equal(c.targets.length,level+2);
  assert.equal(new Set(c.targets).size,c.targets.length);
  // Track each craft's route independently, without using transferFleet.
  const positions=new Map(c.initial.map((ship,dock)=>[ship,dock]));
  const travels=new Map(c.initial.map(ship=>[ship,0]));
  for(const [a,b] of c.transfers){
    assert(a!==b&&a>=0&&b>=0&&a<n&&b<n);
    for(const [ship,dock] of positions){
      if(dock===a||dock===b){positions.set(ship,dock===a?b:a);travels.set(ship,travels.get(ship)+1);}
    }
  }
  for(const [ship,dock] of positions)assert.equal(c.final[dock],ship);
  assert(c.targets.every(ship=>positions.has(ship)));
  assert(c.targets.some(ship=>travels.get(ship)>=2),'Query a craft moved more than once');
  assert(c.targets.some(ship=>travels.get(ship)===0),'Also query an unchanged berth');
  assert.equal(c.studyMs,8000+level*2000);
  assert.equal(new Set(c.final).size,n);
  const points=Array.from({length:n},(_,i)=>orbit.dockPoint(i,n));
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)assert(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)>22,'Touch targets must not overlap');
  seen.add(c.initial.join(',')+':'+c.transfers.flat().join(','));
}
assert(seen.size>1450,'Varied arrangements');
const original=Object.freeze([0,1,2,3]);
assert.equal(orbit.transferFleet(original,[1,3]).join(','),'0,3,2,1');
assert.equal(original.join(','),'0,1,2,3');
console.log('PASS: 1500 orbital layouts, independent craft tracking, chained and unchanged targets, all levels, variety, touch spacing, immutable transfers.');
