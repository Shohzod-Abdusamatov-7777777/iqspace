<template>
	<div class="flex items-center gap-2 select-none">
		<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="24" cy="24" r="22" :fill="circleColor" stroke="#4361ee" stroke-width="3" />
			<path
				d="M18 32c-2-2-3-4.5-3-7.5C15 18.5 19.5 14 24 14s9 4.5 9 10.5c0 3-1 5.5-3 7.5"
				:stroke="iconColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				fill="none"
			/>
			<circle cx="20" cy="22" r="1.5" :fill="iconColor" />
			<circle cx="28" cy="22" r="1.5" :fill="iconColor" />
		</svg>
		<span class="font-bold text-xl tracking-tight" :style="{ color: iconColor }">IQSpace</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "../stores/theme";

const themeStore = useThemeStore();

const iconColor = computed(() => (themeStore.isDark ? "#fff" : "#4361ee"));
const circleColor = computed(() => (themeStore.isDark ? "#4361ee" : "#fff"));
</script>
