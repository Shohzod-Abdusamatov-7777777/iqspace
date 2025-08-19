<template>
	<div class="teachers-page">
		<!-- Header -->
		<NSpace justify="space-between" align="center" class="page-header">
			<NH1 class="page-title">O'qituvchilar boshqaruvi</NH1>
			<NButton type="primary" @click="showAddModal = true" size="large">
				<template #icon>
					<NIcon><PlusIcon /></NIcon>
				</template>
				Yangi o'qituvchi qo'shish
			</NButton>
		</NSpace>

		<!-- Statistics Cards -->
		<NGrid :cols="4" :x-gap="16" :y-gap="16" class="stats-grid">
			<NGi>
				<NCard hoverable>
					<NStatistic label="Jami o'qituvchilar" :value="totalTeachers">
						<template #prefix>
							<NIcon size="24" color="#18a058">
								<UsersIcon />
							</NIcon>
						</template>
					</NStatistic>
				</NCard>
			</NGi>
			<NGi>
				<NCard hoverable>
					<NStatistic label="Faol o'qituvchilar" :value="activeTeachers">
						<template #prefix>
							<NIcon size="24" color="#18a058">
								<CheckCircle2Icon />
							</NIcon>
						</template>
					</NStatistic>
				</NCard>
			</NGi>
			<NGi>
				<NCard hoverable>
					<NStatistic label="Jami kurslar" :value="totalCourses">
						<template #prefix>
							<NIcon size="24" color="#2080f0">
								<BookOpenIcon />
							</NIcon>
						</template>
					</NStatistic>
				</NCard>
			</NGi>
			<NGi>
				<NCard hoverable>
					<NStatistic label="O'rtacha reyting" :value="averageRating">
						<template #prefix>
							<NIcon size="24" color="#f0a020">
								<StarIcon />
							</NIcon>
						</template>
					</NStatistic>
				</NCard>
			</NGi>
		</NGrid>

		<!-- Search and Filters -->
		<NCard class="filters-card">
			<NSpace align="center" justify="space-between">
				<NInput
					v-model:value="searchQuery"
					placeholder="Ism yoki mutaxassislik bo'yicha qidirish..."
					size="large"
					style="width: 300px"
					clearable
					@input="handleSearchChange"
				>
					<template #prefix>
						<NIcon><SearchIcon /></NIcon>
					</template>
				</NInput>

				<NSpace>
					<NSelect
						v-model:value="filterDepartment"
						placeholder="Bo'lim"
						size="large"
						style="width: 200px"
						:options="[{ label: 'Barcha bo\'limlar', value: '' }, ...departmentOptions]"
						clearable
					/>
					<NSelect
						v-model:value="filterStatus"
						placeholder="Holati"
						size="large"
						style="width: 180px"
						:options="[{ label: 'Barcha holatlar', value: '' }, ...statusOptions]"
						clearable
					/>
				</NSpace>
			</NSpace>
		</NCard>

		<!-- Teachers Table -->
		<NCard>
			<NDataTable :columns="columns" :data="filteredTeachers" :pagination="paginationReactive" :loading="loading" :bordered="false" size="large" />
		</NCard>

		<!-- Add/Edit Teacher Modal -->
		<NModal
			v-model:show="showAddModal"
			preset="card"
			:title="editingTeacher ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi qo\'shish'"
			size="huge"
			:closable="true"
			:mask-closable="false"
			:auto-focus="false"
		>
			<NForm :model="teacherForm" :rules="teacherFormRules" ref="formRef" label-placement="top" require-mark-placement="right-hanging">
				<NGrid :cols="2" :x-gap="16" :y-gap="16">
					<NFormItem label="To'liq ism" path="name">
						<NInput v-model:value="teacherForm.name" placeholder="To'liq ismni kiriting" size="large" />
					</NFormItem>
					<NFormItem label="Email" path="email">
						<NInput v-model:value="teacherForm.email" placeholder="Email manzilini kiriting" size="large" />
					</NFormItem>
					<NFormItem label="Telefon" path="phone">
						<NInput v-model:value="teacherForm.phone" placeholder="Telefon raqamini kiriting" size="large" />
					</NFormItem>
					<NFormItem label="Tug'ilgan sana" path="birthDate">
						<NDatePicker v-model:value="teacherForm.birthDate" type="date" placeholder="Sanani tanlang" size="large" style="width: 100%" />
					</NFormItem>
					<NFormItem label="Bo'lim" path="department">
						<NSelect v-model:value="teacherForm.department" :options="departmentOptions" placeholder="Bo'limni tanlang" size="large" />
					</NFormItem>
					<NFormItem label="Mutaxassislik" path="specialization">
						<NInput v-model:value="teacherForm.specialization" placeholder="Mutaxassislikni kiriting" size="large" />
					</NFormItem>
					<NFormItem label="Tajriba (yil)" path="experience">
						<NInputNumber v-model:value="teacherForm.experience" :min="0" placeholder="Tajribani kiriting" size="large" style="width: 100%" />
					</NFormItem>
					<NFormItem label="Holati" path="status">
						<NSelect v-model:value="teacherForm.status" :options="statusOptions" placeholder="Holatni tanlang" size="large" />
					</NFormItem>
				</NGrid>
				<NFormItem label="Biografiya" path="bio">
					<NInput v-model:value="teacherForm.bio" type="textarea" :rows="4" placeholder="Biografiyani kiriting" size="large" />
				</NFormItem>
			</NForm>

			<template #footer>
				<NSpace justify="end">
					<NButton @click="closeModal" size="large">Bekor qilish</NButton>
					<NButton @click="saveTeacher" type="primary" size="large" :loading="loading">
						{{ editingTeacher ? "Saqlash" : "Qo'shish" }}
					</NButton>
				</NSpace>
			</template>
		</NModal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, reactive } from "vue";
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
	NGrid,
	NFormItem,
	useMessage,
	NSpace,
	NH1,
	NGi,
	NStatistic,
	NInputNumber,
	NDatePicker,
	NDataTable,
	type DataTableColumns,
} from "naive-ui";
import { PlusIcon, SearchIcon, EditIcon, Trash2Icon, StarIcon, UsersIcon, BookOpenIcon, CheckCircle2Icon, EyeIcon } from "lucide-vue-next";
import { adminService } from "@/services/api";

