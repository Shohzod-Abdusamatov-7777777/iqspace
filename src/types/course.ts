export interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  students: number;
  rating: number;
  color: string;
  icon: string;
  subject: string;
  duration: string;
  price: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  coursesCount: number;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  subjects: string[];
  bio?: string;
  experience: number;
  rating: number;
  totalStudents: number;
  isActive: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  course: Course;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  points: number;
  maxPoints: number;
  createdAt: string;
}

export interface Schedule {
  id: string;
  courseId: string;
  course: Course;
  teacherId: string;
  teacher: Teacher;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string;
  endTime: string;
  room?: string;
  isActive: boolean;
}
