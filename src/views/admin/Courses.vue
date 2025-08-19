<template>
	<div class="courses-page">
		<!-- Header -->
		<n-space justify="space-between" align="center" class="page-header">
			<n-h1 class="page-title">Kurslar boshqaruvi</n-h1>
			<n-button type="primary" @click="showAddModal = true" size="large">
				<template #icon>
					<n-icon><PlusIcon /></n-icon>
				</template>
				Yangi kurs qo'shish
			</n-button>
		</n-space>

		<!-- Statistics Cards -->
		<n-grid :cols="4" :x-gap="16" :y-gap="16" class="stats-grid">
			<n-gi>
				<n-card hoverable>
					<n-statistic label="Jami kurslar" :value="totalCourses">
						<template #prefix>
							<n-icon size="24" color="#18a058">
								<BookOpenIcon />
							</n-icon>
						</template>
					</n-statistic>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card hoverable>
					<n-statistic label="Faol kurslar" :value="activeCourses">
						<template #prefix>
							<n-icon size="24" color="#18a058">
								<CheckCircle2Icon />
							</n-icon>
						</template>
					</n-statistic>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card hoverable>
					<n-statistic label="O'quvchilar soni" :value="totalStudents">
						<template #prefix>
							<n-icon size="24" color="#2080f0">
								<UsersIcon />
							</n-icon>
						</template>
					</n-statistic>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card hoverable>
					<n-statistic label="O'qituvchilar soni" :value="totalTeachers">
						<template #prefix>
							<n-icon size="24" color="#f0a020">
								<StarIcon />
							</n-icon>
						</template>
					</n-statistic>
				</n-card>
			</n-gi>
		</n-grid>

		<!-- Search and Filters -->
		<n-card class="filters-card">
			<n-space align="center" justify="space-between">
				<n-input 
					v-model:value="pagination.search" 
					placeholder="Kurs nomi bo'yicha qidirish..." 
					size="large"
					style="width: 300px"
					clearable
					@update:value="handleSearchChange"
				>
					<template #prefix>
						<n-icon><SearchIcon /></n-icon>
					</template>
				</n-input>
				
				<n-space>
					<n-select
						v-model:value="filterCategory"
						placeholder="Kategoriya"
						size="large"
						style="width: 200px"
						:options="[
							{ label: 'Barcha kategoriyalar', value: '' },
							...categoryOptions
						]"
						clearable
						@update:value="handleFilterChange"
					/>
					<n-select
						v-model:value="filterStatus"
						placeholder="Holati"
						size="large"
						style="width: 180px"
						:options="[
							{ label: 'Barcha holatlar', value: '' },
							...statusOptions
						]"
						clearable
						@update:value="handleFilterChange"
					/>
				</n-space>
			</n-space>
		</n-card>

		<!-- Courses Table -->
		<n-card>
			<VTable
				:columns="columns"
				:data="courses"
				:pagination="pagination"
				:total-items="totalItems"
				:loading="loading"
				@get-list="fetchCoursesList"
			/>
		</n-card>

		<!-- Add/Edit Course Modal -->
		<n-modal 
			v-model:show="showAddModal" 
			preset="card"
			:title="editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'"
			size="huge"
			:closable="true"
			:mask-closable="false"
			:auto-focus="false"
		>
			<n-form 
				:model="courseForm" 
				:rules="courseFormRules" 
				ref="formRef" 
				label-placement="top"
				require-mark-placement="right-hanging"
			>
				<n-grid :cols="2" :x-gap="16" :y-gap="16">
					<n-form-item label="Kurs nomi" path="title">
						<n-input 
							v-model:value="courseForm.title" 
							placeholder="Kurs nomini kiriting"
							size="large"
						/>
					</n-form-item>
					<n-form-item label="Fan" path="subject">
						<n-select 
							v-model:value="courseForm.subject" 
							:options="categoryOptions" 
							placeholder="Fanni tanlang"
							size="large"
						/>
					</n-form-item>
					<n-form-item label="O'qituvchi" path="teacher_id">
						<n-select 
							v-model:value="courseForm.teacher_id" 
							:options="teacherOptions" 
							placeholder="O'qituvchini tanlang"
							size="large"
							filterable
							@update:value="handleTeacherSelect"
						/>
					</n-form-item>
					<n-form-item label="Davomiyligi" path="duration">
						<n-input 
							v-model:value="courseForm.duration" 
							placeholder="Masalan: 12 hafta"
							size="large"
						/>
					</n-form-item>
					<n-form-item label="Narxi (UZS)" path="price">
						<n-input-number 
							v-model:value="courseForm.price" 
							:min="0"
							:format="formatPriceInput"
							:parse="parsePriceInput"
							placeholder="0"
							size="large"
							style="width: 100%"
						/>
					</n-form-item>
					<n-form-item label="Holati" path="status">
						<n-select 
							v-model:value="courseForm.status" 
							:options="statusOptions" 
							placeholder="Holatni tanlang"
							size="large"
						/>
					</n-form-item>
				</n-grid>
				<n-form-item label="Kurs tavsifi" path="description">
					<n-input 
						v-model:value="courseForm.description" 
						type="textarea" 
						:rows="4" 
						placeholder="Kurs haqida batafsil ma'lumot..."
						size="large"
					/>
				</n-form-item>
			</n-form>
			
			<template #footer>
				<n-space justify="end">
					<n-button @click="closeModal" size="large">
						Bekor qilish
					</n-button>
					<n-button 
						type="primary" 
						@click="saveCourse" 
						:loading="saving"
						size="large"
					>
						{{ editingCourse ? "Saqlash" : "Qo'shish" }}
					</n-button>
				</n-space>
			</template>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, watch } from "vue";
