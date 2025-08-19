import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Teacher } from '@/types'
import { adminService } from '@/services/api'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTeachers() {
    loading.value = true
    error.value = null

    try {
      // Get users with teacher role
      const response = await adminService.getUsers(1, 100, '', 'teacher')

      if (response.data && Array.isArray(response.data)) {
        // Transform users to teachers format
        teachers.value = response.data.map((user: any) => ({
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
          birthDate: user.birthDate || '1990-01-01',
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
        birthDate: teacherData.birthDate || '1990-01-01',
        password: '$2a$12$pqOE2Wgh/FNkvcQrM2FnJeu07TfUzaVumINbByvyN.nveQnrUV7IC.' // Default password hash
      }

      await adminService.createUser(userData)
      await fetchTeachers() // Refresh the list
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
        qualification: teacherData.qualification || 'Master',
        birthDate: teacherData.birthDate
      }

      await adminService.updateUser(id, userData)
      await fetchTeachers() // Refresh the list
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
      await adminService.deleteUser(id)
      await fetchTeachers() // Refresh the list
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