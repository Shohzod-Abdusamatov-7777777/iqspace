<template>
  <!-- Voice Navigation Button -->
  <button
    v-if="speechSupported"
    @click="toggleVoiceRecognition"
    :class="[
      'voice-nav-button',
      { 'active': isListening, 'pulse': isListening }
    ]"
    :title="isListening ? 'Ovozni to\'xtatish' : 'Ovoz bilan boshqarish'"
    :aria-label="isListening ? 'Ovozni to\'xtatish' : 'Ovoz bilan boshqarish'"
  >
    <n-icon :size="24">
      <component :is="isListening ? MicOffIcon : MicIcon" />
    </n-icon>
  </button>
  
  <!-- Voice Status -->
  <div v-if="isListening" class="voice-status">
    <div class="voice-status-content">
      <n-icon :size="20" class="voice-status-icon">
        <MicIcon />
      </n-icon>
      <span>{{ voiceStatusMessage }}</span>
    </div>
  </div>
  
  <!-- Voice Results -->
  <div v-if="voiceResult" class="voice-result">
    <div class="voice-result-content">
      <span>{{ voiceResult }}</span>
    </div>
  </div>
  
  <!-- Voice Login Dialog -->
  <div v-if="isVoiceLoginMode" class="voice-login-dialog">
    <div class="voice-login-content">
      <h3>Ovoz bilan kirish</h3>
      <div class="voice-login-step">
        <p>{{ currentStepMessage }}</p>
        <div v-if="currentLoginData.phone" class="voice-data">
          <strong>Telefon:</strong> {{ currentLoginData.phone }}
        </div>
        <div v-if="currentLoginData.password" class="voice-data">
          <strong>Parol:</strong> {{ '*'.repeat(currentLoginData.password.length) }}
        </div>
      </div>
      <div class="voice-login-actions">
        <button @click="cancelVoiceLogin" class="voice-btn voice-btn-cancel">
          Bekor qilish
        </button>
        <button v-if="loginStep === 'confirm'" @click="confirmVoiceLogin" class="voice-btn voice-btn-confirm">
          Tasdiqlash
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage, NIcon } from "naive-ui";
import { MicIcon, MicOffIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { ttsService } from "@/services/tts";

// Props
interface Props {
  commands?: Record<string, string>;
  onCommand?: (command: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  commands: () => ({}),
});

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();

// Voice Recognition
const isListening = ref(false);
const voiceResult = ref("");
const recognition = ref<any>(null);
const speechSupported = ref(false);

// Voice Login State
const isVoiceLoginMode = ref(false);
const loginStep = ref<'phone' | 'phone-confirm' | 'password' | 'confirm'>('phone');
const currentLoginData = ref({ phone: '', password: '' });
const voiceStatusMessage = ref('Tinglayapman... Buyruq bering');
const currentStepMessage = ref('');

// Speech queue to prevent overlapping TTS
const speechQueue = ref<string[]>([]);
const isSpeaking = ref(false);

// Default voice commands mapping
const defaultVoiceCommands = {
  'dashboard': '/dashboard',
  'bosh sahifa': '/dashboard',
  'asosiy sahifa': '/dashboard',
  'main': '/dashboard',
  'home': '/dashboard',
  'kurslar': '/courses',
  'courses': '/courses',
  'profil': '/profile',
  'profile': '/profile',
  'sozlamalar': '/settings',
  'settings': '/settings',
  'admin': '/admin',
  'administrator': '/admin',
  'admin panel': '/admin',
  'o\'qituvchi': '/teacher',
  'teacher': '/teacher',
  'talaba': '/student',
  'student': '/student',
  'kirish': 'voice-login',
  'login': 'voice-login',
  'tizimga kir': 'voice-login',
  'ovoz bilan kirish': 'voice-login',
  'chiqish': 'logout',
  'logout': 'logout',
  'to\'xtat': 'stop',
  'stop': 'stop',
  'bekor qilish': 'cancel',
  'cancel': 'cancel',
  'tasdiqlash': 'confirm',
  'confirm': 'confirm',
  'ha': 'yes',
  'yes': 'yes',
  'to\'g\'ri': 'yes',
  'togri': 'yes',
  'yo\'q': 'no',
  'no': 'no',
  'yoq': 'no',
  'qaytadan': 'retry',
  'noto\'g\'ri': 'no',
  'notogri': 'no'
};

// Merge default commands with custom commands
const voiceCommands = { ...defaultVoiceCommands, ...props.commands };

// Text-to-Speech Functions
function speakText(text: string, priority = false) {
  if (priority) {
    // Clear queue and speak immediately for high priority messages
    speechQueue.value = [text];
    ttsService.stop();
    processSpeechQueue();
  } else {
    // Add to queue for normal messages
    speechQueue.value.push(text);
    if (!isSpeaking.value) {
      processSpeechQueue();
    }
  }
}

async function processSpeechQueue() {
  if (speechQueue.value.length === 0 || isSpeaking.value) {
    return;
  }
  
  isSpeaking.value = true;
  const text = speechQueue.value.shift()!;
  
  try {
    // Try to use Azure Neural Uzbek voice first
    await ttsService.speak(text, {
      rate: 0.8, // Natural speed for native Uzbek
      pitch: 1.0, // Normal pitch
      volume: 0.8,
      lang: 'uz-UZ', // Uzbek language
      voice: 'uz-UZ-SardorNeural' // Prefer Azure Neural Uzbek voice
    });
  } catch (error: any) {
    // Only log errors that aren't interruption-related
    if (!error?.message?.includes('interrupted') && !error?.message?.includes('canceled')) {
      console.error('TTS error:', error);
    }
  } finally {
    isSpeaking.value = false;
    // Process next item in queue
    if (speechQueue.value.length > 0) {
      setTimeout(processSpeechQueue, 200);
    }
  }
}

// Convert digits to Uzbek pronunciation
function convertDigitsToUzbek(phoneNumber: string): string {
  // Remove +998 prefix for pronunciation
  const cleanNumber = phoneNumber.replace('+998', '');
  
  const digitToUzbek = {
    '0': 'nol', '1': 'bir', '2': 'ikki', '3': 'uch', '4': 'to\'rt',
    '5': 'besh', '6': 'olti', '7': 'yetti', '8': 'sakkiz', '9': 'to\'qqiz'
  };
  
  // Convert each digit to Uzbek and group for readability
  let result = '';
  const digits = cleanNumber.split('');
  
  // Format: XX XXX XX XX (90 593 51 21)
  if (digits.length === 9) {
    // First two digits (operator code)
    const operator = digits[0] + digits[1];
    if (operator === '90') result += 'to\'qsonlik ';
    else if (operator === '91') result += 'to\'qson birlik ';
    else if (operator === '93') result += 'to\'qson uchlik ';
    else if (operator === '94') result += 'to\'qson to\'rtlik ';
    else if (operator === '95') result += 'to\'qson beshlik ';
    else if (operator === '97') result += 'to\'qson yettilik ';
    else if (operator === '98') result += 'to\'qson sakkizlik ';
    else if (operator === '99') result += 'to\'qson to\'qqizlik ';
    else {
      result += `${digitToUzbek[digits[0] as keyof typeof digitToUzbek]} ${digitToUzbek[digits[1] as keyof typeof digitToUzbek]}lik `;
    }
    
    // Next three digits
    const hundreds = digits[2];
    const tens = digits[3];
    const units = digits[4];
    
    if (hundreds !== '0') {
      result += `${digitToUzbek[hundreds as keyof typeof digitToUzbek]} yuz `;
    }
    
    const tensUnits = tens + units;
    if (tensUnits === '00') {
      // Skip if both are zero
    } else if (tens === '0') {
      result += `${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '1') {
      if (units === '0') result += 'o\'n ';
      else result += `o\'n ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '2') {
      if (units === '0') result += 'yigirma ';
      else result += `yigirma ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '3') {
      if (units === '0') result += 'o\'ttiz ';
      else result += `o\'ttiz ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '4') {
      if (units === '0') result += 'qirq ';
      else result += `qirq ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '5') {
      if (units === '0') result += 'ellik ';
      else result += `ellik ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '6') {
      if (units === '0') result += 'oltmish ';
      else result += `oltmish ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '7') {
      if (units === '0') result += 'yetmish ';
      else result += `yetmish ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '8') {
      if (units === '0') result += 'sakson ';
      else result += `sakson ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    } else if (tens === '9') {
      if (units === '0') result += 'to\'qson ';
      else result += `to\'qson ${digitToUzbek[units as keyof typeof digitToUzbek]} `;
    }
    
    // Last four digits (XX XX)
    const lastFour = digits.slice(5);
    const firstPair = lastFour[0] + lastFour[1];
    const secondPair = lastFour[2] + lastFour[3];
    
    // First pair
    result += convertTwoDigitsToUzbek(firstPair) + ' ';
    // Second pair  
    result += convertTwoDigitsToUzbek(secondPair);
  }
  
  return result.trim();
}

function convertTwoDigitsToUzbek(digits: string): string {
  const digitToUzbek = {
    '0': 'nol', '1': 'bir', '2': 'ikki', '3': 'uch', '4': 'to\'rt',
    '5': 'besh', '6': 'olti', '7': 'yetti', '8': 'sakkiz', '9': 'to\'qqiz'
  };
  
  if (digits.length !== 2) return digits;
  
  const tens = digits[0];
  const units = digits[1];
  
  if (tens === '0') {
    return digitToUzbek[units as keyof typeof digitToUzbek];
  } else if (tens === '1') {
    if (units === '0') return 'o\'n';
    else return `o\'n ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '2') {
    if (units === '0') return 'yigirma';
    else return `yigirma ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '3') {
    if (units === '0') return 'o\'ttiz';
    else return `o\'ttiz ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '4') {
    if (units === '0') return 'qirq';
    else return `qirq ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '5') {
    if (units === '0') return 'ellik';
    else return `ellik ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '6') {
    if (units === '0') return 'oltmish';
    else return `oltmish ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '7') {
    if (units === '0') return 'yetmish';
    else return `yetmish ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '8') {
    if (units === '0') return 'sakson';
    else return `sakson ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  } else if (tens === '9') {
    if (units === '0') return 'to\'qson';
    else return `to\'qson ${digitToUzbek[units as keyof typeof digitToUzbek]}`;
  }
  
  return digits;
}

// Complex Uzbek Number Parser
function parseComplexUzbekNumbers(text: string): string {
  let result = text;
  
  // Basic number mappings
  const basicNumbers = {
    'nol': '0', 'bir': '1', 'ikki': '2', 'uch': '3', 'to\'rt': '4', 'tort': '4',
    'besh': '5', 'olti': '6', 'yetti': '7', 'sakkiz': '8', 'to\'qqiz': '9', 'toqqiz': '9'
  };
  
  const tensNumbers = {
    'o\'n': '10', 'on': '10', 'yigirma': '20', 'o\'ttiz': '30', 'ottiz': '30',
    'qirq': '40', 'ellik': '50', 'oltmish': '60', 'yetmish': '70', 
    'sakson': '80', 'to\'qson': '90', 'toqson': '90'
  };
  
  // Handle hundreds first: "besh yuz" -> "500"
  result = result.replace(/(\w+)\s+yuz/g, (match, num) => {
    const digit = basicNumbers[num as keyof typeof basicNumbers];
    return digit ? (digit + '00') : match;
  });
  
  // Handle "yuz" by itself -> "100"
  result = result.replace(/\byuz\b/g, '100');
  
  // Handle "ming" (thousand) patterns: "bir ming" -> "1000"
  result = result.replace(/(\w+)\s+ming/g, (match, num) => {
    const digit = basicNumbers[num as keyof typeof basicNumbers];
    return digit ? (digit + '000') : match;
  });
  
  // Handle "ming" by itself -> "1000"
  result = result.replace(/\bming\b/g, '1000');
  
  // Handle complex combinations like "to'qsonlik" -> "90"
  result = result.replace(/(\w+)lik/g, (match, base) => {
    const digit = tensNumbers[base as keyof typeof tensNumbers];
    return digit || match;
  });
  
  // Handle tens + units combinations: "ellik uch" -> "53"
  Object.entries(tensNumbers).forEach(([tensWord, tensValue]) => {
    Object.entries(basicNumbers).forEach(([unitWord, unitValue]) => {
      const pattern = new RegExp(`\\b${tensWord}\\s+${unitWord}\\b`, 'g');
      const combinedValue = parseInt(tensValue) + parseInt(unitValue);
      result = result.replace(pattern, combinedValue.toString());
    });
  });
  
  // Handle twenty-style combinations: "yigirma bir" -> "21"
  const twentyPatterns = {
    'yigirma': 20, 'o\'ttiz': 30, 'ottiz': 30, 'qirq': 40, 'ellik': 50,
    'oltmish': 60, 'yetmish': 70, 'sakson': 80, 'to\'qson': 90, 'toqson': 90
  };
  
  Object.entries(twentyPatterns).forEach(([word, value]) => {
    Object.entries(basicNumbers).forEach(([unitWord, unitValue]) => {
      const pattern = new RegExp(`\\b${word}\\s+${unitWord}\\b`, 'g');
      const combinedValue = value + parseInt(unitValue);
      result = result.replace(pattern, combinedValue.toString());
    });
  });
  
  // Replace remaining basic numbers
  Object.entries({ ...basicNumbers, ...tensNumbers }).forEach(([word, digit]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    result = result.replace(regex, digit);
  });
  
  console.log(`Number parsing: "${text}" -> "${result}"`);
  return result;
}

// Phone Number Parsing Function
function parsePhoneNumber(text: string): string | null {
  console.log('Processing phone input:', text);
  
  // Normalize text for processing
  let normalized = text.toLowerCase().trim();
  
  // First, handle complex Uzbek number patterns
  normalized = parseComplexUzbekNumbers(normalized);
  
  console.log('After complex parsing:', normalized);
  
  // Extract all digits from the text
  const digits = normalized.match(/\d/g);
  if (!digits) {
    console.log('No digits found after parsing');
    return null;
  }
  
  const phoneDigits = digits.join('');
  console.log('Extracted digits:', phoneDigits);
  
  // Handle different phone number formats
  let cleanPhone = '';
  
  if (phoneDigits.length >= 9) {
    if (phoneDigits.startsWith('998')) {
      // Full format: 998XXXXXXXXX
      cleanPhone = phoneDigits.substring(0, 12);
    } else if (phoneDigits.startsWith('8')) {
      // Format: 8XXXXXXXXX (remove leading 8, add 998)
      cleanPhone = '998' + phoneDigits.substring(1, 10);
    } else if (phoneDigits.length === 9) {
      // Format: XXXXXXXXX (add 998 prefix)
      cleanPhone = '998' + phoneDigits;
    } else if (phoneDigits.length >= 10 && !phoneDigits.startsWith('998')) {
      // Format: XXXXXXXXXX (take last 9 digits and add 998)
      cleanPhone = '998' + phoneDigits.substring(phoneDigits.length - 9);
    } else {
      cleanPhone = phoneDigits.substring(0, 12);
    }
  }
  
  // Validate the phone number
  if (cleanPhone.length === 12 && cleanPhone.startsWith('998')) {
    // Check if it's a valid Uzbek mobile number
    const operatorCode = cleanPhone.substring(3, 5);
    const validCodes = ['90', '91', '93', '94', '95', '97', '98', '99', '88', '77', '33'];
    
    if (validCodes.includes(operatorCode)) {
      return '+' + cleanPhone;
    }
  }
  
  return null;
}

// Voice Login Functions
function startVoiceLogin() {
  isVoiceLoginMode.value = true;
  loginStep.value = 'phone';
  currentLoginData.value = { phone: '', password: '' };
  updateStepMessage();
  speakText('Ovoz bilan kirish boshlandi. Telefon raqamingizni ayting. Masalan: to\'qsonlik besh yuz ellik uch ellik ikki yigirma bir.', true);
  
  // Auto-start listening for phone number
  setTimeout(() => {
    if (recognition.value && !isListening.value) {
      recognition.value.start();
    }
  }, 1000);
}

function updateStepMessage() {
  switch (loginStep.value) {
    case 'phone':
      currentStepMessage.value = 'Telefon raqamingizni ayting (masalan: "to\'qsonlik besh yuz ellik uch ellik ikki yigirma bir" yoki "90 lik 593 51 21")';
      voiceStatusMessage.value = 'Telefon raqamni kutmoqda...';
      break;
    case 'phone-confirm':
      currentStepMessage.value = 'Telefon raqam to\'g\'ri bo\'lsa "ha" yoki "to\'g\'ri" deb ayting, noto\'g\'ri bo\'lsa "yo\'q" yoki "qaytadan" deb ayting';
      voiceStatusMessage.value = 'Telefon tasdiqlashni kutmoqda...';
      break;
    case 'password':
      currentStepMessage.value = 'Parolingizni ayting';
      voiceStatusMessage.value = 'Parolni kutmoqda...';
      break;
    case 'confirm':
      currentStepMessage.value = 'Ma\'lumotlar to\'g\'ri bo\'lsa "tasdiqlash" deb ayting yoki "bekor qilish" deb ayting';
      voiceStatusMessage.value = 'Tasdiqlashni kutmoqda...';
      break;
  }
}

function processVoiceLoginInput(text: string) {
  const normalizedText = text.toLowerCase().trim();
  console.log('Voice input received:', text);
  
  switch (loginStep.value) {
    case 'phone':
      const phone = parsePhoneNumber(normalizedText);
      console.log('Parsed phone result:', phone);
      if (phone) {
        currentLoginData.value.phone = phone;
        
        // Convert phone to Uzbek pronunciation and ask for confirmation
        const uzbekPhone = convertDigitsToUzbek(phone);
        speakText(`Telefon raqam: ${uzbekPhone}. Bu raqam to'g'ri bo'lsa "ha" deb ayting, noto'g'ri bo'lsa "yo'q" deb ayting.`, true);
        loginStep.value = 'phone-confirm';
        updateStepMessage();
        
        // Auto-start listening for confirmation
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 3000);
      } else {
        speakText('Telefon raqam aniqlanmadi. Iltimos, raqamlarni aniq aytib bering. Masalan: to\'qsonlik besh yuz ellik uch ellik ikki yigirma bir.', true);
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      }
      break;
      
    case 'phone-confirm':
      if (normalizedText.includes('ha') || normalizedText.includes('to\'g\'ri') || normalizedText.includes('togri') || normalizedText.includes('yes')) {
        speakText('Telefon raqam tasdiqlandi. Endi parolingizni ayting.', true);
        loginStep.value = 'password';
        updateStepMessage();
        
        // Auto-start listening for password
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      } else if (normalizedText.includes('yo\'q') || normalizedText.includes('yoq') || normalizedText.includes('qaytadan') || normalizedText.includes('noto\'g\'ri') || normalizedText.includes('no')) {
        speakText('Telefon raqamni qaytadan ayting.', true);
        loginStep.value = 'phone';
        currentLoginData.value.phone = '';
        updateStepMessage();
        
        // Auto-start listening for phone number
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      } else {
        speakText('Tushunmadim. "Ha" yoki "yo\'q" deb ayting.', true);
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      }
      break;
      
    case 'password':
      if (normalizedText.length >= 3) {
        currentLoginData.value.password = normalizedText;
        speakText('Parol qabul qilindi. Ma\'lumotlarni tasdiqlash uchun "tasdiqlash" deb ayting yoki "bekor qilish" deb ayting.', true);
        loginStep.value = 'confirm';
        updateStepMessage();
        
        // Auto-start listening for confirmation
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      } else {
        speakText('Parol juda qisqa. Iltimos, parolingizni qayta ayting.');
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      }
      break;
      
    case 'confirm':
      if (normalizedText.includes('tasdiqlash') || normalizedText.includes('confirm') || normalizedText.includes('ha')) {
        confirmVoiceLogin();
      } else if (normalizedText.includes('bekor') || normalizedText.includes('cancel') || normalizedText.includes('yo\'q')) {
        cancelVoiceLogin();
      } else {
        speakText('Tushunmadim. "Tasdiqlash" yoki "bekor qilish" deb ayting.');
        setTimeout(() => {
          if (recognition.value && !isListening.value) {
            recognition.value.start();
          }
        }, 2000);
      }
      break;
  }
}

