/**
 * Text-to-Speech Service
 * Matnni ovozga aylantirish xizmati
 */

export interface TTSOptions {
  rate?: number;      // Tezlik (0.1 - 10)
  pitch?: number;     // Balandlik (0 - 2)
  volume?: number;    // Ovoz balandligi (0 - 1)
  voice?: string;     // Ovoz turi
  lang?: string;      // Til
}

export interface TTSVoice {
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isPlaying = false;
  private defaultOptions: TTSOptions = {
    rate: 1,
    pitch: 1,
    volume: 0.8,
    lang: 'uz-UZ'
  };

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('TTS Service requires browser environment');
    }
    
    // Cross-browser TTS detection
    if (!('speechSynthesis' in window)) {
      console.warn('❌ Text-to-Speech not supported in this browser');
      throw new Error('TTS not supported');
    }
    
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    this.logBrowserSupport();
  }
  
  /**
   * Browser qo'llab-quvvatlash ma'lumotlari
   */
  private logBrowserSupport(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    console.log('🔊 TTS Browser Support:');
    
    if (userAgent.includes('chrome')) {
      console.log('✅ Chrome: Full TTS support');
    } else if (userAgent.includes('firefox')) {
      console.log('⚠️ Firefox: Limited voice selection');
    } else if (userAgent.includes('safari')) {
      console.log('✅ Safari: Good TTS support on macOS/iOS');
    } else if (userAgent.includes('edge')) {
      console.log('✅ Edge: Microsoft TTS integration');
    } else {
      console.log('⚠️ Unknown browser: TTS support may vary');
    }
  }

  /**
   * Ovozlarni yuklash
   */
  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();

    // Agar ovozlar hali yuklanmagan bo'lsa
    if (this.voices.length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.voices = this.synthesis.getVoices();
      });
    }
  }

  /**
   * Mavjud ovozlar ro'yxatini olish
   */
  getAvailableVoices(): TTSVoice[] {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService,
      default: voice.default
    }));
  }

  /**
   * Uzbek tilidagi ovozlarni olish
   */
  getUzbekVoices(): TTSVoice[] {
    return this.getAvailableVoices().filter(voice =>
      voice.lang.startsWith('uz') ||
      voice.lang.startsWith('ru') || // Rus tili ham qo'llab-quvvatlash
      voice.name.toLowerCase().includes('uzbek')
    );
  }

  /**
   * Matnni ovozga aylantirish
   */
  async speak(text: string, options?: TTSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        reject(new Error('Matn bo\'sh'));
        return;
      }

      // Avvalgi ovozni to'xtatish
      this.stop();

      const mergedOptions = { ...this.defaultOptions, ...options };
      const utterance = new SpeechSynthesisUtterance(text);

      // Ovoz sozlamalari
      utterance.rate = mergedOptions.rate!;
      utterance.pitch = mergedOptions.pitch!;
      utterance.volume = mergedOptions.volume!;
      utterance.lang = mergedOptions.lang!;

      // Ovoz turi tanlash
      if (mergedOptions.voice) {
        // First try to find exact match
        let selectedVoice = this.voices.find(voice =>
          voice.name === mergedOptions.voice
        );
        
        // If not found, try to find by partial match (for Azure Neural voices)
        if (!selectedVoice) {
          selectedVoice = this.voices.find(voice =>
            voice.name.toLowerCase().includes(mergedOptions.voice.toLowerCase()) ||
            voice.name.includes('SardorNeural') ||
            voice.name.includes('MadinaNeural') ||
            voice.name.includes('uz-UZ')
          );
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('Selected voice:', selectedVoice.name);
        } else {
          console.log('Voice not found:', mergedOptions.voice);
        }
      } else {
        // Since Uzbek voices are rarely available, prioritize Russian female voices
        // which pronounce Uzbek text better than English voices
        
        const russianFemaleVoice = this.voices.find(voice =>
          voice.lang.startsWith('ru') &&
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') ||
           voice.name.toLowerCase().includes('irina') ||
           voice.name.toLowerCase().includes('katya') ||
           voice.name.toLowerCase().includes('elena') ||
           voice.name.toLowerCase().includes('milena'))
        );
        
        const russianVoice = this.voices.find(voice =>
          voice.lang.startsWith('ru')
        );
        
        const femaleVoice = this.voices.find(voice =>
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('aria') ||
          voice.name.toLowerCase().includes('eva')
        );
        
        // Check for Azure Neural Uzbek voices
        const azureUzbekVoice = this.voices.find(voice =>
          voice.name.includes('SardorNeural') || 
          voice.name.includes('MadinaNeural') ||
          voice.name.includes('uz-UZ-')
        );
        
        const uzbekVoice = this.voices.find(voice =>
          voice.lang.startsWith('uz') || voice.name.toLowerCase().includes('uzbek')
        );
        
        // Priority for Uzbek text: Azure Uzbek Neural > Uzbek > Russian Female > Russian > Female English > Any
        if (azureUzbekVoice) {
          utterance.voice = azureUzbekVoice;
          console.log('🎯 Using Azure Uzbek Neural voice:', azureUzbekVoice.name);
        } else if (uzbekVoice) {
          utterance.voice = uzbekVoice;
          console.log('🇺🇿 Using Uzbek voice:', uzbekVoice.name);
        } else if (russianFemaleVoice) {
          utterance.voice = russianFemaleVoice;
          console.log('Using Russian female voice for Uzbek:', russianFemaleVoice.name);
        } else if (russianVoice) {
          utterance.voice = russianVoice;
          console.log('Using Russian voice for Uzbek:', russianVoice.name);
        } else if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log('Using female voice for Uzbek:', femaleVoice.name);
        } else if (uzbekVoice) {
          utterance.voice = uzbekVoice;
          console.log('Using Uzbek voice:', uzbekVoice.name);
        } else {
          // Final fallback
          const fallbackVoice = this.voices.find(voice =>
            voice.lang.startsWith('en-')
          );
          if (fallbackVoice) {
            utterance.voice = fallbackVoice;
            console.log('Using fallback voice for Uzbek:', fallbackVoice.name);
          }
        }
      }

      // Event listeners
      utterance.onstart = () => {
        this.isPlaying = true;
      };

      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        
        // Don't treat interruption as an error
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve(); // Resolve normally for interruptions
        } else {
          reject(new Error(`TTS xatosi: ${event.error}`));
        }
      };

      // O'qishni boshlash
      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  /**
   * O'qishni to'xtatish
   */
  stop(): void {
    try {
      if (this.synthesis && (this.synthesis.speaking || this.synthesis.pending)) {
        this.synthesis.cancel();
      }
    } catch (error) {
      // Ignore errors during cancellation
      console.debug('TTS cancel error (ignored):', error);
    }
    this.isPlaying = false;
    this.currentUtterance = null;
  }

  /**
   * Pause/Resume
   */
  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * O'qish holati
   */
  get isReading(): boolean {
    return this.isPlaying;
  }

  get isPaused(): boolean {
    return this.synthesis.paused;
  }

  /**
   * Sahifa matnini o'qish
   */
  readPageContent(): void {
    const content = this.extractPageText();
    if (content) {
      this.speak(content);
    }
  }

  /**
   * Tanlangan matnni o'qish
   */
  readSelectedText(): void {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim()) {
      this.speak(selectedText);
    }
  }

  /**
   * Element matnini o'qish
   */
  readElement(element: HTMLElement): void {
    const text = this.extractElementText(element);
    if (text) {
      this.speak(text);
    }
  }

  /**
   * Sahifadan matnni ajratib olish
   */
  private extractPageText(): string {
    const main = document.querySelector('main') || document.body;
    return this.extractElementText(main);
  }

  /**
   * Elementdan matnni ajratib olish
   */
  private extractElementText(element: Element): string {
    // Script va style taglarini o'chirib tashlash
    const clone = element.cloneNode(true) as Element;
    const scripts = clone.querySelectorAll('script, style, noscript');
    scripts.forEach(el => el.remove());

    // Faqat ko'rinadigan matnni olish
    let text = clone.textContent || '';

    // Ortiqcha bo'shliqlarni tozalash
    text = text.replace(/\s+/g, ' ').trim();

    // Juda qisqa matnlarni filtrlash
    if (text.length < 10) {
      return '';
    }

    return text;
  }

  /**
   * Sozlamalarni saqlash
   */
  saveSettings(options: TTSOptions): void {
    localStorage.setItem('tts-settings', JSON.stringify(options));
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * Sozlamalarni yuklash
   */
  loadSettings(): TTSOptions {
    const saved = localStorage.getItem('tts-settings');
    if (saved) {
      try {
        const options = JSON.parse(saved);
        this.defaultOptions = { ...this.defaultOptions, ...options };
        return this.defaultOptions;
      } catch (error) {
        console.error('TTS sozlamalarini yuklashda xato:', error);
      }
    }
    return this.defaultOptions;
  }

  /**
   * Browser qo'llab-quvvatlash tekshiruvi
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Singleton instance
export const ttsService = new TextToSpeechService();
export default ttsService;
