<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><BarChart2Icon /></n-icon>
				<span>Statistika</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Statistika sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. Statistika va tahlillar bu yerda ko'rsatiladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { BarChart2Icon } from "lucide-vue-next";
</script>
