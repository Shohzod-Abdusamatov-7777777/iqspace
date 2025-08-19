<template>
	<Teleport to="body">
		<div
			v-if="isVisible"
			class="keyboard-help-modal fixed inset-0 z-[9999] flex items-center justify-center p-4"
			role="dialog"
			aria-labelledby="keyboard-help-title"
			aria-modal="true"
			@click.self="close"
		>
			<!-- Backdrop -->
			<div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

			<!-- Modal content -->
			<div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<h2 id="keyboard-help-title" class="text-2xl font-bold text-gray-900 dark:text-white">⌨️ Klaviatura Shortcuts</h2>
					<button
						@click="close"
						class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
						aria-label="Modalni yopish"
					>
						<X class="w-6 h-6" />
					</button>
				</div>

				<!-- Content -->
				<div class="p-6 overflow-y-auto max-h-[70vh]">
					<!-- Search -->
					<div class="mb-6">
						<div class="relative">
							<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Shortcut qidirish..."
								class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<!-- Categories -->
					<div class="space-y-6">
						<div v-for="category in filteredCategories" :key="category.name" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
							<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
								<component :is="category.icon" class="w-5 h-5 mr-2" />
								{{ category.name }}
							</h3>

							<div class="grid gap-3">
								<div
									v-for="shortcut in category.shortcuts"
									:key="shortcut.description"
									class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border"
								>
									<div class="flex-1">
										<div class="text-sm font-medium text-gray-900 dark:text-white">
											{{ shortcut.description }}
										</div>
									</div>

									<div class="flex items-center space-x-1">
										<kbd v-if="shortcut.ctrlKey || shortcut.metaKey" class="keyboard-key">
											{{ isMac ? "⌘" : "Ctrl" }}
										</kbd>
										<span v-if="shortcut.ctrlKey || shortcut.metaKey" class="text-gray-400">+</span>

										<kbd v-if="shortcut.shiftKey" class="keyboard-key">
											{{ isMac ? "⇧" : "Shift" }}
										</kbd>
										<span v-if="shortcut.shiftKey" class="text-gray-400">+</span>

										<kbd v-if="shortcut.altKey" class="keyboard-key">
											{{ isMac ? "⌥" : "Alt" }}
										</kbd>
										<span v-if="shortcut.altKey" class="text-gray-400">+</span>

										<kbd class="keyboard-key">
											{{ formatKey(shortcut.key) }}
										</kbd>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Navigation tips -->
					<div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<h3 class="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
							<Lightbulb class="w-5 h-5 mr-2" />
							Foydalanish maslahatlari:
						</h3>
						<ul class="space-y-2 text-sm text-blue-700 dark:text-blue-300">
							<li class="flex items-start">
								<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
								<span>Tab tugmasi orqali elementlar orasida harakatlaning</span>
							</li>
							<li class="flex items-start">
								<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
								<span>Enter yoki Space tugmasi bilan tugmalarni bosing</span>
							</li>
							<li class="flex items-start">
								<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
								<span>Escape tugmasi bilan modallarni yoping</span>
							</li>
							<li class="flex items-start">
								<span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
								<span>J/K tugmalari bilan elementlar orasida navigatsiya qiling</span>
							</li>
						</ul>
					</div>

					<!-- Settings toggle -->
					<div class="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
						<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Sozlamalar:</h3>
						<div class="space-y-3">
							<label class="flex items-center justify-between">
								<span class="text-sm text-gray-700 dark:text-gray-300">Klaviatura navigatsiyasi</span>
								<button
									@click="toggleSetting('enabled')"
									:class="[
										'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
										settings.enabled ? 'bg-blue-600' : 'bg-gray-200',
									]"
									role="switch"
									:aria-checked="settings.enabled"
								>
									<span
										:class="[
											'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
											settings.enabled ? 'translate-x-6' : 'translate-x-1',
										]"
									/>
								</button>
							</label>

							<label class="flex items-center justify-between">
								<span class="text-sm text-gray-700 dark:text-gray-300">Focus highlight</span>
								<button
									@click="toggleSetting('highlightFocused')"
									:class="[
										'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
										settings.highlightFocused ? 'bg-blue-600' : 'bg-gray-200',
									]"
									role="switch"
									:aria-checked="settings.highlightFocused"
								>
									<span
										:class="[
											'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
											settings.highlightFocused ? 'translate-x-6' : 'translate-x-1',
										]"
									/>
								</button>
							</label>

							<label class="flex items-center justify-between">
								<span class="text-sm text-gray-700 dark:text-gray-300">Skip linklar</span>
								<button
									@click="toggleSetting('skipLinks')"
									:class="[
										'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
										settings.skipLinks ? 'bg-blue-600' : 'bg-gray-200',
									]"
									role="switch"
									:aria-checked="settings.skipLinks"
								>
									<span
										:class="[
											'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
											settings.skipLinks ? 'translate-x-6' : 'translate-x-1',
										]"
									/>
								</button>
							</label>

							<label class="flex items-center justify-between">
								<span class="text-sm text-gray-700 dark:text-gray-300">Screen reader e'lonlari</span>
								<button
									@click="toggleSetting('announceNavigation')"
									:class="[
										'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
										settings.announceNavigation ? 'bg-blue-600' : 'bg-gray-200',
									]"
									role="switch"
									:aria-checked="settings.announceNavigation"
								>
									<span
										:class="[
											'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
											settings.announceNavigation ? 'translate-x-6' : 'translate-x-1',
										]"
									/>
								</button>
							</label>
						</div>
					</div>
				</div>

				<!-- Footer -->
				<div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
					<div class="flex items-center justify-between">
						<p class="text-sm text-gray-600 dark:text-gray-400">
							<Keyboard class="inline w-4 h-4 mr-1" />
							Accessibility uchun mo'ljallangan
						</p>
						<button
							@click="close"
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Yopish
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { X, Search, Lightbulb, Keyboard, Home, User, BookOpen, MessageCircle, Settings, Zap, Navigation } from "lucide-vue-next";
import keyboardNavigationService, { type KeyboardShortcut, type NavigationSettings } from "@/services/keyboardNavigation";