function confirmVoiceLogin() {
  speakText('Login qilinmoqda...', true);
  emit('voice-login-data', currentLoginData.value);
  isVoiceLoginMode.value = false;
  loginStep.value = 'phone';
  currentLoginData.value = { phone: '', password: '' };
}

function cancelVoiceLogin() {
  speakText('Ovoz bilan kirish bekor qilindi.', true);
  isVoiceLoginMode.value = false;
  loginStep.value = 'phone';
  currentLoginData.value = { phone: '', password: '' };
  voiceStatusMessage.value = 'Tinglayapman... Buyruq bering';
}

// Cross-browser Speech Recognition Detection
function detectSpeechSupport() {
  if (typeof window === 'undefined') return false;
  
  // Check all possible speech recognition implementations
  const hasWebkitSpeech = 'webkitSpeechRecognition' in window;
  const hasSpeech = 'SpeechRecognition' in window;
  const hasMozSpeech = 'mozSpeechRecognition' in window;
  
  console.log('🎤 Speech Recognition Support:');
  console.log('- WebKit (Chrome/Safari):', hasWebkitSpeech);
  console.log('- Standard (Firefox/Edge):', hasSpeech);
  console.log('- Mozilla (Firefox):', hasMozSpeech);
  
  return hasWebkitSpeech || hasSpeech || hasMozSpeech;
}

