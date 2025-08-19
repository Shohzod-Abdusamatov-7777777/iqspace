<template>
	<n-layout-footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6" bordered>
		<div class="max-w-7xl mx-auto px-6">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<!-- Left side - Copyright -->
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<div class="w-6 h-6 rounded-md flex items-center justify-center">
							<img src="/src/assets/images/logo/2.3.png" alt="IqSpace" class="w-full h-full object-contain" />
						</div>
						<span class="text-sm font-medium text-gray-900 dark:text-white"> IqSpace </span>
					</div>
					<span class="text-sm text-gray-500 dark:text-gray-400"> © {{ currentYear }} Barcha huquqlar himoyalangan </span>
				</div>

				<!-- Center - Links -->
				<div class="flex items-center gap-6">
					<a href="#" class="text-sm dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
						Foydalanish shartlari
					</a>
					<a href="#" class="text-sm dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"> Maxfiylik siyosati </a>
					<a href="#" class="text-sm dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"> Yordam </a>
				</div>

				<!-- Right side - Social links and version -->
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<n-button quaternary circle size="small">
							<template #icon>
								<n-icon size="16">
									<Mail />
								</n-icon>
							</template>
						</n-button>
						<n-button quaternary circle size="small">
							<template #icon>
								<span class="text-blue-500">📱</span>
							</template>
						</n-button>
						<n-button quaternary circle size="small">
							<template #icon>
								<span class="text-red-500">📺</span>
							</template>
						</n-button>
					</div>

					<n-tag size="small" type="info"> v1.0.0 </n-tag>
				</div>
			</div>

			<!-- Mobile version - simplified layout -->
			<div class="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<div class="text-center">
					<div class="flex justify-center gap-4 mb-3">
						<n-button quaternary circle size="small">
							<template #icon>
								<n-icon size="16">
									<Mail />
								</n-icon>
							</template>
						</n-button>
						<n-button quaternary circle size="small">
							<template #icon>
								<span class="text-blue-500">📱</span>
							</template>
						</n-button>
						<n-button quaternary circle size="small">
							<template #icon>
								<span class="text-red-500">📺</span>
							</template>
						</n-button>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">IqSpace Ta'lim Platformasi v1.0.0</p>
				</div>
			</div>
		</div>
	</n-layout-footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NLayoutFooter, NIcon, NButton, NTag } from "naive-ui";
import { BookOpen, Mail } from "lucide-vue-next";

// Computed
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.n-layout-footer {
	margin-top: auto;
}
</style>