import { 
	NButton, 
	NIcon, 
	NTag, 
	NInput, 
	NSelect, 
	NModal, 
	NCard, 
	NForm, 
	NFormItem, 
	NGrid, 
	NGi,
	NSpace,
	NStatistic,
	NH1,
	NInputNumber,
	NPopconfirm,
	useMessage,
	type DataTableColumns
} from "naive-ui";
import { 
	PlusIcon, 
	SearchIcon, 
	StarIcon, 
	UsersIcon, 
	BookOpenIcon, 
	CheckCircle2Icon,
	EyeIcon,
	EditIcon,
	Trash2Icon
} from "lucide-vue-next";
import VTable from "@/components/ui/VTable.vue";
import usePagination from "@/composables/usePagination";
import { useCoursesStore } from "@/stores/courses";
import { useTeachersStore } from "@/stores/teachers";

const message = useMessage();
const coursesStore = useCoursesStore();
const teachersStore = useTeachersStore();

// Pagination
const { pagination, totalItems } = usePagination({
	pageSize: 10,
	search: '',
	sortBy: 'name',
	orderType: 'asc'
});

// Reactive state
const filterCategory = ref("");
const filterStatus = ref("");
const showAddModal = ref(false);
const editingCourse = ref<any>(null);
const loading = ref(false);
const saving = ref(false);
const formRef = ref();
const courses = ref<any[]>([]);
const teachers = ref<any[]>([]);

const courseForm = ref({
	title: "",
	subject: "",
	teacher_id: 0,
	teacher_name: "",
	duration: "",
	price: 0,
	students_count: 0,
	rating: 4.0,
	status: "active" as CourseStatus,
	description: "",
	color: "#3b82f6",
	icon: "book"
});

// Computed properties
const totalCourses = computed(() => totalItems.value);
const activeCourses = computed(() => courses.value.filter((c: any) => c.status === "active").length);
const totalStudents = computed(() => courses.value.reduce((sum: any, c: any) => sum + (c.students_count || 0), 0));
const totalTeachers = computed(() => new Set(courses.value.map((c: any) => c.teacher_id)).size);

