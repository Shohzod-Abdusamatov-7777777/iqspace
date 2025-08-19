<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mening baholarim</h1>
				<p class="dark:text-gray-400 mt-1">Barcha kurslar bo'yicha olingan baholar va statistika</p>
			</div>

			<n-button @click="downloadReport">
				<template #icon>
					<n-icon>
						<DownloadIcon />
					</n-icon>
				</template>
				Hisobotni yuklab olish
			</n-button>
		</div>

		<!-- Overall Statistics -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">O'rtacha baho</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ overallGPA.toFixed(1) }}</p>
						<p class="text-xs text-green-600">+0.3 o'sgan</p>
					</div>
					<div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<StarIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Baholangan topshiriqlar</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ gradedAssignments }}</p>
						<p class="text-xs text-gray-500">{{ totalAssignments }} dan</p>
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
						<p class="text-sm dark:text-gray-400 mb-1">Eng yuqori baho</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ highestGrade }}%</p>
						<p class="text-xs text-blue-600">Python kursi</p>
					</div>
					<div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<BarChartIcon />
						</n-icon>
					</div>
				</div>
			</div>

			<div class="stats-card">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm dark:text-gray-400 mb-1">Muvaffaqiyat darajasi</p>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ successRate }}%</p>
						<p class="text-xs text-green-600">A'lo ko'rsatkich</p>
					</div>
					<div class="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
						<n-icon size="24" color="white">
							<BookOpenIcon />
						</n-icon>
					</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="card">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="form-label">Kurs</label>
					<n-select v-model:value="selectedCourse" :options="courseOptions" @update:value="filterGrades" />
				</div>

				<div>
					<label class="form-label">Baho turi</label>
					<n-select v-model:value="gradeType" :options="gradeTypeOptions" @update:value="filterGrades" />
				</div>

				<div>
					<label class="form-label">Vaqt oralig'i</label>
					<n-select v-model:value="timeRange" :options="timeRangeOptions" @update:value="filterGrades" />
				</div>
			</div>
		</div>

		<!-- Grades by Course -->
		<div class="space-y-6">
			<div v-for="course in courseGrades" :key="course.courseId" class="card">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: course.color }">
							<n-icon size="24" color="white">
								<BookOpenIcon />
							</n-icon>
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
								{{ course.courseTitle }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{{ course.teacherName }}
							</p>
						</div>
					</div>

					<div class="text-right">
						<div class="text-2xl font-bold text-gray-900 dark:text-white">
							{{ course.averageGrade.toFixed(1) }}
						</div>
						<div class="text-sm text-gray-500">O'rtacha baho</div>
					</div>
				</div>

				<!-- Progress bar -->
				<div class="mb-4">
					<div class="flex justify-between items-center mb-2">
						<span class="text-sm dark:text-gray-400">Kurs progressi</span>
						<span class="text-sm font-medium text-gray-900 dark:text-white"> {{ course.progress }}% </span>
					</div>
					<n-progress :percentage="course.progress" :color="getProgressColor(course.progress)" :show-indicator="false" />
				</div>

				<!-- Assignments table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-gray-200 dark:border-gray-600">
								<th class="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Topshiriq</th>
								<th class="text-center py-3 text-sm font-medium text-gray-900 dark:text-white">Baho</th>
								<th class="text-center py-3 text-sm font-medium text-gray-900 dark:text-white">Foiz</th>
								<th class="text-center py-3 text-sm font-medium text-gray-900 dark:text-white">Sana</th>
								<th class="text-center py-3 text-sm font-medium text-gray-900 dark:text-white">Harakat</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="grade in course.grades" :key="grade.id" class="border-b border-gray-100 dark:border-gray-700">
								<td class="py-3">
									<div>
										<p class="font-medium text-gray-900 dark:text-white">
											{{ grade.assignmentTitle }}
										</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">Maksimal: {{ grade.maxScore }} ball</p>
									</div>
								</td>
								<td class="text-center py-3">
									<span class="font-semibold text-gray-900 dark:text-white"> {{ grade.grade }}/{{ grade.maxScore }} </span>
								</td>
								<td class="text-center py-3">
									<n-tag :type="getGradeType(grade.percentage)" size="small"> {{ grade.percentage }}% </n-tag>
								</td>
								<td class="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
									{{ formatDate(grade.gradedAt) }}
								</td>
								<td class="text-center py-3">
									<n-button size="small" quaternary @click="viewGradeDetails(grade)">
										<template #icon>
											<n-icon>
												<EyeIcon />
											</n-icon>
										</template>
									</n-button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Empty state -->
		<div v-if="courseGrades.length === 0" class="text-center py-12">
			<div class="mb-4">
				<n-icon size="64" color="#d1d5db">
					<StarIcon />
				</n-icon>
			</div>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Hali baholaringiz yo'q</h3>
			<p class="text-gray-500 dark:text-gray-400">Topshiriqlar baholangach, bu yerda ko'rinadi</p>
		</div>

		<!-- Grade Details Modal -->
		<n-modal v-model:show="showDetailsModal">
			<n-card style="width: 500px" title="Baho tafsilotlari" :bordered="false" size="huge">
				<div v-if="selectedGrade" class="space-y-4">
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
						<h4 class="font-medium text-gray-900 dark:text-white mb-2">
							{{ selectedGrade.assignmentTitle }}
						</h4>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="text-gray-500 dark:text-gray-400">Baho:</span>
								<span class="font-medium text-gray-900 dark:text-white ml-2"> {{ selectedGrade.grade }}/{{ selectedGrade.maxScore }} </span>
							</div>
							<div>
								<span class="text-gray-500 dark:text-gray-400">Foiz:</span>
								<span class="font-medium text-gray-900 dark:text-white ml-2"> {{ selectedGrade.percentage }}% </span>
							</div>
							<div>
								<span class="text-gray-500 dark:text-gray-400">Sana:</span>
								<span class="font-medium text-gray-900 dark:text-white ml-2">
									{{ formatDate(selectedGrade.gradedAt) }}
								</span>
							</div>
							<div>
								<span class="text-gray-500 dark:text-gray-400">O'qituvchi:</span>
								<span class="font-medium text-gray-900 dark:text-white ml-2"> Jamshid Doniyorov </span>
							</div>
						</div>
					</div>

					<div v-if="selectedGrade.feedback">
						<h5 class="font-medium text-gray-900 dark:text-white mb-2">O'qituvchi izohi:</h5>
						<p class="dark:text-gray-400 text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
							{{ selectedGrade.feedback }}
						</p>
					</div>
				</div>

				<template #footer>
					<div class="flex justify-end">
						<n-button @click="showDetailsModal = false"> Yopish </n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMessage } from "naive-ui";

