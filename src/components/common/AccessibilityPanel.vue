<template>
  <div class="accessibility-panel fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
    <!-- Toggle tugma -->
    <button
      @click="isOpen = !isOpen"
      :class="[
        'w-12 h-12 rounded-r-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300',
        isOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
      ]"
      :title="isOpen ? 'Panelni yopish' : 'Accessibility panelini ochish'"
      :aria-label="isOpen ? 'Yopish' : 'Accessibility sozlamalari'"
      :aria-expanded="isOpen"
    >
      <component :is="isOpen ? X : Eye" class="w-6 h-6 text-white mx-auto" />
    </button>

    <!-- Panel -->
    <div 
      v-if="isOpen"
      class="absolute left-12 top-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-labelledby="accessibility-title"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 id="accessibility-title" class="text-lg font-semibold text-gray-800 dark:text-white">
          👁️ Ko'rish sozlamalari
        </h2>
        <button 
          @click="resetAllSettings"
          class="text-sm px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
          title="Barcha sozlamalarni reset qilish"
        >
          Reset
        </button>
      </div>

      <div class="space-y-6">
        <!-- Font o'lchami -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font o'lchami: {{ settings.fontSize }}%
          </label>
          <div class="flex items-center gap-2">
            <button
              @click="adjustFontSize(-10)"
              class="p-2 bg-red-500 hover:bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Font kichiklashtirish"
              aria-label="Font kichiklashtirish"
            >
              <Minus class="w-4 h-4" />
            </button>
            <input 
              :value="settings.fontSize"
              @input="updateFontSize"
              type="range" 
              min="50" 
              max="300" 
              step="10"
              class="flex-1"
              aria-label="Font o'lchami"
            />
            <button
              @click="adjustFontSize(10)"
              class="p-2 bg-green-500 hover:bg-green-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-300"
              title="Font kattalash"
              aria-label="Font kattalash"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Qator balandligi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Qator balandligi: {{ settings.lineHeight.toFixed(1) }}
          </label>
          <input 
            :value="settings.lineHeight"
            @input="e => updateSetting('lineHeight', parseFloat((e.target as HTMLInputElement).value))"
            type="range" 
            min="1" 
            max="3" 
            step="0.1"
            class="w-full"
            aria-label="Qator balandligi"
          />
        </div>

        <!-- Harflar orasidagi masofa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Harflar orasidagi masofa: {{ settings.letterSpacing }}px
          </label>
          <input 
            :value="settings.letterSpacing"
            @input="e => updateSetting('letterSpacing', parseInt((e.target as HTMLInputElement).value))"
            type="range" 
            min="0" 
            max="10" 
            step="1"
            class="w-full"
            aria-label="Harflar orasidagi masofa"
          />
        </div>

        <!-- Kontrast rejimi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kontrast rejimi:
          </label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                :checked="settings.contrast === 'normal'"
                @change="updateSetting('contrast', 'normal')"
                class="w-4 h-4"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Oddiy</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                :checked="settings.contrast === 'high'"
                @change="updateSetting('contrast', 'high')"
                class="w-4 h-4"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Yuqori kontrast</span>
            </label>
            <label class="flex items-center space-x-2">
              <input 
                type="radio" 
                :checked="settings.contrast === 'dark'"
                @change="updateSetting('contrast', 'dark')"
                class="w-4 h-4"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Qorong'u rejim</span>
            </label>
          </div>
        </div>

        <!-- Rang ko'rish buzilishi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rang ko'rish rejimi:
          </label>
          <select 
            :value="settings.colorBlindMode"
            @change="e => updateSetting('colorBlindMode', (e.target as HTMLSelectElement).value as any)"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="none">Oddiy</option>
            <option value="protanopia">Protanopia (qizil-yashil)</option>
            <option value="deuteranopia">Deuteranopia (yashil-qizil)</option>
            <option value="tritanopia">Tritanopia (ko'k-sariq)</option>
          </select>
        </div>

        <!-- Toggle sozlamalari -->
        <div class="space-y-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Qo'shimcha sozlamalar:
          </h3>
          
          <!-- O'qish rejimi -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">O'qish rejimi</span>
            <button
              @click="updateSetting('readingMode', !settings.readingMode)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.readingMode ? 'bg-blue-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.readingMode"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.readingMode ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </label>

          <!-- Havolalarni ajratib ko'rsatish -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Havolalarni ajratish</span>
            <button
              @click="updateSetting('highlightLinks', !settings.highlightLinks)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.highlightLinks ? 'bg-blue-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.highlightLinks"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.highlightLinks ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </label>

          <!-- Animatsiyalarni kamaytirish -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Animatsiyalarni kamaytirish</span>
            <button
              @click="updateSetting('reducedMotion', !settings.reducedMotion)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.reducedMotion"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </label>

          <!-- Focus indikatori -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Focus ko'rsatkichi</span>
            <button
              @click="updateSetting('focusIndicator', !settings.focusIndicator)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.focusIndicator ? 'bg-blue-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.focusIndicator"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.focusIndicator ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </label>

          <!-- Screen reader optimizatsiya -->
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700 dark:text-gray-300">Screen reader rejimi</span>
            <button
              @click="updateSetting('screenReader', !settings.screenReader)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                settings.screenReader ? 'bg-blue-600' : 'bg-gray-200'
              ]"
              role="switch"
              :aria-checked="settings.screenReader"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </label>
        </div>

        <!-- Kursor o'lchami -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kursor o'lchami:
          </label>
          <select 
            :value="settings.cursor"
            @change="e => updateSetting('cursor', (e.target as HTMLSelectElement).value as any)"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="normal">Oddiy</option>
            <option value="large">Katta</option>
            <option value="extra-large">Juda katta</option>
          </select>
        </div>

        <!-- Tezkor tugmalar -->
        <div class="border-t pt-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tezkor tugmalar:
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="quickToggleContrast"
              class="p-2 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
              title="Kontrast rejimini almashtirish"
            >
              Kontrast
            </button>
            <button
              @click="quickToggleReadingMode"
              class="p-2 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              title="O'qish rejimini almashtirish"
            >
              O'qish
            </button>
            <button
              @click="quickIncreaseFontSize"
              class="p-2 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
              title="Font kattalashtirish"
            >
              Font +
            </button>
            <button
              @click="quickDecreaseFontSize"
              class="p-2 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              title="Font kichiklashtirish"
            >
              Font -
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Eye, X, Plus, Minus } from 'lucide-vue-next'
import visualAccessibilityService, { type AccessibilitySettings } from '@/services/visualAccessibility'

