/**
 * AI Virtual Assistant Service
 * Claude API orqali virtual yordamchi
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice' | 'system';
}

export interface AssistantSettings {
  enabled: boolean;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  language: 'uz' | 'ru' | 'en';
  responseLength: 'short' | 'medium' | 'detailed';
  context: 'navigation' | 'academic' | 'general';
}

class AIAssistantService {
  private messages: ChatMessage[] = [];
  private settings: AssistantSettings;
  private isProcessing = false;
  private readonly storageKey = 'ai-assistant-settings';
  private readonly messagesKey = 'ai-assistant-messages';

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
    this.loadMessages();
  }

  /**
   * Standart sozlamalar
   */
  private getDefaultSettings(): AssistantSettings {
    return {
      enabled: true,
      voiceEnabled: true,
      autoSpeak: false,
      language: 'uz',
      responseLength: 'medium',
      context: 'navigation'
    };
  }

  /**
   * Foydalanuvchi savoliga javob berish
   */
  async askQuestion(question: string, isVoice = false): Promise<ChatMessage> {
    if (!this.settings.enabled) {
      throw new Error('AI yordamchi o\'chirilgan');
    }

    this.isProcessing = true;

    // Foydalanuvchi xabarini qo'shish
    const userMessage: ChatMessage = {
      id: this.generateId(),
      role: 'user',
      content: question,
      timestamp: new Date(),
      type: isVoice ? 'voice' : 'text'
    };

    this.addMessage(userMessage);

    try {
      // Claude API ga so'rov yuborish
      const assistantResponse = await this.callClaudeAPI(question);
      
      const assistantMessage: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
        type: 'text'
      };

      this.addMessage(assistantMessage);
      this.isProcessing = false;

      // Ovozli javob (agar kerak bo'lsa)
      if (this.settings.voiceEnabled && (this.settings.autoSpeak || isVoice)) {
        this.speakResponse(assistantResponse);
      }

      return assistantMessage;
    } catch (error) {
      this.isProcessing = false;
      
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        role: 'assistant',
        content: 'Kechirasiz, xato yuz berdi. Iltimos, keyinroq urinib ko\'ring.',
        timestamp: new Date(),
        type: 'system'
      };

      this.addMessage(errorMessage);
      throw error;
    }
  }

  /**
   * Claude API ga so'rov
   */
  private async callClaudeAPI(question: string): Promise<string> {
    // Kontekst va til sozlamalariga qarab prompt yaratish
    const systemPrompt = this.buildSystemPrompt();
    const conversationHistory = this.getRecentMessages(5); // Oxirgi 5 ta xabar
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: question
      }
    ];

    try {
      const requestBody = {
        messages,
        language: this.settings.language,
        responseLength: this.settings.responseLength,
        context: this.settings.context
      };
      
      console.log('Claude API request:', requestBody);
      
      // Backend API orqali Claude ga so'rov
      const response = await fetch('/api/chat/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API xatosi: ${response.status}`);
      }

      const data = await response.json();
      console.log('Claude API response:', data);
      
      let finalResponse = data.response || data.content;
      
      // Agar action mavjud bo'lsa, navigatsiya taklif qilish
      if (data.action) {
        finalResponse += `\n\n📍 Ushbu sahifaga o'tishni xohlaysizmi? ${data.action}`;
      }
      
      // Qo'shimcha maslahatlar
      if (data.helpful_tips) {
        finalResponse += `\n\n💡 Maslahat: ${data.helpful_tips}`;
      }
      
      return finalResponse;
    } catch (error) {
      console.error('Claude API xatosi:', error);
      return this.getFallbackResponse(question);
    }
  }

  /**
   * Auth token olish
   */
  private getAuthToken(): string {
    // Token localStorage'dan yoki auth store'dan olinadi
    return localStorage.getItem('auth_token') || localStorage.getItem('accessToken') || 'mock-token';
  }

  /**
   * System prompt yaratish
   */
  private buildSystemPrompt(): string {
    const contextPrompts = {
      navigation: `Siz IQSpace LMS tizimi uchun navigatsiya yordamchisiz. Foydalanuvchilarga sahifalar orasida harakatlashda yordam bering.
      
      Mavjud sahifalar:
      - /dashboard - Bosh sahifa
      - /dashboard/profile - Profil
      - /dashboard/messages - Xabarlar
      - /dashboard/teacher/courses - O'qituvchi kurslari
      - /dashboard/teacher/students - O'quvchilar
      - /dashboard/teacher/assignments - Topshiriqlar
      - /dashboard/student/courses - Talaba kurslari
      - /dashboard/student/grades - Baholar
      - /dashboard/student/payments - To'lovlar`,
      
      academic: `Siz IQSpace LMS tizimi uchun akademik yordamchisiz. Ta'lim jarayoni, kurslar, topshiriqlar haqida yordam bering.`,
      
      general: `Siz IQSpace LMS tizimi uchun umumiy yordamchisiz. Har qanday savollarga yordam bering.`
    };

    const languageInstructions = {
      uz: 'Barcha javoblaringiz O\'zbek tilida bo\'lsin.',
      ru: 'Все ваши ответы должны быть на русском языке.',
      en: 'All your responses should be in English.'
    };

    const lengthInstructions = {
      short: 'Qisqa va aniq javob bering (1-2 jumla).',
      medium: 'O\'rtacha uzunlikdagi javob bering (3-4 jumla).',
      detailed: 'Batafsil va to\'liq javob bering.'
    };

    return `
    ${contextPrompts[this.settings.context]}
    
    ${languageInstructions[this.settings.language]}
    ${lengthInstructions[this.settings.responseLength]}
    
    Sizning vazifangiz:
    1. Foydalanuvchi savollariga yordam berish
    2. Navigatsiyada yo'l ko'rsatish
    3. Tizim funksiyalarini tushuntirish
    4. Accessibility xususiyatlari haqida ma'lumot berish
    
    Har doim do'stona va yordam beruvchi bo'ling.
    `;
  }

  /**
   * Fallback javob (API ishlamasa)
   */
  private getFallbackResponse(_question: string): string {
    const responses = {
      uz: [
        'Kechirasiz, hozir texnik muammolar bor. Keyinroq urinib ko\'ring.',
        'Men sizga yordam bermoqchi edim, lekin tizimda xato yuz berdi.',
        'Afsuski, hozir javob berolmayapman. Administratorga murojaat qiling.'
      ],
      ru: [
        'Извините, сейчас есть технические проблемы. Попробуйте позже.',
        'Я хотел бы помочь вам, но в системе произошла ошибка.',
        'К сожалению, сейчас не могу ответить. Обратитесь к администратору.'
      ],
      en: [
        'Sorry, there are technical issues right now. Please try later.',
        'I would like to help you, but there was a system error.',
        'Unfortunately, I cannot answer right now. Contact the administrator.'
      ]
    };

    const langResponses = responses[this.settings.language];
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  }

  /**
   * Navigatsiya tavsiyalari
   */
  async getNavigationSuggestion(currentPath: string): Promise<string> {
    const suggestions = {
      '/dashboard': 'Bu bosh sahifa. Profilingizni ko\'rish uchun "Profil"ga o\'ting.',
      '/dashboard/teacher/courses': 'Yangi kurs qo\'shish yoki mavjud kurslarni tahrirlash mumkin.',
      '/dashboard/student/courses': 'Kurslaringizni ko\'ring va darslarni davom ettiring.',
      '/dashboard/messages': 'Yangi xabarlar uchun tekshiring.'
    };

    return suggestions[currentPath as keyof typeof suggestions] || 
           'Bu sahifada yordam kerak bo\'lsa, so\'rang!';
  }

  /**
   * Quick commands (tezkor buyruqlar)
   */
  async processQuickCommand(command: string): Promise<{ action?: string; message: string }> {
    const commands = {
      'bosh sahifa': { action: '/dashboard', message: 'Bosh sahifaga o\'tyapmiz...' },
      'profil': { action: '/dashboard/profile', message: 'Profilingizga o\'tyapmiz...' },
      'kurslar': { action: '/dashboard/teacher/courses', message: 'Kurslarga o\'tyapmiz...' },
      'baholar': { action: '/dashboard/student/grades', message: 'Baholaringizga o\'tyapmiz...' },
      'yordam': { message: 'Menga qanday yordam kerak? Navigatsiya, kurslar yoki boshqa narsalar haqida so\'rang.' }
    };

    const normalized = command.toLowerCase().trim();
    return commands[normalized as keyof typeof commands] || 
           { message: 'Bu buyruqni tushunmadim. "yordam" deb yozing.' };
  }

  /**
   * Ovozli javob
   */
  private async speakResponse(text: string): Promise<void> {
    if (!this.settings.voiceEnabled) return;

    try {
      // TTS service'dan foydalanish
      const { ttsService } = await import('./tts');
      await ttsService.speak(text, {
        lang: this.settings.language === 'uz' ? 'uz-UZ' : 
              this.settings.language === 'ru' ? 'ru-RU' : 'en-US'
      });
    } catch (error) {
      console.error('TTS xatosi:', error);
    }
  }

  /**
   * Xabar qo'shish
   */
  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
    this.saveMessages();
  }

  /**
   * Oxirgi xabarlar
   */
  private getRecentMessages(count: number): ChatMessage[] {
    return this.messages.slice(-count);
  }

  /**
   * ID generatsiya
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * Xabarlar tarixi
   */
  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  /**
   * Chat tozalash
   */
  clearChat(): void {
    this.messages = [];
    this.saveMessages();
  }

  /**
   * Processing holati
   */
  get isActive(): boolean {
    return this.isProcessing;
  }

  /**
   * Sozlamalarni olish
   */
  getSettings(): AssistantSettings {
    return { ...this.settings };
  }

  /**
   * Sozlamalarni yangilash
   */
  updateSettings(newSettings: Partial<AssistantSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Ovoz tanish (agar mavjud bo'lsa)
   */
  async startVoiceInput(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Ovoz tanish qo\'llab-quvvatlanmaydi'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = this.settings.language === 'uz' ? 'uz-UZ' : 
                        this.settings.language === 'ru' ? 'ru-RU' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Ovoz tanish xatosi: ${event.error}`));
      };

      recognition.start();
    });
  }

  /**
   * Smart contextual help
   */
  async getContextualHelp(element?: HTMLElement): Promise<string> {
    let context = 'general';
    
    if (element) {
      // Element kontekstini aniqlash
      if (element.closest('form')) context = 'form';
      else if (element.closest('nav')) context = 'navigation';
      else if (element.closest('.course')) context = 'course';
      else if (element.closest('.assignment')) context = 'assignment';
    }

    const helpTexts = {
      form: 'Bu formani to\'ldirish uchun barcha majburiy maydonlarni kiriting.',
      navigation: 'Navigatsiya menyusidan kerakli sahifani tanlang.',
      course: 'Kurs haqida ma\'lumot olish yoki darslarni ko\'rish uchun ustiga bosing.',
      assignment: 'Topshiriqni ko\'rish yoki bajarish uchun ustiga bosing.',
      general: 'Bu sahifada yordam kerak bo\'lsa, menga savol bering!'
    };

    return helpTexts[context as keyof typeof helpTexts];
  }

  /**
   * Sozlamalarni saqlash
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('AI assistant sozlamalarini saqlashda xato:', error);
    }
  }

  /**
   * Sozlamalarni yuklash
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsedSettings };
      }
    } catch (error) {
      console.error('AI assistant sozlamalarini yuklashda xato:', error);
    }
  }

  /**
   * Xabarlarni saqlash
   */
  private saveMessages(): void {
    try {
      // Faqat oxirgi 50 ta xabarni saqlash
      const recentMessages = this.messages.slice(-50);
      localStorage.setItem(this.messagesKey, JSON.stringify(recentMessages));
    } catch (error) {
      console.error('AI assistant xabarlarini saqlashda xato:', error);
    }
  }

  /**
   * Xabarlarni yuklash
   */
  private loadMessages(): void {
    try {
      const saved = localStorage.getItem(this.messagesKey);
      if (saved) {
        this.messages = JSON.parse(saved);
      }
    } catch (error) {
      console.error('AI assistant xabarlarini yuklashda xato:', error);
    }
  }
}

// Singleton instance
export const aiAssistantService = new AIAssistantService();
export default aiAssistantService;
