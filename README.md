# Odak Atlası

Yetişkinlere yönelik, Türkçe **23 zihin oyunu** içeren bir web uygulaması MVP’si. Kısa oyun seansları oluşturabilir, istediğiniz oyunu seçebilir ve kendi oyun performansınızı takip edebilirsiniz.

Next.js App Router, React ve TypeScript ile geliştirilmiştir. Hesap açma, API anahtarı veya sunucu veritabanı gerektirmez.

## Hızlı başlangıç

### Gereksinimler

- **Node.js 22.13 veya üzeri** ve beraberinde gelen npm.
- Güncel bir web tarayıcısı.
- İlk kurulumda paketleri indirmek için internet bağlantısı.

### Kurulum ve çalıştırma

1. GitHub deposunu klonlayın veya **Code → Download ZIP** ile indirip ZIP’i çıkartın.
2. Terminali **`package.json` dosyasının bulunduğu klasörde** açın. Komutları dıştaki ZIP/indirme klasöründe çalıştırmayın.
3. Sırayla çalıştırın:

```sh
npm ci
npm run dev
```

4. Tarayıcıda **http://127.0.0.1:5173** adresini açın.

`npm ci`, kilit dosyasındaki bağımlılıkları `node_modules` klasörüne kurar. İlk kurulumda gereklidir; her açılışta tekrar çalıştırmanız gerekmez. Sonraki açılışlarda `npm run dev` yeterlidir. Terminal açık kalmalıdır; sunucuyu durdurmak için `Ctrl+C` kullanın.

> **Windows / PowerShell:** `npm.ps1` çalıştırma ilkesi hatası alırsanız aynı komutları `npm.cmd ci` ve `npm.cmd run dev` olarak çalıştırın.

## Uygulamada neler var?

- **Bugün:** Değiştirilebilir üç oyunluk günlük öneri.
- **Oyunlar:** Beceri alanlarına göre filtrelenen, serbestçe açılabilen katalog.
- **Oynanış:** Kısa yönergeler, üç zorluk seviyesi, duraklatma, sonuç ve yeniden oynama.
- **Normal ve baskısız mod:** Oyuna göre süre sınırı, inceleme süresi veya akış kontrolü değişir. Farklar oyun hazırlık ekranında açıklanır.
- **İlerleme:** Gerçek sonuçlara dayanan grafik; oyun, mod, seviye ve 7/30/90 gün filtreleri.
- **Ayarlar:** Ses, azaltılmış hareket ve yerel veriyi sıfırlama.

### Öne çıkan oyunlar

- **Işık Atölyesi:** Aynaları döndürüp ışını üç enerji noktasından hedefe ulaştırın.
- **Eksik Küp:** 3×3×3 veya 4×4×4 küpteki eksik parçaları görüntü kapanmadan sayıp hatırlayın.
- **Yıldız Limanı:** Araçların yerlerini ezberleyin; gizli yer değişimlerinden sonra son konumlarını bulun.
- **Liman Kilidi:** Konteynerleri kaydırarak çıkış yolunu açın.
- **Rota Makinesi:** Keşif aracının hareketlerini programlayıp planınızı çalıştırın.
- **Hava Koridoru:** Uçaklara rota verip fırtınalardan ve yakın trafikten kaçınarak doğru piste indirin.

### Tüm oyunlar

Beş ana beceri alanı ve bunları birleştiren karma oyunlar bulunur.

| Kategori | Oyunlar |
| --- | --- |
| Hafıza (6) | Yıldız Limanı, Eksik Küp, İz Dizisi, Yer Hafızası, Kare Hafızası, Işık Sırası |
| Dikkat (3) | Hava Koridoru, İnce Ayrıntı, Yörünge |
| İşlem hızı (3) | Anlık Eş, Doğru An, Hedef Darbesi |
| Problem çözme (6) | Işık Atölyesi, Liman Kilidi, Rota Makinesi, Kısa Rota, Sayı Dengesi, Örüntü Atölyesi |
| Bilişsel esneklik (2) | Kural Akışı, Ters Yön |
| Karma (3) | Makas İstasyonu, Posta Turu, Mola Kafesi |

## Veriler ve puanlama

Sonuçlar ve tercihler **yalnızca kullandığınız tarayıcı profilinde `localStorage` ile saklanır**. Sunucuya gönderilmez, başka cihazlara eşitlenmez. Tarayıcı verilerini temizlemek veya uygulama ayarlarından sıfırlamak geçmişi siler. En son 5.000 sonuç saklanır.

Adres, port veya tarayıcı profili değişirse ayrı bir depolama alanı kullanılır. Örneğin `localhost:5173`, `127.0.0.1:5173` ve üretim önizlemesindeki `127.0.0.1:3000` aynı geçmişi paylaşmaz. Geçmişinize devam etmek için aynı adresi ve profili kullanın.

```text
Puan = max(0, doğru × 100 − yanlış × 25) × seviye
```

Doğru/yanlış birimi oyuna göre değişir; oyun içindeki açıklamada belirtilir. Farklı oyunların puanları birleştirilmez. Grafikler aynı oyun, mod ve seviyedeki sonuçları karşılaştırır. Hedef Darbesi için tepki süresi ayrıca kullanılır.

