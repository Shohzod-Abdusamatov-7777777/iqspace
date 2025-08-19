<template>
	<n-layout-header
		class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
		bordered
	>
		<!-- Left side -->
		<div class="flex items-center gap-4">
			<!-- Mobile menu toggle -->
			<n-button quaternary circle @click="themeStore.toggleSidebar">
				<template #icon>
					<n-icon size="20">
						<AlignRight v-if="themeStore.sidebarCollapsed" />
						<AlignLeft v-else />
					</n-icon>
				</template>
			</n-button>
		</div>

		<!-- Right side -->
		<div class="flex items-center gap-4">
			<!-- Search (hidden on mobile) -->
			<div class="hidden md:block">
				<n-input placeholder="Qidirish..." size="small" style="width: 200px">
					<template #prefix>
						<n-icon size="16">
							<Search />
						</n-icon>
					</template>
				</n-input>
			</div>

			<!-- Notifications -->
			<n-badge :value="notificationCount" :max="99" :show="notificationCount > 0">
				<n-button quaternary circle>
					<template #icon>
						<n-icon size="18">
							<Bell />
						</n-icon>
					</template>
				</n-button>
			</n-badge>

			<!-- Theme toggle -->
			<n-button quaternary circle @click="toggleTheme">
				<template #icon>
					<n-icon size="18">
						<Sun v-if="isDark" />
						<Moon v-else />
					</n-icon>
				</template>
			</n-button>

			<!-- User menu -->
			<n-dropdown trigger="click" :options="userMenuOptions" @select="handleUserMenuSelect">
				<div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
					<n-avatar :size="32" :style="{ backgroundColor: '#4361ee' }">
						{{ authStore.user?.avatar || "U" }}
					</n-avatar>
					<div class="hidden sm:block text-left">
						<div class="text-sm font-medium text-gray-900 dark:text-white">
							{{ authStore.user?.name || "Foydalanuvchi" }}
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-400 capitalize">
							{{ getRoleLabel(authStore.user?.role) }}
						</div>
					</div>
					<n-icon size="14" class="text-gray-400">
						<ChevronDown />
					</n-icon>
				</div>
			</n-dropdown>
		</div>
	</n-layout-header>
</template>

<script setup lang="ts">
import { computed, h, inject } from "vue";
import { useRouter } from "vue-router";
import { NLayoutHeader, NButton, NIcon, NInput, NBadge, NDropdown, NAvatar } from "naive-ui";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
// Import Lucide icons
import { Menu, X, BookOpen, Search, Bell, Sun, Moon, ChevronDown, User, Settings, LogOut, ChevronLeft, AlignLeft, AlignRight } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const isDark = inject("isDark");
const toggleTheme = inject("toggleTheme") as void;

// Computed
const notificationCount = computed(() => 5); // Mock notification count

const userMenuOptions = computed(() => [
	{
		label: "Profil",
		key: "profile",
		icon: () => h(NIcon, null, { default: () => h(User) }),
	},
	{
		label: "Sozlamalar",
		key: "settings",
		icon: () => h(NIcon, null, { default: () => h(Settings) }),
	},
	{
		type: "divider",
		key: "d1",
	},
	{
		label: "Chiqish",
		key: "logout",
		icon: () => h(NIcon, null, { default: () => h(LogOut) }),
	},
]);

// Methods
const getRoleLabel = (role?: string) => {
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

const handleUserMenuSelect = (key: string) => {
	switch (key) {
		case "profile":
			router.push("/dashboard/profile");
			break;
		case "settings":
			// Navigate to settings based on role
			if (authStore.isAdmin) {
				router.push("/dashboard/admin/settings");
			} else {
				router.push("/dashboard/profile");
			}
			break;
		case "logout":
			handleLogout();
			break;
	}
};

const handleLogout = async () => {
	try {
		await authStore.logout();
		router.push("/login");
	} catch (error) {
		console.error("Logout error:", error);
	}
};
</script>

<style scoped>
.n-layout-header {
	height: 64px;
}
</style>
