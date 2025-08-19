<template>
	<n-config-provider :theme="theme" :theme-overrides="themeCustom">
		<n-message-provider>
			<n-dialog-provider>
				<n-notification-provider>
					<n-loading-bar-provider>
						<div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
							<router-view />
						</div>
					</n-loading-bar-provider>
				</n-notification-provider>
			</n-dialog-provider>
		</n-message-provider>
	</n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider } from "naive-ui";
import { provide } from "vue";
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme, theme, themeCustom } = useTheme();

provide("isDark", isDark);
provide("toggleTheme", toggleTheme);
</script>
