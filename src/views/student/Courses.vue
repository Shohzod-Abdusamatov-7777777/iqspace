<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mening kurslarim</h1>
				<p class="dark:text-gray-400 mt-1">Siz ro'yxatdan o'tgan kurslar va ularning progressi</p>
			</div>

			<n-button type="primary" @click="showAvailableCoursesModal = true">
				<template #icon>
					<n-icon>
						<PlusIcon />
					</n-icon>
				</template>
				Yangi kursga yozilish
			</n-button>
		</div>

		<!-- Progress Overview -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Jami kurslar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">
							{{ enrolledCourses.length }}
						</p>
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
						<p class="text-sm dark:text-gray-400 mb-1">O'rtacha progress</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageProgress }}%</p>
					</div>
					<div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<BarChartIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Tugallangan</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">
							{{ completedCourses }}
						</p>
					</div>
					<div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<StarIcon />
						</n-icon>
					</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="card">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="form-label">Qidirish</label>
					<n-input v-model:value="searchQuery" placeholder="Kurs nomi..." clearable>
						<template #prefix>
							<n-icon>
								<SearchIcon />
							</n-icon>
						</template>
					</n-input>
				</div>

				<div>
					<label class="form-label">Status</label>
					<n-select v-model:value="statusFilter" :options="statusOptions" />
				</div>

				<div>
					<label class="form-label">Fan</label>
					<n-select v-model:value="subjectFilter" :options="subjectOptions" />
				</div>
			</div>
		</div>

		<!-- Courses Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="enrollment in filteredCourses" :key="enrollment.id" class="course-card group cursor-pointer" @click="viewCourse(enrollment)">
				<!-- Course header with color -->
				<div class="h-32 relative overflow-hidden" :style="{ backgroundColor: getCourseColor(enrollment.course_id) }">
					<div class="absolute inset-0 bg-black bg-opacity-20"></div>
					<div class="absolute top-4 right-4">
						<n-tag :type="getStatusType(enrollment.status)" size="small">
							{{ getStatusLabel(enrollment.status) }}
						</n-tag>
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
						{{ enrollment.course_title }}
					</h3>

					<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
						<n-icon>
							<ChalkboardTeacherIcon />
						</n-icon>
						<span>{{ getCourseTeacher(enrollment.course_id) }}</span>
					</div>

					<!-- Progress bar -->
					<div class="mb-4">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm dark:text-gray-400">Progress</span>
							<span class="text-sm font-medium text-gray-900 dark:text-white"> {{ enrollment.progress }}% </span>
						</div>
						<n-progress :percentage="enrollment.progress" :color="getProgressColor(enrollment.progress)" :show-indicator="false" />
					</div>

					<!-- Action buttons -->
					<div class="flex gap-2">
						<n-button size="small" block @click.stop="viewCourse(enrollment)">
							<template #icon>
								<n-icon>
									<EyeIcon />
								</n-icon>
							</template>
							Ko'rish
						</n-button>
						<n-button size="small" type="error" quaternary @click.stop="unenrollCourse(enrollment)">
							<template #icon>
								<n-icon>
									<XIcon />
								</n-icon>
							</template>
						</n-button>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div v-if="!loading && enrolledCourses.length === 0" class="text-center py-12">
			<div class="mb-4">
				<n-icon size="64" color="#d1d5db">
					<BookOpenIcon />
				</n-icon>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Hali kurslaringiz yo'q</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-4">Birinchi kursingizga yoziling va o'rganishni boshlang</p>
			<n-button type="primary" @click="showAvailableCoursesModal = true"> Kurslarni ko'rish </n-button>
		</div>

		<!-- Available Courses Modal -->
		<n-modal v-model:show="showAvailableCoursesModal">
			<n-card style="width: 900px; max-height: 80vh" title="Mavjud kurslar" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<div class="space-y-4 max-h-96 overflow-y-auto">
					<div
						v-for="course in availableCourses"
						:key="course.id"
						class="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						<div class="w-16 h-16 rounded-lg flex items-center justify-center" :style="{ backgroundColor: course.color }">
							<n-icon size="24" color="white">
								<BookOpenIcon />
							</n-icon>
						</div>

						<div class="flex-1">
							<h4 class="font-medium text-gray-900 dark:text-white">
								{{ course.title }}
							</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
								{{ course.teacher_name }}
							</p>
							<p class="text-xs text-gray-400">{{ course.students_count }} o'quvchi • {{ course.duration }}</p>
						</div>

						<div class="flex items-center gap-2">
							<n-tag size="small"> {{ course.price.toLocaleString() }} so'm </n-tag>
							<n-button size="small" type="primary" @click="enrollInCourse(course.id)" :loading="enrolling === course.id"> Yozilish </n-button>
						</div>
					</div>
				</div>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { studentService } from "@/services/api";
import type { Enrollment, Course } from "@/types";

const router = useRouter();
const message = useMessage();

// State
const loading = ref(false);
const enrolling = ref<number | null>(null);
const showAvailableCoursesModal = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
const subjectFilter = ref("all");

const enrolledCourses = ref<Enrollment[]>([]);
const availableCourses = ref<Course[]>([]);

// Mock data for demonstration
const mockCourses = [
	{
		id: 1,
		title: "Informatika",
		teacher_name: "Jamshid Doniyorov",
		color: "#4361ee",
		price: 1200000,
		students_count: 245,
		duration: "12 hafta",
	},
	{
		id: 2,
		title: "Mobilografiya asoslari",
		teacher_name: "Dilfuza Rahimova",
		color: "#4895ef",
		price: 800000,
		students_count: 187,
		duration: "16 hafta",
	},
	{ id: 3, title: "Rassomchilik asoslari", teacher_name: "Shodmon Yusupov", color: "#3f37c9", price: 900000, students_count: 132, duration: "14 hafta" },
	{ id: 4, title: "Biologiya asoslari", teacher_name: "Zebo Karimova", color: "#7209b7", price: 750000, students_count: 98, duration: "12 hafta" },
];

