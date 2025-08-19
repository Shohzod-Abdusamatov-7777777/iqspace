<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mening kurslarim</h1>
				<p class="dark:text-gray-400 mt-1">O'qitayotgan kurslaringizni boshqaring va yangi kurs yarating</p>
			</div>

			<n-button type="primary" @click="showCreateModal = true">
				<template #icon>
					<n-icon>
						<PlusIcon />
					</n-icon>
				</template>
				Yangi kurs
			</n-button>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Jami kurslar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ courses.length }}</p>
					</div>
					<div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<BookOpenIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Jami o'quvchilar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalStudents }}</p>
					</div>
					<div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<UsersIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Faol topshiriqlar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeAssignments }}</p>
					</div>
					<div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<ClipboardListIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">O'rtacha baho</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">4.7</p>
					</div>
					<div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<StarIcon />
						</n-icon>
					</div>
				</div>
			</div>
		</div>

		<!-- Courses Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="course in courses" :key="course.id" class="course-card group cursor-pointer" @click="viewCourse(course)">
				<!-- Course header -->
				<div class="h-32 relative overflow-hidden" :style="{ backgroundColor: course.color }">
					<div class="absolute inset-0 bg-black bg-opacity-20"></div>
					<div class="absolute top-4 right-4">
						<n-dropdown :options="courseMenuOptions" @select="(key) => handleCourseAction(key, course)">
							<n-button quaternary circle size="small">
								<template #icon>
									<n-icon color="white">
										<MoreVerticalIcon />
									</n-icon>
								</template>
							</n-button>
						</n-dropdown>
					</div>
					<div class="absolute bottom-4 left-4">
						<n-icon size="48" color="white" class="opacity-80">
							<BookOpenIcon />
						</n-icon>
					</div>
				</div>

				<!-- Course content -->
				<div class="p-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
						{{ course.title }}
					</h3>

					<p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
						{{ course.description }}
					</p>

					<!-- Course meta -->
					<div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
						<div class="flex items-center gap-1">
							<n-icon>
								<UsersIcon />
							</n-icon>
							<span>{{ course.students_count }} o'quvchi</span>
						</div>
						<div class="flex items-center gap-1">
							<n-icon>
								<StarIcon />
							</n-icon>
							<span>{{ course.rating }}</span>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="flex gap-2">
						<n-button size="small" block @click.stop="viewCourse(course)">
							<template #icon>
								<n-icon>
									<EyeIcon />
								</n-icon>
							</template>
							Ko'rish
						</n-button>
						<n-button size="small" type="primary" @click.stop="editCourse(course)">
							<template #icon>
								<n-icon>
									<EditIcon />
								</n-icon>
							</template>
						</n-button>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div v-if="!loading && courses.length === 0" class="text-center py-12">
			<div class="mb-4">
				<n-icon size="64" color="#d1d5db">
					<BookOpenIcon />
				</n-icon>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Hali kurslaringiz yo'q</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-4">Birinchi kursingizni yarating va o'qitishni boshlang</p>
			<n-button type="primary" @click="showCreateModal = true"> Yangi kurs yaratish </n-button>
		</div>

		<!-- Create/Edit Course Modal -->
		<n-modal v-model:show="showCreateModal">
			<n-card
				style="width: 600px"
				:title="editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs yaratish'"
				:bordered="false"
				size="huge"
				role="dialog"
				aria-modal="true"
			>
				<n-form ref="formRef" :model="courseForm" :rules="courseFormRules" label-placement="top">
					<n-form-item path="title" label="Kurs nomi">
						<n-input v-model:value="courseForm.title" placeholder="Kurs nomini kiriting" />
					</n-form-item>

					<n-form-item path="description" label="Tavsif">
						<n-input v-model:value="courseForm.description" type="textarea" placeholder="Kurs haqida qisqacha ma'lumot..." :rows="3" />
					</n-form-item>

					<n-grid :cols="2" :x-gap="12">
						<n-form-item-gi path="subject" label="Fan">
							<n-select v-model:value="courseForm.subject" :options="subjectOptions" placeholder="Fanni tanlang" />
						</n-form-item-gi>

						<n-form-item-gi path="duration" label="Davomiyligi">
							<n-input v-model:value="courseForm.duration" placeholder="12 hafta" />
						</n-form-item-gi>

						<n-form-item-gi path="price" label="Narxi (so'm)">
							<n-input-number v-model:value="courseForm.price" :min="0" :step="100000" placeholder="0" style="width: 100%" />
						</n-form-item-gi>

						<n-form-item-gi path="color" label="Rang">
							<n-select v-model:value="courseForm.color" :options="colorOptions" placeholder="Rang tanlang" />
						</n-form-item-gi>
					</n-grid>
				</n-form>

				<template #footer>
					<div class="flex justify-end gap-3">
						<n-button @click="showCreateModal = false"> Bekor qilish </n-button>
						<n-button type="primary" @click="saveCourse" :loading="submitting">
							{{ editingCourse ? "Saqlash" : "Yaratish" }}
						</n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage, type FormInst } from "naive-ui";
import { teacherService } from "@/services/api";
import type { Course } from "@/types";

const router = useRouter();
const message = useMessage();

// Refs
const formRef = ref<FormInst | null>(null);

// State
const loading = ref(false);
const submitting = ref(false);
const showCreateModal = ref(false);
const editingCourse = ref<Course | null>(null);
const courses = ref<Course[]>([]);