// Voice Recognition Functions
function initVoiceRecognition() {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    speechSupported.value = detectSpeechSupport();
    
    if (speechSupported.value) {
      // Try different implementations based on browser
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition || 
        (window as any).mozSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('❌ Speech Recognition not available in this browser');
        speechSupported.value = false;
        return;
      }
      
      recognition.value = new SpeechRecognition();
      console.log('✅ Speech Recognition initialized:', SpeechRecognition.name);
      
      // Browser-specific configuration
      recognition.value.continuous = false;
      recognition.value.interimResults = false;
      
      // Set language with fallbacks for better browser support
      const supportedLanguages = ['uz-UZ', 'ru-RU', 'en-US'];
      recognition.value.lang = supportedLanguages[0]; // Start with Uzbek
      
      // Browser-specific settings
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome')) {
        console.log('🌐 Chrome detected - using optimal settings');
        recognition.value.maxAlternatives = 3;
      } else if (userAgent.includes('firefox')) {
        console.log('🦊 Firefox detected - using compatible settings');
        recognition.value.lang = 'ru-RU'; // Firefox better with Russian for Uzbek
      } else if (userAgent.includes('safari')) {
        console.log('🧭 Safari detected - using iOS/macOS settings');
        recognition.value.maxAlternatives = 1;
      } else if (userAgent.includes('edge')) {
        console.log('🔷 Edge detected - using Microsoft settings');
        recognition.value.maxAlternatives = 2;
      }
      
      recognition.value.onstart = () => {
        isListening.value = true;
        voiceResult.value = "";
      };
      
      recognition.value.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        voiceResult.value = transcript;
        
        // If in voice login mode, process as login input
        if (isVoiceLoginMode.value) {
          processVoiceLoginInput(transcript);
        } else {
          handleVoiceCommand(transcript);
        }
      };
      
      recognition.value.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        message.error('Ovoz tanishda xatolik yuz berdi');
        isListening.value = false;
      };
      
      recognition.value.onend = () => {
        isListening.value = false;
        setTimeout(() => {
          voiceResult.value = "";
        }, 2000);
      };
    } else {
      // Fallback for unsupported browsers
      speechSupported.value = false;
      console.warn('❌ Speech Recognition not supported in this browser');
      
      // Show browser-specific guidance
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('firefox')) {
        console.log('💡 Firefox: Enable media.webspeech.recognition.enable in about:config');
      } else if (userAgent.includes('safari')) {
        console.log('💡 Safari: Speech Recognition may require HTTPS connection');
      } else {
        console.log('💡 Try using Chrome or Edge for better speech support');
      }
    }
  }
}

