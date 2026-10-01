# Odak Atlası — yeni oyunlar araştırması ve tasarım kararları

## Seçim ölçütü

Kullanıcının geri bildirimi: oyunların kart veya soru-cevap hissi vermesi ve kararların fazla basit kalması. Üç oyun seçildi; her biri farklı bir etkileşim türü, mekânsal sahne ve birden fazla adımın birlikte planlanmasını içeriyor.

## Kaynaklar

- ThinkFun / Ravensburger, Rush Hour: https://www.ravensburger.us/en-US/products/games/thinkfun/rush-hour-76582 — eksen boyunca hareket eden parçalar, birbirini engelleme ve çok adımlı çözüm.
- Zachtronics, Opus Magnum: https://www.zachtronics.com/opus-magnum/ — bir çözüm mekanizması kurma, çalıştırma, gözleme ve iyileştirme.
- Mini Metro resmi Nintendo Switch sitesi: https://minimetro.radialgames.com/ — hareketli bir ağın yönetimi ve eşzamanlı ihtiyaçlar.

Erişim: 29–30 Eylül 2026. Araştırma, mekanik tasarımına yön vermek için kullanıldı. Kaynaklardaki sağlık/bilişsel gelişim pazarlama iddiaları ürüne taşınmadı. Bu oyunların görsel varlıkları veya hazır bölümleri kullanılmadı.

## Uygulanan oyunlar

1. Liman Kilidi: eksen boyunca konteyner kaydırma. Bir hareketin diğer parçaların olası hareketlerini değiştirmesi temel zorluk. Çözücüyle doğrulanmış dokuz özgün bölüm, geri alma, sürükleme, klavye ve en kısa hamle hedefi.
2. Rota Makinesi: keşif aracına komut programı yazma. Mekânsal rota + yön + anahtar/kapı + üç enerji hedefini birlikte yönetme. Komut bütçesi, tekrar sayısı, dene-düzelt döngüsü ve dokuz bölüm.
3. Makas İstasyonu: aynı anda ilerleyen trenleri iki aşamalı ayrımlardan doğru harfli terminale gönderme. Geçişte sabitlenen makas kararı, gelecek seferler ve üç zorlukta değişen hız/yoğunluk. Baskısız modda elle adımlanan simülasyon.

## Kapsam

İlk iki oyunda seviye başına üç bölüm vardır; haritalar sabittir. Yeniden oynamanın amacı aynı koşullarda çözümü iyileştirmektir. Tren vardiyası seviye başına sabit sefer planıyla çalışır. Sonsuz içerik veya ticari oyunların içerik hacmi hedeflenmemiştir. Zorluk ve sürelerin insan oyuncularla dengelenmesi sonraki değerlendirme konusudur.


## Yıldız Limanı — 30 Eylül 2026

- İstenen bir yeni hafıza oyunu eklendi. Nesne–konum eşleştirme ile kapalı araçların hareketlerini zihinde güncelleme birleştirildi. Küpteki sayma/görsel hacim görevinin tekrarı değildir.
- Cambridge Cognition PAL: https://cambridgecognition.com/paired-associates-learning-pal/ — nesne ve konum bağlama. Lumosity Memory Serves: https://help.lumosity.com/hc/en-us/articles/12844029788183-Memory-Serves — değişen bilgiyi akılda tutma. Resmi kaynaklar yalnız mekanik düzeyinde incelendi; sağlık iddiaları kullanılmadı.
- Özgün dairesel istasyon, on araç silueti, kapalı iskeleler, çift yönlü aktarım rotaları. Görseller SVG/CSS ile yerel olarak çizildi; dış görsel bağımlılığı yok.
- 6/8/10 iskele, 2/3/4 zincirleme aktarım, 3/4/5 soru; üç vardiya. Aktarım zinciri kendini geri almaz. Her vardiya birkaç kez taşınan ve sabit kalan araçları sorar.
- Normal modda 10/12/14 sn gözlem, aktarım başına 2,6 sn, toplam 180 sn. Baskısız mod ve azaltılmış hareket tercihi için elle ilerleyen aktarım. Normal modda azaltılmış hareket toplam süreyi kaldırmaz.
- Cevaplar tek sefer puanlanır; çözüm vardiya sonunda açılır. Süre sonunda cevaplanmış sorular korunur. Zorluk ve sürelerin geniş kullanıcı kitlesiyle dengelenmesi MVP sonrası değerlendirmedir.


## 1 Ekim 2026 — Işık Atölyesi ve Memory Matrix

Önce yeni oyun uygulandı ve tarayıcıda sonuç ekranına kadar test edildi; ardından Memory Matrix yenilendi.

Işık Atölyesi, problem çözme kategorisinde optik rota kurma oyunudur. ThinkFun resmi Laser Maze sayfasındaki planla–ışını gönder–sonucu incele yaklaşımı mekanik araştırmasına yön verdi: https://www.thinkfun.co.uk/en-GB/products/logic-games/laser-maze-76340 . Marka, görseller ve hazır bölümler kullanılmadı. Dokuz farklı rota yerel olarak tasarlandı. Her bölümde tüm aynaları ve üç enerji noktasını birlikte düşünmek gerekir. 1.008 konfigürasyon ayrı bir vektör simülasyonuyla sınandı; her bölüm tek çözümlüdür.

Memory Matrix: kontrollü başlangıç, panel açılışı, kapanan hücreler, süre çubuğu, fiziksel düğme hissi veren seçim, klavye gezinmesi, temizleme, kademeli çözüm ve ayna karşılaştırması. Hedef üretimi, hedef sayısı, tam desen gözlem süreleri, altı tur ve puan formülü değiştirilmedi. Hazırlık/geçiş süreleri toplam oturum süresine eklenir; bu yüzden eski ve yeni toplam süreler birebir eşdeğer deneyim değildir. Azaltılmış harekette geçişler kaldırılır.

Sınırlar: Işık Atölyesi sabit dokuz bulmaca içerir. Karmaşık ticari oyunlar kadar içerik hedeflenmedi. İnsan oyuncularla zorluk/süre dengelemesi ve fiziksel cihazlarda geniş tarayıcı testi yapılmadı.

## Hava Koridoru / Dikkat

Mekânsal rota planlama ve aynı anda birden fazla hareketli öğeyi takip etme üzerine kurulu yeni oyun. Uçak seçimi, dört noktaya kadar serbest yol ve iki iniş pisti; başlangıç noktaları, fırtına alanları ve yakıt sınırları kararları birbirine bağlar. Uçuş şeritleri kart soruları değil, haritadaki hareketli uçuşlara erişim ve kalan yakıt göstergeleridir.

Kıyı haritası, pist işaretleri, harfli uçak etiketleri, kesik plan çizgisi ve yakınlaşma halkaları kullanıldı. Puan uçak başına sonuçtan üretilir; performans yalnızca aynı oyun, seviye ve mod içinde karşılaştırılır. Gerçek havacılık eğitimi veya bilişsel iyileşme iddiası yoktur. Harita ve uçuş programı seviye başına sabittir; oyuncunun rotaları serbesttir. Sonraki içerik çalışması için farklı hava sahaları düşünülebilir; bu sürüme eklenmedi.