// Options
const statusOptions = [
	{ label: "Barcha", value: "all" },
	{ label: "Faol", value: "active" },
	{ label: "Tugallangan", value: "completed" },
	{ label: "To'xtatilgan", value: "dropped" },
];

const subjectOptions = [
	{ label: "Barcha fanlar", value: "all" },
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Mobilografiya", value: "Mobilografiya" },
	{ label: "Rassomchilik", value: "Rassomchilik" },
	{ label: "Biologiya", value: "Biologiya" },
];

// Computed
const filteredCourses = computed(() => {
	return enrolledCourses.value.filter((enrollment) => {
		const matchesSearch = !searchQuery.value || enrollment.course_title.toLowerCase().includes(searchQuery.value.toLowerCase());

		const matchesStatus = statusFilter.value === "all" || enrollment.status === statusFilter.value;

		return matchesSearch && matchesStatus;
	});
});

const averageProgress = computed(() => {
	if (enrolledCourses.value.length === 0) return 0;
	const total = enrolledCourses.value.reduce((sum, enrollment) => sum + enrollment.progress, 0);
	return Math.round(total / enrolledCourses.value.length);
});

const completedCourses = computed(() => {
	return enrolledCourses.value.filter((enrollment) => enrollment.progress >= 100).length;
});

// Methods
const loadMyCourses = async () => {
	try {
		loading.value = true;
		// Mock data - in real app, use: const response = await studentService.getMyCourses();
		enrolledCourses.value = [
			{
				id: 1,
				student_id: 4,
				student_name: "Ali Karimov",
				course_id: 1,
				course_title: "Informatika",
				enrolled_at: "2024-02-05T00:00:00Z",
				status: "active",
				progress: 65,
			},
			{
				id: 2,
				student_id: 4,
				student_name: "Ali Karimov",
				course_id: 2,
				course_title: "Mobilografiya asoslari",
				enrolled_at: "2024-02-10T00:00:00Z",
				status: "active",
				progress: 40,
			},
			{
				id: 3,
				student_id: 4,
				student_name: "Ali Karimov",
				course_id: 3,
				course_title: "Rassomchilik asoslari",
				enrolled_at: "2024-03-01T00:00:00Z",
				status: "completed",
				progress: 100,
			},
		];
	} catch (error: any) {
		message.error(error.message || "Kurslarni yuklashda xatolik");
	} finally {
		loading.value = false;
	}
};

const loadAvailableCourses = async () => {
	try {
		// Mock data - in real app, get all courses and filter out enrolled ones
		const enrolledIds = enrolledCourses.value.map((e) => e.course_id);
		availableCourses.value = mockCourses.filter((course) => !enrolledIds.includes(course.id));
	} catch (error: any) {
		message.error(error.message || "Mavjud kurslarni yuklashda xatolik");
	}
};

const getCourseColor = (courseId: number) => {
	const colors = {
		1: "#4361ee",
		2: "#4895ef",
		3: "#3f37c9",
		4: "#7209b7",
	};
	return colors[courseId as keyof typeof colors] || "#6b7280";
};

const getCourseTeacher = (courseId: number) => {
	const teachers = {
		1: "Jamshid Doniyorov",
		2: "Dilfuza Rahimova",
		3: "Shodmon Yusupov",
		4: "Zebo Karimova",
	};
	return teachers[courseId as keyof typeof teachers] || "Noma'lum";
};

const getStatusType = (status: string) => {
	switch (status) {
		case "active":
			return "info";
		case "completed":
			return "success";
		case "dropped":
			return "error";
		default:
			return "default";
	}
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case "active":
			return "Faol";
		case "completed":
			return "Tugallangan";
		case "dropped":
			return "To'xtatilgan";
		default:
			return "Noma'lum";
	}
};

const getProgressColor = (progress: number) => {
	if (progress >= 80) return "#10b981";
	if (progress >= 50) return "#f59e0b";
	return "#ef4444";
};

const viewCourse = (enrollment: Enrollment) => {
	// Navigate to course detail page
	router.push(`/dashboard/student/courses/${enrollment.course_id}`);
};

const enrollInCourse = async (courseId: number) => {
	try {
		enrolling.value = courseId;
		// await studentService.enrollInCourse(courseId);

		// Mock success
		message.success("Kursga muvaffaqiyatli yozildingiz!");
		showAvailableCoursesModal.value = false;

		// Refresh data
		loadMyCourses();
		loadAvailableCourses();
	} catch (error: any) {
		message.error(error.message || "Kursga yozilishda xatolik");
	} finally {
		enrolling.value = null;
	}
};

const unenrollCourse = async (enrollment: Enrollment) => {
	try {
		// await studentService.unenrollFromCourse(enrollment.course_id);

		message.success("Kursdan muvaffaqiyatli chiqildi");

		// Remove from local state
		enrolledCourses.value = enrolledCourses.value.filter((e) => e.id !== enrollment.id);
		loadAvailableCourses();
	} catch (error: any) {
		message.error(error.message || "Kursdan chiqishda xatolik");
	}
};

// Lifecycle
onMounted(() => {
	loadMyCourses();
	loadAvailableCourses();
});
</script>

<style scoped>
@reference '../../assets/styles/main.css';
.stats-card {
	@apply bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200;
}

.card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6;
}

.course-card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
}

.form-label {
	@apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

/* Custom progress bar styling */
:deep(.n-progress .n-progress-graph .n-progress-graph-line-fill) {
	transition: all 0.3s ease;
}

/* Course card hover effects */
.course-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