function toggleVoiceRecognition() {
  if (!recognition.value) return;
  
  if (isListening.value) {
    recognition.value.stop();
  } else {
    recognition.value.start();
  }
}

function handleVoiceCommand(command: string) {
  // Normalize command
  const normalizedCommand = command.toLowerCase().trim();
  
  // Check if parent component wants to handle the command
  if (props.onCommand) {
    props.onCommand(normalizedCommand);
  }
  
  // Check for exact matches first
  if (voiceCommands[normalizedCommand as keyof typeof voiceCommands]) {
    const route = voiceCommands[normalizedCommand as keyof typeof voiceCommands];
    
    if (route === 'voice-login') {
      startVoiceLogin();
    } else if (route === 'logout') {
      authStore.logout();
    } else if (route === 'stop') {
      recognition.value?.stop();
    } else if (route === 'cancel') {
      if (isVoiceLoginMode.value) {
        cancelVoiceLogin();
      }
    } else {
      // Navigate to route
      setTimeout(() => {
        router.push(route);
      }, 500);
    }
    
    message.success(`Buyruq bajarildi: ${command}`);
    return;
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(voiceCommands)) {
    if (normalizedCommand.includes(key) || key.includes(normalizedCommand)) {
      const route = value;
      
      if (route === 'voice-login') {
        startVoiceLogin();
      } else if (route === 'logout') {
        authStore.logout();
      } else if (route === 'stop') {
        recognition.value?.stop();
      } else if (route === 'cancel') {
        if (isVoiceLoginMode.value) {
          cancelVoiceLogin();
        }
      } else {
        setTimeout(() => {
          router.push(route);
        }, 500);
      }
      
      message.success(`Buyruq bajarildi: ${command}`);
      return;
    }
  }
  
  message.warning(`Buyruq tushunilmadi: "${command}"`);
}