// Reactive state
const isOpen = ref(false)
const settings = ref<AccessibilitySettings>(visualAccessibilityService.getSettings())

/**
 * Component lifecycle
 */
onMounted(() => {
  // Rang ko'rish buzilishi filtrlarini yaratish
  visualAccessibilityService.createColorBlindFilters()
  
  // Klaviatura shortcuts
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

/**
 * Sozlamani yangilash
 */
const updateSetting = <K extends keyof AccessibilitySettings>(
  key: K, 
  value: AccessibilitySettings[K]
) => {
  settings.value[key] = value
  visualAccessibilityService.updateSetting(key, value)
}

/**
 * Font o'lchamini yangilash
 */
const updateFontSize = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  updateSetting('fontSize', value)
}

/**
 * Font o'lchamini sozlash
 */
const adjustFontSize = (change: number) => {
  const newSize = Math.max(50, Math.min(300, settings.value.fontSize + change))
  updateSetting('fontSize', newSize)
}

/**
 * Barcha sozlamalarni reset qilish
 */
const resetAllSettings = () => {
  visualAccessibilityService.resetSettings()
  settings.value = visualAccessibilityService.getSettings()
}

/**
 * Tezkor togglelar
 */
const quickToggleContrast = () => {
  visualAccessibilityService.toggleContrast()
  settings.value = visualAccessibilityService.getSettings()
}

const quickToggleReadingMode = () => {
  visualAccessibilityService.toggleReadingMode()
  settings.value = visualAccessibilityService.getSettings()
}

const quickIncreaseFontSize = () => adjustFontSize(20)
const quickDecreaseFontSize = () => adjustFontSize(-20)

/**
 * Klaviatura shortcuts
 */
const handleKeydown = (event: KeyboardEvent) => {
  // Alt + A - Accessibility panel toggle
  if (event.altKey && event.key === 'a') {
    event.preventDefault()
    isOpen.value = !isOpen.value
  }
  
  // Alt + C - Contrast toggle
  if (event.altKey && event.key === 'c') {
    event.preventDefault()
    quickToggleContrast()
  }
  
  // Alt + R - Reading mode toggle
  if (event.altKey && event.key === 'r') {
    event.preventDefault()
    quickToggleReadingMode()
  }
  
  // Alt + = - Increase font size
  if (event.altKey && event.key === '=') {
    event.preventDefault()
    quickIncreaseFontSize()
  }
  
  // Alt + - - Decrease font size
  if (event.altKey && event.key === '-') {
    event.preventDefault()
    quickDecreaseFontSize()
  }
  
  // Escape - Close panel
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}
</script>

<style scoped>
.accessibility-panel {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom range slider styling */
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

/* Dark mode support */
.dark input[type="range"] {
  background: #4b5563;
}

/* Animation for panel */
.accessibility-panel > div {
  transition: all 0.3s ease;
}

/* High contrast mode overrides */
@media (prefers-contrast: high) {
  .accessibility-panel button,
  .accessibility-panel input,
  .accessibility-panel select {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .accessibility-panel * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
