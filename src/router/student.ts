import type { RouteRecordRaw } from 'vue-router';

// Student routes with lazy loading
const StudentCourses = () => import('@/views/student/Courses.vue');
const StudentAssignments = () => import('@/views/student/Assignments.vue');
const StudentGrades = () => import('@/views/student/Grades.vue');
const StudentSchedule = () => import('@/views/student/Schedule.vue');
const StudentMaterials = () => import('@/views/student/Materials.vue');
const StudentAttendance = () => import('@/views/student/Attendance.vue');
const StudentPayments = () => import('@/views/student/Payments.vue');
const StudentCertificates = () => import('@/views/student/Certificates.vue');

export const studentRoutes: RouteRecordRaw[] = [
  {
    path: 'student/courses',
    name: 'StudentCourses',
    component: StudentCourses,
    meta: {
      title: 'Mening kurslarim',
      roles: ['student'],
      icon: 'book-open'
    }
  },
  {
    path: 'student/assignments',
    name: 'StudentAssignments',
    component: StudentAssignments,
    meta: {
      title: 'Topshiriqlar',
      roles: ['student'],
      icon: 'clipboard-list'
    }
  },
  {
    path: 'student/grades',
    name: 'StudentGrades',
    component: StudentGrades,
    meta: {
      title: 'Baholar',
      roles: ['student'],
      icon: 'academic-cap'
    }
  },
  {
    path: 'student/schedule',
    name: 'StudentSchedule',
    component: StudentSchedule,
    meta: {
      title: 'Dars jadvali',
      roles: ['student'],
      icon: 'calendar'
    }
  },
  {
    path: 'student/materials',
    name: 'StudentMaterials',
    component: StudentMaterials,
    meta: {
      title: 'O\'quv materiallari',
      roles: ['student'],
      icon: 'document-text'
    }
  },
  {
    path: 'student/attendance',
    name: 'StudentAttendance',
    component: StudentAttendance,
    meta: {
      title: 'Davomat',
      roles: ['student'],
      icon: 'check-circle'
    }
  },
  {
    path: 'student/payments',
    name: 'StudentPayments',
    component: StudentPayments,
    meta: {
      title: 'To\'lovlar',
      roles: ['student'],
      icon: 'credit-card'
    }
  },
  {
    path: 'student/certificates',
    name: 'StudentCertificates',
    component: StudentCertificates,
    meta: {
      title: 'Sertifikatlar',
      roles: ['student'],
      icon: 'award'
    }
  }
];

// Student navigation menu items
export const studentMenuItems = [
  {
    title: 'Bosh sahifa',
    route: '/dashboard',
    icon: 'home'
  },
  {
    title: 'Mening kurslarim',
    route: '/dashboard/student/courses',
    icon: 'book-open'
  },
  {
    title: 'Topshiriqlar',
    route: '/dashboard/student/assignments',
    icon: 'clipboard-list'
  },
  {
    title: 'Baholar',
    route: '/dashboard/student/grades',
    icon: 'academic-cap'
  },
  {
    title: 'Dars jadvali',
    route: '/dashboard/student/schedule',
    icon: 'calendar'
  },
  {
    title: 'O\'quv materiallari',
    route: '/dashboard/student/materials',
    icon: 'document-text'
  },
  {
    title: 'Davomat',
    route: '/dashboard/student/attendance',
    icon: 'check-circle'
  },
  {
    title: 'To\'lovlar',
    route: '/dashboard/student/payments',
    icon: 'credit-card'
  },
  {
    title: 'Sertifikatlar',
    route: '/dashboard/student/certificates',
    icon: 'award'
  }
];