// Props
interface Props {
	modelValue: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
});

// Emits
const emit = defineEmits<{
	"update:modelValue": [value: boolean];
}>();

// Reactive state
const searchQuery = ref("");
const settings = ref<NavigationSettings>(keyboardNavigationService.getSettings());
const isMac = ref(navigator.platform.toUpperCase().indexOf("MAC") >= 0);

// Computed
const isVisible = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit("update:modelValue", value),
});

const categories = computed(() => {
	const shortcuts = keyboardNavigationService.getAllShortcuts();
	const categoryMap = new Map<string, { name: string; icon: any; shortcuts: KeyboardShortcut[] }>();

	// Category icons
	const categoryIcons = {
		Navigatsiya: Navigation,
		"O'qituvchi": User,
		Talaba: BookOpen,
		Utility: Zap,
		Focus: Settings,
	};

	shortcuts.forEach((shortcut) => {
		if (!categoryMap.has(shortcut.category)) {
			categoryMap.set(shortcut.category, {
				name: shortcut.category,
				icon: categoryIcons[shortcut.category as keyof typeof categoryIcons] || Settings,
				shortcuts: [],
			});
		}
		categoryMap.get(shortcut.category)!.shortcuts.push(shortcut);
	});

	return Array.from(categoryMap.values());
});

const filteredCategories = computed(() => {
	if (!searchQuery.value) return categories.value;

	const query = searchQuery.value.toLowerCase();
	return categories.value
		.map((category) => ({
			...category,
			shortcuts: category.shortcuts.filter(
				(shortcut) => shortcut.description.toLowerCase().includes(query) || shortcut.key.toLowerCase().includes(query),
			),
		}))
		.filter((category) => category.shortcuts.length > 0);
});

/**
 * Key formatini yaxshilash
 */
const formatKey = (key: string): string => {
	const keyMap: Record<string, string> = {
		" ": "Space",
		Escape: "Esc",
		ArrowUp: "↑",
		ArrowDown: "↓",
		ArrowLeft: "←",
		ArrowRight: "→",
		Enter: "⏎",
		Tab: "⇥",
		Backspace: "⌫",
		Delete: "⌦",
	};

	return keyMap[key] || key.toUpperCase();
};

/**
 * Modal yopish
 */
const close = (): void => {
	isVisible.value = false;
};

/**
 * Sozlamani o'zgartirish
 */
const toggleSetting = (key: keyof NavigationSettings): void => {
	const newSettings = { ...settings.value };
	newSettings[key] = !newSettings[key] as any;
	settings.value = newSettings;
	keyboardNavigationService.updateSettings(newSettings);
};

/**
 * Event listeners
 */
const handleKeydown = (event: KeyboardEvent): void => {
	if (event.key === "Escape" && isVisible.value) {
		close();
	}
};

const handleShowHelp = (): void => {
	isVisible.value = true;
};

/**
 * Lifecycle
 */
onMounted(() => {
	document.addEventListener("keydown", handleKeydown);
	document.addEventListener("show-keyboard-help", handleShowHelp);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
	document.removeEventListener("show-keyboard-help", handleShowHelp);
});
</script>

<style scoped>
@reference "../../assets/styles/main.css";
.keyboard-key {
	@apply inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded shadow-sm min-w-[1.5rem] h-6;
}

.dark .keyboard-key {
	@apply text-gray-200 bg-gray-700 border-gray-600;
}

/* Animation */
.keyboard-help-modal {
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

/* Focus management inside modal */
.keyboard-help-modal :focus {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
	background: #1e293b;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
	background: #475569;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	.keyboard-help-modal,
	.keyboard-help-modal * {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
</style>
