<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><Users2Icon /></n-icon>
				<span>Guruhlar boshqaruvi</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Guruhlar sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. Guruhlarni boshqarish uchun bu yerda kerakli funksiyalar paydo bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { Users2Icon } from "lucide-vue-next";
</script>
