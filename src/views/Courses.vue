<template>
	<n-space vertical size="large">
		<!-- Page Header -->
		<n-space justify="space-between" align="center">
			<n-h2 style="color: var(--primary-color)">Kurslar</n-h2>
			<n-space>
				<n-button secondary>
					<template #icon>
						<FilterIcon />
					</template>
					Filtr
				</n-button>
				<n-button>
					<template #icon>
						<PlusIcon />
					</template>
					Yangi kurs
				</n-button>
			</n-space>
		</n-space>

		<!-- Search and Filters -->
		<n-space vertical>
			<n-space align="center" justify="space-between">
				<n-input v-model:value="searchQuery" placeholder="Kurslarni qidirish..." @keyup.enter="handleSearch" style="width: 300px" :loading="loading">
					<template #prefix>
						<SearchIcon />
					</template>
				</n-input>
				<n-space>
					<n-select
						v-model:value="selectedSubject"
						:options="subjectOptions"
						placeholder="Fan bo'yicha"
						style="width: 150px"
						@update:value="handleSubjectFilter"
					/>
					<n-select v-model:value="sortBy" :options="sortOptions" placeholder="Saralash" style="width: 150px" @update:value="handleSort" />
					<n-button secondary size="small" @click="clearFilters" :disabled="!hasActiveFilters"> Filtrlarni tozalash </n-button>
				</n-space>
			</n-space>

			<!-- Results summary -->
			<n-text depth="3" size="small" v-if="!loading && courses.length > 0">{{ totalItems }} ta kursdan {{ courses.length }} tasi ko'rsatilmoqda</n-text>
		</n-space>

		<!-- Courses Grid (paginated) -->
		<n-flex v-if="loading" justify="center" align="center" style="padding: 48px 0">
			<n-spin size="large" />
		</n-flex>

		<n-grid v-else cols="1 m:2 l:3" x-gap="24" y-gap="24" responsive="screen">
			<n-gi v-for="course in courses" :key="course.id">
				<n-card hoverable>
					<n-space vertical>
						<div :class="(bgMap[course.color as string] || 'bg-blue-600') + ' h-40 flex items-center justify-center text-white rounded-xl shadow-lg'">
							<component :is="iconMap[course.icon as string] || Code2Icon" :size="56" />
						</div>
						<n-h4 style="margin-bottom: 8px">{{ course.title }}</n-h4>
						<n-space align="center" size="small" style="margin-bottom: 12px">
							<UserIcon />
							<n-text>{{ course.instructor }}</n-text>
						</n-space>
						<n-text size="small" style="margin-bottom: 16px">{{ course.description }}</n-text>
						<n-space justify="space-between" align="center" size="small">
							<n-space align="center" size="small">
								<UsersIcon />
								<n-text>{{ course.students }}</n-text>
							</n-space>
							<n-space align="center" size="small">
								<StarIcon />
								<n-text style="color: var(--warning-color)">{{ course.rating }}</n-text>
							</n-space>
						</n-space>
						<n-space justify="space-between" align="center" size="small" style="margin-top: 8px">
							<n-text size="small" depth="3">{{ course.duration }}</n-text>
							<n-text size="small" strong style="color: var(--success-color)">{{ formatPrice(course.price) }}</n-text>
						</n-space>
					</n-space>
				</n-card>
			</n-gi>
		</n-grid>

		<!-- Empty state -->
		<n-flex v-if="!loading && courses.length === 0 && !error" vertical justify="center" align="center" style="padding: 48px 0">
			<n-empty description="Kurslar topilmadi" />
		</n-flex>

		<!-- Error state -->
		<n-flex v-if="error" vertical justify="center" align="center" style="padding: 48px 0">
			<n-result status="error" :title="error" description="Iltimos, qaytadan urinib ko'ring">
				<template #footer>
					<n-button @click="getCourses"> Qaytadan urinish </n-button>
				</template>
			</n-result>
		</n-flex>

		<!-- Pagination controls for grid -->
		<n-flex justify="center" style="margin-top: 24px">
			<v-pagination
				:model-value="pagination.page"
				:page-size="pagination.pageSize"
				:item-count="totalItems"
				@update:model-value="onPageChange"
				@update:page-size="onPageSizeChange"
			/>
		</n-flex>
	</n-space>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { NButton, NCard, NSpace, NGrid, NGi, NInput, NSpin, NEmpty, NSelect, NResult, NH2, NText, NFlex, NH4 } from "naive-ui";
