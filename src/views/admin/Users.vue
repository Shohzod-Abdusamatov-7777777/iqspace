<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Foydalanuvchilar boshqaruvi</h1>
				<p class="dark:text-gray-400 mt-1">Tizim foydalanuvchilarini boshqaring va yangi hisoblar yarating</p>
			</div>

			<n-button type="primary" @click="showCreateModal = true">
				<template #icon>
					<n-icon>
						<PlusIcon />
					</n-icon>
				</template>
				Yangi foydalanuvchi
			</n-button>
		</div>

		<!-- Filters and Search -->
		<div class="card">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<label class="form-label">Qidirish</label>
					<n-input v-model:value="pagination.search" placeholder="Ism, telefon yoki email..." clearable>
						<template #prefix>
							<n-icon>
								<SearchIcon />
							</n-icon>
						</template>
					</n-input>
				</div>

				<div>
					<label class="form-label">Rol</label>
					<n-select v-model:value="filters.role" :options="roleOptions" @update:value="loadUsers" />
				</div>

				<div>
					<label class="form-label">Status</label>
					<n-select v-model:value="filters.status" :options="statusOptions" @update:value="loadUsers" />
				</div>

				<div class="flex items-end">
					<n-button @click="resetFilters" class="w-full">
						<template #icon>
							<n-icon>
								<XIcon />
							</n-icon>
						</template>
						Tozalash
					</n-button>
				</div>
			</div>
		</div>

		<!-- Users Table -->
		<div class="card">
			<VTable
				:columns="columns"
				:data="users"
				:loading="loading"
				:pagination="pagination"
				:total-items="totalItems"
				@get-list="loadUsers"
			/>
		</div>

		<!-- Create/Edit User Modal -->
		<n-modal v-model:show="showCreateModal">
			<n-card
				style="width: 600px"
				:title="editingUser ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'"
				:bordered="false"
				size="huge"
				role="dialog"
				aria-modal="true"
			>
				<n-form ref="formRef" :model="userForm" :rules="userFormRules" label-placement="top">
					<n-grid :cols="2" :x-gap="12">
						<n-form-item-gi :span="2" path="name" label="Ism va Familiya">
							<n-input v-model:value="userForm.name" placeholder="Ism va Familiya" />
						</n-form-item-gi>

						<n-form-item-gi path="phone" label="Telefon">
							<n-input v-model:value="userForm.phone" placeholder="+998901234567" />
						</n-form-item-gi>

						<n-form-item-gi path="email" label="Email">
							<n-input v-model:value="userForm.email" placeholder="email@example.com" />
						</n-form-item-gi>

						<n-form-item-gi path="role" label="Rol">
							<n-select v-model:value="userForm.role" :options="roleOptions.filter((r) => r.value !== 'all')" placeholder="Rol tanlang" />
						</n-form-item-gi>

						<n-form-item-gi path="status" label="Status">
							<n-select v-model:value="userForm.status" :options="statusOptions.filter((s) => s.value !== 'all')" placeholder="Status tanlang" />
						</n-form-item-gi>

						<n-form-item-gi v-if="userForm.role === 'teacher'" :span="2" path="subjects" label="Fanlar">
							<n-select v-model:value="userForm.subjects" :options="subjectOptions" multiple placeholder="Fanlarni tanlang" />
						</n-form-item-gi>

						<n-form-item-gi v-if="userForm.role === 'teacher'" :span="2" path="bio" label="Bio">
							<n-input v-model:value="userForm.bio" type="textarea" placeholder="Qisqacha ma'lumot..." :rows="3" />
						</n-form-item-gi>
					</n-grid>
				</n-form>

				<template #footer>
					<div class="flex justify-end gap-3">
						<n-button @click="showCreateModal = false"> Bekor qilish </n-button>
						<n-button type="primary" @click="saveUser" :loading="submitting">
							{{ editingUser ? "Saqlash" : "Yaratish" }}
						</n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref, watch } from "vue";
import {
	NButton,
	NIcon,
	NTag,
	NPopconfirm,
	NInput,
	NSelect,
	NModal,
	NCard,
	NForm,
	NFormItem,
	NGrid,
	NFormItemGi,
	useMessage,
	type DataTableColumns,
	type FormInst,
} from "naive-ui";
import { PlusIcon, SearchIcon, XIcon, EditIcon, Trash2Icon } from "lucide-vue-next";
import { adminService } from "@/services/api";
import type { User } from "@/types";
import usePagination from "@/composables/usePagination";
import VTable from "@/components/ui/VTable.vue";

const message = useMessage();

// Refs
const formRef = ref<FormInst | null>(null);

// Reactive state
const loading = ref(false);
const submitting = ref(false);
const showCreateModal = ref(false);
const editingUser = ref<User | null>(null);
const users = ref<User[]>([]);

const { pagination, totalItems } = usePagination({
	search: "",
	page: 1,
	pageSize: 10,
});

const filters = reactive({
	role: "all",
	status: "all",
});

const userForm = reactive({
	name: "",
	phone: "",
	email: "",
	role: "student",
	status: "active",
	subjects: [] as string[],
	bio: "",
});


// Options
const roleOptions = [
	{ label: "Barcha rollar", value: "all" },
	{ label: "Administrator", value: "admin" },
	{ label: "O'qituvchi", value: "teacher" },
	{ label: "O'quvchi", value: "student" },
];

const statusOptions = [
	{ label: "Barcha statuslar", value: "all" },
	{ label: "Faol", value: "active" },
	{ label: "Nofaol", value: "inactive" },
];

const subjectOptions = [
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Matematika", value: "Matematika" },
	{ label: "Kimyo", value: "Kimyo" },
	{ label: "Biologiya", value: "Biologiya" },
	{ label: "Fizika", value: "Fizika" },
	{ label: "Tarix", value: "Tarix" },
	{ label: "Geografiya", value: "Geografiya" },
];

