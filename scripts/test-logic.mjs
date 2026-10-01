import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const modules={};
function load(name){if(modules[name])return modules[name];const code=ts.transpileModule(fs.readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:p=>load(p.replace('./','')),console,Date,Set,Math,Number,JSON,Error,Array,String});return modules[name]=module.exports;}
const a=load('atlas'),c=load('challenges'),storage=load('storage');
let generated=0;
for(const game of a.games.filter(g=>!['matrix','reaction','pattern','simon','harbor','rover','railway','cube','orbit','light','air'].includes(g.id)))for(const level of [1,2,3])for(let round=0;round<100;round++){
 const q=c.createChallenge(game.id,level,round%6);generated++;assert.equal(q.kind,game.id);
 if(q.kind==='sequence'){assert(q.answer.every(v=>v>=0&&v<6));assert.equal(JSON.stringify(q.answer),JSON.stringify(q.reverse?[...q.shown].reverse():q.shown));}
 if(q.kind==='shelf'){assert(q.numbers[q.answer[0]]>=0);const visible=q.numbers.filter(n=>n>=0);assert.equal(new Set(visible).size,visible.length);}
 if(q.kind==='search')assert.deepEqual(q.tiles.map((t,i)=>t.symbol===q.target.symbol&&t.filled===q.target.filled?i:-1).filter(i=>i>=0).sort((a,b)=>a-b),[...q.answer].sort((a,b)=>a-b));
 if(q.kind==='track')for(const path of q.paths)assert.equal(new Set(path).size,q.numbers.length);
 if(q.kind==='compare')assert.equal(q.answer[0],q.tiles.slice(0,q.required).every((t,i)=>t.symbol===q.tiles[i+q.required].symbol&&t.filled===q.tiles[i+q.required].filled)?0:1);
 if(q.kind==='path'){assert(q.answer.length>1);assert(q.answer.length-1<=q.limit);for(let i=1;i<q.answer.length;i++)assert(c.validMove(q,q.answer[i-1],q.answer[i]));assert.equal(q.answer.at(-1),q.size*q.size-1);let checkpoint=0;for(const cell of q.answer)if(cell===q.checkpoints[checkpoint])checkpoint++;assert.equal(checkpoint,q.checkpoints.length);}
 if(q.kind==='sum'){assert(c.validSum(q,q.answer));assert(!c.validSum(q,[]));assert(!c.validSum(q,[q.answer[0],q.answer[0]]));}
 if(q.kind==='rule'){const matches=q.tiles.map((t,i)=>t[q.criterion]===q.target[q.criterion]?i:-1).filter(i=>i>=0);assert.equal(matches.length,1);assert.equal(matches[0],q.answer[0]);}
 if(q.kind==='reverse')assert.equal(q.answer[0],(q.direction+q.rotation)%4);
 if(q.kind==='post'){assert.equal(new Set(q.numbers).size,q.numbers.length);assert(q.answer.every(n=>q.numbers.includes(n)));assert.equal(JSON.stringify(q.answer.slice(0,q.priority.length)),JSON.stringify(q.priority));const regular=q.answer.slice(q.priority.length);assert(regular.every((n,i)=>i===0||n>regular[i-1]));}
 if(q.kind==='cafe')assert(q.orders.every(o=>o.drink>=0&&o.drink<4&&o.extra>=0&&o.extra<4&&o.size>=0&&o.size<2));
}
assert.equal(a.games.length,23);for(const cat of Object.keys(a.categories))assert(a.games.filter(g=>g.category===cat).length>=2);
assert.equal(a.score(4,1,2),750);assert.equal(a.score(0,5,3),0);assert.equal(a.accuracy({correct:3,wrong:1}),75);
const result={id:'test',gameId:'sequence',date:new Date().toISOString(),mode:'normal',level:1,correct:10,wrong:0,score:1000,duration:90,version:2};
assert.equal(a.suggestLevel([result,result,result],'sequence','normal'),2);assert.equal(a.suggestLevel([result,result,result],'sequence','zen'),1);
const stored=a.initialStore();stored.results=[result];const parsed=storage.parseStore(JSON.stringify(stored));assert.equal(parsed.results.length,1);assert.equal(parsed.results[0].score,1000);
assert.equal(storage.parseStore(null).results.length,0);assert.throws(()=>storage.parseStore('{'));
const wrongData={...stored,results:[{...result,score:'wrong'}]};assert.equal(storage.parseStore(JSON.stringify(wrongData)).results.length,0);
assert.equal(a.suggestLevel([{...result,version:1},{...result,version:1},{...result,version:1}],'sequence','normal'),1);
assert.equal(new Set(a.dailyGames('2026-09-29')).size,3);