// Table columns with sorting
const columns: DataTableColumns = [
	{
		title: "Kurs nomi",
		key: "title",
		sortOrder: false,
		sorter: true,
		render: (row: any) => {
			return h('div', { class: 'course-info' }, [
				h('div', { class: 'course-name' }, row.title || ''),
				h('div', { class: 'course-code' }, `ID: ${row.id}`)
			]);
		}
	},
	{
		title: "Kategoriya",
		key: "subject",
		sortOrder: false,
		sorter: true,
		render: (row: any) => {
			const categoryLabel = row.subject || 'Noma\'lum';
			return h(NTag, { type: 'info' }, { default: () => categoryLabel });
		}
	},
	{
		title: "O'qituvchi",
		key: "teacher_name",
		sortOrder: false,
		sorter: true,
		render: (row: any) => {
			return row.teacher_name || 'Noma\'lum';
		}
	},
	{
		title: "O'quvchilar",
		key: "students_count",
		sortOrder: false,
		sorter: true,
		render: (row: any) => `${row.students_count || 0}`
	},
	{
		title: "Davomiyligi",
		key: "duration",
		sortOrder: false,
		sorter: true,
		render: (row: any) => row.duration || 'Noma\'lum'
	},
	{
		title: "Narxi",
		key: "price",
		sortOrder: false,
		sorter: true,
		render: (row: any) => formatPrice(row.price || 0)
	},
	{
		title: "Holati",
		key: "status",
		sortOrder: false,
		sorter: true,
		render: (row: any) => {
			const statusConfig = {
				active: { type: 'success', label: 'Faol' },
				draft: { type: 'warning', label: 'Qoralama' },
				archived: { type: 'default', label: 'Arxivlangan' }
			} as const;
			
			const config = statusConfig[row.status as keyof typeof statusConfig] || { type: 'default', label: row.status };
			return h(NTag, { type: config.type }, { default: () => config.label });
		}
	},
	{
		title: "Amallar",
		key: "actions",
		width: 150,
		render: (row: any) => {
			return h('div', { class: 'action-buttons' }, [
				h(NButton, {
					size: 'small',
					type: 'info',
					ghost: true,
					title: 'Ko\'rish',
					onClick: () => viewCourse(row)
				}, {
					icon: () => h(NIcon, { component: EyeIcon })
				}),
				h(NButton, {
					size: 'small',
					type: 'primary',
					ghost: true,
					title: 'Tahrirlash',
					onClick: () => editCourse(row),
					style: { marginLeft: '8px' }
				}, {
					icon: () => h(NIcon, { component: EditIcon })
				}),
				h(NPopconfirm, {
					showIcon: false,
					onPositiveClick: () => deleteCourse(row),
					positiveText: 'Ha, o\'chirish',
					negativeText: 'Bekor qilish',
					style: { marginLeft: '8px' }
				}, {
					trigger: () => h(NButton, {
						size: 'small',
						type: 'error',
						ghost: true,
						title: 'O\'chirish'
					}, {
						icon: () => h(NIcon, { component: Trash2Icon })
					}),
					default: () => `"${row.title}" kursini o'chirmoqchimisiz?`
				})
			]);
		}
	}
];

// Options
const categoryOptions = [
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Matematika", value: "Matematika" },
	{ label: "Fizika", value: "Fizika" },
	{ label: "Kimyo", value: "Kimyo" },
	{ label: "Biologiya", value: "Biologiya" },
	{ label: "Ingliz tili", value: "Ingliz tili" },
];

const statusOptions = [
	{ label: "Faol", value: "active" },
	{ label: "Qoralama", value: "draft" },
	{ label: "Arxivlangan", value: "archived" },
];

type CourseStatus = "active" | "draft" | "archived";

const teacherOptions = computed(() => 
	teachers.value.map((t: any) => ({ label: t.name, value: t.id }))
);

// Form validation rules
const courseFormRules = {
	title: [{ required: true, message: "Kurs nomi majburiy", trigger: "blur" }],
	subject: [{ required: true, message: "Fan majburiy", trigger: "change" }],
	teacher_id: [{ required: true, message: "O'qituvchi majburiy", trigger: "change" }],
	duration: [{ required: true, message: "Davomiyligi majburiy", trigger: "blur" }],
	price: [{ required: true, type: "number" as const, message: "Narxi majburiy", trigger: "blur" }],
	status: [{ required: true, message: "Holati majburiy", trigger: "change" }],
};

// API methods
async function fetchCoursesList(): Promise<void> {
	loading.value = true;
	try {
		// Build filter params
		const params: any = {
			page: pagination.value.page,
			limit: pagination.value.pageSize,
			search: pagination.value.search,
			sortBy: pagination.value.sortBy,
			sortOrder: pagination.value.orderType,
		};

		if (filterCategory.value) {
			params.subject = filterCategory.value;
		}
		
		if (filterStatus.value) {
			params.status = filterStatus.value;
		}

		// Simulate API call - replace with actual service call
		const response = await fetch(`/api/courses?${new URLSearchParams(params)}`);
		const data = await response.json();
		
		courses.value = data.data || [];
		totalItems.value = data.total || 0;
	} catch (error) {
		message.error("Kurslarni yuklashda xato yuz berdi");
		console.error("Error fetching courses:", error);
	} finally {
		loading.value = false;
	}
}

