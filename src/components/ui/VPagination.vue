<template>
	<div class="flex flex-wrap sm:justify-between justify-center gap-3 items-center w-full">
		<n-pagination
			v-model:page="pageProxy"
			v-model:page-size="pageSizeProxy"
			:page-slot="7"
			:item-count="itemCount"
			@update:page="emitPage"
			@update:page-size="emitPageSize"
			ref="paginationRef"
		/>
		<div class="flex justify-center gap-2 items-center">
			<div v-if="paginationRef" class="text-[#677488] text-xs font-medium leading-tight text-nowrap">
				{{ paginationText }}
			</div>
			<n-select size="small" :options="pageSizes" v-model:value="pageSizeProxy" class="!w-16" @update:value="emitPageSize" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { NPagination, NSelect } from "naive-ui";
import type { PaginationInfo, SelectOption } from "naive-ui";

const props = defineProps<{
	modelValue: number;
	pageSize: number;
	itemCount: number;
	pageSizes?: SelectOption[];
}>();

const emit = defineEmits(["update:modelValue", "update:pageSize"]);

const paginationRef = ref<PaginationInfo | null>(null);

const pageProxy = ref(props.modelValue);
const pageSizeProxy = ref(props.pageSize);

watch(
	() => props.modelValue,
	(val) => (pageProxy.value = val),
);
watch(
	() => props.pageSize,
	(val) => (pageSizeProxy.value = val),
);

const emitPage = (val: number) => {
	emit("update:modelValue", val);
};
const emitPageSize = (val: number) => {
	emit("update:pageSize", val);
	pageProxy.value = 1; // Reset to first page
	emit("update:modelValue", 1);
};

const pageSizes = computed<SelectOption[]>(
	() =>
		props.pageSizes ?? [
			{ value: 5, label: "5" },
			{ value: 10, label: "10" },
			{ value: 20, label: "20" },
			{ value: 50, label: "50" },
		],
);

const paginationText = computed(() => {
	if (!paginationRef.value) return "";
	const start = (paginationRef.value.startIndex ?? 0) + 1;
	const end = (paginationRef.value.endIndex ?? 0) + 1;
	const count = paginationRef.value.itemCount ?? 0;
	return `Showing ${start}–${end} of ${count}`;
});
</script>