const message = useMessage();

// State
const loading = ref(false);
const showDetailsModal = ref(false);
const selectedGrade = ref<any>(null);
const selectedCourse = ref("all");
const gradeType = ref("all");
const timeRange = ref("all");

// Mock data
const grades = ref([
	{
		id: 1,
		studentId: 4,
		studentName: "Ali Karimov",
		courseId: 1,
		courseTitle: "Informatika",
		assignmentId: 1,
		assignmentTitle: "Python o'zgaruvchilar",
		grade: 85,
		maxScore: 100,
		percentage: 85,
		gradedAt: "2024-07-01T16:00:00Z",
		gradedBy: 2,
		feedback: "Yaxshi ish! Kodi to'g'ri ishlaydi.",
	},
	{
		id: 2,
		studentId: 4,
		studentName: "Ali Karimov",
		courseId: 1,
		courseTitle: "Informatika",
		assignmentId: 2,
		assignmentTitle: "Shartli operatorlar",
		grade: 90,
		maxScore: 100,
		percentage: 90,
		gradedAt: "2024-07-02T14:30:00Z",
		gradedBy: 2,
		feedback: "A'lo! Mantiqni yaxshi tushungan.",
	},
	{
		id: 3,
		studentId: 4,
		studentName: "Ali Karimov",
		courseId: 2,
		courseTitle: "Mobilografiya asoslari",
		assignmentId: 3,
		assignmentTitle: "Kvadrat tenglama",
		grade: 92,
		maxScore: 100,
		percentage: 92,
		gradedAt: "2024-07-02T16:00:00Z",
		gradedBy: 3,
		feedback: "Mukammal yechim!",
	},
]);

