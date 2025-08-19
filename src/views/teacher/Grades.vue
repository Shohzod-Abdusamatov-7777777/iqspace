<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><GraduationCapIcon /></n-icon>
				<span>Baholash</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Baholash sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. O'qituvchi uchun baholash boshqaruvi shu yerda bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { GraduationCapIcon } from "lucide-vue-next";
</script>
