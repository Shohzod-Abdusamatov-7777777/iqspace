import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/api';
import type { User, LoginRequest, VerifyRequest } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isAdmin = computed(() => userRole.value === 'admin');
  const isTeacher = computed(() => userRole.value === 'teacher');
  const isStudent = computed(() => userRole.value === 'student');

  // Actions
  const initializeAuth = () => {
    const token = localStorage.getItem('access_token');
    const refresh = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user');

    if (token && refresh && userData && userData !== 'undefined') {
      try {
        accessToken.value = token;
        refreshToken.value = refresh;
        user.value = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
  };

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const setUser = (userData: User) => {
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const login = async (credentials: LoginRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const { data } = await authService.login(credentials);
      if (data) {
        setTokens(data.accessToken, 'mock-refresh-token')
        setUser(data.user)
      } else {
        throw new Error('Login response format invalid')
      }

      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const verifySMS = async (data: VerifyRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await authService.verifySMS(data);

      if (response.success) {
        setTokens(response.access_token, response.refresh_token);
        setUser(response.user);
      }

      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Verification failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
      return response;
    } catch (err: any) {
      console.error('Failed to get current user:', err);
      clearAuth();
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
    }
  };

  const refreshUserToken = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.success) {
        setTokens(response.access_token, response.refresh_token);
        setUser(response.user);
      }
      return response;
    } catch (err) {
      console.error('Token refresh failed:', err);
      clearAuth();
      throw err;
    }
  };

  // Initialize auth on store creation
  initializeAuth();

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isTeacher,
    isStudent,

    // Actions
    initializeAuth,
    login,
    verifySMS,
    getCurrentUser,
    logout,
    refreshUserToken,
    clearAuth,
    setUser,
  };
});