// Keyboard shortcuts
function handleKeyboardShortcut(event: KeyboardEvent) {
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault();
    toggleVoiceRecognition();
  }
}

// Emits
const emit = defineEmits<{
  'login-command': [],
  'voice-login-data': [data: { phone: string, password: string }]
}>();

// Debug function to log available voices
function logAvailableVoices() {
  const voices = ttsService.getAvailableVoices();
  console.log('🎤 Available TTS voices:', voices.length);
  
  // Check for Uzbek voices (including Azure Neural)
  const azureUzbekVoices = voices.filter(v => 
    v.name.includes('SardorNeural') || 
    v.name.includes('MadinaNeural') ||
    v.name.includes('uz-UZ-')
  );
  
  const uzbekVoices = voices.filter(v => 
    v.lang.startsWith('uz') || 
    v.name.toLowerCase().includes('uzbek')
  );
  
  // Check for Russian voices (best for Uzbek)
  const russianVoices = voices.filter(v => v.lang.startsWith('ru'));
  const russianFemaleVoices = russianVoices.filter(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('woman') ||
    v.name.toLowerCase().includes('irina') ||
    v.name.toLowerCase().includes('katya') ||
    v.name.toLowerCase().includes('elena')
  );
  
  // Check for female voices in general
  const femaleVoices = voices.filter(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('woman') ||
    v.name.toLowerCase().includes('zira') ||
    v.name.toLowerCase().includes('aria')
  );
  
  console.log('🎯 Azure Uzbek Neural voices:', azureUzbekVoices.length ? azureUzbekVoices : 'None');
  console.log('🇺🇿 Other Uzbek voices:', uzbekVoices.length ? uzbekVoices : 'None');
  console.log('🇷🇺 Russian voices found:', russianVoices.length);
  console.log('👩 Russian female voices:', russianFemaleVoices.length ? russianFemaleVoices : 'None');
  console.log('👩 All female voices:', femaleVoices.length);
  
  if (azureUzbekVoices.length > 0) {
    console.log('🎉 Perfect! Will use Azure Neural Uzbek voice (SardorNeural/MadinaNeural)');
  } else if (uzbekVoices.length > 0) {
    console.log('✅ Will use native Uzbek voice');
  } else if (russianFemaleVoices.length > 0) {
    console.log('✅ Using Russian female voice - good for Uzbek pronunciation');
    console.log('💡 Tip: Install Windows Uzbek language pack for native uz-UZ-SardorNeural voice');
  } else if (russianVoices.length > 0) {
    console.log('✅ Using Russian voice for Uzbek - acceptable quality');
    console.log('💡 Tip: Install Windows Uzbek language pack for native uz-UZ-SardorNeural voice');
  } else if (femaleVoices.length > 0) {
    console.log('⚠️ Using English female voice for Uzbek - limited quality');
    console.log('💡 Recommendation: Install Russian or Uzbek language pack for better pronunciation');
  } else {
    console.log('❌ No optimal voices found for Uzbek');
    console.log('💡 Install additional language packs in your OS settings');
  }
  
  // Show current best voice that will be used
  const currentBest = azureUzbekVoices[0] || uzbekVoices[0] || russianFemaleVoices[0] || russianVoices[0] || femaleVoices[0];
  if (currentBest) {
    console.log(`🎤 Current voice: "${currentBest.name}" (${currentBest.lang})`);
  }
}

