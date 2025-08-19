/**
 * Visual Accessibility Service
 * Ko'rish qiyinchiliklariga ega foydalanuvchilar uchun vizual sozlamalar
 */

export interface AccessibilitySettings {
  fontSize: number;           // Font o'lchami (%)
  lineHeight: number;         // Qatorlar orasidagi masofa
  letterSpacing: number;      // Harflar orasidagi masofa
  wordSpacing: number;        // So'zlar orasidagi masofa
  contrast: 'normal' | 'high' | 'dark';  // Kontrast rejimi
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'; // Rang ko'rish buzilishi
  readingMode: boolean;       // O'qish rejimi
  highlightLinks: boolean;    // Havolalarni ajratib ko'rsatish
  focusIndicator: boolean;    // Focus ko'rsatkichini kuchaytirish
  reducedMotion: boolean;     // Animatsiyalarni kamaytirish
  cursor: 'normal' | 'large' | 'extra-large'; // Kursor o'lchami
  screenReader: boolean;      // Screen reader optimizatsiya
}

class VisualAccessibilityService {
  private settings: AccessibilitySettings;
  private styleElement: HTMLStyleElement | null = null;
  private readonly storageKey = 'visual-accessibility-settings';

  constructor() {
    this.settings = this.getDefaultSettings();
    this.loadSettings();
    this.createStyleElement();
    this.applySettings();
  }

  /**
   * Standart sozlamalar
   */
  private getDefaultSettings(): AccessibilitySettings {
    return {
      fontSize: 100,
      lineHeight: 1.5,
      letterSpacing: 0,
      wordSpacing: 0,
      contrast: 'normal',
      colorBlindMode: 'none',
      readingMode: false,
      highlightLinks: true,
      focusIndicator: true,
      reducedMotion: false,
      cursor: 'normal',
      screenReader: false
    };
  }

  /**
   * Style elementi yaratish
   */
  private createStyleElement(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'visual-accessibility-styles';
    document.head.appendChild(this.styleElement);
  }

