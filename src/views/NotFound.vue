<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="mx-auto h-24 w-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
          <n-icon size="48" color="#4361ee">
            <AlertCircleIcon />
          </n-icon>
        </div>
        
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Sahifa topilmadi
        </h2>
        
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan.
        </p>
      </div>
      
      <div class="space-y-4">
        <n-button
          type="primary"
          size="large"
          block
          @click="goHome"
        >
          <template #icon>
            <n-icon>
              <HomeIcon />
            </n-icon>
          </template>
          Bosh sahifaga qaytish
        </n-button>
        
        <n-button
          quaternary
          size="large"
          block
          @click="goBack"
        >
          <template #icon>
            <n-icon>
              <ChevronLeftIcon />
            </n-icon>
          </template>
          Orqaga qaytish
        </n-button>
      </div>
      
      <!-- Helpful links based on user role -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Foydali havolalar:
        </p>
        <div class="flex flex-wrap gap-2 justify-center">
          <n-tag 
            v-for="link in helpfulLinks" 
            :key="link.path"
            class="cursor-pointer hover:opacity-80"
            @click="$router.push(link.path)"
          >
            {{ link.label }}
          </n-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Computed
const helpfulLinks = computed(() => {
  const role = authStore.userRole;
  
  if (role === 'admin') {
    return [
      { label: 'Foydalanuvchilar', path: '/dashboard/admin/users' },
      { label: 'Kurslar', path: '/dashboard/admin/courses' },
      { label: 'Statistika', path: '/dashboard/admin/stats' }
    ];
  }
  
  if (role === 'teacher') {
    return [
      { label: 'Mening kurslarim', path: '/dashboard/teacher/courses' },
      { label: 'Topshiriqlar', path: '/dashboard/teacher/assignments' },
      { label: 'O\'quvchilar', path: '/dashboard/teacher/students' }
    ];
  }
  
  if (role === 'student') {
    return [
      { label: 'Mening kurslarim', path: '/dashboard/student/courses' },
      { label: 'Topshiriqlar', path: '/dashboard/student/assignments' },
      { label: 'Baholar', path: '/dashboard/student/grades' }
    ];
  }
  
  return [
    { label: 'Kirish', path: '/login' }
  ];
});

// Methods
const goHome = () => {
  router.push('/dashboard');
};

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
/* Custom animation for the 404 number */
h1 {
  background: linear-gradient(135deg, #4361ee 0%, #4895ef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Bounce animation for the icon */
.bounce-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-10px);
  }
  70% {
    transform: translateY(-5px);
  }
}
</style>