interface Teacher {
	id: number;
	name: string;
	email: string;
	phone: string;
	birthDate: string;
	department: string;
	specialization: string;
	experience: number;
	status: string;
	bio: string;
	avatar?: string;
	courses: number;
	students: number;
	rating: number;
}

const message = useMessage();

// AdminService'dan foydalanamiz

// Reactive state
const teachers = ref<Teacher[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const filterDepartment = ref("");
const filterStatus = ref("");
const showAddModal = ref(false);
const editingTeacher = ref<Teacher | null>(null);
const formRef = ref<any>();

const teacherForm = ref({
	id: 0,
	name: "",
	email: "",
	phone: "",
	birthDate: null as number | null,
	department: "",
	specialization: "",
	experience: 0,
	status: "active",
	bio: "",
});

// Options for selects
const departmentOptions = [
	{ label: "Dasturlash", value: "programming" },
	{ label: "Dizayn", value: "design" },
	{ label: "Marketing", value: "marketing" },
	{ label: "Biznes", value: "business" },
];

const statusOptions = [
	{ label: "Faol", value: "active" },
	{ label: "Nofaol", value: "inactive" },
	{ label: "Ta'tilda", value: "vacation" },
];

// Form rules
const teacherFormRules = {
	name: [{ required: true, message: "To'liq ism kiritilishi shart", trigger: ["input", "blur"] }],
	email: [{ required: true, message: "Email kiritilishi shart", trigger: ["input", "blur"] }],
	phone: [{ required: true, message: "Telefon raqami kiritilishi shart", trigger: ["input", "blur"] }],
	department: [{ required: true, message: "Bo'lim tanlanishi shart", trigger: ["blur", "change"] }],
	specialization: [{ required: true, message: "Mutaxassislik kiritilishi shart", trigger: ["input", "blur"] }],
	experience: [{ required: true, message: "Tajriba kiritilishi shart", trigger: ["blur", "change"] }],
};

// Computed properties
const totalTeachers = computed(() => teachers.value.length);
const activeTeachers = computed(() => teachers.value.filter((t) => t.status === "active").length);
const totalCourses = computed(() => teachers.value.reduce((sum, t) => sum + (t.courses || 0), 0));
const averageRating = computed(() => {
	const validTeachers = teachers.value.filter((t) => t.rating && !isNaN(t.rating));
	if (validTeachers.length === 0) return "0.0";

	const total = validTeachers.reduce((sum, t) => sum + Number(t.rating), 0);
	return (total / validTeachers.length).toFixed(1);
});

const filteredTeachers = computed(() => {
	return teachers.value.filter((teacher) => {
		const matchesSearch =
			!searchQuery.value ||
			teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			teacher.specialization.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			teacher.email.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesDepartment = !filterDepartment.value || teacher.department === filterDepartment.value;
		const matchesStatus = !filterStatus.value || teacher.status === filterStatus.value;

		return matchesSearch && matchesDepartment && matchesStatus;
	});
});

// Search qilganda API'ni qayta chaqirish
function handleSearchChange() {
	// Debounce qilish uchun timeout
	setTimeout(() => {
		fetchTeachers();
	}, 500);
}

const paginationReactive = reactive({
	page: 1,
	pageSize: 10,
	showSizePicker: true,
	pageSizes: [10, 20, 50],
	onChange: (page: number) => {
		paginationReactive.page = page;
	},
	onUpdatePageSize: (pageSize: number) => {
		paginationReactive.pageSize = pageSize;
		paginationReactive.page = 1;
	},
});

// Helper functions
function getStatusText(status: string) {
	const statusMap: Record<string, string> = {
		active: "Faol",
		inactive: "Nofaol",
		vacation: "Ta'tilda",
	};
	return statusMap[status] || status;
}

function getStatusType(status: string) {
	const typeMap: Record<string, any> = {
		active: "success",
		inactive: "error",
		vacation: "warning",
	};
	return typeMap[status] || "default";
}

function getDepartmentText(department: string) {
	const deptOption = departmentOptions.find((d) => d.value === department);
	return deptOption ? deptOption.label : department;
}

// Table columns
const columns: DataTableColumns<Teacher> = [
	{
		title: "O'qituvchi",
		key: "name",
		render(row) {
			return h(
				"div",
				{
					class: "teacher-info",
					style: { display: "flex", alignItems: "center", gap: "12px" },
				},
				[
					h("img", {
						src: row.avatar || "/default-avatar.png",
						alt: row.name,
						class: "teacher-avatar",
						style: {
							width: "40px",
							height: "40px",
							borderRadius: "50%",
							objectFit: "cover",
							flexShrink: "0",
						},
					}),
					h("div", { style: { flex: "1", minWidth: "0" } }, [
						h(
							"div",
							{
								style: {
									fontWeight: "500",
									color: "#1f2937",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								},
							},
							row.name,
						),
						h(
							"div",
							{
								style: {
									fontSize: "12px",
									color: "#6b7280",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								},
							},
							row.email,
						),
					]),
				],
			);
		},
	},
	{
		title: "Mutaxassislik",
		key: "specialization",
	},
	{
		title: "Bo'lim",
		key: "department",
		render(row) {
			return getDepartmentText(row.department);
		},
	},
	{
		title: "Kurslar",
		key: "courses",
	},
	{
		title: "O'quvchilar",
		key: "students",
	},
	{
		title: "Reyting",
		key: "rating",
		render(row) {
			return h("div", { class: "rating", style: { display: "flex", alignItems: "center", gap: "4px" } }, [
				h(NIcon, { color: "#fbbf24" }, () => h(StarIcon)),
				h("span", row.rating),
			]);
		},
	},
	{
		title: "Holati",
		key: "status",
		render(row) {
			return h(NTag, { type: getStatusType(row.status), size: "small" }, () => getStatusText(row.status));
		},
	},
	{
		title: "Amallar",
		key: "actions",
		render(row) {
			return h("div", { class: "action-buttons", style: { display: "flex", gap: "8px" } }, [
				h(
					NButton,
					{
						size: "small",
						quaternary: true,
						circle: true,
						onClick: () => viewTeacher(row),
					},
					() => h(NIcon, () => h(EyeIcon)),
				),
				h(
					NButton,
					{
						size: "small",
						quaternary: true,
						circle: true,
						onClick: () => editTeacher(row),
					},
					() => h(NIcon, () => h(EditIcon)),
				),
				h(
					NPopconfirm,
					{
						onPositiveClick: () => deleteTeacher(row),
						positiveText: "Ha",
						negativeText: "Yo'q",
					},
					{
						trigger: () =>
							h(
								NButton,
								{
									size: "small",
									quaternary: true,
									circle: true,
								},
								() => h(NIcon, { color: "#dc2626" }, () => h(Trash2Icon)),
							),
						default: () => `"${row.name}" o'qituvchini o'chirmoqchimisiz?`,
					},
				),
			]);
		},
	},
];

// CRUD operations
async function fetchTeachers() {
	try {
		loading.value = true;

		// AdminService ishlatish
		const response = await adminService.getUsers(1, 100, searchQuery.value, "teacher");
		const apiTeachers = (response as any).data || response || [];

		// JSON server ma'lumotlarini Teacher interfaceiga mos qilish
		teachers.value = apiTeachers.map((user: any) => ({
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			birthDate: user.birth_date || "1990-01-01",
			department: user.subjects?.[0] || "programming",
			specialization: user.subjects?.join(", ") || "General Teaching",
			experience: parseInt(user.experience?.replace(" yil", "")) || 5,
			status: user.status,
			bio: user.bio,
			avatar:
				user.avatar?.length === 2
					? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=3b82f6&radius=50`
					: user.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(user.name)}`,
			courses: Math.floor(Math.random() * 8) + 1, // Random kurslar soni
			students: Math.floor(Math.random() * 150) + 20, // Random o'quvchilar soni
			rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5-5.0 oralig'ida rating
		}));
	} catch (error) {
		console.error("Error fetching teachers:", error);
		message.error("O'qituvchilarni yuklashda xatolik yuz berdi");
		teachers.value = [];
	} finally {
		loading.value = false;
	}
}

function viewTeacher(teacher: Teacher) {
	// Navigate to teacher details or show detailed view
	message.info(`${teacher.name} o'qituvchisining ma'lumotlari ko'rilmoqda`);
	console.log("View teacher:", teacher);
}

function editTeacher(teacher: Teacher) {
	editingTeacher.value = teacher;
	teacherForm.value = {
		id: teacher.id,
		name: teacher.name,
		email: teacher.email,
		phone: teacher.phone,
		birthDate: teacher.birthDate ? new Date(teacher.birthDate).getTime() : null,
		department: teacher.department,
		specialization: teacher.specialization,
		experience: teacher.experience,
		status: teacher.status,
		bio: teacher.bio,
	};
	showAddModal.value = true;
}

async function deleteTeacher(teacher: Teacher) {
	try {
		loading.value = true;

		// AdminService ishlatish
		await adminService.deleteUser(teacher.id);
		const success = true;

		if (success) {
			await fetchTeachers();
			message.success(`${teacher.name} o'qituvchisi muvaffaqiyatli o'chirildi`);
		} else {
			throw new Error("Delete failed");
		}
	} catch (error) {
		console.error("Error deleting teacher:", error);
		message.error("O'qituvchini o'chirishda xatolik yuz berdi");
	} finally {
		loading.value = false;
	}
}

async function saveTeacher() {
	try {
		await formRef.value?.validate();
		loading.value = true;

		// JSON server uchun format
		const formData = {
			name: teacherForm.value.name,
			email: teacherForm.value.email,
			phone: teacherForm.value.phone,
			birth_date: teacherForm.value.birthDate ? new Date(teacherForm.value.birthDate).toISOString().split("T")[0] : "",
			subjects: [teacherForm.value.specialization],
			experience: `${teacherForm.value.experience} yil`,
			qualification: "Professional Teacher",
			status: teacherForm.value.status,
			bio: teacherForm.value.bio,
			role: "teacher",
			avatar: teacherForm.value.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase(),
			created_at: new Date().toISOString(),
			last_login: new Date().toISOString(),
		};

		if (editingTeacher.value) {
			// AdminService ishlatish - update
			await adminService.updateUser(editingTeacher.value.id, formData as any);
			message.success("O'qituvchi ma'lumotlari muvaffaqiyatli yangilandi");
		} else {
			// AdminService ishlatish - create
			await adminService.createUser(formData as any);
			message.success("Yangi o'qituvchi muvaffaqiyatli qo'shildi");
		}

		await fetchTeachers();
		closeModal();
	} catch (error) {
		console.error("Error saving teacher:", error);
		if (error && typeof error === "object" && "message" in error) {
			// Form validation error
			return;
		}
		message.error("O'qituvchini saqlashda xatolik yuz berdi");
	} finally {
		loading.value = false;
	}
}

function closeModal() {
	showAddModal.value = false;
	editingTeacher.value = null;
	teacherForm.value = {
		id: 0,
		name: "",
		email: "",
		phone: "",
		birthDate: null,
		department: "",
		specialization: "",
		experience: 0,
		status: "active",
		bio: "",
	};
}

// Lifecycle
onMounted(async () => {
	await fetchTeachers();
});
</script>

<style scoped>
.teachers-page {
	padding: 24px;
}

.page-header {
	margin-bottom: 32px;
}

.page-title {
	font-size: 28px;
	font-weight: 600;
	color: #1f2937;
	margin: 0;
}

.stats-grid {
	margin-bottom: 32px;
}

.filters-card {
	margin-bottom: 24px;
}

.teacher-info {
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 0;
}

.teacher-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
	flex-shrink: 0;
}

.rating {
	display: flex;
	align-items: center;
	gap: 4px;
}

.action-buttons {
	display: flex;
	gap: 8px;
}
</style>