// Form validation rules
const userFormRules = {
	name: [{ required: true, message: "Ism va familiyani kiriting", trigger: "blur" }],
	phone: [
		{ required: true, message: "Telefon raqamini kiriting", trigger: "blur" },
		{ pattern: /^\+?\d{9,15}$/, message: "Telefon raqami noto'g'ri formatda", trigger: "blur" },
	],
	email: [{ type: "email", message: "Email manzili noto'g'ri formatda", trigger: "blur" }],
	role: [{ required: true, message: "Rolni tanlang", trigger: "change" }],
	status: [{ required: true, message: "Statusni tanlang", trigger: "change" }],
};

// Table columns
const columns: DataTableColumns<User> = [
	{
		title: "Foydalanuvchi",
		key: "name",
		render(row) {
			return h("div", { class: "flex items-center gap-3" }, [
				h(
					"div",
					{
						class: "w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium",
					},
					row.avatar,
				),
				h("div", [
					h("div", { class: "font-medium text-gray-900 dark:text-white" }, row.name),
					h("div", { class: "text-sm text-gray-500 dark:text-gray-400" }, row.phone),
				]),
			]);
		},
	},
	{
		title: "Email",
		key: "email",
		render(row) {
			return row.email || h("span", { class: "text-gray-400" }, "Kiritilmagan");
		},
	},
	{
		title: "Rol",
		key: "role",
		render(row) {
			const roleColors = {
				admin: "error",
				teacher: "warning",
				student: "info",
			};
			const roleLabels = {
				admin: "Administrator",
				teacher: "O'qituvchi",
				student: "O'quvchi",
			};
			return h(
				NTag,
				{
					type: roleColors[row.role as keyof typeof roleColors],
					size: "small",
				},
				{ default: () => roleLabels[row.role as keyof typeof roleLabels] },
			);
		},
	},
	{
		title: "Status",
		key: "status",
		render(row) {
			return h(
				NTag,
				{
					type: row.status === "active" ? "success" : "default",
					size: "small",
				},
				{ default: () => (row.status === "active" ? "Faol" : "Nofaol") },
			);
		},
	},
	{
		title: "Oxirgi kirish",
		key: "last_login",
		render(row) {
			return new Date(row.last_login).toLocaleDateString("uz-UZ");
		},
	},
	{
		title: "Amallar",
		key: "actions",
		render(row) {
			return h("div", { class: "flex gap-2" }, [
				h(
					NButton,
					{
						size: "small",
						quaternary: true,
						onClick: () => editUser(row),
					},
					{
						icon: () => h(NIcon, () => h("EditIcon")),
					},
				),
				h(
					NPopconfirm,
					{
						onPositiveClick: () => deleteUser(row.id),
					},
					{
						trigger: () =>
							h(
								NButton,
								{
									size: "small",
									quaternary: true,
									type: "error",
								},
								{
									icon: () => h(NIcon, () => h("Trash2Icon")),
								},
							),
						default: () => "Bu foydalanuvchini o'chirishni tasdiqlaysizmi?",
					},
				),
			]);
		},
	},
];

// Methods
const loadUsers = async () => {
	try {
		loading.value = true;
		const response = await adminService.getUsers(pagination.value.page, pagination.value.pageSize, pagination.value.search, filters.role);

		if (response.success) {
			users.value = response.data;
			totalItems.value = response.pagination.total;
		}
	} catch (error: any) {
		message.error(error.message || "Foydalanuvchilarni yuklashda xatolik");
	} finally {
		loading.value = false;
	}
};

const resetFilters = () => {
	pagination.value.search = "";
	filters.role = "all";
	filters.status = "all";
	pagination.value.page = 1;
	loadUsers();
};

const resetForm = () => {
	userForm.name = "";
	userForm.phone = "";
	userForm.email = "";
	userForm.role = "student";
	userForm.status = "active";
	userForm.subjects = [];
	userForm.bio = "";
	editingUser.value = null;
};

const editUser = (user: User) => {
	editingUser.value = user;
	userForm.name = user.name;
	userForm.phone = user.phone;
	userForm.email = user.email || "";
	userForm.role = user.role;
	userForm.status = user.status;
	userForm.subjects = user.subjects || [];
	userForm.bio = user.bio || "";
	showCreateModal.value = true;
};

const saveUser = async () => {
	try {
		await formRef.value?.validate();
		submitting.value = true;

		const userData = {
			name: userForm.name,
			phone: userForm.phone,
			email: userForm.email,
			role: userForm.role,
			status: userForm.status,
			subjects: userForm.role === "teacher" ? userForm.subjects : undefined,
			bio: userForm.role === "teacher" ? userForm.bio : undefined,
		};

		if (editingUser.value) {
			await adminService.updateUser(editingUser.value.id, userData);
			message.success("Foydalanuvchi muvaffaqiyatli yangilandi");
		} else {
			await adminService.createUser(userData);
			message.success("Yangi foydalanuvchi muvaffaqiyatli yaratildi");
		}

		showCreateModal.value = false;
		resetForm();
		loadUsers();
	} catch (error: any) {
		message.error(error.message || "Saqlashda xatolik yuz berdi");
	} finally {
		submitting.value = false;
	}
};

const deleteUser = async (id: number) => {
	try {
		await adminService.deleteUser(id);
		message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
		loadUsers();
	} catch (error: any) {
		message.error(error.message || "O'chirishda xatolik yuz berdi");
	}
};

// Watch for pagination changes
watch(() => pagination.value, () => {
	loadUsers();
}, { deep: true });

// Lifecycle
onMounted(() => {
	loadUsers();
});
</script>
