import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Teacher } from '@/types'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTeachers() {
    loading.value = true
    error.value = null
    
    try {
      // For now, we'll use mock data from the database users with role 'teacher'
      const response = await fetch('http://localhost:3001/api/users?role=teacher')
      const data = await response.json()
      
      if (data.success) {
        // Transform users to teachers format
        teachers.value = data.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          department: user.subjects ? user.subjects[0] : 'Umumiy',
          specialization: user.subjects ? user.subjects.join(', ') : 'Umumiy',
          experience: parseInt(user.experience?.replace(' yil', '') || '0'),
          status: user.status,
          bio: user.bio || '',
          rating: 4.5, // Default rating
          courses: Math.floor(Math.random() * 5) + 1, // Random course count
          students: Math.floor(Math.random() * 100) + 10, // Random student count
          birthDate: '1990-01-01', // Default birth date
          qualification: user.qualification || 'Master'
        }))
      }
    } catch (err) {
      error.value = 'Failed to fetch teachers'
      console.error('Error fetching teachers:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTeacher(teacherData: Partial<Teacher>) {
    loading.value = true
    error.value = null
    
    try {
      // Convert teacher data to user format for API
      const userData = {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        role: 'teacher',
        status: teacherData.status || 'active',
        avatar: teacherData.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'T',
        subjects: teacherData.specialization?.split(', ') || [],
        experience: `${teacherData.experience || 0} yil`,
        bio: teacherData.bio || '',
        qualification: teacherData.qualification || 'Master',
        created_at: new Date().toISOString(),
        password: '$2a$12$pqOE2Wgh/FNkvcQrM2FnJeu07TfUzaVumINbByvyN.nveQnrUV7IC.' // Default password hash
      }

      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        await fetchTeachers() // Refresh the list
      } else {
        throw new Error('Failed to create teacher')
      }
    } catch (err) {
      error.value = 'Failed to create teacher'
      console.error('Error creating teacher:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTeacher(id: number, teacherData: Partial<Teacher>) {
    loading.value = true
    error.value = null
    
    try {
      const userData = {
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        status: teacherData.status,
        subjects: teacherData.specialization?.split(', ') || [],
        experience: `${teacherData.experience || 0} yil`,
        bio: teacherData.bio || '',
        qualification: teacherData.qualification || 'Master'
      }

      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        await fetchTeachers() // Refresh the list
      } else {
        throw new Error('Failed to update teacher')
      }
    } catch (err) {
      error.value = 'Failed to update teacher'
      console.error('Error updating teacher:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTeacher(id: number) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchTeachers() // Refresh the list
      } else {
        throw new Error('Failed to delete teacher')
      }
    } catch (err) {
      error.value = 'Failed to delete teacher'
      console.error('Error deleting teacher:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
  }
})