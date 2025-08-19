<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mening topshiriqlarim</h1>
				<p class="dark:text-gray-400 mt-1">Sizga berilgan topshiriqlar va ularning holati</p>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Jami topshiriqlar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ assignments.length }}</p>
					</div>
					<div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<ClipboardListIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Topshirilgan</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ submittedCount }}</p>
					</div>
					<div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<CheckIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Baholangan</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ gradedCount }}</p>
					</div>
					<div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<StarIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">O'rtacha baho</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageGrade }}%</p>
					</div>
					<div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<BarChartIcon />
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
					<n-input v-model:value="searchQuery" placeholder="Topshiriq nomi..." clearable>
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
					<label class="form-label">Kurs</label>
					<n-select v-model:value="courseFilter" :options="courseOptions" />
				</div>
			</div>
		</div>

		<!-- Assignments List -->
		<div class="space-y-4">
			<div
				v-for="assignment in filteredAssignments"
				:key="assignment.id"
				class="card hover:shadow-lg transition-all duration-200 cursor-pointer"
				@click="viewAssignment(assignment)"
			>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-2">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
								{{ assignment.title }}
							</h3>
							<n-tag :type="getStatusType(assignment)" size="small">
								{{ getStatusLabel(assignment) }}
							</n-tag>
						</div>

						<p class="dark:text-gray-400 mb-3">
							{{ assignment.description }}
						</p>

						<div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
							<div class="flex items-center gap-1">
								<n-icon>
									<BookOpenIcon />
								</n-icon>
								<span>{{ getCourseTitle(assignment.course_id) }}</span>
							</div>

							<div class="flex items-center gap-1">
								<n-icon>
									<CalendarIcon />
								</n-icon>
								<span>Muddat: {{ formatDate(assignment.due_date) }}</span>
							</div>

							<div class="flex items-center gap-1">
								<n-icon>
									<StarIcon />
								</n-icon>
								<span>{{ assignment.max_score }} ball</span>
							</div>
						</div>
					</div>

					<div class="flex flex-col items-end gap-2">
						<div v-if="assignment.grade !== undefined" class="text-right">
							<div class="text-lg font-bold text-green-600">{{ assignment.grade }}/{{ assignment.max_score }}</div>
							<div class="text-xs text-gray-500">{{ Math.round((assignment.grade / assignment.max_score) * 100) }}%</div>
						</div>

						<n-button v-if="!assignment.submitted_at" type="primary" size="small" @click.stop="submitAssignment(assignment)">
							<template #icon>
								<n-icon>
									<UploadIcon />
								</n-icon>
							</template>
							Topshirish
						</n-button>

						<n-button v-else size="small" quaternary @click.stop="viewSubmission(assignment)">
							<template #icon>
								<n-icon>
									<EyeIcon />
								</n-icon>
							</template>
							Ko'rish
						</n-button>
					</div>
				</div>

				<!-- Progress bar for assignments with deadline -->
				<div v-if="assignment.due_date" class="mt-4">
					<div class="flex justify-between items-center mb-1">
						<span class="text-xs text-gray-500">Muddat</span>
						<span class="text-xs" :class="getTimeStatusColor(assignment.due_date)">
							{{ getTimeRemaining(assignment.due_date) }}
						</span>
					</div>
					<n-progress
						:percentage="getTimeProgress(assignment.due_date, assignment.created_at)"
						:color="getTimeProgressColor(assignment.due_date)"
						:show-indicator="false"
						:height="4"
					/>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div v-if="!loading && assignments.length === 0" class="text-center py-12">
			<div class="mb-4">
				<n-icon size="64" color="#d1d5db">
					<ClipboardListIcon />
				</n-icon>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Hali topshiriqlaringiz yo'q</h3>
			<p class="text-gray-500 dark:text-gray-400">O'qituvchilar tomonidan topshiriqlar berilganda bu yerda ko'rinadi</p>
		</div>

		<!-- Assignment Submission Modal -->
		<n-modal v-model:show="showSubmissionModal">
			<n-card style="width: 600px" title="Topshiriqni topshirish" :bordered="false" size="huge">
				<div v-if="selectedAssignment" class="space-y-4">
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h4 class="font-medium text-gray-900 dark:text-white mb-2">
							{{ selectedAssignment.title }}
						</h4>
						<p class="text-sm dark:text-gray-400">
							{{ selectedAssignment.description }}
						</p>
					</div>

					<n-form-item label="Javobingiz">
						<n-input v-model:value="submissionContent" type="textarea" placeholder="Topshiriq javobini bu yerga yozing..." :rows="6" />
					</n-form-item>
				</div>

				<template #footer>
					<div class="flex justify-end gap-3">
						<n-button @click="showSubmissionModal = false"> Bekor qilish </n-button>
						<n-button type="primary" @click="handleSubmitAssignment" :loading="submitting"> Topshirish </n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMessage } from "naive-ui";