// Options
const courseOptions = [
	{ label: "Barcha kurslar", value: "all" },
	{ label: "Informatika", value: 1 },
	{ label: "Mobilografiya asoslari", value: 2 },
];

const gradeTypeOptions = [
	{ label: "Barcha", value: "all" },
	{ label: "A'lo (90-100%)", value: "excellent" },
	{ label: "Yaxshi (70-89%)", value: "good" },
	{ label: "Qoniqarli (50-69%)", value: "satisfactory" },
];

const timeRangeOptions = [
	{ label: "Barcha vaqt", value: "all" },
	{ label: "So'nggi hafta", value: "week" },
	{ label: "So'nggi oy", value: "month" },
	{ label: "So'nggi 3 oy", value: "quarter" },
];

// Computed
const overallGPA = computed(() => {
	if (grades.value.length === 0) return 0;
	const total = grades.value.reduce((sum, grade) => sum + grade.percentage, 0);
	return total / grades.value.length;
});

const gradedAssignments = computed(() => grades.value.length);
const totalAssignments = computed(() => 8); // Mock total

const highestGrade = computed(() => {
	if (grades.value.length === 0) return 0;
	return Math.max(...grades.value.map((g) => g.percentage));
});

const successRate = computed(() => {
	if (grades.value.length === 0) return 0;
	const passed = grades.value.filter((g) => g.percentage >= 70).length;
	return Math.round((passed / grades.value.length) * 100);
});

const courseGrades = computed(() => {
	const courseMap = new Map();

	grades.value.forEach((grade) => {
		if (!courseMap.has(grade.courseId)) {
			courseMap.set(grade.courseId, {
				courseId: grade.courseId,
				courseTitle: grade.courseTitle,
				teacherName: grade.courseId === 1 ? "Jamshid Doniyorov" : "Dilfuza Rahimova",
				color: grade.courseId === 1 ? "#4361ee" : "#4895ef",
				grades: [],
				progress: grade.courseId === 1 ? 65 : 40,
			});
		}

		courseMap.get(grade.courseId).grades.push(grade);
	});

	// Calculate average grades
	courseMap.forEach((course) => {
		const total = course.grades.reduce((sum: number, g: any) => sum + g.percentage, 0);
		course.averageGrade = total / course.grades.length;
	});

	return Array.from(courseMap.values());
});

// Methods
const getProgressColor = (progress: number) => {
	if (progress >= 80) return "#10b981";
	if (progress >= 50) return "#f59e0b";
	return "#ef4444";
};

const getGradeType = (percentage: number) => {
	if (percentage >= 90) return "success";
	if (percentage >= 70) return "info";
	if (percentage >= 50) return "warning";
	return "error";
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("uz-UZ");
};

const viewGradeDetails = (grade: any) => {
	selectedGrade.value = grade;
	showDetailsModal.value = true;
};

const filterGrades = () => {
	// Filter logic would go here
	message.info("Filtr funksiyasi");
};

const downloadReport = () => {
	const reportData = {
		student: "Ali Karimov",
		overallGPA: overallGPA.value,
		totalGrades: grades.value.length,
		grades: grades.value,
		generatedAt: new Date().toISOString(),
	};

	const dataStr = JSON.stringify(reportData, null, 2);
	const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

	const exportFileDefaultName = `grades-report-${Date.now()}.json`;

	const linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();

	message.success("Hisobot yuklab olindi");
};

// Lifecycle
onMounted(() => {
	// Load grades
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

/* Custom table styling */
table {
	border-collapse: separate;
	border-spacing: 0;
}

th:first-child {
	@apply rounded-tl-lg;
}

th:last-child {
	@apply rounded-tr-lg;
}

tbody tr:last-child td:first-child {
	@apply rounded-bl-lg;
}

tbody tr:last-child td:last-child {
	@apply rounded-br-lg;
}
</style>
