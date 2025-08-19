/**
 * Mobile Accessibility Service
 * Mobil qurilmalar uchun accessibility xususiyatlari
 */

export interface MobileSettings {
  enabled: boolean;
  gesturesEnabled: boolean;
  hapticFeedback: boolean;
  largeTargets: boolean;
  swipeNavigation: boolean;
  voiceControl: boolean;
  orientationLock: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  zoomEnabled: boolean;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  action: () => void;
  description: string;
}

export interface TouchTarget {
  element: HTMLElement;
  minSize: number;
  expanded: boolean;
}

class MobileAccessibilityService {
  private settings: MobileSettings;
  private swipeGestures: Map<string, SwipeGesture> = new Map();
  private touchTargets: TouchTarget[] = [];
  private isMobile = false;
  private readonly storageKey = 'mobile-accessibility-settings';
  private touchStart: { x: number; y: number; time: number } | null = null;
  private readonly SWIPE_THRESHOLD = 50; // minimum swipe distance
  private readonly SWIPE_TIME_THRESHOLD = 300; // maximum swipe time

  constructor() {
    this.settings = this.getDefaultSettings();
    this.isMobile = this.detectMobile();
    
    if (this.isMobile) {
      this.loadSettings();
      this.initializeGestures();
      this.setupEventListeners();
      this.enhanceTouchTargets();
    }
  }

  /**
   * Standart sozlamalar
   */
  private getDefaultSettings(): MobileSettings {
    return {
      enabled: true,
      gesturesEnabled: true,
      hapticFeedback: true,
      largeTargets: true,
      swipeNavigation: true,
      voiceControl: true,
      orientationLock: false,
      reduceMotion: false,
      highContrast: false,
      zoomEnabled: true
    };
  }

