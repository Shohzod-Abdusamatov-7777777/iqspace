import { apiClient } from './api';
import { Course, Subject, Teacher, Assignment, Schedule, PaginatedResponse, QueryParams } from '@/types';

export class CourseService {
  static async getCourses(params?: QueryParams): Promise<PaginatedResponse<Course>> {
    const queryParams: any = {};

    if (params?.page) {
      queryParams._page = params.page;
    }
    if (params?.limit) {
      queryParams._limit = params.limit;
    }
    if (params?.search) {
      queryParams.q = params.search;
    }
    if (params?.sortBy) {
      queryParams._sort = params.sortBy;
    }
    if (params?.sortOrder) {
      queryParams._order = params.sortOrder;
    }
    if (params?.subject) {
      queryParams.subject = params.subject;
    }

    return apiClient.getPaginated<Course>('/courses', { params: queryParams });
  }

  static async getCourse(id: string): Promise<Course> {
    return apiClient.get<Course>(`/courses/${id}`);
  }

  static async createCourse(data: Partial<Course>): Promise<Course> {
    return apiClient.post<Course>('/courses', data);
  }

  static async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    return apiClient.put<Course>(`/courses/${id}`, data);
  }

  static async deleteCourse(id: string): Promise<void> {
    return apiClient.delete<void>(`/courses/${id}`);
  }
}

export class SubjectService {
  static async getSubjects(): Promise<Subject[]> {
    return apiClient.get<Subject[]>('/subjects');
  }

  static async getSubject(id: string): Promise<Subject> {
    return apiClient.get<Subject>(`/subjects/${id}`);
  }

  static async createSubject(data: Partial<Subject>): Promise<Subject> {
    return apiClient.post<Subject>('/subjects', data);
  }

  static async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    return apiClient.put<Subject>(`/subjects/${id}`, data);
  }

  static async deleteSubject(id: string): Promise<void> {
    return apiClient.delete<void>(`/subjects/${id}`);
  }
}

export class TeacherService {
  static async getTeachers(params?: QueryParams): Promise<PaginatedResponse<Teacher>> {
    return apiClient.get<PaginatedResponse<Teacher>>('/teachers', { params });
  }

  static async getTeacher(id: string): Promise<Teacher> {
    return apiClient.get<Teacher>(`/teachers/${id}`);
  }

  static async createTeacher(data: Partial<Teacher>): Promise<Teacher> {
    return apiClient.post<Teacher>('/teachers', data);
  }

  static async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    return apiClient.put<Teacher>(`/teachers/${id}`, data);
  }

  static async deleteTeacher(id: string): Promise<void> {
    return apiClient.delete<void>(`/teachers/${id}`);
  }
}

export class AssignmentService {
  static async getAssignments(params?: QueryParams): Promise<PaginatedResponse<Assignment>> {
    return apiClient.get<PaginatedResponse<Assignment>>('/assignments', { params });
  }

  static async getAssignment(id: string): Promise<Assignment> {
    return apiClient.get<Assignment>(`/assignments/${id}`);
  }

  static async submitAssignment(id: string, data: any): Promise<Assignment> {
    return apiClient.post<Assignment>(`/assignments/${id}/submit`, data);
  }
}

export class ScheduleService {
  static async getSchedule(): Promise<Schedule[]> {
    return apiClient.get<Schedule[]>('/schedule');
  }

  static async createSchedule(data: Partial<Schedule>): Promise<Schedule> {
    return apiClient.post<Schedule>('/schedule', data);
  }

  static async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
    return apiClient.put<Schedule>(`/schedule/${id}`, data);
  }

  static async deleteSchedule(id: string): Promise<void> {
    return apiClient.delete<void>(`/schedule/${id}`);
  }
}
