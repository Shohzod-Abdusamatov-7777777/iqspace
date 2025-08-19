<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><CheckCircle2Icon /></n-icon>
				<span>Davomat</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="Davomat sahifasi"> Bu sahifa hali to'liq ishlab chiqilmagan. O'quvchi uchun davomat shu yerda bo'ladi. </n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { CheckCircle2Icon } from "lucide-vue-next";
</script>
