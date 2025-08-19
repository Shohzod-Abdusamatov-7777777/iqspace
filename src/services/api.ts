import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  AuthResponse,
  User
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://84.247.128.50:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  // Pagination helper
  async getPaginated<T>(
    url: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string,
    order?: string
  ): Promise<PaginatedResponse<T>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    if (sort) params.sort = sort;
    if (order) params.order = order;

    return this.get<PaginatedResponse<T>>(url, params);
  }
}

// Auth Service
export class AuthService extends ApiService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', data);
  }

  async verifySMS(data: VerifyRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/verify-sms', data);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>('/auth/me');
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>('/auth/logout');
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.post<AuthResponse>('/auth/refresh-token', { refresh_token: refreshToken });
  }
}

// Admin Service
export class AdminService extends ApiService {
  // Users
  async getUsers(page = 1, limit = 10, search = '', role = 'all') {
    const params: any = { _page: page, _limit: limit };
    if (search) params.q = search;
    if (role !== 'all') params.role = role;

    return this.get('/users', params);
  }

  async createUser(data: Partial<User>) {
    return this.post('/admin/users', data);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.put(`/admin/users/${id}`, data);
  }

  async deleteUser(id: number) {
    return this.delete(`/admin/users/${id}`);
  }

  async updateUserRole(id: number, role: string) {
    return this.put(`/admin/users/${id}/role`, { role });
  }

  async updateUserStatus(id: number, status: string) {
    return this.put(`/admin/users/${id}/status`, { status });
  }

  // Courses
  async getCourses(page = 1, limit = 10, search = '') {
    return this.getPaginated('/admin/courses', page, limit, search);
  }

  async createCourse(data: any) {
    return this.post('/admin/courses', data);
  }

  async updateCourse(id: number, data: any) {
    return this.put(`/admin/courses/${id}`, data);
  }

  async deleteCourse(id: number) {
    return this.delete(`/admin/courses/${id}`);
  }

  async assignTeacherToCourse(courseId: number, teacherId: number) {
    return this.post(`/admin/courses/${courseId}/assign-teacher`, { teacher_id: teacherId });
  }

  // Statistics
  async getStats() {
    return this.get('/admin/stats');
  }

  async getReports() {
    return this.get('/admin/reports');
  }

  async getLogs() {
    return this.get('/admin/logs');
  }

  async updateSettings(data: any) {
    return this.put('/admin/settings', data);
  }
}

// Teacher Service
export class TeacherService extends ApiService {
  // Courses
  async getMyCourses(page = 1, limit = 10) {
    return this.getPaginated('/teacher/courses', page, limit);
  }

  async getCourse(id: number) {
    return this.get(`/teacher/courses/${id}`);
  }

  async updateCourse(id: number, data: any) {
    return this.put(`/teacher/courses/${id}`, data);
  }

  async getCourseStudents(courseId: number) {
    return this.get(`/teacher/courses/${courseId}/students`);
  }

  // Assignments
  async getMyAssignments(page = 1, limit = 10) {
    return this.getPaginated('/teacher/assignments', page, limit);
  }

  async createAssignment(data: any) {
    return this.post('/teacher/assignments', data);
  }

  async updateAssignment(id: number, data: any) {
    return this.put(`/teacher/assignments/${id}`, data);
  }

  async deleteAssignment(id: number) {
    return this.delete(`/teacher/assignments/${id}`);
  }

  async getAssignmentSubmissions(assignmentId: number) {
    return this.get(`/teacher/assignments/${assignmentId}/submissions`);
  }

  async gradeSubmission(submissionId: number, grade: number, feedback?: string) {
    return this.put(`/teacher/submissions/${submissionId}/grade`, { grade, feedback });
  }

  // Schedule
  async getMySchedule() {
    return this.get('/teacher/schedule');
  }

  async getTodaySchedule() {
    return this.get('/teacher/schedule/today');
  }

  async markAttendance(data: any) {
    return this.post('/teacher/attendance', data);
  }

  async updateAttendance(id: number, data: any) {
    return this.put(`/teacher/attendance/${id}`, data);
  }

  // Students
  async getMyStudents() {
    return this.get('/teacher/students');
  }

  async getStudent(id: number) {
    return this.get(`/teacher/students/${id}`);
  }

  async gradeStudent(studentId: number, data: any) {
    return this.put(`/teacher/students/${studentId}/grade`, data);
  }

  async getStudentProgress(studentId: number) {
    return this.get(`/teacher/students/${studentId}/progress`);
  }
}

// Student Service
export class StudentService extends ApiService {
  // Courses
  async getMyCourses() {
    return this.get('/student/courses');
  }

  async enrollInCourse(courseId: number) {
    return this.post(`/student/courses/${courseId}/enroll`);
  }

  async unenrollFromCourse(courseId: number) {
    return this.delete(`/student/courses/${courseId}/unenroll`);
  }

  async getCourse(id: number) {
    return this.get(`/student/courses/${id}`);
  }

  async getCourseMaterials(courseId: number) {
    return this.get(`/student/courses/${courseId}/materials`);
  }

  // Assignments
  async getMyAssignments() {
    return this.get('/student/assignments');
  }

  async getAssignment(id: number) {
    return this.get(`/student/assignments/${id}`);
  }

  async submitAssignment(assignmentId: number, content: string) {
    return this.post(`/student/assignments/${assignmentId}/submit`, { content });
  }

  async getAssignmentGrade(assignmentId: number) {
    return this.get(`/student/assignments/${assignmentId}/grade`);
  }

  // Schedule & Attendance
  async getMySchedule() {
    return this.get('/student/schedule');
  }

  async getTodaySchedule() {
    return this.get('/student/schedule/today');
  }

  async getMyAttendance() {
    return this.get('/student/attendance');
  }

  // Progress & Grades
  async getMyGrades() {
    return this.get('/student/grades');
  }

  async getMyProgress() {
    return this.get('/student/progress');
  }

  async getMyCertificates() {
    return this.get('/student/certificates');
  }
}

// Export service instances
export const authService = new AuthService();
export const adminService = new AdminService();
export const teacherService = new TeacherService();
export const studentService = new StudentService();
