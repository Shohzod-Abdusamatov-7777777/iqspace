<template>
  <div class="accessibility-demo min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <!-- Header -->
    <header class="max-w-6xl mx-auto mb-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        🌟 Complete Accessibility Suite Demo
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        IQSpace LMS loyihasi uchun to'liq accessibility yechimi
      </p>
    </header>

    <!-- Stats Cards -->
    <div class="max-w-6xl mx-auto mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div class="flex items-center">
            <Mic class="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Voice Control</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Ovoz bilan boshqarish</p>
            </div>
          </div>
          <div class="mt-4">
            <span :class="['px-2 py-1 text-xs rounded-full', voiceStatus.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600']">
              {{ voiceStatus.active ? 'Faol' : 'Nofaol' }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div class="flex items-center">
            <Volume2 class="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Text-to-Speech</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Matn o'qish</p>
            </div>
          </div>
          <div class="mt-4">
            <span :class="['px-2 py-1 text-xs rounded-full', ttsStatus.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600']">
              {{ ttsStatus.active ? 'O\'qilmoqda' : 'Kutilmoqda' }}
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div class="flex items-center">
            <Eye class="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Visual</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Ko'rish sozlamalari</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
              {{ visualSettings.fontSize }}% font
            </span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div class="flex items-center">
            <Bot class="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Virtual yordamchi</p>
            </div>
          </div>
          <div class="mt-4">
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
              {{ aiStats.messages }} xabar
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Sections -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column -->
      <div class="space-y-8">
        <!-- Voice Commands Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Mic class="w-6 h-6 mr-2 text-blue-500" />
            Ovoz buyruqlari sinovi
          </h2>
          
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-300">
              Quyidagi buyruqlarni ovoz bilan aytib ko'ring:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="command in voiceCommands"
                :key="command.text"
                @click="testVoiceCommand(command.text)"
                class="p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg text-left transition-colors"
              >
                <div class="font-medium text-gray-900 dark:text-white">
                  "{{ command.text }}"
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ command.description }}
                </div>
              </button>
            </div>

            <!-- Voice test result -->
            <div 
              v-if="voiceTestResult" 
              :class="[
                'p-4 rounded-lg',
                voiceTestResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              ]"
            >
              <div class="flex items-center">
                <component 
                  :is="voiceTestResult.success ? CheckCircle : XCircle" 
                  class="w-5 h-5 mr-2" 
                />
                {{ voiceTestResult.message }}
              </div>
            </div>
          </div>
        </section>

        <!-- Visual Accessibility Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Eye class="w-6 h-6 mr-2 text-purple-500" />
            Visual Accessibility sinovi
          </h2>
          
          <div class="space-y-4">
            <!-- Font size test -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font o'lchami: {{ testFontSize }}%
              </label>
              <input 
                v-model.number="testFontSize"
                @input="updateTestFontSize"
                type="range" 
                min="50" 
                max="300" 
                step="10"
                class="w-full"
              />
            </div>

            <!-- Contrast test -->
            <div class="space-y-2">
              <button
                @click="testContrast('normal')"
                :class="[
                  'w-full p-3 rounded-lg transition-colors',
                  testContrastMode === 'normal' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                ]"
              >
                Normal kontrast
              </button>
              <button
                @click="testContrast('high')"
                :class="[
                  'w-full p-3 rounded-lg transition-colors',
                  testContrastMode === 'high' 
                    ? 'bg-gray-900 text-white border-2 border-gray-900' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                ]"
              >
                Yuqori kontrast
              </button>
            </div>

            <!-- Sample text for testing -->
            <div 
              :style="{ fontSize: testFontSize + '%' }"
              :class="[
                'p-4 rounded-lg border',
                testContrastMode === 'high' 
                  ? 'bg-black text-white border-white' 
                  : 'bg-gray-50 text-gray-900 border-gray-200'
              ]"
            >
              <h3 class="font-bold mb-2">Test matni</h3>
              <p>
                Bu matn visual accessibility xususiyatlarini sinash uchun. 
                Font o'lchami va kontrast rejimini o'zgartiring.
              </p>
              <p class="mt-2 text-sm">
                <a href="#" class="underline hover:no-underline">
                  Bu havola misoli
                </a>
              </p>
            </div>
          </div>
        </section>

        <!-- Keyboard Navigation Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Keyboard class="w-6 h-6 mr-2 text-green-500" />
            Klaviatura navigatsiyasi sinovi
          </h2>
          
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-300">
              Tab tugmasi bilan quyidagi elementlar orasida harakat qiling:
            </p>
            
            <div class="grid grid-cols-2 gap-4">
              <button 
                class="p-3 bg-green-50 hover:bg-green-100 focus:bg-green-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                @focus="handleFocus('button1')"
              >
                Tugma 1
              </button>
              <button 
                class="p-3 bg-green-50 hover:bg-green-100 focus:bg-green-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                @focus="handleFocus('button2')"
              >
                Tugma 2
              </button>
              <input 
                type="text" 
                placeholder="Matn kiritish"
                class="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                @focus="handleFocus('input')"
              />
              <select 
                class="p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                @focus="handleFocus('select')"
              >
                <option>Variant 1</option>
                <option>Variant 2</option>
              </select>
            </div>

            <div v-if="focusHistory.length > 0" class="mt-4">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                Focus tarixi:
              </h4>
              <ul class="text-sm text-gray-600 dark:text-gray-400">
                <li v-for="(item, index) in focusHistory.slice(-5)" :key="index">
                  {{ index + 1 }}. {{ item.element }} - {{ item.time }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- TTS Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Volume2 class="w-6 h-6 mr-2 text-blue-500" />
            Text-to-Speech sinovi
          </h2>
          
          <div class="space-y-4">
            <textarea
              v-model="ttsTestText"
              class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="O'qitilishi kerak bo'lgan matnni kiriting..."
            ></textarea>
            
            <div class="flex gap-3">
              <button
                @click="testTTS"
                :disabled="!ttsTestText.trim() || ttsStatus.active"
                class="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Play class="w-4 h-4 inline mr-2" />
                O'qish
              </button>
              <button
                @click="stopTTS"
                class="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Square class="w-4 h-4 inline mr-2" />
                To'xtat
              </button>
            </div>

            <!-- TTS Settings -->
            <div class="border-t pt-4">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">
                Ovoz sozlamalari:
              </h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Tezlik: {{ ttsSettings.rate.toFixed(1) }}x
                  </label>
                  <input 
                    v-model.number="ttsSettings.rate"
                    type="range" 
                    min="0.1" 
                    max="3" 
                    step="0.1"
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Balandlik: {{ ttsSettings.pitch.toFixed(1) }}
                  </label>
                  <input 
                    v-model.number="ttsSettings.pitch"
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- AI Assistant Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bot class="w-6 h-6 mr-2 text-purple-500" />
            AI Assistant sinovi
          </h2>
          
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-300">
              AI yordamchini sinash uchun savol bering:
            </p>
            
            <div class="space-y-3">
              <button
                v-for="question in aiTestQuestions"
                :key="question.text"
                @click="testAI(question.text)"
                :disabled="aiStatus.processing"
                class="w-full p-3 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-100 rounded-lg text-left transition-colors disabled:cursor-not-allowed"
              >
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ question.text }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ question.description }}
                </div>
              </button>
            </div>

            <!-- AI Response -->
            <div 
              v-if="aiTestResponse"
              class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500"
            >
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                AI javobi:
              </h4>
              <p class="text-gray-700 dark:text-gray-300">
                {{ aiTestResponse }}
              </p>
            </div>

            <!-- Processing indicator -->
            <div 
              v-if="aiStatus.processing"
              class="flex items-center justify-center p-4 text-gray-500"
            >
              <Loader class="w-5 h-5 animate-spin mr-2" />
              AI javob bermoqda...
            </div>
          </div>
        </section>

        <!-- Mobile Accessibility Test -->
        <section class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Smartphone class="w-6 h-6 mr-2 text-green-500" />
            Mobil accessibility sinovi
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-700 dark:text-gray-300">Mobil qurilma:</span>
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                isMobile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              ]">
                {{ isMobile ? 'Ha' : 'Yo\'q' }}
              </span>
            </div>

            <div v-if="isMobile" class="space-y-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Quyidagi gesture'larni sinab ko'ring:
              </p>
              
              <div class="grid grid-cols-2 gap-2">
                <div class="p-3 bg-blue-50 rounded-lg text-center">
                  <div class="text-sm font-medium">← Chap Swipe</div>
                  <div class="text-xs text-gray-600">Orqaga</div>
                </div>
                <div class="p-3 bg-green-50 rounded-lg text-center">
                  <div class="text-sm font-medium">→ O'ng Swipe</div>
                  <div class="text-xs text-gray-600">Oldinga</div>
                </div>
                <div class="p-3 bg-purple-50 rounded-lg text-center">
                  <div class="text-sm font-medium">↑ Yuqori Swipe</div>
                  <div class="text-xs text-gray-600">Bosh</div>
                </div>
                <div class="p-3 bg-orange-50 rounded-lg text-center">
                  <div class="text-sm font-medium">↓ Pastga Swipe</div>
                  <div class="text-xs text-gray-600">Menyü</div>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 py-8">
              <Smartphone class="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Mobil qurilmada ochib, gesture'larni sinab ko'ring</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Test Results Summary -->
    <div class="max-w-6xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart class="w-6 h-6 mr-2 text-indigo-500" />
          Test natijalari
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-500">{{ testResults.voice }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Ovoz testlari</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">{{ testResults.tts }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">TTS testlari</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-500">{{ testResults.ai }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">AI testlari</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-500">{{ testResults.keyboard }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Klaviatura testlari</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  Mic, Volume2, Eye, Bot, Keyboard, Smartphone, BarChart,
  CheckCircle, XCircle, Play, Square, Loader
} from 'lucide-vue-next'

// Reactive state
const voiceStatus = reactive({ active: false })
const ttsStatus = reactive({ active: false })
const aiStatus = reactive({ processing: false })

const visualSettings = reactive({ fontSize: 100 })
const aiStats = reactive({ messages: 0 })

const testFontSize = ref(100)
const testContrastMode = ref('normal')
const ttsTestText = ref('Salom! Bu text-to-speech xususiyatini sinash uchun test matni.')
const ttsSettings = reactive({ rate: 1, pitch: 1 })

const voiceTestResult = ref<{ success: boolean; message: string } | null>(null)
const aiTestResponse = ref('')
const focusHistory = ref<{ element: string; time: string }[]>([])

const testResults = reactive({
  voice: 0,
  tts: 0,
  ai: 0,
  keyboard: 0
})

// Test data
const voiceCommands = ref([
  { text: 'bosh sahifa', description: 'Dashboard\'ga o\'tish' },
  { text: 'profil', description: 'Profilga o\'tish' },
  { text: 'kurslar', description: 'Kurslarga o\'tish' },
  { text: 'yordam', description: 'Yordam ko\'rsatish' }
])

const aiTestQuestions = ref([
  { text: 'Qanday qilib yangi kurs yarataman?', description: 'Akademik yordam' },
  { text: 'Bosh sahifaga qanday o\'taman?', description: 'Navigatsiya yordami' },
  { text: 'Mening baholarimni qayerdan ko\'raman?', description: 'Tizim ma\'lumotlari' }
])

// Computed
const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768
})