import { studentService } from "@/services/api";

const message = useMessage();

// State
const loading = ref(false);
const submitting = ref(false);
const showSubmissionModal = ref(false);
const selectedAssignment = ref<any>(null);
const submissionContent = ref("");
const searchQuery = ref("");
const statusFilter = ref("all");
const courseFilter = ref("all");

// Mock data
const assignments = ref([
	{
		id: 1,
		course_id: 1,
		title: "Python o'zgaruvchilar",
		description: "Python dasturlash tilida o'zgaruvchilar bilan ishlash",
		due_date: "2024-07-10T23:59:59Z",
		max_score: 100,
		created_at: "2024-07-01T00:00:00Z",
		submitted_at: "2024-07-01T14:30:00Z",
		grade: 85,
	},
	{
		id: 2,
		course_id: 1,
		title: "Shartli operatorlar",
		description: "If-else shartli operatorlari bilan amaliy mashq",
		due_date: "2024-07-15T23:59:59Z",
		max_score: 80,
		created_at: "2024-07-01T00:00:00Z",
		submitted_at: null,
		grade: undefined,
	},
	{
		id: 3,
		course_id: 2,
		title: "Kvadrat tenglama",
		description: "Kvadrat tenglamalarni yechish usullari",
		due_date: "2024-07-12T23:59:59Z",
		max_score: 90,
		created_at: "2024-07-01T00:00:00Z",
		submitted_at: "2024-07-02T16:45:00Z",
		grade: 92,
	},
]);

const courses = ref([
	{ id: 1, title: "Dasturlash asoslari" },
	{ id: 2, title: "Matematika asoslari" },
]);

// Options
const statusOptions = [
	{ label: "Barcha", value: "all" },
	{ label: "Kutilmoqda", value: "pending" },
	{ label: "Topshirilgan", value: "submitted" },
	{ label: "Baholangan", value: "graded" },
	{ label: "Muddat o'tgan", value: "overdue" },
];

const courseOptions = computed(() => [
	{ label: "Barcha kurslar", value: "all" },
	...courses.value.map((course) => ({ label: course.title, value: course.id })),
]);

// Computed
const filteredAssignments = computed(() => {
	return assignments.value.filter((assignment) => {
		const matchesSearch = !searchQuery.value || assignment.title.toLowerCase().includes(searchQuery.value.toLowerCase());

		const matchesStatus = statusFilter.value === "all" || getAssignmentStatus(assignment) === statusFilter.value;

		const matchesCourse = courseFilter.value === "all" || assignment.course_id === courseFilter.value;

		return matchesSearch && matchesStatus && matchesCourse;
	});
});

const submittedCount = computed(() => {
	return assignments.value.filter((a) => a.submitted_at).length;
});

const gradedCount = computed(() => {
	return assignments.value.filter((a) => a.grade !== undefined).length;
});

