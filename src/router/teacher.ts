import type { RouteRecordRaw } from 'vue-router';

// Teacher routes with lazy loading
const TeacherCourses = () => import('@/views/teacher/Courses.vue');
const TeacherAssignments = () => import('@/views/teacher/Assignments.vue');
const TeacherStudents = () => import('@/views/teacher/Students.vue');
const TeacherSchedule = () => import('@/views/teacher/Schedule.vue');
const TeacherGrades = () => import('@/views/teacher/Grades.vue');
const TeacherAttendance = () => import('@/views/teacher/Attendance.vue');
const TeacherMaterials = () => import('@/views/teacher/Materials.vue');

export const teacherRoutes: RouteRecordRaw[] = [
  {
    path: 'teacher/courses',
    name: 'TeacherCourses',
    component: TeacherCourses,
    meta: {
      title: 'Mening kurslarim',
      roles: ['teacher'],
      icon: 'book-open'
    }
  },
  {
    path: 'teacher/assignments',
    name: 'TeacherAssignments',
    component: TeacherAssignments,
    meta: {
      title: 'Topshiriqlar',
      roles: ['teacher'],
      icon: 'list'
    }
  },
  {
    path: 'teacher/students',
    name: 'TeacherStudents',
    component: TeacherStudents,
    meta: {
      title: 'O\'quvchilar',
      roles: ['teacher'],
      icon: 'users'
    }
  },
  {
    path: 'teacher/schedule',
    name: 'TeacherSchedule',
    component: TeacherSchedule,
    meta: {
      title: 'Dars jadvali',
      roles: ['teacher'],
      icon: 'calendar'
    }
  },
  {
    path: 'teacher/grades',
    name: 'TeacherGrades',
    component: TeacherGrades,
    meta: {
      title: 'Baholash',
      roles: ['teacher'],
      icon: 'graduation-cap'
    }
  },
  {
    path: 'teacher/attendance',
    name: 'TeacherAttendance',
    component: TeacherAttendance,
    meta: {
      title: 'Davomat',
      roles: ['teacher'],
      icon: 'check-circle'
    }
  },
  {
    path: 'teacher/materials',
    name: 'TeacherMaterials',
    component: TeacherMaterials,
    meta: {
      title: 'O\'quv materiallari',
      roles: ['teacher'],
      icon: 'file-text'
    }
  }
];

// Teacher navigation menu items
export const teacherMenuItems = [
  {
    title: 'Bosh sahifa',
    route: '/dashboard',
    icon: 'home'
  },
  {
    title: 'Mening kurslarim',
    route: '/dashboard/teacher/courses',
    icon: 'book-open'
  },
  {
    title: 'Topshiriqlar',
    route: '/dashboard/teacher/assignments',
    icon: 'list'
  },
  {
    title: 'O\'quvchilar',
    route: '/dashboard/teacher/students',
    icon: 'users'
  },
  {
    title: 'Dars jadvali',
    route: '/dashboard/teacher/schedule',
    icon: 'calendar'
  },
  {
    title: 'Baholash',
    route: '/dashboard/teacher/grades',
    icon: 'graduation-cap'
  },
  {
    title: 'Davomat',
    route: '/dashboard/teacher/attendance',
    icon: 'check-circle'
  },
  {
    title: 'O\'quv materiallari',
    route: '/dashboard/teacher/materials',
    icon: 'file-text'
  }
];