async function fetchTeachers(): Promise<void> {
	try {
		await teachersStore.fetchTeachers();
		teachers.value = teachersStore.teachers;
	} catch (error) {
		console.error("Error fetching teachers:", error);
	}
}

// Event handlers
function handleSearchChange(): void {
	// Reset to first page when searching
	pagination.value.page = 1;
	fetchCoursesList();
}

function handleFilterChange(): void {
	// Reset to first page when filtering
	pagination.value.page = 1;
	fetchCoursesList();
}

function handleTeacherSelect(teacherId: number): void {
	const teacher = teachers.value.find((t: any) => t.id === teacherId);
	if (teacher) {
		courseForm.value.teacher_name = teacher.name;
	}
}

// Course operations
function viewCourse(course: any): void {
	message.info(`Kurs tafsilotlari: ${course.title}`);
	console.log("View course:", course);
}

function editCourse(course: any): void {
	editingCourse.value = course;
	courseForm.value = { ...course };
	showAddModal.value = true;
}

async function deleteCourse(course: any): Promise<void> {
	try {
		await coursesStore.deleteCourse(course.id);
		message.success(`"${course.title}" kursi muvaffaqiyatli o'chirildi`);
		await fetchCoursesList(); // Refresh list
	} catch (error) {
		message.error("Kursni o'chirishda xato yuz berdi");
		console.error("Error deleting course:", error);
	}
}

async function saveCourse(): Promise<void> {
	try {
		await formRef.value?.validate();
		saving.value = true;

		if (editingCourse.value) {
			await coursesStore.updateCourse(editingCourse.value.id, courseForm.value);
			message.success("Kurs muvaffaqiyatli yangilandi");
		} else {
			await coursesStore.createCourse(courseForm.value);
			message.success("Yangi kurs muvaffaqiyatli qo'shildi");
		}
		
		closeModal();
		await fetchCoursesList(); // Refresh list
	} catch (error) {
		message.error("Kursni saqlashda xato yuz berdi");
		console.error("Error saving course:", error);
	} finally {
		saving.value = false;
	}
}

function closeModal(): void {
	showAddModal.value = false;
	editingCourse.value = null;
	courseForm.value = {
		title: "",
		subject: "",
		teacher_id: 0,
		teacher_name: "",
		duration: "",
		price: 0,
		students_count: 0,
		rating: 4.0,
		status: "active" as CourseStatus,
		description: "",
		color: "#3b82f6",
		icon: "book"
	};
}

// Utility functions
function formatPrice(price: number): string {
	return new Intl.NumberFormat("uz-UZ", {
		style: "currency",
		currency: "UZS",
		minimumFractionDigits: 0,
	}).format(price);
}

function formatPriceInput(value: number | null): string {
	if (value === null || value === undefined) return '0';
	return new Intl.NumberFormat('uz-UZ').format(value);
}

function parsePriceInput(input: string): number {
	const nums = input.replace(/,/g, '');
	return Number(nums);
}

// Watchers
watch([filterCategory, filterStatus], () => {
	handleFilterChange();
});

// Lifecycle
onMounted(async () => {
	await Promise.all([
		fetchCoursesList(),
		fetchTeachers()
	]);
});
</script>

<style scoped>
.courses-page {
	padding: 24px;
	max-width: 1400px;
	margin: 0 auto;
}

.page-header {
	margin-bottom: 24px;
}

.page-title {
	margin: 0;
	font-size: 28px;
	font-weight: 600;
	color: var(--n-text-color);
}

.stats-grid {
	margin-bottom: 24px;
}

.filters-card {
	margin-bottom: 24px;
}

.course-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.course-name {
	font-weight: 500;
	color: var(--n-text-color);
	font-size: 14px;
}

.course-code {
	font-size: 12px;
	color: var(--n-text-color-disabled);
}

.action-buttons {
	display: flex;
	gap: 8px;
	align-items: center;
}

/* Responsive design */
@media (max-width: 768px) {
	.courses-page {
		padding: 16px;
	}
	
	.stats-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 480px) {
	.stats-grid {
		grid-template-columns: 1fr;
	}
}
</style>