const extra=load('new-games');
for(const level of [1,2,3])for(let round=0;round<100;round++){
 const m=extra.matrixChallenge(level,round%6);assert.equal(new Set(m.shown).size,m.shown.length);assert.equal(m.answer.length,m.shown.length);assert(m.answer.every(i=>i>=0&&i<16));
 assert.equal(JSON.stringify(m.answer),JSON.stringify(m.shown.map(i=>m.mirrored?Math.floor(i/4)*4+3-i%4:i)));generated++;
 const reaction=extra.reactionChallenge(level,round%30);assert.equal(new Set(reaction.distractors).size,reaction.distractors.length);assert(!reaction.distractors.includes(reaction.target));assert(reaction.target===-1||(reaction.target>=0&&reaction.target<reaction.size**2));assert(reaction.responseMs>0&&reaction.waitMs>=600);generated++;
 const simon=extra.simonChallenge(level,round%6);assert(simon.sequence.length>=4);assert(simon.sequence.every((v,i)=>v>=0&&v<simon.pads&&(i===0||v!==simon.sequence[i-1])));assert(simon.litMs<simon.pulseMs);generated++;
 const pattern=extra.patternChallenge(level,round%8);assert.equal(pattern.options.length,4);assert.equal(new Set(pattern.options).size,4);assert.equal(pattern.options.filter(v=>v===pattern.answer).length,1);assert.equal(pattern.values[pattern.hidden],pattern.answer);assert(pattern.values.every(Number.isSafeInteger));
 const v=pattern.values,d=v.slice(1).map((x,i)=>x-v[i]),f=Number(pattern.family);
 if(f===0||f===2)assert(d.every(x=>x===d[0]));
 if(f===1)assert(v.slice(1).every((x,i)=>x===v[i]*2));
 if(f===3||f===6)assert(d.slice(1).every((x,i)=>x-d[i]===d[1]-d[0]));
 if(f===4)assert(v.slice(1).every((x,i)=>i%2?x===v[i]*2:x-v[i]===d[0]));
 if(f===5)assert(v.slice(2).every((x,i)=>x-v[i]===v[i%2+2]-v[i%2]));
 if(f===7)assert(v.slice(1).every((x,i)=>i%2?x-v[i]===d[1]:x===v[i]*2));
 if(f===8)assert(d.every((x,i)=>x===d[i%3]));
 if(f===9)assert(v.slice(2).every((x,i)=>i%2?x-v[i]===v[3]-v[1]:x===v[i]*2));
 generated++;
}
const eligible=new Set();for(let day=0;day<365;day++){const d=new Date(Date.UTC(2026,0,1+day)).toISOString().slice(0,10);const ids=a.dailyGames(d);assert.equal(new Set(ids).size,3);ids.forEach(id=>eligible.add(id));assert.equal(new Set(ids.map(id=>a.games.find(g=>g.id===id).category)).size,3);}
assert.equal(eligible.size,23);
for(const id of ['matrix','reaction','pattern','simon','orbit','light','air']){const raw=a.initialStore();raw.results=[{...result,gameId:id,reactionMs:413}];const p=storage.parseStore(JSON.stringify(raw));assert.equal(p.results[0].gameId,id);assert.equal(p.results[0].reactionMs,413);}
console.log('PASS: '+generated+' generated challenges for the original 16 games / 3 levels; 365 daily selections; old and new result persistence.');


