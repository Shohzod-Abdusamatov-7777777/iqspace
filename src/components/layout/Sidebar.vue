<template>
	<n-layout-sider
		v-model:collapsed="themeStore.sidebarCollapsed"
		:collapsed-width="0"
		:width="280"
		:native-scrollbar="true"
		collapse-mode="width"
		bordered
		class="h-full bg-white dark:bg-gray-800"
	>
		<div class="flex flex-col h-full">
			<!-- Sidebar header -->
			<div class="border-b flex justify-start px-4 items-center h-16 border-bottom dark:border-gray-700">
				<div class="h-10 rounded-lg flex items-center justify-center">
					<img src="/src/assets/images/logo/1.3.1.png" alt="IqSpace" class="w-full h-full object-contain" />
				</div>
			</div>

			<!-- Navigation menu -->
			<div class="flex-1 overflow-y-auto py-4">
				<n-menu
					:collapsed="themeStore.sidebarCollapsed"
					:collapsed-width="64"
					:collapsed-icon-size="20"
					:options="menuOptions"
					:value="activeKey"
					@update:value="handleMenuSelect"
				/>
			</div>

			<!-- Sidebar footer -->
			<div v-if="!themeStore.sidebarCollapsed" class="p-4 border-t border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
					<n-avatar :size="32" :style="{ backgroundColor: '#4361ee' }">
						{{ authStore.user?.avatar || "U" }}
					</n-avatar>
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium text-gray-900 dark:text-white truncate">
							{{ authStore.user?.name || "Foydalanuvchi" }}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400">
							{{ authStore.user?.email || authStore.user?.phone }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</n-layout-sider>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NLayoutSider, NIcon, NMenu, NAvatar } from "naive-ui";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useMenu } from "@/composables/useMenu";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Computed
const activeKey = computed(() => {
	return route.path;
});

const menuItems = useMenu(authStore.userRole || "");

const menuOptions = computed(() => {
	if (!authStore.userRole) return [];

	return menuItems.value.map((item) => ({
		label: item.title,
		key: item.path || item.id,
		icon: item.icon ? () => h(NIcon, null, { default: () => h(item.icon) }) : undefined,
		children:
			item.children?.map((child) => ({
				label: child.title,
				key: child.path,
				icon: child.icon ? () => h(NIcon, null, { default: () => h(child.icon) }) : undefined,
			})) || undefined,
	}));
});

// Methods
const getRoleLabel = (role?: string | null) => {
	switch (role) {
		case "admin":
			return "Administrator";
		case "teacher":
			return "O'qituvchi";
		case "student":
			return "O'quvchi";
		default:
			return "Foydalanuvchi";
	}
};

const handleMenuSelect = (key: string) => {
	if (key && key !== route.path) {
		router.push(key);
	}
};
</script>

<style scoped>
/* Custom menu styling */
:deep(.n-menu-item) {
	margin: 0 8px 4px 8px;
	border-radius: 8px;
}

:deep(.n-menu-item--selected) {
	background-color: rgba(67, 97, 238, 0.1) !important;
	color: #4361ee !important;
}

:deep(.n-menu-item:hover) {
	background-color: rgba(67, 97, 238, 0.05) !important;
}

:deep(.n-submenu-children) {
	background-color: transparent !important;
}

:deep(.n-submenu-children .n-menu-item) {
	margin-left: 16px;
	margin-right: 8px;
}
</style>
