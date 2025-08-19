<template>
	<div class="tts-control fixed top-4 right-4 z-50">
		<!-- TTS Tugmalar -->
		<div class="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
			<!-- Play/Pause tugmasi -->
			<button
				@click="toggleReading"
				:disabled="!ttsSupported"
				:class="[
					'p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300',
					isReading ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white',
					!ttsSupported && 'opacity-50 cursor-not-allowed',
				]"
				:title="isReading ? 'O\'qishni to\'xtatish' : 'Sahifani o\'qish'"
				:aria-label="isReading ? 'To\'xtat' : 'O\'qish'"
			>
				<component :is="isReading ? Square : Play" class="w-5 h-5" />
			</button>

			<!-- Settings tugmasi -->
			<button
				@click="showSettings = !showSettings"
				class="p-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
				title="TTS sozlamalari"
				aria-label="Sozlamalar"
			>
				<Settings class="w-5 h-5" />
			</button>

			<!-- Tanlangan matnni o'qish -->
			<button
				@click="readSelected"
				:disabled="!selectedText"
				:class="[
					'p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300',
					selectedText ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed',
				]"
				title="Tanlangan matnni o'qish"
				aria-label="Tanlanganini o'qish"
			>
				<Type class="w-5 h-5" />
			</button>
		</div>

		<!-- Sozlamalar paneli -->
		<div v-if="showSettings" class="absolute top-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">TTS Sozlamalari</h3>
				<button @click="showSettings = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<!-- Ovoz tanlash -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Ovoz turi: </label>
					<select
						v-model="settings.voice"
						@change="saveSettings"
						class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					>
						<option value="">Avto tanlash</option>
						<option v-for="voice in availableVoices" :key="voice.name" :value="voice.name">{{ voice.name }} ({{ voice.lang }})</option>
					</select>
				</div>

				<!-- Tezlik -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Tezlik: {{ settings.rate.toFixed(1) }}x </label>
					<input v-model.number="settings.rate" @input="saveSettings" type="range" min="0.1" max="3" step="0.1" class="w-full" />
				</div>

				<!-- Balandlik -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> Ovoz balandligi: {{ settings.pitch.toFixed(1) }} </label>
					<input v-model.number="settings.pitch" @input="saveSettings" type="range" min="0" max="2" step="0.1" class="w-full" />
				</div>

				<!-- Ovoz kuchi -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Ovoz kuchi: {{ Math.round(settings.volume * 100) }}%
					</label>
					<input v-model.number="settings.volume" @input="saveSettings" type="range" min="0" max="1" step="0.1" class="w-full" />
				</div>

				<!-- Test tugmasi -->
				<button @click="testVoice" class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
					Test qilish
				</button>
			</div>
		</div>

		<!-- Status indikatori -->
		<div v-if="status" class="absolute top-16 right-0 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
			{{ status }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Play, Square, Settings, Type, X } from "lucide-vue-next";
import ttsService, { type TTSOptions, type TTSVoice } from "@/services/tts";

// Reactive state
const isReading = ref(false);
const showSettings = ref(false);
const status = ref("");
const selectedText = ref("");
const ttsSupported = ref(true);
const availableVoices = ref<TTSVoice[]>([]);

// TTS sozlamalari
const settings = ref<TTSOptions>({
	rate: 1,
	pitch: 1,
	volume: 0.8,
	voice: "",
	lang: "uz-UZ",
});

/**
 * Component lifecycle
 */
onMounted(() => {
	// TTS qo'llab-quvvatlash tekshiruvi
	ttsSupported.value = ttsService.isSupported();

	if (ttsSupported.value) {
		// Sozlamalarni yuklash
		const savedSettings = ttsService.loadSettings();
		settings.value = { ...settings.value, ...savedSettings };

		// Ovozlar ro'yxatini yuklash
		loadVoices();

		// Selection tracker
		document.addEventListener("selectionchange", handleSelectionChange);
	}
});

onUnmounted(() => {
	ttsService.stop();
	document.removeEventListener("selectionchange", handleSelectionChange);
});

