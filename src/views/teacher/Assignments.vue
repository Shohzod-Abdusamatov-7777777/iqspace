<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><ClipboardListIcon /></n-icon>
				<span>Topshiriqlar</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Topshiriqlar sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. O'qituvchi uchun topshiriqlar boshqaruvi shu yerda bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { ClipboardListIcon } from "lucide-vue-next";
</script>
