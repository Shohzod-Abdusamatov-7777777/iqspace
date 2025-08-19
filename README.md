# 🎓 LMS Platform - Learning Management System

Vue 3 + TypeScript + Naive UI + Tailwind CSS 4 + JSON Server bilan qurilgan zamonaviy Learning Management System.

## ✨ Xususiyatlar

### 🔐 **Role-based Authentication**
- **Admin**: Tizim boshqaruvi, foydalanuvchilar va kurslar
- **Teacher**: Kurslar yaratish, topshiriqlar, o'quvchilarni boshqarish  
- **Student**: Kurslarga yozilish, topshiriqlar bajarish, progress tracking

### 🎯 **Asosiy funksiyalar**
- Modern responsive dizayn
- Dark/Light theme
- Real-time pagination
- Role-based navigation
- Interactive dashboards
- Comprehensive user management

## 🛠️ **Texnologiyalar**

### Frontend
- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Naive UI** - Component library
- **Tailwind CSS 4** - Modern styling
- **Lucide Vue** - Icons
- **Pinia** - State management
- **Vue Router** - Navigation

### Backend
- **JSON Server** - Mock API
- **Custom middleware** - Authentication & pagination
- **Role-based access control**

## 🚀 **Loyihani ishga tushirish**

### 1. Repozitoriyani clone qiling
```bash
git clone <repo-url>
cd lms-platform
```

### 2. Dependencies o'rnatish
```bash
npm install
```

### 3. Development server'larni ishga tushirish

**Variant 1 - Ikkisini birga:**
```bash
npm run dev:all
```

**Variant 2 - Alohida terminal:**

