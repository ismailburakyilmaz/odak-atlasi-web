import { dockPoint, fleet } from '@/lib/orbit-game';

const paths = [
  'M32 5 44 31 55 45 38 41 32 57 26 41 9 45 20 31Z M27 27h10v11H27Z',
  'M25 22h14v22H25Z M5 15h14v34H5Z M45 15h14v34H45Z M19 32h6m14 0h6M32 9v13',
  'M32 8 46 43H18Z M25 43l-8 12m22-12 8 12M32 22v12 M24 51h16',
  'M14 20h36v26H14Z M7 26h7m36 0h7M7 40h7m36 0h7M23 20v26m18-26v26M25 12h14',
  'M20 20a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0Z M20 27h24M20 37h24M28 12h8',
  'M32 6 57 32 32 58 7 32Z M32 6v52M7 32h50M20 20l24 24m0-24L20 44',
  'M12 20a25 25 0 0 0 40 0Z M32 20V8m-5 0h10M32 32v14m-12 9 12-9 12 9',
  'M18 20h28v25H18Z M12 26h6m28 0h6M12 39h6m28 0h6M24 12v8m16-8v8 M25 28h14v9H25Z M18 51h28',
  'M13 14h14v38H13Z M37 14h14v38H37Z M27 26h10m-10 12h10M17 21h6m18 0h6',
  'M23 23h18v18H23Z M26 7h12v16H26Z M26 41h12v16H26Z M7 26h16v12H7Z M41 26h16v12H41Z',
];
export function ShipMark({ ship }: { ship: number }) {
  return <svg viewBox="0 0 64 64" aria-hidden="true" className="orbit-ship" style={{ color: fleet[ship].color }}><path d={paths[ship]} fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}
export default function OrbitArt() {
  return <svg viewBox="0 0 330 260" aria-hidden="true" className="orbit-cover"><rect width="330" height="260" fill="#102d38"/><circle cx="292" cy="20" r="100" fill="#264551"/><circle cx="292" cy="20" r="76" fill="#1c3b48"/><g transform="translate(35 0)"><circle cx="130" cy="130" r="92" fill="none" stroke="#55757a" strokeWidth="12"/><circle cx="130" cy="130" r="92" fill="none" stroke="#b4c5b8" strokeWidth="1" strokeDasharray="2 8"/><circle cx="130" cy="130" r="51" fill="#173e49" stroke="#77918a"/><path d="M109 130h42m-21-21v42" stroke="#b7c9b7"/><circle cx="130" cy="130" r="12" fill="none" stroke="#b7c9b7"/>{Array.from({length:6},(_,i)=>{const p=dockPoint(i,6);return <g key={i} transform={`translate(${p.x*2.6-21} ${p.y*2.6-21})`}><rect width="42" height="42" rx="12" fill="#183b46" stroke="#a4c3b8"/><svg width="42" height="42" viewBox="0 0 64 64"><path d={paths[i]} stroke={fleet[i].color} fill="none" strokeWidth="2.7"/></svg></g>;})}</g><path d="M15 22h20m-10-10v20M296 224h16m-8-8v16" stroke="#8faaa5"/></svg>;
}
