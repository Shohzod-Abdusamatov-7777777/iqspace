<template>
	<div class="accessibility-suite">
		<!-- Accessibility komponetlari -->

		<!-- Voice Control (Ovoz bilan boshqarish) -->
		<VoiceControl v-if="enabledFeatures.voice" />

		<!-- TTS Control (Matn o'qish) -->
		<TTSControl v-if="enabledFeatures.tts" />

		<!-- Visual Accessibility Panel (Ko'rish sozlamalari) -->
		<AccessibilityPanel v-if="enabledFeatures.visual" />

		<!-- AI Chatbot (AI yordamchi) -->
		<AIChatbot v-if="enabledFeatures.ai" />

		<!-- Keyboard Help Modal -->
		<KeyboardHelpModal v-model="showKeyboardHelp" v-if="enabledFeatures.keyboard" />

		<!-- Quick Actions Mobile Menu (Mobil uchun) -->
		<QuickActionsMenu v-if="isMobile && enabledFeatures.mobile" :show="showQuickActions" @close="showQuickActions = false" />

		<!-- Accessibility Toolbar (Asosiy toolbar) -->
		<div
			v-if="showToolbar"
			class="accessibility-toolbar fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-b-lg shadow-lg border-x border-b px-4 py-2"
		>
			<div class="flex items-center space-x-3">
				<!-- Suite toggle -->
				<button
					@click="toggleSuite"
					:class="[
						'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300',
						suiteEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600',
					]"
					:title="suiteEnabled ? 'Accessibility o\'chirish' : 'Accessibility yoqish'"
					:aria-label="suiteEnabled ? 'Accessibility\'ni o\'chirish' : 'Accessibility\'ni yoqish'"
				>
					<Usb class="w-5 h-5" />
				</button>

				<!-- Quick toggles -->
				<div class="flex items-center space-x-1">
					<button @click="toggleFeature('voice')" :class="getFeatureButtonClass('voice')" title="Ovoz boshqarish" aria-label="Ovoz boshqarish">
						<Mic class="w-4 h-4" />
					</button>

					<button @click="toggleFeature('tts')" :class="getFeatureButtonClass('tts')" title="Matn o'qish" aria-label="Matn o'qish">
						<Volume2 class="w-4 h-4" />
					</button>

					<button
						@click="toggleFeature('visual')"
						:class="getFeatureButtonClass('visual')"
						title="Ko'rish sozlamalari"
						aria-label="Ko'rish sozlamalari"
					>
						<Eye class="w-4 h-4" />
					</button>

					<button @click="toggleFeature('ai')" :class="getFeatureButtonClass('ai')" title="AI yordamchi" aria-label="AI yordamchi">
						<Bot class="w-4 h-4" />
					</button>

					<button
						@click="toggleFeature('keyboard')"
						:class="getFeatureButtonClass('keyboard')"
						title="Klaviatura yordam"
						aria-label="Klaviatura yordam"
					>
						<Keyboard class="w-4 h-4" />
					</button>
				</div>

				<!-- Settings -->
				<button
					@click="showSettings = !showSettings"
					class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
					title="Suite sozlamalari"
					aria-label="Sozlamalar"
				>
					<Settings class="w-4 h-4" />
				</button>

				<!-- Minimize/Close -->
				<button
					@click="showToolbar = false"
					class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
					title="Toolbarni yashirish"
					aria-label="Yashirish"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Settings panel -->
			<div v-if="showSettings" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4">
				<h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Accessibility Suite sozlamalari</h3>

				<div class="space-y-3">
					<!-- Auto-start -->
					<label class="flex items-center justify-between">
						<span class="text-sm text-gray-700 dark:text-gray-300">Avtomatik boshlash</span>
						<button
							@click="updateSetting('autoStart', !settings.autoStart)"
							:class="getToggleClass(settings.autoStart)"
							role="switch"
							:aria-checked="settings.autoStart"
						>
							<span :class="getToggleThumbClass(settings.autoStart)" />
						</button>
					</label>

					<!-- Show toolbar -->
					<label class="flex items-center justify-between">
						<span class="text-sm text-gray-700 dark:text-gray-300">Toolbarni ko'rsatish</span>
						<button
							@click="updateSetting('showToolbarByDefault', !settings.showToolbarByDefault)"
							:class="getToggleClass(settings.showToolbarByDefault)"
							role="switch"
							:aria-checked="settings.showToolbarByDefault"
						>
							<span :class="getToggleThumbClass(settings.showToolbarByDefault)" />
						</button>
					</label>

					<!-- Announce changes -->
					<label class="flex items-center justify-between">
						<span class="text-sm text-gray-700 dark:text-gray-300">O'zgarishlarni e'lon qilish</span>
						<button
							@click="updateSetting('announceChanges', !settings.announceChanges)"
							:class="getToggleClass(settings.announceChanges)"
							role="switch"
							:aria-checked="settings.announceChanges"
						>
							<span :class="getToggleThumbClass(settings.announceChanges)" />
						</button>
					</label>
				</div>

				<!-- Reset button -->
				<div class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
					<button @click="resetAllSettings" class="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm">
						Barcha sozlamalarni reset qilish
					</button>
				</div>
			</div>
		</div>

		<!-- Floating Access Button (Toolbar yashirilgan bo'lsa) -->
		<button
			v-if="!showToolbar"
			@click="showToolbar = true"
			class="fixed top-4 right-4 z-50 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
			title="Accessibility Suite ochish"
			aria-label="Accessibility Suite"
		>
			<Usb class="w-6 h-6 mx-auto" />
		</button>

		<!-- Status announcer (Screen reader uchun) -->
		<div ref="announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from "vue";
import { Usb, Mic, Volume2, Eye, Bot, Keyboard, Settings, X } from "lucide-vue-next";

// Komponentlarni import qilish
import VoiceControl from "./VoiceControl.vue";
import TTSControl from "./TTSControl.vue";
import AccessibilityPanel from "./AccessibilityPanel.vue";
import AIChatbot from "./AIChatbot.vue";
import KeyboardHelpModal from "./KeyboardHelpModal.vue";
import QuickActionsMenu from "./QuickActionsMenu.vue";

// Servicelarni import qilish
import mobileAccessibilityService from "@/services/mobileAccessibility";

// Suite sozlamalari interfeysi
interface SuiteSettings {
	autoStart: boolean;
	showToolbarByDefault: boolean;
	announceChanges: boolean;
	enabledFeatures: {
		voice: boolean;
		tts: boolean;
		visual: boolean;
		ai: boolean;
		keyboard: boolean;
		mobile: boolean;
	};
}

// Reactive state
const suiteEnabled = ref(true);
const showToolbar = ref(true);
const showSettings = ref(false);
const showKeyboardHelp = ref(false);
const showQuickActions = ref(false);
const announcer = ref<HTMLElement>();

// Mobile detection
const isMobile = computed(() => mobileAccessibilityService.isMobileDevice);

// Suite settings
const settings = reactive<SuiteSettings>({
	autoStart: true,
	showToolbarByDefault: true,
	announceChanges: true,
	enabledFeatures: {
		voice: true,
		tts: true,
		visual: true,
		ai: true,
		keyboard: true,
		mobile: true,
	},
});

// Enabled features computed
const enabledFeatures = computed(() => {
	if (!suiteEnabled.value) {
		return {
			voice: false,
			tts: false,
			visual: false,
			ai: false,
			keyboard: false,
			mobile: false,
		};
	}
	return settings.enabledFeatures;
});

/**
 * Component lifecycle
 */
onMounted(() => {
	loadSettings();
	setupEventListeners();

	if (settings.autoStart) {
		initializeSuite();
	}

	showToolbar.value = settings.showToolbarByDefault;
});

onUnmounted(() => {
	removeEventListeners();
});

/**
 * Suite'ni initialize qilish
 */
const initializeSuite = (): void => {
	// Barcha servicelarni activate qilish
	if (enabledFeatures.value.mobile && isMobile.value) {
		mobileAccessibilityService.updateSettings({ enabled: true });
	}

	// CSS classlarni qo'shish
	document.body.classList.add("accessibility-suite-active");

	announce("Accessibility Suite yoqildi");
};

/**
 * Suite'ni toggle qilish
 */
const toggleSuite = (): void => {
	suiteEnabled.value = !suiteEnabled.value;

	if (suiteEnabled.value) {
		initializeSuite();
		announce("Accessibility Suite yoqildi");
	} else {
		document.body.classList.remove("accessibility-suite-active");
		announce("Accessibility Suite o'chirildi");
	}

	saveSettings();
};

/**
 * Feature toggle
 */
const toggleFeature = (feature: keyof typeof settings.enabledFeatures): void => {
	settings.enabledFeatures[feature] = !settings.enabledFeatures[feature];
	saveSettings();

	const featureNames = {
		voice: "Ovoz boshqarish",
		tts: "Matn o'qish",
		visual: "Ko'rish sozlamalari",
		ai: "AI yordamchi",
		keyboard: "Klaviatura yordam",
		mobile: "Mobil xususiyatlar",
	};

	const status = settings.enabledFeatures[feature] ? "yoqildi" : "o'chirildi";
	announce(`${featureNames[feature]} ${status}`);
};

/**
 * Feature button class
 */
const getFeatureButtonClass = (feature: keyof typeof settings.enabledFeatures): string => {
	const baseClass = "p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs";
	return `${baseClass} ${
		enabledFeatures.value[feature] ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
	}`;
};

/**
 * Toggle switch classes
 */
const getToggleClass = (enabled: boolean): string => {
	return `relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
		enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
	}`;
};

const getToggleThumbClass = (enabled: boolean): string => {
	return `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`;
};

/**
 * Settings update
 */
const updateSetting = <K extends keyof SuiteSettings>(key: K, value: SuiteSettings[K]): void => {
	settings[key] = value;
	saveSettings();

	if (key === "announceChanges") {
		announce(value ? "E'lonlar yoqildi" : "E'lonlar o'chirildi");
	}
};

/**
 * Reset all settings
 */
const resetAllSettings = (): void => {
	// Default settings
	Object.assign(settings, {
		autoStart: true,
		showToolbarByDefault: true,
		announceChanges: true,
		enabledFeatures: {
			voice: true,
			tts: true,
			visual: true,
			ai: true,
			keyboard: true,
			mobile: true,
		},
	});

	suiteEnabled.value = true;
	saveSettings();
	announce("Barcha sozlamalar reset qilindi");
};

/**
 * Event listeners
 */
const setupEventListeners = (): void => {
	// Global keyboard shortcuts
	document.addEventListener("keydown", handleGlobalKeydown);

	// Quick actions for mobile
	document.addEventListener("open-quick-actions", handleOpenQuickActions);

	// Suite activation shortcut
	document.addEventListener("keydown", handleSuiteShortcut);
};

const removeEventListeners = (): void => {
	document.removeEventListener("keydown", handleGlobalKeydown);
	document.removeEventListener("open-quick-actions", handleOpenQuickActions);
	document.removeEventListener("keydown", handleSuiteShortcut);
};

/**
 * Keyboard handlers
 */
const handleGlobalKeydown = (event: KeyboardEvent): void => {
	// Ctrl + Shift + ? - Show keyboard help
	if (event.ctrlKey && event.shiftKey && event.key === "?") {
		event.preventDefault();
		showKeyboardHelp.value = true;
	}
};

const handleSuiteShortcut = (event: KeyboardEvent): void => {
	// Ctrl + Alt + A - Toggle accessibility suite
	if (event.ctrlKey && event.altKey && event.key === "a") {
		event.preventDefault();
		toggleSuite();
	}
};

const handleOpenQuickActions = (): void => {
	if (isMobile.value) {
		showQuickActions.value = true;
	}
};

/**
 * Screen reader announcements
 */
const announce = (message: string): void => {
	if (!settings.announceChanges || !announcer.value) return;

	announcer.value.textContent = message;

	// Clear after announcement
	setTimeout(() => {
		if (announcer.value) {
			announcer.value.textContent = "";
		}
	}, 1000);
};

/**
 * Settings persistence
 */
const saveSettings = (): void => {
	try {
		const settingsToSave = {
			...settings,
			suiteEnabled: suiteEnabled.value,
			showToolbar: showToolbar.value,
		};
		localStorage.setItem("accessibility-suite-settings", JSON.stringify(settingsToSave));
	} catch (error) {
		console.error("Accessibility suite sozlamalarini saqlashda xato:", error);
	}
};

const loadSettings = (): void => {
	try {
		const saved = localStorage.getItem("accessibility-suite-settings");
		if (saved) {
			const parsedSettings = JSON.parse(saved);
			Object.assign(settings, parsedSettings);
			suiteEnabled.value = parsedSettings.suiteEnabled ?? true;
			showToolbar.value = parsedSettings.showToolbar ?? true;
		}
	} catch (error) {
		console.error("Accessibility suite sozlamalarini yuklashda xato:", error);
	}
};

// Watch for mobile-specific changes
watch(isMobile, (newValue) => {
	if (newValue && enabledFeatures.value.mobile) {
		mobileAccessibilityService.updateSettings({ enabled: true });
	}
});
</script>

<style scoped>
.accessibility-suite {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Toolbar animations */
.accessibility-toolbar {
	transition: all 0.3s ease;
}

/* Screen reader only content */
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

/* High contrast mode */
@media (prefers-contrast: high) {
	.accessibility-toolbar,
	.accessibility-toolbar button {
		border: 2px solid currentColor;
	}
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
	.accessibility-suite *,
	.accessibility-suite *::before,
	.accessibility-suite *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}

/* Mobile optimizations */
@media (max-width: 768px) {
	.accessibility-toolbar {
		left: 4px;
		right: 4px;
		transform: none;
		max-width: calc(100vw - 8px);
	}

	.accessibility-toolbar .flex {
		flex-wrap: wrap;
		gap: 8px;
	}

	.accessibility-toolbar button {
		min-width: 40px;
		min-height: 40px;
	}
}

/* Global accessibility enhancements when suite is active */
:global(.accessibility-suite-active) {
	scroll-behavior: smooth;
}

:global(.accessibility-suite-active *:focus) {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

:global(.accessibility-suite-active button),
:global(.accessibility-suite-active a),
:global(.accessibility-suite-active input),
:global(.accessibility-suite-active select),
:global(.accessibility-suite-active textarea) {
	transition: all 0.2s ease;
}

:global(.accessibility-suite-active button:hover),
:global(.accessibility-suite-active a:hover) {
	transform: scale(1.05);
}
</style>
