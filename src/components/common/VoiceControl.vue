<template>
  <div class="voice-control fixed bottom-4 right-4 z-50">
    <!-- Ovoz tugmasi -->
    <div class="relative">
      <button
        @click="toggleListening"
        :class="[
          'w-16 h-16 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300',
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        ]"
        :aria-label="isListening ? 'Ovozni to\'xtatish' : 'Ovoz bilan boshqarish'"
        :title="isListening ? 'Tinglashni to\'xtatish' : 'Ovoz bilan boshqarish'"
      >
        <component 
          :is="isListening ? MicOff : Mic" 
          class="w-8 h-8 text-white mx-auto" 
        />
      </button>
      
      <!-- Listening animatsiya -->
      <div 
        v-if="isListening" 
        class="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"
      ></div>
    </div>

    <!-- Ovoz buyruqlari ko'rsatkich -->
    <div 
      v-if="showCommands" 
      class="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 max-h-96 overflow-y-auto"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Ovoz buyruqlari
        </h3>
        <button 
          @click="showCommands = false"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Yopish"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="space-y-2 text-sm">
        <div class="font-medium text-gray-700 dark:text-gray-300">Navigatsiya:</div>
        <div class="space-y-1 text-gray-600 dark:text-gray-400">
          <div>• "Bosh sahifa" - Asosiy sahifaga o'tish</div>
          <div v-if="userRole === 'teacher'">• "Kurslarimga o't" - Kurslar sahifasiga o'tish</div>
          <div v-if="userRole === 'teacher'">• "O'quvchilar" - O'quvchilar ro'yxati</div>
          <div v-if="userRole === 'teacher'">• "Topshiriqlar" - Topshiriqlar sahifasi</div>
          <div v-if="userRole === 'teacher'">• "Dars jadvali" - Jadval ko'rish</div>
          <div v-if="userRole === 'teacher'">• "Baholash" - Baholar sahifasi</div>
          <div v-if="userRole === 'student'">• "Kurslarim" - Mening kurslarim</div>
          <div v-if="userRole === 'student'">• "Topshiriqlarim" - Mening topshiriqlarim</div>
          <div v-if="userRole === 'student'">• "Baholarim" - Mening baholarim</div>
          <div v-if="userRole === 'student'">• "To'lovlar" - To'lov ma'lumotlari</div>
          <div>• "Profil" - Profil sahifasi</div>
          <div>• "Xabarlar" - Xabarlar sahifasi</div>
        </div>
        
        <div class="font-medium text-gray-700 dark:text-gray-300 mt-3">Boshqaruv:</div>
        <div class="space-y-1 text-gray-600 dark:text-gray-400">
          <div>• "Yordam" - Barcha buyruqlarni ko'rish</div>
          <div>• "To'xtat" - Ovozni to'xtatish</div>
        </div>
      </div>
    </div>

    <!-- Feedback -->
    <div 
      v-if="feedback" 
      class="absolute bottom-20 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
    >
      {{ feedback }}
    </div>

    <!-- Xato xabari -->
    <div 
      v-if="error" 
      class="absolute bottom-20 right-0 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      {{ error }}
    </div>

    <!-- Oxirgi buyruq -->
    <div 
      v-if="lastCommand && isListening" 
      class="absolute bottom-20 right-0 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Tinglayapman: "{{ lastCommand }}"
    </div>

    <!-- Yordam tugmasi -->
    <button
      @click="showCommands = !showCommands"
      class="mt-2 w-16 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      aria-label="Yordam"
      title="Ovoz buyruqlari ro'yxati"
    >
      <HelpCircle class="w-5 h-5 mx-auto" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mic, MicOff, X, HelpCircle } from 'lucide-vue-next'

// Reactive state
const isListening = ref(false)
const lastCommand = ref('')
const feedback = ref('')
const error = ref('')
const showCommands = ref(false)
const speechSupported = ref(true)

// Speech recognition reference
let recognition: any = null

// Router va Store
const router = useRouter()
const authStore = useAuthStore()

// User role olish
const userRole = computed(() => {
  return authStore.userRole || 'student'
})

