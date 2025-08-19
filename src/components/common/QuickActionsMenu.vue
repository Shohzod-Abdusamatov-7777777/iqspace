<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 bg-black bg-opacity-50" 
    @click="$emit('close')"
  >
    <div 
      class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl p-4 transform transition-transform duration-300"
      :class="show ? 'translate-y-0' : 'translate-y-full'"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          Tezkor amallar
        </h3>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Quick actions grid -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <button
          @click="navigate('/dashboard')"
          class="flex flex-col items-center p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Home class="w-6 h-6 mb-2" />
          <span class="text-sm">Bosh sahifa</span>
        </button>
        
        <button
          @click="navigate('/dashboard/profile')"
          class="flex flex-col items-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <User class="w-6 h-6 mb-2" />
          <span class="text-sm">Profil</span>
        </button>
        
        <button
          @click="navigate('/dashboard/teacher/courses')"
          class="flex flex-col items-center p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <BookOpen class="w-6 h-6 mb-2" />
          <span class="text-sm">Kurslar</span>
        </button>
        
        <button
          @click="navigate('/dashboard/messages')"
          class="flex flex-col items-center p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <MessageCircle class="w-6 h-6 mb-2" />
          <span class="text-sm">Xabarlar</span>
        </button>
      </div>

      <!-- Accessibility actions -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Accessibility
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="toggleVoice"
            class="flex flex-col items-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Mic class="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
            <span class="text-xs text-gray-600 dark:text-gray-300">Ovoz</span>
          </button>
          
          <button
            @click="toggleTTS"
            class="flex flex-col items-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Volume2 class="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
            <span class="text-xs text-gray-600 dark:text-gray-300">O'qish</span>
          </button>
          
          <button
            @click="toggleContrast"
            class="flex flex-col items-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Eye class="w-5 h-5 mb-1 text-gray-600 dark:text-gray-300" />
            <span class="text-xs text-gray-600 dark:text-gray-300">Kontrast</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  X, Home, User, BookOpen, MessageCircle, 
  Mic, Volume2, Eye 
} from 'lucide-vue-next'

// Props & Emits
interface Props {
  show: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Router
const router = useRouter()

/**
 * Navigation
 */
const navigate = (path: string): void => {
  router.push(path)
  emit('close')
}

/**
 * Accessibility toggles
 */
const toggleVoice = (): void => {
  // Voice control toggle logic
  const event = new CustomEvent('toggle-voice-control')
  document.dispatchEvent(event)
  emit('close')
}

const toggleTTS = (): void => {
  // TTS toggle logic
  const event = new CustomEvent('toggle-tts')
  document.dispatchEvent(event)
  emit('close')
}

const toggleContrast = (): void => {
  // Visual accessibility toggle logic
  const event = new CustomEvent('toggle-contrast')
  document.dispatchEvent(event)
  emit('close')
}
</script>

<style scoped>
/* Animation for smooth slide up */
.transition-transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Touch-friendly targets */
button {
  min-height: 44px;
  touch-action: manipulation;
}

/* Improved accessibility */
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .transition-transform {
    transition-duration: 0.01ms;
  }
}
</style>
