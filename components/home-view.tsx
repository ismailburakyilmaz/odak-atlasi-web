"use client";
import { ArrowUpRight, ArrowRight, Repeat2, Check } from "lucide-react";
import { games, categories, type Game, type GameId, type Category } from "@/lib/atlas";
import { GameArt } from "./game-visuals";

type Props = {
  selected: Game[]; completed: Set<GameId>; weekCount: number;
  onOpen: (id: GameId) => void; onSwap: (index: number) => void;
  onStart: () => void; onCatalog: (category: Category | "all") => void;
  onProgress: () => void;
};

export default function HomeView(p: Props) {
  const completed = p.selected.filter(g => p.completed.has(g.id)).length;
  const featured = games.find(g => g.id === "harbor")!;
  return <>
    <div className="edition-line"><span>GÜNLÜK OYUN SEÇKİSİ</span><span>{new Date().toLocaleDateString("tr-TR", {day:"numeric",month:"long",year:"numeric"})}</span></div>
    <section className="editorial-hero">
      <div className="hero-copy"><span className="small-index">01 — OYUN ARASI</span><h1>Biraz düşün.<br/><em>Biraz oyna.</em></h1><p>Bir limanın kilidini aç. Bir keşif aracını programla. Trenlerin yolunu yönet. Bir sonraki hamleyi düşünmenin keyfi.</p><button className="text-link" onClick={() => p.onCatalog("all")}>Oyun koleksiyonuna bak <ArrowUpRight size={21}/></button><div className="hero-facts"><span><b>{games.length}</b> oyun</span><span><b>5</b> beceri alanı</span><span><b>Senin</b> tempon</span></div></div>
      <button className="featured-game" onClick={() => p.onOpen("harbor")} aria-label="Liman Kilidi oyununu aç"><div className="feature-top"><span>MASADAKİ BULMACA</span><span>NO. 01</span></div><GameArt game={featured}/><div className="feature-caption"><div><span>PROBLEM ÇÖZME</span><h2>Liman Kilidi</h2><p>Her konteyner diğerinin yolunu değiştirir.</p></div><span className="round-arrow"><ArrowUpRight size={29}/></span></div></button>
    </section>
    <section className="cube-feature"><GameArt game={games.find(g=>g.id==="air")!}/><div><small>YENİ / CANLI HAVA SAHASI</small><h2>Gökyüzünde bir düzen kur.</h2><p>Rotayı çiz. Fırtınayı dolaş. Bir uçak piste yaklaşırken sıradakinin yolunu düşün.</p></div><button className="primary" onClick={()=>p.onOpen("air")}>Kontrolü devral <ArrowUpRight size={18}/></button></section>
    <section className="cube-feature orbit-feature"><GameArt game={games.find(g=>g.id==="orbit")!}/><div><small>YENİ / HAFIZADA BİR YER DEĞİŞİKLİĞİ</small><h2>İstasyon kapanır.<br/>Zihninde hareket sürer.</h2><p>Araçları hatırla, gizli aktarımları takip et, son iskeleyi bul. Yıldız Limanı’nda üç vardiya seni bekliyor.</p></div><button className="primary" onClick={()=>p.onOpen("orbit")}>Yıldız Limanı’nı aç <ArrowUpRight size={18}/></button></section>
    <section className="cube-feature"><GameArt game={games.find(g=>g.id==="cube")!}/><div><small>YENİ / ÜÇ BOYUTLU HAFIZA</small><h2>Eksik olanı hatırla.</h2><p>3×3×3 ve 4×4×4 küpler. Kısa bir gözlem, ardından tek bir soru: kaç parça eksikti?</p></div><button className="primary" onClick={()=>p.onOpen("cube")}>Küpü incele <ArrowUpRight size={18}/></button></section><h2 className="deep-feature-title"><small>YENİ SEÇKİ / ÜÇ AYRI DÜNYA</small>Bir hamleden fazlası.</h2><section className="deep-picks">{games.filter(g=>["harbor","rover","railway"].includes(g.id)).map((g,i)=><button key={g.id} onClick={()=>p.onOpen(g.id)}><span>0{i+1} / {g.id==="harbor"?"MEKÂNSAL PLANLAMA":g.id==="rover"?"PROGRAMLAMA BULMACASI":"CANLI AKIŞ YÖNETİMİ"}</span><GameArt game={g}/><h3>{g.name} ↗</h3><p>{g.subtitle}</p></button>)}</section><section className="daily-editorial"><div className="daily-intro"><span className="small-index">02 — BUGÜNÜN ÜÇLÜSÜ</span><h2>Kısa bir<br/><em>oyun molası.</em></h2><p>İki beceri oyunu ve bir karma oyun. İstemediğini değiştir, sıranı kendin belirle.</p><button className="primary" onClick={p.onStart}>{completed === 3 ? "Üçlüyü tekrar oyna" : completed ? "Kaldığın yerden devam" : "Üçlüye başla"}<ArrowRight size={18}/></button><small>Yaklaşık 6–12 dakika · {completed}/3 tamamlandı</small></div><div className="daily-list">{p.selected.map((g,i) => <article className="daily-row" key={g.id}><span className="row-number">0{i+1}</span><button className="daily-row-main" onClick={() => p.onOpen(g.id)} aria-label={g.name+" oyununu aç"}><div className="daily-thumbnail"><GameArt game={g}/></div><div><span className="row-category">{categories[g.category].name}</span><h3>{g.name}</h3><p>{g.subtitle}</p></div><span className="row-play">{p.completed.has(g.id)?<Check size={22}/>:<ArrowUpRight size={22}/>}</span></button><button className="row-swap" onClick={() => p.onSwap(i)} aria-label={g.name+" oyununu değiştir"}><Repeat2 size={17}/><span>Değiştir</span></button></article>)}</div></section>
    <section className="collection-index"><div className="section-heading"><span className="small-index">03 — KOLEKSİYON</span><button className="text-link" onClick={() => p.onCatalog("all")}>Tüm oyunlar <ArrowUpRight size={18}/></button></div><div className="category-index">{Object.entries(categories).map(([id,c],i) => <button key={id} onClick={() => p.onCatalog(id as Category)}><span className="index-no">0{i+1}</span><h3>{c.name}</h3><span>{games.filter(g=>g.category===id).length} oyun</span><ArrowUpRight size={18}/></button>)}</div></section>
    <section className="history-strip"><span className="history-big">{p.weekCount.toString().padStart(2,"0")}</span><div><h3>Bu haftaki oyunların</h3><p>Sonuçlarını aynı oyundaki önceki denemelerinle karşılaştır.</p></div><button className="text-link" onClick={p.onProgress}>Oyun defterini aç <ArrowRight size={20}/></button></section>
  </>;
}