/**
 * Ovozlar ro'yxatini yuklash
 */
const loadVoices = () => {
	availableVoices.value = ttsService.getAvailableVoices();

	// Agar ovozlar hali yuklanmagan bo'lsa
	if (availableVoices.value.length === 0) {
		setTimeout(loadVoices, 100);
	}
};

/**
 * Matn tanlanishini kuzatish
 */
const handleSelectionChange = () => {
	const selection = window.getSelection();
	selectedText.value = selection?.toString().trim() || "";
};

/**
 * O'qishni boshlash/to'xtatish
 */
const toggleReading = async () => {
	if (isReading.value) {
		ttsService.stop();
		isReading.value = false;
		status.value = "";
	} else {
		try {
			status.value = "O'qilmoqda...";
			isReading.value = true;

			await ttsService.speak(getPageContent(), settings.value);

			status.value = "O'qish tugadi";
			isReading.value = false;

			setTimeout(() => {
				status.value = "";
			}, 2000);
		} catch (error) {
			console.error("TTS xatosi:", error);
			status.value = "Xato yuz berdi";
			isReading.value = false;

			setTimeout(() => {
				status.value = "";
			}, 3000);
		}
	}
};

/**
 * Tanlangan matnni o'qish
 */
const readSelected = async () => {
	if (!selectedText.value) return;

	try {
		status.value = "Tanlangan matn o'qilmoqda...";
		await ttsService.speak(selectedText.value, settings.value);
		status.value = "";
	} catch (error) {
		console.error("TTS xatosi:", error);
		status.value = "Xato yuz berdi";
		setTimeout(() => {
			status.value = "";
		}, 3000);
	}
};

/**
 * Sahifa matnini olish
 */
const getPageContent = (): string => {
	// Asosiy content qismini topish
	const main = document.querySelector("main") || document.querySelector('[role="main"]') || document.querySelector(".main-content") || document.body;

	if (!main) return "";

	// Script va style taglarini o'chirish
	const clone = main.cloneNode(true) as Element;
	const unwantedElements = clone.querySelectorAll("script, style, noscript, .tts-control, .voice-control");
	unwantedElements.forEach((el) => el.remove());

	// Matnni tozalash
	let text = clone.textContent || "";
	text = text.replace(/\s+/g, " ").trim();

	// Qisqa matnlar uchun alternatif
	if (text.length < 50) {
		text = document.title + ". " + text;
	}

	return text;
};

/**
 * Ovozni test qilish
 */
const testVoice = () => {
	const testText = "Salom! Bu ovoz test qilish uchun. Ovoz sozlamalari to'g'ri ishlayapti.";
	ttsService.speak(testText, settings.value);
};

/**
 * Sozlamalarni saqlash
 */
const saveSettings = () => {
	ttsService.saveSettings(settings.value);
};

/**
 * Klaviatura shortcuts
 */
const handleKeydown = (event: KeyboardEvent) => {
	// Ctrl + Shift + R - Read page
	if (event.ctrlKey && event.shiftKey && event.key === "R") {
		event.preventDefault();
		toggleReading();
	}

	// Ctrl + Shift + T - Read selected text
	if (event.ctrlKey && event.shiftKey && event.key === "T") {
		event.preventDefault();
		if (selectedText.value) {
			readSelected();
		}
	}

	// Ctrl + Shift + S - TTS Settings
	if (event.ctrlKey && event.shiftKey && event.key === "S") {
		event.preventDefault();
		showSettings.value = !showSettings.value;
	}
};

// Klaviatura events
onMounted(() => {
	document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.tts-control {
	user-select: none;
}

/* Animations */
.tts-control button {
	transition: all 0.2s ease;
}

.tts-control button:active {
	transform: scale(0.95);
}

/* Focus indicators */
.tts-control button:focus {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Slider styling */
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

/* Dark mode */
.dark input[type="range"] {
	background: #4b5563;
}

/* High contrast mode */
@media (prefers-contrast: high) {
	.tts-control button {
		border: 2px solid currentColor;
	}
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
	.tts-control * {
		transition-duration: 0.01ms !important;
	}
}
</style>
