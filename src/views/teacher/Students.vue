<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><Users2Icon /></n-icon>
				<span>O'quvchilar</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="O'quvchilar sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. O'qituvchi uchun o'quvchilar boshqaruvi shu yerda bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { Users2Icon } from "lucide-vue-next";
</script>
