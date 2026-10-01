import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';
const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/deep-games.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module,exports:module.exports,Set,Math,Array,Number});const g=module.exports;
let seed=314159;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const harbor=[[],[],[]];
for(let attempt=0;attempt<12000&&harbor.some(a=>a.length<3);attempt++){
 const pieces=[{x:0,y:2,length:2,vertical:false}];const occupied=new Set(g.cargoCells(pieces[0]));
 for(let i=0;i<70&&pieces.length<10;i++){const p={x:Math.floor(random()*6),y:Math.floor(random()*6),length:random()<.2?3:2,vertical:random()<.5};if(p.x+(p.vertical?1:p.length)>6||p.y+(p.vertical?p.length:1)>6||g.cargoCells(p).some(c=>occupied.has(c)))continue;pieces.push(p);g.cargoCells(p).forEach(c=>occupied.add(c));}
 if(!pieces.some(p=>p.vertical&&g.cargoCells(p).some(c=>c>=14&&c<=17)))continue;
 const solution=g.solveHarbor(pieces,16000);if(!solution)continue;const tier=solution.length>=20?2:solution.length>=13?1:solution.length>=8?0:-1;
 if(tier>=0&&harbor[tier].length<3)harbor[tier].push({pieces,par:solution.length,solution});
}
const rover=[[],[],[]];
for(let attempt=0;attempt<5000&&rover.some(a=>a.length<3);attempt++){
 const grid=Array.from({length:7},(_,y)=>Array.from({length:7},(_,x)=>x===0||y===0||x===6||y===6?'#':random()<.16?'#':'.'));
 grid[5][1]='S';grid[1][5]='E';
 const spots=[];for(let y=1;y<6;y++)for(let x=1;x<6;x++)if(grid[y][x]==='.')spots.push([x,y]);
 for(const symbol of ['K','D','*','*','*']){if(!spots.length)break;const [x,y]=spots.splice(Math.floor(random()*spots.length),1)[0];grid[y][x]=symbol;}
 const board={rows:grid.map(r=>r.join('')),par:0,solution:[]};const solution=g.solveRover(board);if(!solution)continue;
 // Require the optimal path to collect the key and cross the door.
 let s=g.roverStart(board),door=false;for(const cmd of solution){s=g.roverStep(board,s,cmd);if(board.rows[s.y][s.x]==='D')door=true;}
 if(!door||!s.key)continue;
 const tier=solution.length>=32?2:solution.length>=25?1:solution.length>=18?0:-1;
 if(tier>=0&&rover[tier].length<3)rover[tier].push({...board,par:solution.length,solution});
}
if(harbor.some(a=>a.length!==3)||rover.some(a=>a.length!==3))throw Error('Incomplete board pool '+JSON.stringify([harbor.map(a=>a.length),rover.map(a=>a.length)]));
fs.writeFileSync('lib/deep-boards.ts','import type {HarborBoard,RoverBoard} from "./deep-games";\nexport const harborBoards:HarborBoard[][]='+JSON.stringify(harbor)+';\nexport const roverBoards:RoverBoard[][]='+JSON.stringify(rover)+';\n');
console.log('Generated',harbor.map(a=>a.map(b=>b.par)),rover.map(a=>a.map(b=>b.par)));
