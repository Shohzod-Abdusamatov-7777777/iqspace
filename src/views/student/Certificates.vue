<template>
	<div>
		<n-space vertical size="large">
			<n-card title="Certificates" size="large">
				<n-space justify="space-between" align="center">
					<n-input v-model="search" placeholder="Search certificates..." clearable style="width: 300px" />
					<n-button type="primary" @click="showModal = true">Add Certificate</n-button>
				</n-space>
				<VTable :columns="columns" :data="filteredCertificates" :pagination="pagination" :total-items="totalItems" style="margin-top: 20px" />
			</n-card>

			<BaseModal v-model:show="showModal" title="Add Certificate"> </BaseModal>
		</n-space>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { NCard, NSpace, NInput, NButton } from "naive-ui";
import BaseModal from "@/components/common/BaseModal.vue";
import VTable from "@/components/ui/VTable.vue";
import usePagination from "@/composables/usePagination";

const search = ref("");
const showModal = ref(false);
const certificates = ref([
	{ id: 1, name: "Certificate of Excellence", issuedTo: "John Doe", date: "2024-06-01" },
	{ id: 2, name: "Completion Certificate", issuedTo: "Jane Smith", date: "2024-05-15" },
]);

const columns = [
	{ title: "ID", key: "id" },
	{ title: "Name", key: "name" },
	{ title: "Issued To", key: "issuedTo" },
	{ title: "Date", key: "date" },
];

const { pagination, totalItems } = usePagination({
	search: "",
	pageSize: 10,
});

const filteredCertificates = computed(() => {
	if (!search.value) return certificates.value;
	return certificates.value.filter(
		(c) => c.name.toLowerCase().includes(search.value.toLowerCase()) || c.issuedTo.toLowerCase().includes(search.value.toLowerCase()),
	);
});

const form = ref({ name: "", issuedTo: "", date: "" });
const rules = {
	name: [{ required: true, message: "Name is required", trigger: "blur" }],
	issuedTo: [{ required: true, message: "Recipient is required", trigger: "blur" }],
	date: [{ required: true, message: "Date is required", trigger: "blur" }],
};

function handleSubmit(values: any) {
	certificates.value.push({ id: certificates.value.length + 1, ...values });
	showModal.value = false;
}
</script>