const courseForm = reactive({
	title: "",
	description: "",
	subject: "",
	duration: "",
	price: 0,
	color: "#4361ee",
});

// Mock data
const mockCourses: Course[] = [
	{
		id: 1,
		title: "Informatika",
		description: "Python dasturlash tilini noldan o'rganish uchun mukammal kurs",
		teacher_id: 2,
		teacher_name: "Jamshid Doniyorov",
		subject: "Dasturlash",
		duration: "12 hafta",
		price: 1200000,
		students_count: 45,
		rating: 4.8,
		color: "#4361ee",
		icon: "code",
		status: "active",
		created_at: "2024-01-10T00:00:00Z",
		updated_at: "2024-06-01T00:00:00Z",
	},
	{
		id: 2,
		title: "Web Development",
		description: "HTML, CSS, JavaScript va Vue.js bilan web saytlar yaratish",
		teacher_id: 2,
		teacher_name: "Jamshid Doniyorov",
		subject: "Dasturlash",
		duration: "16 hafta",
		price: 1500000,
		students_count: 32,
		rating: 4.9,
		color: "#4895ef",
		icon: "globe",
		status: "active",
		created_at: "2024-02-01T00:00:00Z",
		updated_at: "2024-06-15T00:00:00Z",
	},
];

// Options
const subjectOptions = [
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Mobilografiya", value: "Mobilografiya" },
	{ label: "Rassomchilik", value: "Rassomchilik" },
	{ label: "Biologiya", value: "Biologiya" },
	{ label: "Fizika", value: "Fizika" },
];

const colorOptions = [
	{ label: "Ko'k", value: "#4361ee" },
	{ label: "Yashil", value: "#10b981" },
	{ label: "Qizil", value: "#ef4444" },
	{ label: "Sariq", value: "#f59e0b" },
	{ label: "Binafsha", value: "#8b5cf6" },
	{ label: "Pushti", value: "#ec4899" },
];

const courseMenuOptions = [
	{
		label: "Tahrirlash",
		key: "edit",
		icon: () => h("EditIcon"),
	},
	{
		label: "O'quvchilar",
		key: "students",
		icon: () => h("UsersIcon"),
	},
	{
		label: "Topshiriqlar",
		key: "assignments",
		icon: () => h("ClipboardListIcon"),
	},
	{
		type: "divider",
		key: "d1",
	},
	{
		label: "O'chirish",
		key: "delete",
		icon: () => h("Trash2Icon"),
	},
];

// Form validation
const courseFormRules = {
	title: [{ required: true, message: "Kurs nomini kiriting", trigger: "blur" }],
	description: [{ required: true, message: "Tavsif kiriting", trigger: "blur" }],
	subject: [{ required: true, message: "Fanni tanlang", trigger: "change" }],
	duration: [{ required: true, message: "Davomiyligini kiriting", trigger: "blur" }],
};

// Computed
const totalStudents = computed(() => {
	return courses.value.reduce((sum, course) => sum + course.students_count, 0);
});

const activeAssignments = computed(() => {
	return 12; // Mock data
});

// Methods
const loadCourses = async () => {
	try {
		loading.value = true;
		// Mock data - in real app: const response = await teacherService.getMyCourses();
		courses.value = mockCourses;
	} catch (error: any) {
		message.error(error.message || "Kurslarni yuklashda xatolik");
	} finally {
		loading.value = false;
	}
};

const viewCourse = (course: Course) => {
	router.push(`/dashboard/teacher/courses/${course.id}`);
};

const editCourse = (course: Course) => {
	editingCourse.value = course;
	courseForm.title = course.title;
	courseForm.description = course.description;
	courseForm.subject = course.subject;
	courseForm.duration = course.duration;
	courseForm.price = course.price;
	courseForm.color = course.color;
	showCreateModal.value = true;
};

const resetForm = () => {
	courseForm.title = "";
	courseForm.description = "";
	courseForm.subject = "";
	courseForm.duration = "";
	courseForm.price = 0;
	courseForm.color = "#4361ee";
	editingCourse.value = null;
};

const saveCourse = async () => {
	try {
		await formRef.value?.validate();
		submitting.value = true;

		if (editingCourse.value) {
			// await teacherService.updateCourse(editingCourse.value.id, courseForm);
			message.success("Kurs muvaffaqiyatli yangilandi");
		} else {
			// await teacherService.createCourse(courseForm);
			message.success("Yangi kurs muvaffaqiyatli yaratildi");
		}

		showCreateModal.value = false;
		resetForm();
		loadCourses();
	} catch (error: any) {
		message.error(error.message || "Saqlashda xatolik yuz berdi");
	} finally {
		submitting.value = false;
	}
};

const handleCourseAction = (action: string, course: Course) => {
	switch (action) {
		case "edit":
			editCourse(course);
			break;
		case "students":
			router.push(`/dashboard/teacher/courses/${course.id}/students`);
			break;
		case "assignments":
			router.push(`/dashboard/teacher/assignments?course=${course.id}`);
			break;
		case "delete":
			// Handle delete with confirmation
			break;
	}
};

// Lifecycle
onMounted(() => {
	loadCourses();
});
</script>

<style scoped>
@reference '../../assets/styles/main.css';
.stats-card {
	@apply bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200;
}

.course-card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}

.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
