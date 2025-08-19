<template>
	<n-card>
		<template #header>
			<div style="display: flex; align-items: center; gap: 8px">
				<n-icon size="24"><FileTextIcon /></n-icon>
				<span>O'quv materiallari</span>
			</div>
		</template>
		<div style="margin-top: 16px">
			<n-alert type="info" title="O'quv materiallari sahifasi">
				Bu sahifa hali to'liq ishlab chiqilmagan. O'qituvchi uchun o'quv materiallari shu yerda bo'ladi.
			</n-alert>
		</div>
	</n-card>
</template>

<script setup lang="ts">
import { NCard, NIcon, NAlert } from "naive-ui";
import { FileTextIcon } from "lucide-vue-next";
</script>
