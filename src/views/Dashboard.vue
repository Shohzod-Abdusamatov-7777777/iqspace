<template>
	<DashboardLayout>
		<!-- Breadcrumb -->
		<div class="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<n-breadcrumb>
				<n-breadcrumb-item>
					<router-link to="/dashboard" class="flex items-center gap-2">
						<n-icon size="16">
							<Home />
						</n-icon>
						Bosh sahifa
					</router-link>
				</n-breadcrumb-item>
				<n-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path">
					<router-link v-if="crumb.path" :to="crumb.path">
						{{ crumb.title }}
					</router-link>
					<span v-else>{{ crumb.title }}</span>
				</n-breadcrumb-item>
			</n-breadcrumb>
		</div>
		<!-- Main content -->
		<main class="p-6">
			<router-view v-slot="{ Component }">
				<transition name="page" mode="out-in" enter-active-class="animate-fade-in" leave-active-class="animate-fade-out">
					<component :is="Component" />
				</transition>
			</router-view>
		</main>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { Home } from "lucide-vue-next";
import { findMenuItemByPath } from "@/utils/menu";

const route = useRoute();

// Breadcrumbs
const breadcrumbs = computed(() => {
	const pathSegments = route.path.split("/").filter(Boolean);
	const crumbs = [];

	// Build breadcrumbs from route path
	let currentPath = "";
	for (let i = 1; i < pathSegments.length; i++) {
		currentPath += "/" + pathSegments[i];
		const menuItem = findMenuItemByPath(currentPath);

		if (menuItem) {
			crumbs.push({
				title: menuItem.title,
				path: currentPath === route.path ? null : currentPath,
			});
		} else {
			// Fallback for custom paths
			const segment = pathSegments[i];
			const title = segment.charAt(0).toUpperCase() + segment.slice(1);
			crumbs.push({
				title: title,
				path: currentPath === route.path ? null : currentPath,
			});
		}
	}

	return crumbs;
});
</script>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
	transition: all 0.3s ease;
}

.page-enter-from {
	opacity: 0;
	transform: translateY(10px);
}

.page-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Fade animations */
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fade-out {
	from {
		opacity: 1;
		transform: translateY(0);
	}
	to {
		opacity: 0;
		transform: translateY(-10px);
	}
}

.animate-fade-in {
	animation: fade-in 0.3s ease-out;
}

.animate-fade-out {
	animation: fade-out 0.3s ease-out;
}
</style>
