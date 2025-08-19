<template>
	<n-data-table
		:columns="columns"
		:data="data"
		:bordered="false"
		scroll-x="1200"
		size="large"
		class="bg-white !rounded-none border-t border-border"
		striped
		:remote="true"
		:pagination="false"
		:resizable="true"
		v-bind="$attrs"
		@update:sorter="handleSorterChange"
	/>

	<div class="px-6 py-4 flex flex-wrap sm:justify-between justify-center gap-3 items-center">
		<v-pagination
			:model-value="pagination?.page ?? 1"
			:page-size="pagination?.pageSize ?? 10"
			:item-count="totalItems"
			:page-sizes="pageSizes"
			@update:model-value="onUpdatePage"
			@update:page-size="onUpdatePageSize"
		/>
	</div>
</template>

<script setup lang="ts">
import { toRef, watch, defineModel } from "vue";
import { NDataTable } from "naive-ui";
import type { DataTableProps, DataTableSortState } from "naive-ui";
import VPagination from "./VPagination.vue";
import type { IPagination } from "@/types/base";

interface VTableProps extends /* @vue-ignore */ DataTableProps {
	data: any[];
	pagination: IPagination;
	totalItems: number;
	columns: any[];
}

const props = defineProps<VTableProps>();

const columnsRef = toRef(props, "columns");
const pagination = defineModel<IPagination>("pagination");

const pageSizes = [
	{ value: 5, label: "5" },
	{ value: 10, label: "10" },
	{ value: 20, label: "20" },
	{ value: 50, label: "50" },
];

const getList = () => {
	emit("getList");
};

const onUpdatePage = (page: number) => {
	if (pagination.value) {
		pagination.value.page = page;
		getList();
	}
};

const onUpdatePageSize = (size: number) => {
	if (pagination.value) {
		pagination.value.pageSize = size;
		pagination.value.page = 1;
		getList();
	}
};

const handleSorterChange = (sorter: DataTableSortState) => {
	if (columnsRef.value && pagination.value) {
		columnsRef.value.forEach((column) => {
			if (!sorter) {
				column.sortOrder = false;
				return;
			}
			if (column.key === sorter.columnKey) {
				column.sortOrder = sorter.order;
				pagination.value!.sortBy = column.key;
				pagination.value!.orderType = sorter.order === "ascend" ? "asc" : "desc";
			} else {
				column.sortOrder = false;
			}
		});
		getList();
	}
};

const emit = defineEmits<{
	(e: "getList"): void;
}>();

watch(
	() => pagination.value,
	(newP) => {
		// No need to emit update:pagination, handled by v-model
	},
	{ deep: true },
);
</script>
