<template>
	<n-page-header title="Dars jadvali">
		<template #avatar>
			<Calendar :size="32" />
		</template>
	</n-page-header>
	<n-space vertical size="large">
		<n-card>
			<n-empty description="Bu sahifa hozircha bo'sh. Tez orada dars jadvali bu yerda ko'rsatiladi." />
		</n-card>
	</n-space>
</template>

<script setup lang="ts">
import { Calendar } from "lucide-vue-next";
</script>