// Methods
const testVoiceCommand = (command: string): void => {
  voiceStatus.active = true
  
  setTimeout(() => {
    voiceStatus.active = false
    voiceTestResult.value = {
      success: true,
      message: `"${command}" buyruqi muvaffaqiyatli tanildi!`
    }
    testResults.voice++
    
    setTimeout(() => {
      voiceTestResult.value = null
    }, 3000)
  }, 1000)
}

const updateTestFontSize = (): void => {
  visualSettings.fontSize = testFontSize.value
}

const testContrast = (mode: string): void => {
  testContrastMode.value = mode
}

const testTTS = async (): Promise<void> => {
  if (!ttsTestText.value.trim()) return
  
  ttsStatus.active = true
  testResults.tts++
  
  try {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(ttsTestText.value)
      utterance.rate = ttsSettings.rate
      utterance.pitch = ttsSettings.pitch
      
      utterance.onend = () => {
        ttsStatus.active = false
      }
      
      speechSynthesis.speak(utterance)
    }
  } catch (error) {
    console.error('TTS xatosi:', error)
    ttsStatus.active = false
  }
}

const stopTTS = (): void => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
  ttsStatus.active = false
}

const testAI = async (question: string): Promise<void> => {
  aiStatus.processing = true
  testResults.ai++
  
  // Simulate AI response
  setTimeout(() => {
    const responses = {
      'Qanday qilib yangi kurs yarataman?': 'Yangi kurs yaratish uchun "Kurslar" bo\'limiga o\'ting va "Yangi kurs" tugmasini bosing. Keyin kurs ma\'lumotlarini to\'ldiring.',
      'Bosh sahifaga qanday o\'taman?': 'Bosh sahifaga o\'tish uchun "Bosh sahifa" tugmasini bosing yoki "bosh sahifa" deb ayting.',
      'Mening baholarimni qayerdan ko\'raman?': 'Baholaringizni ko\'rish uchun "Baholar" bo\'limiga o\'ting. U yerda barcha fanlar bo\'yicha baholaringiz ko\'rsatilgan.'
    }
    
    aiTestResponse.value = responses[question as keyof typeof responses] || 'Bu savol haqida ma\'lumot topilmadi.'
    aiStats.messages++
    aiStatus.processing = false
  }, 2000)
}

const handleFocus = (element: string): void => {
  const time = new Date().toLocaleTimeString('uz-UZ')
  focusHistory.value.push({ element, time })
  testResults.keyboard++
}

// Lifecycle
onMounted(() => {
  console.log('Accessibility Demo yuklandi')
})
</script>

<style scoped>
.accessibility-demo {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Test element animations */
.bg-blue-50:hover,
.bg-green-50:hover,
.bg-purple-50:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

/* Focus indicators for testing */
button:focus,
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* High contrast mode for testing */
.bg-black {
  background-color: #000 !important;
}

.text-white {
  color: #fff !important;
}

/* Custom range styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
}

/* Accessibility enhancements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-contrast: high) {
  .bg-white {
    background-color: #fff !important;
    border: 2px solid #000 !important;
  }
  
  .text-gray-900 {
    color: #000 !important;
  }
}
</style>
