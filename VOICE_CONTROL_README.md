# Ovoz bilan boshqarish tizimi - IQSpace LMS

Bu hujjat IQSpace LMS loyihasiga qo'shilgan ovoz bilan boshqarish tizimi haqida to'liq ma'lumot beradi.

## Xususiyatlar

### 🎤 Asosiy imkoniyatlar
- **Ovoz tanish**: Web Speech API orqali real-time ovoz tanish
- **Uzbek tili qo'llab-quvvatlash**: Buyruqlar uzbek tilida
- **Role-based navigatsiya**: Har bir foydalanuvchi roli uchun maxsus buyruqlar
- **Accessibility**: Imkoniyati cheklangan foydalanuvchilar uchun mo'ljallangan
- **Klaviatura shortcuts**: Klaviatura orqali ham boshqarish imkoniyati

### 🔊 Qo'llab-quvvatlanadigan buyruqlar

#### Umumiy navigatsiya
- `"Bosh sahifa"` - Asosiy sahifaga o'tish
- `"Dashboard"` - Dashboard sahifasiga o'tish  
- `"Profil"` - Profil sahifasiga o'tish
- `"Xabarlar"` - Xabarlar sahifasiga o'tish

#### O'qituvchi buyruqlari
- `"Kurslarimga o't"` - Kurslar sahifasiga o'tish
- `"O'quvchilar"` - O'quvchilar ro'yxatiga o'tish
- `"Topshiriqlar"` - Topshiriqlar sahifasiga o'tish
- `"Dars jadvali"` - Jadval sahifasiga o'tish
- `"Baholash"` - Baholar sahifasiga o'tish
- `"Davomat"` - Davomat sahifasiga o'tish
- `"Materiallar"` - O'quv materiallari sahifasiga o'tish

#### Talaba buyruqlari
- `"Kurslarim"` - Mening kurslarim sahifasiga o'tish
- `"Topshiriqlarim"` - Mening topshiriqlarim sahifasiga o'tish
- `"Baholarim"` - Mening baholarim sahifasiga o'tish
- `"To'lovlar"` - To'lovlar sahifasiga o'tish
- `"Sertifikatlar"` - Sertifikatlar sahifasiga o'tish

#### Boshqaruv buyruqlari
- `"Yordam"` - Buyruqlar ro'yxatini ko'rsatish
- `"To'xtat"` - Ovoz tanishni to'xtatish

### ⌨️ Klaviatura shortcuts
- `Ctrl + Shift + V` - Ovoz tanishni yoqish/o'chirish
- `Ctrl + Shift + H` - Yordam oynasini ochish/yopish
- `Escape` - Yordam oynasini yopish yoki ovoz tanishni to'xtatish

## O'rnatish va sozlash

### 1. Komponentni import qilish
VoiceControl komponenti allaqachon DashboardLayout.vue fayliga qo'shilgan:

```vue
import VoiceControl from "@/components/common/VoiceControl.vue";
```

### 2. Template'da ishlatish
```vue
<template>
  <!-- Boshqa kontent -->
  <VoiceControl />
</template>
```

### 3. Browser ruxsati
Ovoz tanish ishlashi uchun foydalanuvchi browser'da mikrofon ruxsatini berishi kerak.

## Texnik detalllar

### Dependencies
- `vue` ^3.4.15
- `vue-router` ^4.2.5
- `pinia` ^2.1.7
- `lucide-vue-next` ^0.316.0
- `@vueuse/core` ^13.4.0

### Browser qo'llab-quvvatlash
- Chrome 25+
- Firefox 44+
- Safari 14.1+
- Edge 79+

### Fayllar strukturi
```
src/
├── components/
│   └── common/
│       └── VoiceControl.vue          # Asosiy ovoz boshqarish komponenti
├── layouts/
│   └── DashboardLayout.vue           # Layout'ga qo'shilgan
└── stores/
    └── auth.ts                       # Foydalanuvchi roli uchun
```

## Xavfsizlik

### Ruxsatlar
- Mikrofon ruxsati talab qilinadi
- Ma'lumotlar mahalliy qayta ishlanadi (server'ga yuborilmaydi)

### Privacy
- Ovoz ma'lumotlari saqlanmaydi
- Faqat buyruq matnlari qayta ishlanadi

## Muammolarni hal qilish

### Ovoz tanilmayapti
1. Mikrofon ruxsati berilganligini tekshiring
2. Browser'da HTTPS ishlatilayotganligini tekshiring
3. Mikrofon ulangan va ishlaydigan holatda ekanligini tekshiring

### Buyruq tushunilmayapti
1. Aniq va ravshan gapiring
2. Shovqinsiz muhitda foydalaning
3. Buyruqlarni to'g'ri aytganligingizni tekshiring

### Browser qo'llab-quvvatlamaydi
1. Yangi browser versiyasiga yangilang
2. HTTPS orqali kirganligingizni tekshiring
3. Qo'llab-quvvatlanadigan browser'lardan foydalaning

## Kelajakdagi yangilanishlar

### Rejalashtirilgan xususiyatlar
- [ ] Ko'proq til qo'llab-quvvatlash (rus, ingliz)
- [ ] Murakkab buyruqlar (masalan: "Mobilografiya kursidagi topshiriqlarni ko'rsat")
- [ ] Ovozli javoblar (TTS - Text to Speech)
- [ ] Offline rejimi
- [ ] Buyruqlarni sozlash imkoniyati

### Takomillashtirish takliflari
- Shovqin filtrlash
- Dinamik buyruqlar yaratish
- Machine learning orqali yaxshiroq tanish

## Yordam va qo'llab-quvvatlash

### Texnik yordam
Agar muammolar bo'lsa, quyidagi ma'lumotlarni tayyorlab qo'ying:
1. Browser nomi va versiyasi
2. Operatsion tizim
3. Xato xabarlari
4. Qaysi buyruq ishlamayapti

### Contact
- Email: support@iqspace.uz
- Phone: +998 90 123 45 67

---

**Eslatma**: Bu tizim imkoniyati cheklangan foydalanuvchilar uchun mo'ljallangan va WCAG 2.1 standartlariga muvofiq ishlab chiqilgan.