// Voice commands mapping
const voiceCommands = {
  // Umumiy navigatsiya
  'bosh sahifa': '/dashboard',
  'asosiy sahifa': '/dashboard',
  'bosh sahifaga o\'t': '/dashboard',
  'dashboard': '/dashboard',
  'profil': '/dashboard/profile',
  'profilga o\'t': '/dashboard/profile',
  'xabarlar': '/dashboard/messages',
  'xabarlarga o\'t': '/dashboard/messages',
  
  // O'qituvchi buyruqlari
  'kurslarimga o\'t': '/dashboard/teacher/courses',
  'kurslarim': '/dashboard/teacher/courses',
  'mening kurslarim': '/dashboard/teacher/courses',
  'o\'quvchilar': '/dashboard/teacher/students',
  'o\'quvchilarga o\'t': '/dashboard/teacher/students',
  'talabalar': '/dashboard/teacher/students',
  'topshiriqlar': '/dashboard/teacher/assignments',
  'topshiriqlarga o\'t': '/dashboard/teacher/assignments',
  'dars jadvali': '/dashboard/teacher/schedule',
  'jadval': '/dashboard/teacher/schedule',
  'jadvalgao\'t': '/dashboard/teacher/schedule',
  'baholash': '/dashboard/teacher/grades',
  'baholar': '/dashboard/teacher/grades',
  'baholarga o\'t': '/dashboard/teacher/grades',
  'davomat': '/dashboard/teacher/attendance',
  'davomatga o\'t': '/dashboard/teacher/attendance',
  'materiallar': '/dashboard/teacher/materials',
  'o\'quv materiallari': '/dashboard/teacher/materials',
  
  // Talaba buyruqlari
  'kurslarim': '/dashboard/student/courses',
  'mening kurslarim': '/dashboard/student/courses',
  'topshiriqlarim': '/dashboard/student/assignments',
  'mening topshiriqlarim': '/dashboard/student/assignments',
  'baholarim': '/dashboard/student/grades',
  'mening baholarim': '/dashboard/student/grades',
  'to\'lovlar': '/dashboard/student/payments',
  'to\'lovlarga o\'t': '/dashboard/student/payments',
  'sertifikatlar': '/dashboard/student/certificates',
  'sertifikatlarga o\'t': '/dashboard/student/certificates',
  'mening davomatim': '/dashboard/student/attendance',
  'mening materilarim': '/dashboard/student/materials',
  
  // Boshqaruv buyruqlari
  'yordam': 'help',
  'qo\'llanma': 'help',
  'buyruqlar': 'help',
  'to\'xtat': 'stop',
  'to\'xtatish': 'stop',
  'yopish': 'stop'
}

// Speech recognition sozlash
const initializeSpeechRecognition = () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    speechSupported.value = false
    error.value = 'Brauzeringiz ovoz tanishni qo\'llab-quvvatlamaydi'
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'uz-UZ' // Uzbek tili
  
  recognition.onstart = () => {
    isListening.value = true
    error.value = ''
    feedback.value = 'Tinglayapman...'
  }
  
  recognition.onresult = (event: any) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    
    lastCommand.value = transcript.toLowerCase().trim()
    
    if (event.results[event.results.length - 1].isFinal) {
      processVoiceCommand(lastCommand.value)
    }
  }
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error)
    error.value = 'Ovoz tanishda xato yuz berdi'
    isListening.value = false
  }
  
  recognition.onend = () => {
    isListening.value = false
    lastCommand.value = ''
    if (feedback.value === 'Tinglayapman...') {
      feedback.value = ''
    }
  }
}

// Voice command ni qayta ishlash
const processVoiceCommand = (command: string) => {
  console.log('Voice command received:', command)
  
  // Buyruqni topish
  let matchedRoute = null
  let matchedCommand = null
  
  for (const [voiceCmd, route] of Object.entries(voiceCommands)) {
    if (command.includes(voiceCmd)) {
      matchedRoute = route
      matchedCommand = voiceCmd
      break
    }
  }
  
  if (matchedRoute) {
    if (matchedRoute === 'help') {
      showCommands.value = true
      feedback.value = 'Yordam oynasi ochildi'
    } else if (matchedRoute === 'stop') {
      stopListening()
      feedback.value = 'Ovoz tanish to\'xtatildi'
    } else {
      // Navigatsiya
      router.push(matchedRoute)
      feedback.value = `"${matchedCommand}" sahifasiga o'tildi`
      stopListening()
    }
  } else {
    error.value = 'Buyruq tushunilmadi. "Yordam" deb ayting'
  }
  
  // Feedback va error ni tozalash
  setTimeout(() => {
    feedback.value = ''
    error.value = ''
  }, 3000)
}

// Listening boshqarish
const toggleListening = () => {
  if (!speechSupported.value) {
    error.value = 'Ovoz tanish qo\'llab-quvvatlanmaydi'
    return
  }
  
  if (isListening.value) {
    stopListening()
  } else {
    startListening()
  }
}

const startListening = () => {
  if (recognition) {
    recognition.start()
  }
}

const stopListening = () => {
  if (recognition) {
    recognition.stop()
  }
  isListening.value = false
}

// Accessibility: Klaviatura shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl + Shift + V - Voice control toggle
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault()
    toggleListening()
  }
  
  // Ctrl + Shift + H - Help
  if (event.ctrlKey && event.shiftKey && event.key === 'H') {
    event.preventDefault()
    showCommands.value = !showCommands.value
  }
  
  // Escape - Close help or stop listening
  if (event.key === 'Escape') {
    if (showCommands.value) {
      showCommands.value = false
    } else if (isListening.value) {
      stopListening()
    }
  }
}

// Component lifecycle
onMounted(() => {
  initializeSpeechRecognition()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (recognition) {
    recognition.stop()
  }
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.voice-control {
  user-select: none;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .voice-control {
    color-scheme: dark;
  }
}

/* Accessibility improvements */
.voice-control button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation for better UX */
.voice-control .transition-all {
  transition: all 0.3s ease;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .voice-control button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .voice-control * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