// Show voice quality notification to user
function showVoiceQualityNotification() {
  const voices = ttsService.getAvailableVoices();
  const azureUzbekVoices = voices.filter(v => 
    v.name.includes('SardorNeural') || v.name.includes('MadinaNeural')
  );
  const russianVoices = voices.filter(v => v.lang.startsWith('ru'));
  
  let notificationText = '';
  if (azureUzbekVoices.length > 0) {
    notificationText = '🎉 Perfect Uzbek voice available!';
  } else if (russianVoices.length > 0) {
    notificationText = '✅ Good voice quality for Uzbek';
  } else {
    notificationText = '⚠️ Limited voice quality - consider installing language packs';
  }
  
  // You could show this in a toast notification
  console.log('Voice Status:', notificationText);
}

// Comprehensive browser compatibility check
function checkBrowserCompatibility() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isHTTPS = location.protocol === 'https:';
  
  console.log('🌐 Browser Compatibility Check:');
  console.log('Browser:', userAgent.includes('chrome') ? 'Chrome' : 
                    userAgent.includes('firefox') ? 'Firefox' :
                    userAgent.includes('safari') ? 'Safari' :
                    userAgent.includes('edge') ? 'Edge' : 'Unknown');
  console.log('HTTPS:', isHTTPS ? '✅' : '❌ (Required for Speech API)');
  console.log('Speech Recognition:', speechSupported.value ? '✅' : '❌');
  console.log('Text-to-Speech:', 'speechSynthesis' in window ? '✅' : '❌');
  
  // Provide recommendations
  if (!isHTTPS) {
    console.warn('⚠️ HTTPS required for Speech Recognition in most browsers');
  }
  
  if (!speechSupported.value) {
    if (userAgent.includes('firefox')) {
      console.log('🔧 Firefox: Go to about:config → media.webspeech.recognition.enable → true');
    } else if (!isHTTPS) {
      console.log('🔧 Try using HTTPS version of this site');
    } else {
      console.log('🔧 Recommended browsers: Chrome, Edge, Safari');
    }
  }
}