import {
	PlusIcon,
	FilterIcon,
	UsersIcon,
	UserIcon,
	StarIcon,
	Code2Icon,
	SquareDotIcon,
	FlaskConicalIcon,
	BookOpenIcon,
	GlobeIcon,
	LandmarkIcon,
	SearchIcon,
} from "lucide-vue-next";
import { CourseService } from "@/services";
import VPagination from "@/components/ui/VPagination.vue";
import usePagination from "@/composables/usePagination";
import type { IPagination } from "@/types/base";
import type { Course } from "@/types/course";

const iconMap: Record<string, any> = {
	code: Code2Icon,
	"square-root": SquareDotIcon,
	"flask-conical": FlaskConicalIcon,
	dna: BookOpenIcon,
	globe: GlobeIcon,
	landmark: LandmarkIcon,
};

const bgMap: Record<string, string> = {
	"#4361ee": "bg-blue-600",
	"#4895ef": "bg-blue-500",
	"#3f37c9": "bg-purple-600",
	"#7209b7": "bg-green-600",
	"#f72585": "bg-pink-500",
	"#4cc9f0": "bg-yellow-600",
};

const { pagination, totalItems } = usePagination();
const courses = ref<Course[]>([]);
const searchQuery = ref("");
const loading = ref(false);
const error = ref("");
const sortBy = ref("");
const selectedSubject = ref("");

const sortOptions = [
	{ label: "Nomi", value: "title" },
	{ label: "O'qituvchi", value: "instructor" },
	{ label: "Talabalar", value: "students" },
	{ label: "Reyting", value: "rating" },
	{ label: "Fan", value: "subject" },
];

const subjectOptions = [
	{ label: "Barcha fanlar", value: "" },
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Matematika", value: "Matematika" },
	{ label: "Kimyo", value: "Kimyo" },
	{ label: "Biologiya", value: "Biologiya" },
	{ label: "Geografiya", value: "Geografiya" },
	{ label: "Tarix", value: "Tarix" },
];

const hasActiveFilters = computed(() => {
	return searchQuery.value || selectedSubject.value || sortBy.value;
});

const columns = [
	{
		title: "Nomi",
		key: "title",
		render(row: Course) {
			return row.title;
		},
		sorter: true,
	},
	{
		title: "O'qituvchi",
		key: "instructor",
		render(row: Course) {
			return row.instructor;
		},
		sorter: true,
	},
	{
		title: "Talabalar",
		key: "students",
		render(row: Course) {
			return row.students;
		},
		sorter: true,
	},
	{
		title: "Reyting",
		key: "rating",
		render(row: Course) {
			return row.rating;
		},
		sorter: true,
	},
	{
		title: "Fan",
		key: "subject",
		render(row: Course) {
			return row.subject;
		},
	},
];

function formatPrice(price: number): string {
	return new Intl.NumberFormat("uz-UZ", {
		style: "currency",
		currency: "UZS",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

async function getCourses() {
	try {
		loading.value = true;
		error.value = "";
		const params = {
			page: pagination.value.page,
			limit: pagination.value.pageSize,
			search: searchQuery.value || undefined,
			sortBy: sortBy.value || undefined,
			sortOrder: pagination.value.orderType || undefined,
			subject: selectedSubject.value || undefined,
		};

		const res = await CourseService.getCourses(params);
		courses.value = res.data;
		totalItems.value = res.total;
	} catch (err: any) {
		console.error("Error fetching courses:", err);
		error.value = err.message || "Kurslarni yuklashda xatolik yuz berdi";
		courses.value = [];
		totalItems.value = 0;
	} finally {
		loading.value = false;
	}
}

function onPageChange(page: number) {
	pagination.value.page = page;
	getCourses();
}

function onPageSizeChange(size: number) {
	pagination.value.pageSize = size;
	pagination.value.page = 1;
	getCourses();
}

function handleSearch() {
	pagination.value.page = 1;
	getCourses();
}

function handleSort() {
	pagination.value.page = 1;
	getCourses();
}

function handleSubjectFilter() {
	pagination.value.page = 1;
	getCourses();
}

function clearFilters() {
	searchQuery.value = "";
	selectedSubject.value = "";
	sortBy.value = "";
	pagination.value.page = 1;
	getCourses();
}

// Watch for search query changes
watch(searchQuery, () => {
	debouncedSearch();
});

// Debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
	let timeout: NodeJS.Timeout;
	return ((...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	}) as T;
}

// Debounced search function
const debouncedSearch = debounce(() => {
	pagination.value.page = 1;
	getCourses();
}, 500);

onMounted(getCourses);
</script>