  /**
   * Mobil qurilma aniqlash
   */
  private detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768 ||
           'ontouchstart' in window;
  }

  /**
   * Touch event listenerlarni sozlash
   */
  private setupEventListeners(): void {
    if (!this.settings.enabled) return;

    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    
    // Orientation change
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // Keyboard appearance (mobile)
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Default swipe gesturelarni sozlash
   */
  private initializeGestures(): void {
    const defaultGestures: SwipeGesture[] = [
      {
        direction: 'left',
        action: () => this.navigateForward(),
        description: 'Keyingi sahifaga o\'tish'
      },
      {
        direction: 'right',
        action: () => this.navigateBack(),
        description: 'Oldingi sahifaga qaytish'
      },
      {
        direction: 'up',
        action: () => this.scrollToTop(),
        description: 'Sahifa boshiga o\'tish'
      },
      {
        direction: 'down',
        action: () => this.openQuickActions(),
        description: 'Tezkor amallar menyusi'
      }
    ];

    defaultGestures.forEach(gesture => this.addSwipeGesture(gesture));
  }

  /**
   * Touch start handler
   */
  private handleTouchStart(event: TouchEvent): void {
    if (!this.settings.gesturesEnabled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }

  /**
   * Touch end handler
   */
  private handleTouchEnd(event: TouchEvent): void {
    if (!this.settings.gesturesEnabled || !this.touchStart || event.changedTouches.length !== 1) {
      this.touchStart = null;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStart.x;
    const deltaY = touch.clientY - this.touchStart.y;
    const deltaTime = Date.now() - this.touchStart.time;

    // Time threshold check
    if (deltaTime > this.SWIPE_TIME_THRESHOLD) {
      this.touchStart = null;
      return;
    }

    // Distance threshold check
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < this.SWIPE_THRESHOLD) {
      this.touchStart = null;
      return;
    }

    // Determine swipe direction
    let direction: 'left' | 'right' | 'up' | 'down';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    // Execute gesture
    const gesture = this.swipeGestures.get(direction);
    if (gesture) {
      event.preventDefault();
      gesture.action();
      this.provideFeedback();
    }

    this.touchStart = null;
  }

  /**
   * Touch move handler
   */
  private handleTouchMove(event: TouchEvent): void {
    // Prevent scroll during gesture recognition
    if (this.touchStart && this.settings.gesturesEnabled) {
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStart.x);
      const deltaY = Math.abs(touch.clientY - this.touchStart.y);
      
      if (deltaX > 20 || deltaY > 20) {
        // Might be a gesture, prevent default scrolling
        event.preventDefault();
      }
    }
  }

  /**
   * Orientation change handler
   */
  private handleOrientationChange(): void {
    setTimeout(() => {
      this.enhanceTouchTargets();
      this.adjustLayout();
    }, 100);
  }

  /**
   * Resize handler (klaviatura appearance)
   */
  private handleResize(): void {
    if (this.isMobile) {
      this.adjustForKeyboard();
    }
  }

  /**
   * Touch targetlarni kattalashtirish
   */
  private enhanceTouchTargets(): void {
    if (!this.settings.largeTargets) return;

    const minTargetSize = 44; // Apple va Google tavsiyasi
    const selectors = 'button, a, input, select, textarea, [onclick], [role="button"]';
    const elements = document.querySelectorAll(selectors) as NodeListOf<HTMLElement>;

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const needsEnhancement = rect.width < minTargetSize || rect.height < minTargetSize;

      if (needsEnhancement) {
        this.enhanceTarget(element, minTargetSize);
      }
    });
  }

  /**
   * Bitta elementni enhance qilish
   */
  private enhanceTarget(element: HTMLElement, minSize: number): void {
    const existingTarget = this.touchTargets.find(t => t.element === element);
    if (existingTarget) return;

    // Touch area kengaytirish
    element.style.minWidth = `${minSize}px`;
    element.style.minHeight = `${minSize}px`;
    element.style.padding = element.style.padding || '8px';
    
    // Focus indicator kengaytirish
    element.style.touchAction = 'manipulation';
    
    this.touchTargets.push({
      element,
      minSize,
      expanded: true
    });
  }

  /**
   * Haptic feedback
   */
  private provideFeedback(): void {
    if (!this.settings.hapticFeedback) return;

    // Vibration API
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms vibration
    }
  }

  /**
   * Navigatsiya gesturelar
   */
  private navigateForward(): void {
    // Browser forward
    if (window.history.length > 1) {
      window.history.forward();
    }
  }

  private navigateBack(): void {
    // Browser back
    window.history.back();
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: this.settings.reduceMotion ? 'auto' : 'smooth'
    });
  }

  private openQuickActions(): void {
    // Quick actions menu ochish
    const event = new CustomEvent('open-quick-actions');
    document.dispatchEvent(event);
  }

  /**
   * Layout adjustment
   */
  private adjustLayout(): void {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.body.classList.toggle('mobile-landscape', isLandscape);
    document.body.classList.toggle('mobile-portrait', !isLandscape);
  }

  /**
   * Klaviatura uchun adjustment
   */
  private adjustForKeyboard(): void {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const windowHeight = window.innerHeight;
    const keyboardHeight = windowHeight - viewportHeight;

    if (keyboardHeight > 100) {
      // Klaviatura ochiq
      document.body.classList.add('keyboard-open');
      document.body.style.paddingBottom = `${keyboardHeight}px`;
    } else {
      // Klaviatura yopiq
      document.body.classList.remove('keyboard-open');
      document.body.style.paddingBottom = '';
    }
  }

  /**
   * Voice control (mobile-specific)
   */
  async startMobileVoiceInput(): Promise<string> {
    if (!this.settings.voiceControl) {
      throw new Error('Ovoz boshqarish o\'chirilgan');
    }

    // TTS service'dan foydalanish
    try {
      const { aiAssistantService } = await import('./aiAssistant');
      return await aiAssistantService.startVoiceInput();
    } catch (error) {
      throw new Error('Ovoz tanish xatosi');
    }
  }

  /**
   * Zoom functionality
   */
  enableZoom(): void {
    if (!this.settings.zoomEnabled) return;

    // Meta viewport tag'ni o'zgartirish
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }

    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
  }

  disableZoom(): void {
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
  }

  /**
   * Swipe gesture qo'shish
   */
  addSwipeGesture(gesture: SwipeGesture): void {
    this.swipeGestures.set(gesture.direction, gesture);
  }

  /**
   * Swipe gesture olib tashlash
   */
  removeSwipeGesture(direction: string): void {
    this.swipeGestures.delete(direction);
  }

  /**
   * Barcha gesturalar
   */
  getAllGestures(): SwipeGesture[] {
    return Array.from(this.swipeGestures.values());
  }

  /**
   * Mobile-friendly form enhancements
   */
  enhanceForms(): void {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => this.enhanceForm(form));
  }

  private enhanceForm(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea') as NodeListOf<HTMLInputElement>;
    
    inputs.forEach(input => {
      // Input type optimizatsiya
      this.optimizeInputType(input);
      
      // Auto-focus next field
      this.setupAutoFocus(input);
      
      // Error handling
      this.enhanceErrorHandling(input);
    });
  }

  private optimizeInputType(input: HTMLInputElement): void {
    // Email va tel inputlar uchun klaviatura optimallashtirish
    if (input.type === 'email') {
      input.setAttribute('inputmode', 'email');
    } else if (input.type === 'tel') {
      input.setAttribute('inputmode', 'tel');
    } else if (input.type === 'number') {
      input.setAttribute('inputmode', 'numeric');
    }
  }

  private setupAutoFocus(input: HTMLInputElement): void {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.type !== 'textarea') {
        const form = input.closest('form');
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input, select, textarea')) as HTMLInputElement[];
          const currentIndex = inputs.indexOf(input);
          const nextInput = inputs[currentIndex + 1];
          
          if (nextInput) {
            event.preventDefault();
            nextInput.focus();
          }
        }
      }
    });
  }

  private enhanceErrorHandling(input: HTMLInputElement): void {
    input.addEventListener('invalid', () => {
      this.provideFeedback();
    });
  }

  /**
   * Accessibility CSS qo'shish
   */
  private addMobileAccessibilityCSS(): void {
    const css = `
      /* Mobile accessibility enhancements */
      .mobile-enhanced {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        -webkit-touch-callout: none;
        touch-action: manipulation;
      }

      .mobile-enhanced button,
      .mobile-enhanced a,
      .mobile-enhanced [role="button"] {
        min-width: 44px;
        min-height: 44px;
        padding: 8px;
        touch-action: manipulation;
      }

      .mobile-enhanced input,
      .mobile-enhanced select,
      .mobile-enhanced textarea {
        min-height: 44px;
        font-size: 16px; /* Prevent zoom on iOS */
      }

      .keyboard-open {
        position: fixed;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }

      .mobile-landscape .accessibility-panel {
        left: 2px;
        top: 50%;
        transform: translateY(-50%);
      }

      .mobile-portrait .accessibility-panel {
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
      }

      /* High contrast mode for mobile */
      @media (prefers-contrast: high) {
        .mobile-enhanced * {
          border: 2px solid currentColor !important;
        }
      }

      /* Reduced motion for mobile */
      @media (prefers-reduced-motion: reduce) {
        .mobile-enhanced * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Large text support */
      @media (prefers-reduced-motion: reduce) {
        .mobile-enhanced {
          font-size: 1.2em;
          line-height: 1.6;
        }
      }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Sozlamalarni olish
   */
  getSettings(): MobileSettings {
    return { ...this.settings };
  }

  /**
   * Sozlamalarni yangilash
   */
  updateSettings(newSettings: Partial<MobileSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Sozlamalarni qo'llash
   */
  private applySettings(): void {
    // CSS classlar qo'shish/olib tashlash
    document.body.classList.toggle('mobile-enhanced', this.settings.enabled);
    document.body.classList.toggle('high-contrast-mobile', this.settings.highContrast);
    document.body.classList.toggle('reduced-motion-mobile', this.settings.reduceMotion);

    // Zoom settings
    if (this.settings.zoomEnabled) {
      this.enableZoom();
    } else {
      this.disableZoom();
    }

    // Touch targets
    if (this.settings.largeTargets) {
      this.enhanceTouchTargets();
    }

    // CSS qo'shish
    this.addMobileAccessibilityCSS();
  }

  /**
   * Mobile ekanligini tekshirish
   */
  get isMobileDevice(): boolean {
    return this.isMobile;
  }

  /**
   * Sozlamalarni saqlash
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Mobile accessibility sozlamalarini saqlashda xato:', error);
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
        this.applySettings();
      }
    } catch (error) {
      console.error('Mobile accessibility sozlamalarini yuklashda xato:', error);
    }
  }
}

// Singleton instance
export const mobileAccessibilityService = new MobileAccessibilityService();
export default mobileAccessibilityService;