Sonuçlar yalnızca **oyun içi performansı** ifade eder; sağlık, tanı veya IQ ölçümü değildir.

## Komutlar

Komutları proje kökünde, `package.json` dosyasının yanında çalıştırın.

| Komut | Açıklama |
| --- | --- |
| `npm ci` | Kilit dosyasına göre bağımlılıkları kurar. |
| `npm run dev` | Geliştirme sunucusunu `127.0.0.1:5173` adresinde açar. |
| `npm run typecheck` | TypeScript tip kontrolünü çalıştırır. |
| `npm test` | Oyun mantığı, bölüm çözümleri, günlük öneri ve kayıt doğrulama testlerini çalıştırır. |
| `npm run build` | Üretim için statik dosyaları `out/` klasörüne oluşturur. |
| `npm start` | Hazır `out/` çıktısını `127.0.0.1:3000` adresinde sunar. |

### Üretim önizlemesi

Bağımlılıkları kurduktan sonra:

```sh
npm run build
npm start
```

**http://127.0.0.1:3000** adresini açın. Kaynak kod değişirse üretim önizlemesinden önce yeniden derleme yapın.

GitHub deposunda `out/` bulunmaz; önce `npm run build` gerekir. Ayrıca sağlanan teslim ZIP’inde hazır `out/` varsa Node.js ile doğrudan `npm start` kullanılabilir. Geliştirme için yine bağımlılık kurulumu gerekir.

Bu komutlar yerel sunucu açar. GitHub’a kod yüklemek siteyi internette yayınlamaz. Proje statik çıktı üretir; dağıtım yöntemi kullanılan barındırma hizmetine göre ayrıca ayarlanır.

## Sık karşılaşılan sorunlar

| Hata / durum | Yapılacak işlem |
| --- | --- |
| `Could not read package.json` / `ENOENT` | Terminali `package.json` bulunan proje klasöründe açın. |
| `'next' is not recognized` / `next: command not found` | Önce `npm ci` çalıştırın. Kurulum hata verdiyse önce o hatayı çözün. |
| `node` veya `npm` tanınmıyor | Node.js kurulumunu kontrol edin; terminali yeniden açın. `node --version` ve `npm --version` ile doğrulayın. |
| `npm.ps1 cannot be loaded` | PowerShell’de `npm` yerine `npm.cmd` kullanın. |
| `EADDRINUSE` / port kullanımda | Aynı projeyi çalıştıran eski terminali `Ctrl+C` ile durdurun. Alternatif geliştirme portu: `npm run dev -- --port 5174`. |
| `npm start` derleme istiyor | Önce `npm run build` çalıştırın. |
| Oyun geçmişi görünmüyor | Aynı tarayıcı profili, adres ve portu kullandığınızı kontrol edin. Gizli pencere ayrı depolama kullanır. |

## Proje yapısı

```text
app/                    Next.js sayfa yapısı ve stiller
components/             Katalog, günlük seans, sonuç ve ilerleme ekranları
components/games/       Oyunlara özel React bileşenleri
hooks/                  Ortak React kancaları
lib/                    Oyun tanımları, kurallar, bölüm üretimi ve yerel depolama
public/                 Statik varlıklar
scripts/                Testler, yardımcı araçlar ve üretim önizleme sunucusu
vendor/                 Projeyle birlikte taşınan yardımcı bağımlılıklar
```

Başlangıç noktaları: `components/atlas.tsx` uygulama akışını, `components/game-session.tsx` oyun oturumunu, `lib/atlas.ts` oyun kataloğunu, `lib/storage.ts` veri saklamayı yönetir.

Destekleyen tarayıcılarda WebMCP ile oyunları listeleme ve hazırlık ekranını açma araçları sunulur; kişisel geçmiş bu araçlarla paylaşılmaz.

## GitHub’a dahil edilmeyen dosyalar

Mevcut `.gitignore`; `node_modules/`, `.next/`, `out/`, `.env*` ve geçici çalışma dosyalarını dışarıda bırakır. `package.json` ile `package-lock.json` depoda tutulmalıdır. Projeyi indiren kişi bağımlılıkları `npm ci` ile kurar.

## Test kapsamı ve MVP sınırları

Otomatik testler oyun mantığını, bölüm çözülebilirliğini, puanlama ve kayıt doğrulamasını kapsar. Bu testler tüm tarayıcı etkileşimlerinin veya fiziksel cihazların test edildiği anlamına gelmez. Ayrıntılı kontroller ve tamamlanmamış doğrulamalar [Kontrol Notları](KONTROL-NOTLARI.md) dosyasındadır.

- Hesap, bulut yedekleme, ödeme ve sosyal özellikler bulunmaz.
- Bazı oyunlarda sabit bölüm veya uçuş programı havuzları vardır.
- Fare, dokunmatik ve klavye kontrolleri uygulanmıştır; gerçek cihaz ve yardımcı teknoloji kapsamı sınırlıdır.
- Bazı oyunlarda normal modun toplam süresi, azaltılmış hareket açıkken de devam eder. Baskısız modun davranışı oyun hazırlığında açıklanır.

Oyunların tasarım yaklaşımı ve araştırma notları için [Oyun Tasarım Notları](OYUN-TASARIM-NOTLARI.md) dosyasına bakın.
