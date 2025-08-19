<template>
  <div class="ai-chatbot fixed bottom-4 left-4 z-50">
    <!-- Chat toggle button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      :class="[
        'w-14 h-14 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300',
        isProcessing ? 'bg-orange-500 animate-pulse' : 'bg-purple-500 hover:bg-purple-600'
      ]"
      :title="isProcessing ? 'AI javob bermoqda...' : 'AI yordamchini ochish'"
      :aria-label="isProcessing ? 'Javob kutilmoqda' : 'AI yordamchi'"
    >
      <component 
        :is="isProcessing ? Loader : Bot" 
        :class="[
          'w-7 h-7 text-white mx-auto',
          isProcessing && 'animate-spin'
        ]" 
      />
    </button>

    <!-- Chat window -->
    <div 
      v-if="isOpen"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border w-80 h-96 flex flex-col"
      role="dialog"
      aria-labelledby="chatbot-title"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <Bot class="w-6 h-6 text-purple-500" />
          <h3 id="chatbot-title" class="font-semibold text-gray-800 dark:text-white">
            AI Yordamchi
          </h3>
          <span 
            v-if="isProcessing"
            class="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full"
          >
            Javob bermoqda...
          </span>
        </div>
        
        <div class="flex items-center space-x-1">
          <!-- Settings -->
          <button
            @click="showSettings = !showSettings"
            class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
            title="Sozlamalar"
          >
            <Settings class="w-4 h-4" />
          </button>
          
          <!-- Close -->
          <button
            @click="toggleChat"
            class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
            title="Yopish"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Settings panel -->
      <div 
        v-if="showSettings" 
        class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
      >
        <div class="space-y-2">
          <!-- Language -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-gray-600 dark:text-gray-400">Til:</label>
            <select 
              :value="settings.language"
              @change="updateSetting('language', ($event.target as HTMLSelectElement).value)"
              class="text-xs p-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="uz">O'zbek</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <!-- Response length -->
          <div class="flex items-center justify-between">
            <label class="text-xs text-gray-600 dark:text-gray-400">Javob:</label>
            <select 
              :value="settings.responseLength"
              @change="updateSetting('responseLength', ($event.target as HTMLSelectElement).value)"
              class="text-xs p-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="short">Qisqa</option>
              <option value="medium">O'rtacha</option>
              <option value="detailed">Batafsil</option>
            </select>
          </div>

          <!-- Voice toggle -->
          <label class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">Ovozli javob:</span>
            <button
              @click="updateSetting('voiceEnabled', !settings.voiceEnabled)"
              :class="[
                'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none',
                settings.voiceEnabled ? 'bg-purple-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.voiceEnabled"
            >
              <span 
                :class="[
                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                  settings.voiceEnabled ? 'translate-x-4' : 'translate-x-0.5'
                ]"
              />
            </button>
          </label>
        </div>
      </div>

      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-3 space-y-3"
      >
        <!-- Welcome message -->
        <div 
          v-if="messages.length === 0"
          class="text-center text-gray-500 dark:text-gray-400 text-sm py-8"
        >
          <Bot class="w-12 h-12 mx-auto mb-3 text-purple-300" />
          <p>Salom! Men sizga yordam berish uchun shu yerdaman.</p>
          <p class="mt-2 text-xs">Savol bering yoki "yordam" deb yozing.</p>
        </div>

        <!-- Message list -->
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[80%] p-3 rounded-lg text-sm',
              message.role === 'user' 
                ? 'bg-purple-500 text-white rounded-br-none' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none'
            ]"
          >
            <!-- Message content -->
            <div class="whitespace-pre-wrap">{{ message.content }}</div>
            
            <!-- Action button (agar navigatsiya taklif qilingan bo'lsa) -->
            <div 
              v-if="message.role === 'assistant' && message.content.includes('📍')"
              class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"
            >
              <button
                @click="executeNavigation(message.content)"
                class="text-xs bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded transition-colors"
              >
                O'tish
              </button>
            </div>
            
            <!-- Timestamp -->
            <div 
              :class="[
                'text-xs mt-1 opacity-70',
                message.role === 'user' ? 'text-right' : 'text-left'
              ]"
            >
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div 
          v-if="isProcessing"
          class="flex justify-start"
        >
          <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <!-- Quick commands -->
        <div class="flex flex-wrap gap-1 mb-2">
          <button
            v-for="cmd in quickCommands"
            :key="cmd.text"
            @click="sendQuickCommand(cmd.text)"
            class="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
            :title="cmd.description"
          >
            {{ cmd.text }}
          </button>
        </div>

        <!-- Input form -->
        <form @submit.prevent="sendMessage" class="flex space-x-2">
          <div class="flex-1 relative">
            <input
              v-model="inputMessage"
              :disabled="isProcessing"
              type="text"
              placeholder="Savol bering..."
              class="w-full p-2 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              :aria-label="isProcessing ? 'Javob kutilmoqda' : 'Xabar yozing'"
            />
            
            <!-- Voice input button -->
            <button
              v-if="settings.voiceEnabled"
              type="button"
              @click="startVoiceInput"
              :disabled="isProcessing || isListening"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-purple-500 disabled:opacity-50"
              :title="isListening ? 'Tinglamoqda...' : 'Ovoz bilan yozing'"
            >
              <component 
                :is="isListening ? MicOff : Mic" 
                :class="[
                  'w-4 h-4',
                  isListening && 'text-red-500 animate-pulse'
                ]" 
              />
            </button>
          </div>
          
          <button
            type="submit"
            :disabled="!inputMessage.trim() || isProcessing"
            class="p-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed"
            :aria-label="isProcessing ? 'Javob kutilmoqda' : 'Xabar yuborish'"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Bot, X, Settings, Send, Mic, MicOff, Loader } from 'lucide-vue-next'
