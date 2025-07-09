# Kim Milyoner Olmak İster? 🎯

Modern ve responsive tasarım ile geliştirilmiş "Kim Milyoner Olmak İster?" bilgi yarışması oyunu.

## 🚀 Özellikler

- **Çift Mod Desteği**: Mobil ve masaüstü için optimize edilmiş farklı UI düzenleri
- **Modern Tasarım**: TailwindCSS ve shadcn/ui ile geliştirilmiş sade ve şık arayüz
- **Joker Sistemi**: 
  - 50:50 Jokeri
  - Seyirciye Sor
  - Telefon Jokeri
- **Responsive**: Tüm ekran boyutlarında mükemmel görünüm
- **TypeScript**: Tip güvenliği ile geliştirilmiş

## 🛠️ Teknolojiler

- **React 18** + **TypeScript**
- **Vite** (Hızlı geliştirme ortamı)
- **TailwindCSS** (Styling)
- **shadcn/ui** (UI komponentleri)
- **Lucide React** (İkonlar)
- **Radix UI** (Accessible UI primitives)

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

## 🎮 Kullanım

1. **Mod Seçimi**: Uygulama açıldığında mobil veya masaüstü modu seçin
2. **Oyun**: Sorulara cevap verin, jokerlerinizi kullanın
3. **Geri Dön**: İstediğiniz zaman ana menüye dönebilirsiniz

## 📱 Mobil Mod

- Dikey tasarım
- Büyük, dokunmaya uygun butonlar
- Soru üstte, seçenekler altta
- Jokerler altta kompakt düzende

## 🖥️ Masaüstü Mod

- Geniş ekran düzeni
- Soru ortalanmış
- Seçenekler 2x2 grid
- Jokerler sağ üstte ikonlar halinde

## 🎯 Gelecek Planları

- [ ] Çoklu seviye sistemi
- [ ] Skor takibi
- [ ] Zamanlayıcı
- [ ] Ses efektleri
- [ ] Dil desteği (i18n)
- [ ] Dark/Light tema
- [ ] Soru veritabanı genişletme
- [ ] Multiplayer mod

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── ui/              # shadcn/ui komponentleri
│   ├── StartScreen.tsx  # Giriş ekranı
│   └── GameScreen.tsx   # Oyun ekranı
├── context/
│   └── GameModeContext.tsx # Mod yönetimi
├── lib/
│   └── utils.ts         # Utility fonksiyonlar
├── App.tsx              # Ana uygulama
├── main.tsx             # Entry point
└── globals.css          # Global stiller
```

## 🔧 Geliştirme

Proje geliştirilme aşamasındadır. Katkıda bulunmak için:

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında geliştirilmiştir. 