Terminal 1 - JSON Server:
```bash
npm run json-server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 4. Ochish
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

## 🔑 **Demo ma'lumotlari**

### Login uchun:
- **Telefon**: +998901234567 (yoki istalgan raqam)
- **Ism**: Test User (yoki istalgan ism)
- **SMS kod**: 1234 (istalgan 4 ta raqam)

### Test tokenlari:
Login qilganingizdan so'ng avtomatik token beriladi:
- **Admin**: `admin_token`
- **Teacher**: `teacher_token` 
- **Student**: `student_token`

## 📱 **Sahifalar struktura**

### 🛡️ Admin Panel
```
/dashboard/admin/
├── users        # Foydalanuvchilar CRUD
├── teachers     # O'qituvchilar boshqaruvi
├── courses      # Kurslar boshqaruvi
├── stats        # Statistika va analytics
└── settings     # Tizim sozlamalari
```

### 👨‍🏫 Teacher Panel
```
/dashboard/teacher/
├── courses      # Mening kurslarim
├── assignments  # Topshiriqlar yaratish
├── students     # O'quvchilar boshqaruvi
└── schedule     # Dars jadvali
```

### 👨‍🎓 Student Panel
```
/dashboard/student/
├── courses      # Mening kurslarim
├── assignments  # Topshiriqlarim
├── grades       # Baholarim
└── schedule     # Dars jadvalim
```

### 🔄 Shared Pages
```
/dashboard/
├── profile      # Profil sozlamalari
└── messages     # Xabarlashtirish
```

## 🔧 **API Endpoints**

### Authentication
```http
POST /api/auth/login           # SMS orqali kirish
POST /api/auth/verify-sms      # SMS kodni tekshirish
GET  /api/auth/me              # Joriy foydalanuvchi
POST /api/auth/logout          # Chiqish
```

### Admin APIs
```http
GET    /api/admin/users        # Foydalanuvchilar ro'yxati
POST   /api/admin/users        # Yangi foydalanuvchi
PUT    /api/admin/users/:id    # Tahrirlash
DELETE /api/admin/users/:id    # O'chirish
GET    /api/admin/stats        # Statistika
```

### Teacher APIs
```http
GET  /api/teacher/courses      # Mening kurslarim
POST /api/teacher/assignments  # Topshiriq yaratish
GET  /api/teacher/students     # O'quvchilar
```

### Student APIs
```http
GET  /api/student/courses           # Mening kurslarim
POST /api/student/courses/:id/enroll # Kursga yozilish
GET  /api/student/assignments       # Topshiriqlar
POST /api/student/assignments/:id/submit # Topshiriq yuborish
```

## 🎨 **UI/UX Features**

### Tailwind CSS 4
- Modern utility-first approach
- Dark/Light theme support
- Responsive design
- Custom components

### Naive UI Components
- Rich component library
- Accessible design
- Consistent theming
- TypeScript support

### Animations
```css
/* Custom animations */
.fade-in { animation: fadeIn 0.3s ease-in-out; }
.slide-up { animation: slideUp 0.3s ease-out; }
.bounce-soft { animation: bounceSoft 0.6s ease-out; }
```

## 📊 **Features Demo**

### Dashboard Features
- ✅ Real-time statistics cards
- ✅ Interactive charts and progress bars
- ✅ Role-based content
- ✅ Quick action buttons
- ✅ Recent activity feeds

### CRUD Operations
- ✅ Pagination with search
- ✅ Filters and sorting
- ✅ Modal forms
- ✅ Bulk operations
- ✅ Data validation

### User Experience
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Responsive design
- ✅ Keyboard shortcuts

## 📁 **Loyiha strukturasi**

```
lms-platform/
├── db/                        # JSON Server
│   ├── server.js             # Custom server
│   ├── db.json               # Mock database
│   ├── auth-middleware.js    # Auth logic
│   ├── pagination-middleware.js # Pagination
│   └── role-middleware.js    # Role access
├── src/
│   ├── assets/styles/        # Global CSS
│   ├── components/
│   │   ├── layout/          # Header, Sidebar, Footer
│   │   └── common/          # Reusable components
│   ├── stores/              # Pinia state management
│   │   ├── auth.ts          # Authentication
│   │   └── theme.ts         # Theme management
│   ├── services/            # API layer
│   │   └── api.ts           # HTTP client & services
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helper functions
│   │   └── menu.ts          # Navigation menu
│   ├── views/               # Page components
│   │   ├── admin/           # Admin pages
│   │   ├── teacher/         # Teacher pages
│   │   ├── student/         # Student pages
│   │   ├── Login.vue        # Authentication
│   │   ├── Dashboard.vue    # Main layout
│   │   ├── Overview.vue     # Dashboard home
│   │   └── NotFound.vue     # 404 page
│   └── router/              # Vue Router config
├── tailwind.config.js       # Tailwind CSS 4 config
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## 🔨 **Development Commands**

```bash
# Development
npm run dev              # Frontend development server
npm run json-server      # Backend API server
npm run dev:all          # Ikkisini birga

# Production
npm run build            # Production build
npm run preview          # Preview production build

# Type checking
npm run type-check       # TypeScript validation
```

## 🚦 **Getting Started Guide**

### 1. **First Run**
```bash
git clone <repo>
cd lms-platform
npm install
npm run dev:all
```

### 2. **Test Different Roles**
1. Login as Student (default)
2. Change token in dev tools: `localStorage.setItem('access_token', 'admin_token')`
3. Refresh page to see admin panel

### 3. **API Testing**
```bash
# Test API directly
curl http://localhost:3001/api/users
curl -H "Authorization: Bearer admin_token" http://localhost:3001/api/admin/users
```

## 🎯 **Production Deployment**

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder
```

### Backend Options
1. **JSON Server**: Deploy to Railway/Render
2. **Real Backend**: Replace with Express.js/FastAPI
3. **Database**: Replace JSON files with PostgreSQL/MongoDB

## 📚 **Documentation Links**

- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Naive UI Components](https://www.naiveui.com/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Pinia Store](https://pinia.vuejs.org/)

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

---

### 🎉 **Happy Coding!**

LMS Platform - Modern education management for the future! 🚀

Bu loyiha zamonaviy web development best practices va clean architecture prinsiplariga asoslangan holda qurildi.
# iqspace