const averageGrade = computed(() => {
	const gradedAssignments = assignments.value.filter((a) => a.grade !== undefined);
	if (gradedAssignments.length === 0) return 0;

	const total = gradedAssignments.reduce((sum, a) => sum + (a.grade / a.max_score) * 100, 0);
	return Math.round(total / gradedAssignments.length);
});

// Methods
const getAssignmentStatus = (assignment: any) => {
	if (assignment.grade !== undefined) return "graded";
	if (assignment.submitted_at) return "submitted";
	if (new Date(assignment.due_date) < new Date()) return "overdue";
	return "pending";
};

const getStatusType = (assignment: any) => {
	const status = getAssignmentStatus(assignment);
	switch (status) {
		case "graded":
			return "success";
		case "submitted":
			return "info";
		case "overdue":
			return "error";
		default:
			return "warning";
	}
};

const getStatusLabel = (assignment: any) => {
	const status = getAssignmentStatus(assignment);
	switch (status) {
		case "graded":
			return "Baholangan";
		case "submitted":
			return "Topshirilgan";
		case "overdue":
			return "Muddat o'tgan";
		default:
			return "Kutilmoqda";
	}
};

const getCourseTitle = (courseId: number) => {
	const course = courses.value.find((c) => c.id === courseId);
	return course?.title || "Noma'lum kurs";
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("uz-UZ");
};

const getTimeRemaining = (dueDateString: string) => {
	const dueDate = new Date(dueDateString);
	const now = new Date();
	const diff = dueDate.getTime() - now.getTime();

	if (diff < 0) return "Muddat o'tgan";

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

	if (days > 0) return `${days} kun qoldi`;
	if (hours > 0) return `${hours} soat qoldi`;
	return "Yaqinda tugaydi";
};

const getTimeStatusColor = (dueDateString: string) => {
	const dueDate = new Date(dueDateString);
	const now = new Date();
	const diff = dueDate.getTime() - now.getTime();
	const hours = diff / (1000 * 60 * 60);

	if (diff < 0) return "text-red-600";
	if (hours < 24) return "text-orange-600";
	return "text-green-600";
};

const getTimeProgress = (dueDateString: string, createdAtString: string) => {
	const dueDate = new Date(dueDateString);
	const createdAt = new Date(createdAtString);
	const now = new Date();

	const total = dueDate.getTime() - createdAt.getTime();
	const elapsed = now.getTime() - createdAt.getTime();

	return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

const getTimeProgressColor = (dueDateString: string) => {
	const dueDate = new Date(dueDateString);
	const now = new Date();
	const diff = dueDate.getTime() - now.getTime();
	const hours = diff / (1000 * 60 * 60);

	if (diff < 0) return "#ef4444";
	if (hours < 24) return "#f59e0b";
	return "#10b981";
};

const viewAssignment = (assignment: any) => {
	console.log("View assignment:", assignment);
};

const submitAssignment = (assignment: any) => {
	selectedAssignment.value = assignment;
	submissionContent.value = "";
	showSubmissionModal.value = true;
};

const viewSubmission = (assignment: any) => {
	console.log("View submission:", assignment);
};

const handleSubmitAssignment = async () => {
	if (!submissionContent.value.trim()) {
		message.error("Javob matnini kiriting");
		return;
	}

	try {
		submitting.value = true;
		// await studentService.submitAssignment(selectedAssignment.value.id, submissionContent.value);

		// Mock success
		message.success("Topshiriq muvaffaqiyatli topshirildi!");

		// Update local state
		const assignment = assignments.value.find((a) => a.id === selectedAssignment.value.id);
		if (assignment) {
			assignment.submitted_at = new Date().toISOString();
		}

		showSubmissionModal.value = false;
	} catch (error: any) {
		message.error(error.message || "Topshirishda xatolik yuz berdi");
	} finally {
		submitting.value = false;
	}
};

// Lifecycle
onMounted(() => {
	// Load assignments
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

.form-label {
	@apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}
</style>
