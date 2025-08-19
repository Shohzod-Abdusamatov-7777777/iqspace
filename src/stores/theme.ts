import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Theme } from '@/types';

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<Theme>('light');
  const sidebarCollapsed = ref(false);


  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value));
  };

  const initializeSidebar = () => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      sidebarCollapsed.value = saved === 'true';
    }
  };

  // Initialize on store creation
  initializeSidebar();

  return {
    // State
    currentTheme,
    sidebarCollapsed,

    toggleSidebar,
  };
});