import aiAssistantService, { type ChatMessage, type AssistantSettings } from '@/services/aiAssistant'

// Router
const router = useRouter()

// Reactive state
const isOpen = ref(false)
const showSettings = ref(false)
const inputMessage = ref('')
const isProcessing = ref(false)
const isListening = ref(false)
const messages = ref<ChatMessage[]>([])
const settings = ref<AssistantSettings>(aiAssistantService.getSettings())
const messagesContainer = ref<HTMLElement>()

// Quick commands
const quickCommands = ref([
  { text: 'yordam', description: 'Umumiy yordam' },
  { text: 'bosh sahifa', description: 'Bosh sahifaga o\'tish' },
  { text: 'profil', description: 'Profilga o\'tish' },
  { text: 'kurslar', description: 'Kurslarga o\'tish' }
])

/**
 * Component lifecycle
 */
onMounted(() => {
  messages.value = aiAssistantService.getMessages()
  
  // Klaviatura shortcuts
  document.addEventListener('keydown', handleKeydown)
  
  // Welcome message qo'shish (agar bo'sh bo'lsa)
  if (messages.value.length === 0) {
    addWelcomeMessage()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

/**
 * Messages scroll qilish
 */
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

/**
 * Chat ochish/yopish
 */
const toggleChat = (): void => {
  isOpen.value = !isOpen.value
  showSettings.value = false
  
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

/**
 * Xabar yuborish
 */
const sendMessage = async (): Promise<void> => {
  const message = inputMessage.value.trim()
  if (!message || isProcessing.value) return

  inputMessage.value = ''
  isProcessing.value = true

  try {
    await aiAssistantService.askQuestion(message)
    messages.value = aiAssistantService.getMessages()
  } catch (error) {
    console.error('AI assistant xatosi:', error)
  } finally {
    isProcessing.value = false
  }
}

/**
 * Tezkor buyruq yuborish
 */
const sendQuickCommand = async (command: string): Promise<void> => {
  if (isProcessing.value) return

  isProcessing.value = true

  try {
    const result = await aiAssistantService.processQuickCommand(command)
    
    // Foydalanuvchi xabarini qo'shish
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: command,
      timestamp: new Date(),
      type: 'text'
    };
    
    // Assistant javobini qo'shish
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.message,
      timestamp: new Date(),
      type: 'text'
    };

    messages.value.push(userMessage, assistantMessage)

    // Navigatsiya (agar kerak bo'lsa)
    if (result.action) {
      setTimeout(() => {
        router.push(result.action!)
      }, 1000)
    }
  } catch (error) {
    console.error('Quick command xatosi:', error)
  } finally {
    isProcessing.value = false
  }
}

/**
 * Ovoz bilan kiritish
 */
const startVoiceInput = async (): Promise<void> => {
  if (isListening.value || !settings.value.voiceEnabled) return

  isListening.value = true

  try {
    const transcript = await aiAssistantService.startVoiceInput()
    inputMessage.value = transcript
  } catch (error) {
    console.error('Ovoz tanish xatosi:', error)
  } finally {
    isListening.value = false
  }
}

/**
 * Navigatsiya bajarish
 */
const executeNavigation = (messageContent: string): void => {
  // Message'dan route'ni ajratib olish
  const routeMatch = messageContent.match(/\/dashboard[^\s]*/);
  if (routeMatch) {
    router.push(routeMatch[0])
    toggleChat() // Chat'ni yopish
  }
}

/**
 * Sozlamani yangilash
 */
const updateSetting = <K extends keyof AssistantSettings>(
  key: K, 
  value: AssistantSettings[K]
): void => {
  settings.value[key] = value
  aiAssistantService.updateSettings({ [key]: value })
}

/**
 * Vaqtni formatlash
 */
const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Scroll to bottom
 */
const scrollToBottom = (): void => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

/**
 * Welcome message qo'shish
 */
const addWelcomeMessage = (): void => {
  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: 'Salom! Men IQSpace AI yordamchisiman. Sizga navigatsiya, kurslar va tizim haqida yordam bera olaman. Nima bilan yordam kerak?',
    timestamp: new Date(),
    type: 'system'
  }
  
  messages.value.push(welcomeMessage)
}

/**
 * Klaviatura shortcuts
 */
const handleKeydown = (event: KeyboardEvent): void => {
  // Ctrl + Shift + A - AI assistant toggle
  if (event.ctrlKey && event.shiftKey && event.key === 'A') {
    event.preventDefault()
    toggleChat()
  }
  
  // Escape - close chat
  if (event.key === 'Escape' && isOpen.value) {
    toggleChat()
  }
}

/**
 * Chat tozalash
 */
const clearChat = (): void => {
  aiAssistantService.clearChat()
  messages.value = []
  addWelcomeMessage()
}
</script>

<style scoped>
.ai-chatbot {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

/* Animation for chat opening */
.ai-chatbot > div {
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Message animations */
.ai-chatbot .space-y-3 > div {
  animation: fadeInMessage 0.3s ease;
}

@keyframes fadeInMessage {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Typing animation */
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .ai-chatbot button,
  .ai-chatbot input {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ai-chatbot *,
  .ai-chatbot *::before,
  .ai-chatbot *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
