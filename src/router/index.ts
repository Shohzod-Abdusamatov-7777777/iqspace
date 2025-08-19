import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { RouteRecordRaw } from 'vue-router';
import { adminRoutes } from './admin';
import { teacherRoutes } from './teacher';
import { studentRoutes } from './student';

// Lazy loading components
const Login = () => import('@/views/Login.vue');
const Overview = () => import('@/views/Overview.vue');
const Profile = () => import('@/views/Profile.vue');
const Messages = () => import('@/views/Messages.vue');
const VoiceDemo = () => import('@/views/VoiceDemo.vue');
const AccessibilityDemo = () => import('@/views/AccessibilityDemo.vue');
const NotFound = () => import('@/views/NotFound.vue');
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Kirish'
    }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: {
      requiresAuth: true,
      title: 'Boshqaruv paneli'
    },
    children: [
      {
        path: '',
        name: 'Overview',
        component: Overview,
        meta: {
          title: 'Bosh sahifa',
          roles: ['admin', 'teacher', 'student']
        }
      },
      ...adminRoutes,
      ...teacherRoutes,
      ...studentRoutes,
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'Profil',
          roles: ['admin', 'teacher', 'student']
        }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: Messages,
        meta: {
          title: 'Xabarlar',
          roles: ['admin', 'teacher', 'student']
        }
      },
      {
        path: 'voice-demo',
        name: 'VoiceDemo',
        component: VoiceDemo,
        meta: {
          title: 'Ovoz boshqarish demo',
          roles: ['admin', 'teacher', 'student']
        }
      },
      {
        path: 'accessibility-demo',
        name: 'AccessibilityDemo',
        component: AccessibilityDemo,
        meta: {
          title: 'Complete Accessibility Demo',
          roles: ['admin', 'teacher', 'student']
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Sahifa topilmadi'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - IqSpace` : 'IqSpace';

  // Check if route requires authentication
  if (to.meta.requiresAuth !== false) {
    // Check authentication state from store first, then fallback to localStorage
    const isAuthenticated = authStore.isAuthenticated || 
      (localStorage.getItem('access_token') && localStorage.getItem('user'));
    
    console.log('Navigation check - authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      next('/login');
      return;
    }
    
    // If we have tokens in localStorage but store isn't initialized, initialize it
    if (!authStore.isAuthenticated && localStorage.getItem('access_token')) {
      authStore.initializeAuth();
    }

    // Check role-based access
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      let userRole = authStore.userRole;
      
      // If store doesn't have user role, get it from localStorage
      if (!userRole && localStorage.getItem('user')) {
        try {
          const userDataString = localStorage.getItem('user')!;
          if (userDataString && userDataString !== 'undefined') {
            const userData = JSON.parse(userDataString);
            userRole = userData.role;
          }
        } catch (e) {
          console.error('Error parsing user data from localStorage:', e);
          // Clear invalid data
          localStorage.removeItem('user');
        }
      }
      
      if (!userRole || !to.meta.roles.includes(userRole)) {
        console.log('Access denied for role:', userRole)
        // Redirect to appropriate default route based on role
        switch (userRole) {
          case 'admin':
            next('/dashboard');
            break;
          case 'teacher':
            next('/dashboard/teacher/courses');
            break;
          case 'student':
            next('/dashboard/student/courses');
            break;
          default:
            next('/login');
        }
        return;
      }
    }
  } else {
    // If trying to access login while authenticated, redirect to dashboard
    if (to.name === 'Login' && authStore.isAuthenticated) {
      next('/dashboard');
      return;
    }
  }

  next();
});

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error);
  // You can add toast notification here
});

export default router;
