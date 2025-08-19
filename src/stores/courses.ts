import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course } from '@/types'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCourses() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('http://localhost:3001/api/courses')
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        // Transform the course data to match our Course interface
        courses.value = data.data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          teacher_id: course.teacher_id || 0,
          teacher_name: course.instructor || course.teacher_name,
          subject: course.subject,
          duration: course.duration,
          price: course.price,
          students_count: course.students || course.students_count,
          rating: course.rating,
          color: course.color,
          icon: course.icon,
          status: course.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      }
    } catch (err) {
      error.value = 'Failed to fetch courses'
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }

  async function createCourse(courseData: Partial<Course>) {
    loading.value = true
    error.value = null
    
    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        teacher_id: courseData.teacher_id,
        teacher_name: courseData.teacher_name,
        subject: courseData.subject,
        duration: courseData.duration,
        price: courseData.price,
        students_count: courseData.students_count || 0,
        rating: courseData.rating || 4.5,
        color: courseData.color || '#4361ee',
        icon: courseData.icon || 'book',
        status: courseData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const response = await fetch('http://localhost:3001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchCourses() // Refresh the list
      } else {
        throw new Error('Failed to create course')
      }
    } catch (err) {
      error.value = 'Failed to create course'
      console.error('Error creating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCourse(id: number, courseData: Partial<Course>) {
    loading.value = true
    error.value = null
    
    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        teacher_id: courseData.teacher_id,
        teacher_name: courseData.teacher_name,
        subject: courseData.subject,
        duration: courseData.duration,
        price: courseData.price,
        students_count: courseData.students_count,
        rating: courseData.rating,
        color: courseData.color,
        icon: courseData.icon,
        status: courseData.status,
        updated_at: new Date().toISOString()
      }

      const response = await fetch(`http://localhost:3001/api/courses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchCourses() // Refresh the list
      } else {
        throw new Error('Failed to update course')
      }
    } catch (err) {
      error.value = 'Failed to update course'
      console.error('Error updating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCourse(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`http://localhost:3001/api/courses/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCourses() // Refresh the list
      } else {
        throw new Error('Failed to delete course')
      }
    } catch (err) {
      error.value = 'Failed to delete course'
      console.error('Error deleting course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse
  }
})