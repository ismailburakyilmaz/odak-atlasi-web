import type {CSSProperties} from 'react';
import {cubeCells} from '@/lib/cube-game';
const sides=['front','back','right','left','top','bottom'] as const;
export default function CubeSculpture({size,missing=[],reveal=false,angle={x:-25,y:-32},compact=false}:{size:3|4;missing?:number[];reveal?:boolean;angle?:{x:number;y:number};compact?:boolean}){
 const pitch=(compact?116:178)/size,edge=pitch-3.2;
 return <div className={'cube-perspective'+(compact?' cube-compact':'')} aria-hidden="true"><div className="cube-orientation" style={{transform:`rotateX(${angle.x}deg) rotateY(${angle.y}deg)`}}>{cubeCells(size).map(c=>{
  const absent=missing.includes(c.id);if(absent&&!reveal)return null;
  return <div key={c.id} className={'cube-piece'+(absent?' cube-ghost':'')} style={{'--piece-edge':edge+'px','--piece-half':edge/2+'px',width:edge,height:edge,transform:`translate3d(${(c.x-(size-1)/2)*pitch-edge/2}px,${(c.y-(size-1)/2)*pitch-edge/2}px,${(c.z-(size-1)/2)*pitch}px)`} as CSSProperties}>{sides.map(side=>{const outer=side==='front'?c.z===size-1:side==='back'?c.z===0:side==='right'?c.x===size-1:side==='left'?c.x===0:side==='top'?c.y===0:c.y===size-1;return <div key={side} className={'cube-face face-'+side+(outer?' cube-exterior':' cube-interior')}>{outer&&<span className="cube-sticker"/>}{absent&&outer&&<b>{missing.indexOf(c.id)+1}</b>}</div>;})}</div>;
 })}</div></div>;
}
