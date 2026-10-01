import {Compass,Layers,Grid2X2,Scan,Orbit,Copy,Zap,Route,Sigma,Shuffle,Mail,Coffee} from "lucide-react";
import {AirArt} from "./games/AirCorridor";
import {MatrixArt} from "./games/MemoryMatrix";
import {LightArt} from "./games/LightWorkshop";
import OrbitArt from "./games/OrbitArt";
import CubeSculpture from "./games/CubeSculpture";
import Illustration from "./illustration";
import {categories,type Game} from "@/lib/atlas";
const icons={layers:Layers,grid:Grid2X2,scan:Scan,orbit:Orbit,copy:Copy,zap:Zap,route:Route,sigma:Sigma,shuffle:Shuffle,compass:Compass,mail:Mail,coffee:Coffee};
export function GameIcon({game,size=24}:{game:Game;size?:number}){const Icon=icons[game.glyph as keyof typeof icons];return <Icon size={size} strokeWidth={1.5}/>;}
export function GameArt({game}:{game:Game}){return <div className={"game-art art-"+game.id} style={{"--game-color":categories[game.category].color} as React.CSSProperties}>{game.id==="air"?<AirArt/>:game.id==="matrix"?<MatrixArt/>:game.id==="light"?<LightArt/>:game.id==="orbit"?<OrbitArt/>:game.id==="cube"?<div className="cube-art-stage"><CubeSculpture size={3} missing={[8,20,24]} compact/></div>:<Illustration id={game.id}/>}</div>;}
