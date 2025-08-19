import type { RouteRecordRaw } from 'vue-router';

// Admin routes with lazy loading
const AdminUsers = () => import('@/views/admin/Users.vue');
const AdminCourses = () => import('@/views/admin/Courses.vue');
const AdminTeachers = () => import('@/views/admin/Teachers.vue');
const AdminStats = () => import('@/views/admin/Stats.vue');
const AdminSettings = () => import('@/views/admin/Settings.vue');
const AdminGroups = () => import('@/views/admin/Groups.vue');
const AdminPayments = () => import('@/views/admin/Payments.vue');
const AdminReports = () => import('@/views/admin/Reports.vue');
const AdminNotifications = () => import('@/views/admin/Notifications.vue');
const AdminLessons = () => import('@/views/admin/Lessons.vue');

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: {
      title: 'Foydalanuvchilar',
      roles: ['admin'],
      icon: 'users'
    }
  },
  {
    path: 'admin/courses',
    name: 'AdminCourses',
    component: AdminCourses,
    meta: {
      title: 'Kurslar boshqaruvi',
      roles: ['admin'],
      icon: 'book-open'
    }
  },
  {
    path: 'admin/teachers',
    name: 'AdminTeachers',
    component: AdminTeachers,
    meta: {
      title: 'O\'qituvchilar',
      roles: ['admin'],
      icon: 'user-check'
    }
  },
  {
    path: 'admin/groups',
    name: 'AdminGroups',
    component: AdminGroups,
    meta: { title: 'Guruhlar', roles: ['admin'], icon: 'users-group' }
  },
  {
    path: 'admin/lessons',
    name: 'AdminLessons',
    component: AdminLessons,
    meta: { title: 'Darslar', roles: ['admin'], icon: 'presentation' }
  },
  {
    path: 'admin/payments',
    name: 'AdminPayments',
    component: AdminPayments,
    meta: { title: 'To\'lovlar', roles: ['admin'], icon: 'credit-card' }
  },
  {
    path: 'admin/stats',
    name: 'AdminStats',
    component: AdminStats,
    meta: { title: 'Statistika', roles: ['admin'], icon: 'chart-bar' }
  },
  {
    path: 'admin/reports',
    name: 'AdminReports',
    component: AdminReports,
    meta: { title: 'Hisobotlar', roles: ['admin'], icon: 'document-report' }
  },
  {
    path: 'admin/notifications',
    name: 'AdminNotifications',
    component: AdminNotifications,
    meta: { title: 'Bildirishnomalar', roles: ['admin'], icon: 'bell' }
  },
  {
    path: 'admin/settings',
    name: 'AdminSettings',
    component: AdminSettings,
    meta: { title: 'Tizim sozlamalari', roles: ['admin'], icon: 'cog' }
  }
];

// Admin navigation menu items
export const adminMenuItems = [
  {
    title: 'Bosh sahifa',
    route: '/dashboard',
    icon: 'home'
  },
  {
    title: 'Foydalanuvchilar',
    route: '/dashboard/admin/users',
    icon: 'users'
  },
  {
    title: 'Kurslar',
    route: '/dashboard/admin/courses',
    icon: 'book-open'
  },
  {
    title: 'O\'qituvchilar',
    route: '/dashboard/admin/teachers',
    icon: 'user-check'
  },
  {
    title: 'Guruhlar',
    route: '/dashboard/admin/groups',
    icon: 'users-group'
  },
  {
    title: 'Darslar',
    route: '/dashboard/admin/lessons',
    icon: 'presentation'
  },
  {
    title: 'To\'lovlar',
    route: '/dashboard/admin/payments',
    icon: 'credit-card'
  },
  {
    title: 'Statistika',
    route: '/dashboard/admin/stats',
    icon: 'chart-bar'
  },
  {
    title: 'Hisobotlar',
    route: '/dashboard/admin/reports',
    icon: 'document-report'
  },
  {
    title: 'Bildirishnomalar',
    route: '/dashboard/admin/notifications',
    icon: 'bell'
  },
  {
    title: 'Sozlamalar',
    route: '/dashboard/admin/settings',
    icon: 'cog'
  }
];
