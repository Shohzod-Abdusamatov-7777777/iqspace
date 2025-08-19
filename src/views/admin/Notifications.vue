<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><BellIcon /></n-icon>
				<span>Bildirishnomalar boshqaruvi</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Bildirishnomalar sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. Bildirishnomalarni boshqarish uchun bu yerda kerakli funksiyalar paydo bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { BellIcon } from "lucide-vue-next";
</script>
