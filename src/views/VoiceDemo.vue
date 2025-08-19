<template>
	<main class="voice-demo p-6 max-w-4xl mx-auto" role="main" aria-labelledby="demo-title">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h1 id="demo-title" class="text-3xl font-bold text-gray-800 dark:text-white mb-6">🎤 Ovoz bilan boshqarish demo</h1>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- Demo ma'lumotlari -->
				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Qanday ishlatish:</h2>
					<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
						<ol class="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
							<li>Pastki o'ng burchakdagi mikrofon tugmasini bosing</li>
							<li>Buyruqni aniq va ravshan aytib bering</li>
							<li>Sahifa avtomatik ravishda o'tadi</li>
						</ol>
					</div>

					<h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Sinab ko'ring:</h3>
					<div class="space-y-2">
						<button
							@click="testCommand('bosh sahifa')"
							class="block w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 rounded-lg transition-colors"
						>
							💬 "Bosh sahifa" deb ayting
						</button>
						<button
							@click="testCommand('profil')"
							class="block w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
						>
							💬 "Profil" deb ayting
						</button>
						<button
							v-if="userRole === 'teacher'"
							@click="testCommand('kurslarimga o\'t')"
							class="block w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
						>
							💬 "Kurslarimga o't" deb ayting
						</button>
						<button
							v-if="userRole === 'student'"
							@click="testCommand('kurslarim')"
							class="block w-full text-left px-4 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 rounded-lg transition-colors"
						>
							💬 "Kurslarim" deb ayting
						</button>
					</div>
				</div>

				<!-- Buyruqlar ro'yxati -->
				<div class="space-y-4">
					<h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Barcha buyruqlar:</h2>

					<div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
						<div class="space-y-3">
							<!-- Umumiy buyruqlar -->
							<div>
								<h4 class="font-medium text-gray-600 dark:text-gray-400 mb-2">Umumiy:</h4>
								<div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<div>• "Bosh sahifa"</div>
									<div>• "Profil"</div>
									<div>• "Xabarlar"</div>
									<div>• "Yordam"</div>
									<div>• "To'xtat"</div>
								</div>
							</div>

							<!-- O'qituvchi buyruqlari -->
							<div v-if="userRole === 'teacher'">
								<h4 class="font-medium text-gray-600 dark:text-gray-400 mb-2">O'qituvchi:</h4>
								<div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<div>• "Kurslarimga o't"</div>
									<div>• "O'quvchilar"</div>
									<div>• "Topshiriqlar"</div>
									<div>• "Dars jadvali"</div>
									<div>• "Baholash"</div>
									<div>• "Davomat"</div>
									<div>• "Materiallar"</div>
								</div>
							</div>

							<!-- Talaba buyruqlari -->
							<div v-if="userRole === 'student'">
								<h4 class="font-medium text-gray-600 dark:text-gray-400 mb-2">Talaba:</h4>
								<div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
									<div>• "Kurslarim"</div>
									<div>• "Topshiriqlarim"</div>
									<div>• "Baholarim"</div>
									<div>• "To'lovlar"</div>
									<div>• "Sertifikatlar"</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Klaviatura shortcuts -->
			<div class="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
				<h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">⌨️ Klaviatura shortcuts:</h3>
				<div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
					<div>
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> +
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Shift</kbd> +
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">V</kbd> - Ovozni yoqish/o'chirish
					</div>
					<div>
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> +
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Shift</kbd> +
						<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">H</kbd> - Yordam
					</div>
					<div><kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Escape</kbd> - Yopish/To'xtatish</div>
				</div>
			</div>

			<!-- Test natijalari -->
			<div
				v-if="testResult"
				class="mt-6 p-4 rounded-lg"
				:class="
					testResult.type === 'success'
						? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
						: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
				"
			>
				<div class="flex items-center">
					<component :is="testResult.type === 'success' ? CheckCircle : X" class="w-5 h-5 mr-2" />
					{{ testResult.message }}
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { CheckCircle, X } from "lucide-vue-next";

// Router va Store
const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const testResult = ref<{ type: "success" | "error"; message: string } | null>(null);

// User role olish
const userRole = computed(() => {
	return authStore.userRole || "student";
});

// Test buyruq
const testCommand = (command: string) => {
	try {
		// Bu yerda VoiceControl komponentidagi logikani simulate qilamiz
		const voiceCommands: Record<string, string> = {
			"bosh sahifa": "/dashboard",
			profil: "/dashboard/profile",
			xabarlar: "/dashboard/messages",
			"kurslarimga o't": "/dashboard/teacher/courses",
			kurslarim: "/dashboard/student/courses",
			topshiriqlarim: "/dashboard/student/assignments",
			baholarim: "/dashboard/student/grades",
		};

		const route = voiceCommands[command];
		if (route) {
			router.push(route);
			testResult.value = {
				type: "success",
				message: `"${command}" buyrugi muvaffaqiyatli bajarildi! Sahifa: ${route}`,
			};
		} else {
			testResult.value = {
				type: "error",
				message: `"${command}" buyrugi topilmadi`,
			};
		}

		// Natijani 5 soniyadan keyin tozalash
		setTimeout(() => {
			testResult.value = null;
		}, 5000);
	} catch (error) {
		testResult.value = {
			type: "error",
			message: "Xato yuz berdi: " + (error as Error).message,
		};

		setTimeout(() => {
			testResult.value = null;
		}, 5000);
	}
};
</script>

<style scoped>
kbd {
	font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
	font-size: 0.75rem;
	font-weight: 600;
}

.voice-demo {
	min-height: calc(100vh - 200px);
}

/* Accessibility enhancements */
.voice-demo *:focus {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

.voice-demo button:hover {
	transform: scale(1.02);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
	.voice-demo {
		background: white;
		color: black;
	}
	
	.voice-demo .dark\:bg-gray-800 {
		background: white !important;
		border: 2px solid black;
	}
	
	.voice-demo button {
		border: 2px solid currentColor;
	}
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	.voice-demo *,
	.voice-demo *::before,
	.voice-demo *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
	
	.voice-demo button:hover {
		transform: none;
	}
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
</style>