// Lifecycle
onMounted(() => {
  initVoiceRecognition();
  window.addEventListener('keydown', handleKeyboardShortcut);
  
  // Comprehensive compatibility and voice checks
  setTimeout(() => {
    checkBrowserCompatibility();
    logAvailableVoices();
    showVoiceQualityNotification();
  }, 1000);
});

onUnmounted(() => {
  if (recognition.value) {
    recognition.value.stop();
  }
  // Stop any ongoing TTS and clear queue
  speechQueue.value = [];
  isSpeaking.value = false;
  ttsService.stop();
  window.removeEventListener('keydown', handleKeyboardShortcut);
});
</script>

<style scoped>
/* Voice Navigation Styles */
.voice-nav-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee 0%, #7209b7 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(67, 97, 238, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.voice-nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(67, 97, 238, 0.4);
}

.voice-nav-button.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
}

.voice-nav-button.pulse {
  animation: pulse-red 1.5s infinite;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 4px 30px rgba(239, 68, 68, 0.6);
  }
  100% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
  }
}

.voice-status {
  position: fixed;
  bottom: 100px;
  right: 24px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  z-index: 1000;
  animation: slideInUp 0.3s ease;
}

.voice-status-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-status-icon {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.voice-result {
  position: fixed;
  bottom: 100px;
  right: 24px;
  background: rgba(67, 97, 238, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  z-index: 1000;
  animation: slideInUp 0.3s ease;
  max-width: 300px;
}

.voice-result-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Voice Login Dialog Styles */
.voice-login-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.voice-login-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease;
}

.voice-login-content h3 {
  color: #4361ee;
  margin-bottom: 24px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
}

.voice-login-step {
  margin-bottom: 24px;
}

.voice-login-step p {
  font-size: 16px;
  color: #374151;
  margin-bottom: 16px;
  line-height: 1.5;
}

.voice-data {
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-family: monospace;
}

.voice-data strong {
  color: #4361ee;
  margin-right: 8px;
}

.voice-login-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.voice-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.voice-btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.voice-btn-cancel:hover {
  background: #e5e7eb;
}

.voice-btn-confirm {
  background: #4361ee;
  color: white;
}

.voice-btn-confirm:hover {
  background: #3730a3;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .voice-nav-button {
    bottom: 16px;
    right: 16px;
    width: 50px;
    height: 50px;
  }
  
  .voice-status,
  .voice-result {
    bottom: 80px;
    right: 16px;
    max-width: 250px;
    font-size: 13px;
  }
  
  .voice-login-content {
    padding: 24px;
    width: 95%;
  }
  
  .voice-login-content h3 {
    font-size: 20px;
  }
  
  .voice-login-actions {
    flex-direction: column;
  }
  
  .voice-btn {
    width: 100%;
  }
}
</style>