  /**
   * Sozlamalarni olish
   */
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Sozlamani o'zgartirish
   */
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ): void {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Barcha sozlamalarni o'rnatish
   */
  updateSettings(newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Sozlamalarni reset qilish
   */
  resetSettings(): void {
    this.settings = this.getDefaultSettings();
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Sozlamalarni apply qilish
   */
  private applySettings(): void {
    if (!this.styleElement) return;

    const styles = this.generateCSS();
    this.styleElement.textContent = styles;

    // Body classlarini boshqarish
    this.updateBodyClasses();

    // Screen reader optimizatsiya
    if (this.settings.screenReader) {
      this.enableScreenReaderMode();
    } else {
      this.disableScreenReaderMode();
    }
  }

  /**
   * CSS generatsiya qilish
   */
  private generateCSS(): string {
    const { settings } = this;
    
    let css = `
      /* Visual Accessibility Styles */
      .visual-accessibility-active {
        font-size: ${settings.fontSize}% !important;
        line-height: ${settings.lineHeight} !important;
        letter-spacing: ${settings.letterSpacing}px !important;
        word-spacing: ${settings.wordSpacing}px !important;
      }

      .visual-accessibility-active *,
      .visual-accessibility-active *::before,
      .visual-accessibility-active *::after {
        font-size: inherit !important;
        line-height: inherit !important;
        letter-spacing: inherit !important;
        word-spacing: inherit !important;
      }
    `;

    // Kontrast rejimlari
    if (settings.contrast === 'high') {
      css += `
        .visual-accessibility-active {
          filter: contrast(200%) !important;
          background: white !important;
          color: black !important;
        }
        .visual-accessibility-active * {
          background: white !important;
          color: black !important;
          border-color: black !important;
        }
        .visual-accessibility-active img,
        .visual-accessibility-active video {
          filter: contrast(200%) !important;
        }
      `;
    } else if (settings.contrast === 'dark') {
      css += `
        .visual-accessibility-active {
          filter: invert(1) hue-rotate(180deg) !important;
          background: #000 !important;
          color: #fff !important;
        }
      `;
    }

    // Rang ko'rish buzilishi uchun filtrlar
    const colorBlindFilters = {
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)', 
      tritanopia: 'url(#tritanopia-filter)'
    };

    if (settings.colorBlindMode !== 'none') {
      css += `
        .visual-accessibility-active {
          filter: ${colorBlindFilters[settings.colorBlindMode]} !important;
        }
      `;
    }

    // O'qish rejimi
    if (settings.readingMode) {
      css += `
        .visual-accessibility-active {
          background: #f9f9f9 !important;
          color: #333 !important;
          font-family: 'Times New Roman', serif !important;
        }
        .visual-accessibility-active *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) {
          background: transparent !important;
          color: #333 !important;
        }
        .visual-accessibility-active img,
        .visual-accessibility-active video,
        .visual-accessibility-active iframe {
          display: none !important;
        }
      `;
    }

    // Havolalarni ajratib ko'rsatish
    if (settings.highlightLinks) {
      css += `
        .visual-accessibility-active a {
          background: yellow !important;
          color: blue !important;
          text-decoration: underline !important;
          border: 2px solid blue !important;
          padding: 2px 4px !important;
        }
      `;
    }

    // Focus indikatori
    if (settings.focusIndicator) {
      css += `
        .visual-accessibility-active *:focus {
          outline: 4px solid #ff6b6b !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 2px #fff, 0 0 0 6px #ff6b6b !important;
        }
      `;
    }

    // Animatsiyalarni kamaytirish
    if (settings.reducedMotion) {
      css += `
        .visual-accessibility-active *,
        .visual-accessibility-active *::before,
        .visual-accessibility-active *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
    }

    // Kursor o'lchami
    const cursorSizes = {
      normal: '16px',
      large: '24px',
      'extra-large': '32px'
    };

    if (settings.cursor !== 'normal') {
      css += `
        .visual-accessibility-active * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSizes[settings.cursor]}" height="${cursorSizes[settings.cursor]}" viewBox="0 0 24 24"><path fill="black" d="M7.4 1.4L19.4 13.4L14.9 15.1L12.6 19.4L7.4 1.4Z"/></svg>') 0 0, auto !important;
        }
      `;
    }

    return css;
  }

  /**
   * Body classlarini yangilash
   */
  private updateBodyClasses(): void {
    const body = document.body;
    
    // Asosiy class
    if (this.isAnySettingActive()) {
      body.classList.add('visual-accessibility-active');
    } else {
      body.classList.remove('visual-accessibility-active');
    }

    // Alohida classlar
    body.classList.toggle('reduced-motion', this.settings.reducedMotion);
    body.classList.toggle('reading-mode', this.settings.readingMode);
    body.classList.toggle('high-contrast', this.settings.contrast === 'high');
    body.classList.toggle('dark-mode', this.settings.contrast === 'dark');
  }

  /**
   * Biror sozlama faollashtirilganligini tekshirish
   */
  private isAnySettingActive(): boolean {
    const defaults = this.getDefaultSettings();
    return Object.keys(this.settings).some(key => {
      const settingKey = key as keyof AccessibilitySettings;
      return this.settings[settingKey] !== defaults[settingKey];
    });
  }

  /**
   * Screen reader rejimini yoqish
   */
  private enableScreenReaderMode(): void {
    // ARIA labellari va description'larni yaxshilash
    const elements = document.querySelectorAll('img:not([alt]), button:not([aria-label]), input:not([aria-label])');
    elements.forEach(element => {
      if (element.tagName === 'IMG') {
        (element as HTMLImageElement).alt = 'Rasm';
      } else if (element.tagName === 'BUTTON') {
        element.setAttribute('aria-label', 'Tugma');
      } else if (element.tagName === 'INPUT') {
        element.setAttribute('aria-label', 'Kiritish maydoni');
      }
    });

    // Skip linklar qo'shish
    this.addSkipLinks();
  }

  /**
   * Screen reader rejimini o'chirish
   */
  private disableScreenReaderMode(): void {
    // Skip linklarni olib tashlash
    this.removeSkipLinks();
  }

  /**
   * Skip linklar qo'shish
   */
  private addSkipLinks(): void {
    if (document.querySelector('.skip-links')) return;

    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Asosiy kontentga o'tish</a>
      <a href="#navigation" class="skip-link">Navigatsiyaga o'tish</a>
      <a href="#search" class="skip-link">Qidiruvga o'tish</a>
    `;

    const skipLinksStyle = document.createElement('style');
    skipLinksStyle.textContent = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 9999;
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
      }
      .skip-link:focus {
        position: static;
        width: auto;
        height: auto;
      }
    `;

    document.head.appendChild(skipLinksStyle);
    document.body.insertBefore(skipLinks, document.body.firstChild);
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
   * Sozlamalarni saqlash
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Accessibility sozlamalarini saqlashda xato:', error);
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
      console.error('Accessibility sozlamalarini yuklashda xato:', error);
    }
  }

  /**
   * Rang ko'rish buzilishi SVG filtrlarini yaratish
   */
  createColorBlindFilters(): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    
    svg.innerHTML = `
      <defs>
        <!-- Protanopia filter -->
        <filter id="protanopia-filter">
          <feColorMatrix type="matrix" values="0.567,0.433,0,0,0
                                               0.558,0.442,0,0,0
                                               0,0.242,0.758,0,0
                                               0,0,0,1,0"/>
        </filter>
        
        <!-- Deuteranopia filter -->
        <filter id="deuteranopia-filter">
          <feColorMatrix type="matrix" values="0.625,0.375,0,0,0
                                               0.7,0.3,0,0,0
                                               0,0.3,0.7,0,0
                                               0,0,0,1,0"/>
        </filter>
        
        <!-- Tritanopia filter -->
        <filter id="tritanopia-filter">
          <feColorMatrix type="matrix" values="0.95,0.05,0,0,0
                                               0,0.433,0.567,0,0
                                               0,0.475,0.525,0,0
                                               0,0,0,1,0"/>
        </filter>
      </defs>
    `;
    
    document.body.appendChild(svg);
  }

  /**
   * Font o'lchamini o'rnatish
   */
  setFontSize(percentage: number): void {
    this.updateSetting('fontSize', Math.max(50, Math.min(300, percentage)));
  }

  /**
   * Kontrast rejimini almashtirish
   */
  toggleContrast(): void {
    const modes: AccessibilitySettings['contrast'][] = ['normal', 'high', 'dark'];
    const currentIndex = modes.indexOf(this.settings.contrast);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.updateSetting('contrast', modes[nextIndex]);
  }

  /**
   * O'qish rejimini almashtirish
   */
  toggleReadingMode(): void {
    this.updateSetting('readingMode', !this.settings.readingMode);
  }
}

// Singleton instance
export const visualAccessibilityService = new VisualAccessibilityService();
export default visualAccessibilityService;
