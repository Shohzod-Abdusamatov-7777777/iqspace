<template>
	<n-modal v-model:show="show" preset="dialog" :title="title" :style="{ width }" :mask-closable="maskClosable">
		<slot />
		<template #action>
			<slot name="footer" />
		</template>
	</n-modal>
</template>

<script setup lang="ts">
import { NModal } from "naive-ui";

const show = defineModel<boolean>("show", { default: false });

defineProps({
	title: String,
	width: { type: String, default: "600px" },
	maskClosable: { type: Boolean, default: true },
});
</script>
