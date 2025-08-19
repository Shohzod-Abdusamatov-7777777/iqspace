/**
 * Advanced Keyboard Navigation Service
 * Ilg'or klaviatura navigatsiyasi xizmati
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
  element?: string; // Qaysi elementda ishlashi kerak
}

export interface NavigationSettings {
  enabled: boolean;
  showTooltips: boolean;
  highlightFocused: boolean;
  skipLinks: boolean;
  customShortcuts: boolean;
  announceNavigation: boolean; // Screen reader uchun
}

class KeyboardNavigationService {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private settings: NavigationSettings;
  private focusedElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private readonly storageKey = 'keyboard-navigation-settings';

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
    this.initializeDefaultShortcuts();
    this.setupEventListeners();
    this.enhanceFocusManagement();
  }

  /**
   * Standart sozlamalar
   */
  private getDefaultSettings(): NavigationSettings {
    return {
      enabled: true,
      showTooltips: true,
      highlightFocused: true,
      skipLinks: true,
      customShortcuts: true,
      announceNavigation: false
    };
  }

  /**
   * Standart shortcutlar
   */
  private initializeDefaultShortcuts(): void {
    const defaultShortcuts: KeyboardShortcut[] = [
      // Asosiy navigatsiya
      {
        key: 'h',
        altKey: true,
        action: () => window.location.href = '/dashboard',
        description: 'Bosh sahifaga o\'tish',
        category: 'Navigatsiya'
      },
      {
        key: 'p',
        altKey: true,
        action: () => window.location.href = '/dashboard/profile',
        description: 'Profilga o\'tish',
        category: 'Navigatsiya'
      },
      {
        key: 'm',
        altKey: true,
        action: () => window.location.href = '/dashboard/messages',
        description: 'Xabarlarga o\'tish',
        category: 'Navigatsiya'
      },

      // O'qituvchi shortcuts
      {
        key: 'c',
        altKey: true,
        action: () => window.location.href = '/dashboard/teacher/courses',
        description: 'Kurslarga o\'tish',
        category: 'O\'qituvchi'
      },
      {
        key: 's',
        altKey: true,
        action: () => window.location.href = '/dashboard/teacher/students',
        description: 'O\'quvchilarga o\'tish',
        category: 'O\'qituvchi'
      },
      {
        key: 't',
        altKey: true,
        action: () => window.location.href = '/dashboard/teacher/assignments',
        description: 'Topshiriqlarga o\'tish',
        category: 'O\'qituvchi'
      },

      // Talaba shortcuts
      {
        key: 'k',
        altKey: true,
        action: () => window.location.href = '/dashboard/student/courses',
        description: 'Mening kurslarimga o\'tish',
        category: 'Talaba'
      },
      {
        key: 'a',
        altKey: true,
        action: () => window.location.href = '/dashboard/student/assignments',
        description: 'Topshiriqlarimga o\'tish',
        category: 'Talaba'
      },
      {
        key: 'g',
        altKey: true,
        action: () => window.location.href = '/dashboard/student/grades',
        description: 'Baholarimga o\'tish',
        category: 'Talaba'
      },

      // Utility shortcuts
      {
        key: '/',
        action: () => this.focusSearchBox(),
        description: 'Qidiruvga o\'tish',
        category: 'Utility'
      },
      {
        key: '?',
        action: () => this.showHelpModal(),
        description: 'Yordam ko\'rsatish',
        category: 'Utility'
      },
      {
        key: 'Escape',
        action: () => this.closeModal(),
        description: 'Modal/Panel yopish',
        category: 'Utility'
      },

      // Focus management
      {
        key: 'j',
        action: () => this.focusNext(),
        description: 'Keyingi elementga o\'tish',
        category: 'Focus'
      },
      {
        key: 'k',
        action: () => this.focusPrevious(),
        description: 'Oldingi elementga o\'tish',
        category: 'Focus'
      },
      {
        key: 'Tab',
        shiftKey: true,
        action: () => this.focusPrevious(),
        description: 'Orqaga tab',
        category: 'Focus'
      }
    ];

    defaultShortcuts.forEach(shortcut => this.addShortcut(shortcut));
  }

  /**
   * Event listenerlarni sozlash
   */
  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));
    
    // DOM o'zgarishlarini kuzatish
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Focus managementni yaxshilash
   */
  private enhanceFocusManagement(): void {
    this.updateFocusableElements();
    this.addSkipLinks();
    this.enhanceFocusIndicators();
  }

  /**
   * Klaviatura hodisalarini boshqarish
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.settings.enabled) return;

    const shortcutKey = this.getShortcutKey(event);
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut) {
      // Input elementlarda ba'zi shortcutlarni o'chirib qo'yish
      const activeElement = document.activeElement as HTMLElement;
      const isInputElement = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      // Input elementlarda faqat ba'zi shortcutlar ishlashi kerak
      if (isInputElement && !this.isAllowedInInput(shortcut)) {
        return;
      }

      event.preventDefault();
      shortcut.action();

      // Screen reader uchun e'lon qilish
      if (this.settings.announceNavigation) {
        this.announce(shortcut.description);
      }
    }
  }

  /**
   * Shortcut kalitini yaratish
   */
  private getShortcutKey(event: KeyboardEvent): string {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    if (event.metaKey) parts.push('meta');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  /**
   * Input elementlarda ruxsat etilgan shortcutlar
   */
  private isAllowedInInput(shortcut: KeyboardShortcut): boolean {
    const allowedKeys = ['Escape', 'Tab', 'F1', 'F2', 'F3', 'F4', 'F5'];
    return allowedKeys.includes(shortcut.key) || 
           (shortcut.altKey && shortcut.key !== '/');
  }

  /**
   * Focus olish hodisasi
   */
  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    
    if (this.settings.highlightFocused) {
      this.highlightElement(target);
    }

    // Screen reader uchun ma'lumot
    if (this.settings.announceNavigation) {
      this.announceElement(target);
    }
  }

  /**
   * Focus yo'qotish hodisasi
   */
  private handleFocusOut(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    this.removeHighlight(target);
  }

  /**
   * Focusable elementlarni yangilash
   */
  private updateFocusableElements(): void {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    this.focusedElements = Array.from(document.querySelectorAll(selectors))
      .filter(el => this.isVisible(el as HTMLElement)) as HTMLElement[];
  }

  /**
   * Elementning ko'rinadigan ekanligini tekshirish
   */
  private isVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    
    return rect.width > 0 && 
           rect.height > 0 && 
           style.visibility !== 'hidden' && 
           style.display !== 'none';
  }

  /**
   * Keyingi elementga focus qilish
   */
  private focusNext(): void {
    this.updateFocusableElements();
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = this.focusedElements.indexOf(currentElement);
    
    if (currentIndex < this.focusedElements.length - 1) {
      this.focusedElements[currentIndex + 1].focus();
    } else {
      this.focusedElements[0]?.focus();
    }
  }

  /**
   * Oldingi elementga focus qilish
   */
  private focusPrevious(): void {
    this.updateFocusableElements();
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = this.focusedElements.indexOf(currentElement);
    
    if (currentIndex > 0) {
      this.focusedElements[currentIndex - 1].focus();
    } else {
      this.focusedElements[this.focusedElements.length - 1]?.focus();
    }
  }

  /**
   * Qidiruv maydoniga focus qilish
   */
  private focusSearchBox(): void {
    const searchBox = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="qidiruv"]') as HTMLInputElement;
    if (searchBox) {
      searchBox.focus();
      searchBox.select();
    }
  }

  /**
   * Yordam modalini ko'rsatish
   */
  private showHelpModal(): void {
    // Help modal componentiga event yuborish
    const event = new CustomEvent('show-keyboard-help');
    document.dispatchEvent(event);
  }

  /**
   * Modal yopish
   */
  private closeModal(): void {
    // Barcha ochiq modallarni yopish
    const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
    modals.forEach(modal => {
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="yop"], .close') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    });
  }

  /**
   * Elementni highlight qilish
   */
  private highlightElement(element: HTMLElement): void {
    if (!this.settings.highlightFocused) return;

    element.classList.add('keyboard-focused');
    
    // CSS qo'shish (agar mavjud bo'lmasa)
    if (!document.querySelector('#keyboard-focus-styles')) {
      const style = document.createElement('style');
      style.id = 'keyboard-focus-styles';
      style.textContent = `
        .keyboard-focused {
          outline: 3px solid #ff6b6b !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 2px #fff, 0 0 0 5px #ff6b6b !important;
          position: relative !important;
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Highlight olib tashlash
   */
  private removeHighlight(element: HTMLElement): void {
    element.classList.remove('keyboard-focused');
  }

  /**
   * Focus indikatorlarini yaxshilash
   */
  private enhanceFocusIndicators(): void {
    const style = document.createElement('style');
    style.id = 'enhanced-focus-indicators';
    style.textContent = `
      *:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
      
      button:focus,
      a:focus,
      input:focus,
      select:focus,
      textarea:focus {
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Skip linklar qo'shish
   */
  private addSkipLinks(): void {
    if (!this.settings.skipLinks) return;
    if (document.querySelector('.skip-links')) return;

    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Asosiy kontentga o'tish (Enter)</a>
      <a href="#navigation" class="skip-link">Navigatsiyaga o'tish (Alt+N)</a>
      <a href="#search" class="skip-link">Qidiruvga o'tish (/)</a>
    `;

    const skipLinksStyle = document.createElement('style');
    skipLinksStyle.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 10000;
      }
      .skip-link {
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .skip-link:focus {
        position: static;
        width: auto;
        height: auto;
        left: 6px;
        top: 6px;
      }
    `;

    document.head.appendChild(skipLinksStyle);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  /**
   * Screen reader uchun e'lon qilish
   */
  private announce(message: string): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }

  /**
   * Element haqida ma'lumot berish
   */
  private announceElement(element: HTMLElement): void {
    if (!this.settings.announceNavigation) return;

    let announcement = '';
    
    if (element.tagName === 'BUTTON') {
      announcement = `Tugma: ${element.textContent || element.getAttribute('aria-label') || 'Nomsiz'}`;
    } else if (element.tagName === 'A') {
      announcement = `Havola: ${element.textContent || element.getAttribute('aria-label') || 'Nomsiz'}`;
    } else if (element.tagName === 'INPUT') {
      const type = element.getAttribute('type') || 'text';
      const label = element.getAttribute('aria-label') || element.getAttribute('placeholder') || 'Kiritish maydoni';
      announcement = `${type} kiritish: ${label}`;
    }
    
    if (announcement) {
      this.announce(announcement);
    }
  }

  /**
   * Shortcut qo'shish
   */
  addShortcut(shortcut: KeyboardShortcut): void {
    const key = this.buildShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Shortcut olib tashlash
   */
  removeShortcut(shortcut: KeyboardShortcut): void {
    const key = this.buildShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  /**
   * Shortcut kalitini yaratish
   */
  private buildShortcutKey(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('ctrl');
    if (shortcut.shiftKey) parts.push('shift');
    if (shortcut.altKey) parts.push('alt');
    if (shortcut.metaKey) parts.push('meta');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  /**
   * Barcha shortcutlarni olish
   */
  getAllShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Kategoriya bo'yicha shortcutlar
   */
  getShortcutsByCategory(category: string): KeyboardShortcut[] {
    return this.getAllShortcuts().filter(s => s.category === category);
  }

  /**
   * Sozlamalarni yangilash
   */
  updateSettings(newSettings: Partial<NavigationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    
    if (newSettings.skipLinks !== undefined) {
      if (newSettings.skipLinks) {
        this.addSkipLinks();
      } else {
        this.removeSkipLinks();
      }
    }
  }

  /**
   * Skip linklarni olib tashlash
   */
  private removeSkipLinks(): void {
    const skipLinks = document.querySelector('.skip-links');
    if (skipLinks) {
      skipLinks.remove();
    }
  }

  /**
   * Sozlamalarni olish
   */
  getSettings(): NavigationSettings {
    return { ...this.settings };
  }

  /**
   * Sozlamalarni saqlash
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Keyboard navigation sozlamalarini saqlashda xato:', error);
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
      console.error('Keyboard navigation sozlamalarini yuklashda xato:', error);
    }
  }
}

// CSS utility classes qo'shish
const utilityCSS = `
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
`;

const style = document.createElement('style');
style.textContent = utilityCSS;
document.head.appendChild(style);

// Singleton instance
export const keyboardNavigationService = new KeyboardNavigationService();
export default keyboardNavigationService;
