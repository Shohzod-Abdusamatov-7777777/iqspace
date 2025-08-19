// User types
export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  avatar: string;
  subjects?: string[];
  experience?: string;
  qualification?: string;
  bio?: string;
  enrolled_courses?: number[];
  created_at: string;
  last_login: string;
}

// Teacher types
export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  specialization: string;
  experience: number;
  status: 'active' | 'inactive' | 'vacation';
  bio: string;
  rating: number;
  courses: number;
  students: number;
  birthDate: string;
  qualification: string;
}

// Course types
export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  teacher_name: string;
  subject: string;
  duration: string;
  price: number;
  students_count: number;
  rating: number;
  color: string;
  icon: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Enrollment types
export interface Enrollment {
  id: number;
  student_id: number;
  student_name: string;
  course_id: number;
  course_title: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
}

// Assignment types
export interface Assignment {
  id: number;
  course_id: number;
  teacher_id: number;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  status: 'active' | 'closed';
  created_at: string;
}

// Submission types
export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  student_name: string;
  content: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: number;
}

// Grade types
export interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  course_id: number;
  course_title: string;
  assignment_id: number;
  assignment_title: string;
  grade: number;
  max_score: number;
  percentage: number;
  graded_at: string;
  graded_by: number;
}

// Schedule types
export interface Schedule {
  id: number;
  course_id: number;
  course_title: string;
  teacher_id: number;
  teacher_name: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  room: string;
  status: 'active' | 'cancelled';
}

// Attendance types
export interface Attendance {
  id: number;
  schedule_id: number;
  student_id: number;
  student_name: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_at: string;
  marked_by: number;
}

// Subject types
export interface Subject {
  id: number;
  title: string;
  description: string;
  course_count: number;
  color: string;
  icon: string;
}

// Message types
export interface Message {
  id: number;
  from_user_id: number;
  from_user_name: string;
  to_user_id: number;
  to_user_name: string;
  subject: string;
  content: string;
  is_read: boolean;
  sent_at: string;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'assignment' | 'schedule' | 'grade' | 'message' | 'system';
  is_read: boolean;
  created_at: string;
}

// Statistics types
export interface Stats {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_admins: number;
  total_courses: number;
  total_enrollments: number;
  total_assignments: number;
  total_submissions: number;
  success_rate: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    from: number;
    to: number;
    has_next: boolean;
    has_prev: boolean;
    next_page: number | null;
    prev_page: number | null;
  };
  meta: {
    sort: string;
    order: string;
    search: string;
  };
}

// Auth types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    user: User;
  }
}

export interface VerifyRequest {
  temp_token: string;
  sms_code: string;
  phone: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  user: User;
}

// Theme types
export type Theme = 'light' | 'dark';

// Menu item types
export interface MenuItem {
  id: string;
  title: string;
  icon: string | any;
  path: string;
  roles: string[];
  children?: MenuItem[];
}
