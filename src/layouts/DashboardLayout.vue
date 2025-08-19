<template>
	<n-layout has-sider class="h-screen">
		<Sidebar />
		<n-layout content-class="relative">
			<Header />
			<!-- Page Content -->
			<n-layout-content class="flex-1 !overflow-y-auto p-6" :native-scrollbar="false">
				<router-view v-slot="{ Component, route }">
					<Transition name="fade" mode="out-in">
						<component :is="Component" :key="route.fullPath" />
					</Transition>
				</router-view>
			</n-layout-content>
			<Footer />
			
			<!-- Complete Accessibility Suite -->
			<AccessibilitySuite />
		</n-layout>
	</n-layout>
</template>

<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import Footer from "@/components/layout/Footer.vue";
import AccessibilitySuite from "@/components/common/AccessibilitySuite.vue";

import { NLayout, NLayoutContent } from "naive-ui";
</script>

<style scoped>
/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>
