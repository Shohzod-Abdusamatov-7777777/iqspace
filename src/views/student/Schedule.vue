<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mening dars jadvalim</h1>
				<p class="dark:text-gray-400 mt-1">Haftalik dars jadvali va bugungi mashg'ulotlar</p>
			</div>

			<div class="flex gap-2">
				<n-button @click="viewMode = 'week'" :type="viewMode === 'week' ? 'primary' : 'default'"> Haftalik </n-button>
				<n-button @click="viewMode = 'day'" :type="viewMode === 'day' ? 'primary' : 'default'"> Kunlik </n-button>
			</div>
		</div>

		<!-- Today's Classes -->
		<div class="card">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bugungi darslar - {{ formatToday() }}</h3>

			<div v-if="todayClasses.length > 0" class="space-y-3">
				<div
					v-for="cls in todayClasses"
					:key="cls.id"
					class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
				>
					<div class="w-3 h-12 rounded-full" :style="{ backgroundColor: cls.color }"></div>

					<div class="flex-1">
						<h4 class="font-medium text-gray-900 dark:text-white">
							{{ cls.courseTitle }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ cls.teacherName }}
						</p>
					</div>

					<div class="text-right">
						<p class="font-medium text-gray-900 dark:text-white">{{ cls.startTime }} - {{ cls.endTime }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ cls.room }}
						</p>
					</div>

					<div class="flex items-center">
						<n-tag :type="getClassStatus(cls)" size="small">
							{{ getClassStatusText(cls) }}
						</n-tag>
					</div>
				</div>
			</div>

			<div v-else class="text-center py-8">
				<n-icon size="48" color="#d1d5db">
					<CalendarIcon />
				</n-icon>
				<p class="text-gray-500 dark:text-gray-400 mt-2">Bugun darslar yo'q</p>
			</div>
		</div>

		<!-- Weekly Schedule -->
		<div v-if="viewMode === 'week'" class="card">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Haftalik jadval</h3>

			<div class="overflow-x-auto">
				<table class="w-full min-w-[800px] border-collapse">
					<thead>
						<tr>
							<th class="p-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Vaqt</th>
							<th
								v-for="day in weekDays"
								:key="day.key"
								class="p-3 text-center text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600"
								:class="{ 'bg-blue-50 dark:bg-blue-900/20': day.isToday }"
							>
								{{ day.name }}
								<div v-if="day.isToday" class="text-xs text-blue-600 dark:text-blue-400">Bugun</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="timeSlot in timeSlots" :key="timeSlot.time" class="border-b border-gray-100 dark:border-gray-700">
							<td class="p-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700">
								{{ timeSlot.time }}
							</td>
							<td
								v-for="day in weekDays"
								:key="day.key"
								class="p-2 text-center border-l border-gray-100 dark:border-gray-700"
								:class="{ 'bg-blue-50 dark:bg-blue-900/20': day.isToday }"
							>
								<div
									v-if="getClassForTimeAndDay(timeSlot.time, day.key)"
									class="p-3 rounded-lg text-xs cursor-pointer transition-colors"
									:style="{ backgroundColor: getClassForTimeAndDay(timeSlot.time, day.key)?.color + '20' }"
									@click="viewClassDetails(getClassForTimeAndDay(timeSlot.time, day.key))"
								>
									<div class="font-medium text-gray-900 dark:text-white">
										{{ getClassForTimeAndDay(timeSlot.time, day.key)?.courseTitle }}
									</div>
									<div class="text-gray-500 dark:text-gray-400 mt-1">
										{{ getClassForTimeAndDay(timeSlot.time, day.key)?.room }}
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Daily Schedule -->
		<div v-if="viewMode === 'day'" class="card">
			<div class="flex items-center justify-between mb-4">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Kunlik jadval</h3>
				<n-date-picker v-model:value="selectedDate" type="date" />
			</div>

			<div class="space-y-3">
				<div
					v-for="cls in getDayClasses(selectedDate)"
					:key="cls.id"
					class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
				>
					<div class="flex flex-col items-center gap-2">
						<div class="text-sm font-medium text-gray-900 dark:text-white">
							{{ cls.startTime }}
						</div>
						<div class="w-3 h-8 rounded-full" :style="{ backgroundColor: cls.color }"></div>
						<div class="text-sm text-gray-500 dark:text-gray-400">
							{{ cls.endTime }}
						</div>
					</div>

					<div class="flex-1">
						<h4 class="font-medium text-gray-900 dark:text-white mb-1">
							{{ cls.courseTitle }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
							{{ cls.teacherName }}
						</p>
						<div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
							<span>📍 {{ cls.room }}</span>
							<span>👥 {{ cls.studentCount || 25 }} o'quvchi</span>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<n-tag :type="getClassStatus(cls)" size="small">
							{{ getClassStatusText(cls) }}
						</n-tag>
						<n-button size="small" @click="viewClassDetails(cls)"> Tafsilotlar </n-button>
					</div>
				</div>
			</div>
		</div>

		<!-- Upcoming Classes -->
		<div class="card">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yaqinlashib kelayotgan darslar</h3>

			<div class="space-y-3">
				<div v-for="cls in upcomingClasses.slice(0, 3)" :key="cls.id" class="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
					<div class="w-2 h-8 rounded-full" :style="{ backgroundColor: cls.color }"></div>

					<div class="flex-1">
						<h4 class="font-medium text-gray-900 dark:text-white">
							{{ cls.courseTitle }}
						</h4>
						<p class="text-sm text-gray-500 dark:text-gray-400">{{ cls.dayName }}, {{ cls.startTime }} - {{ cls.room }}</p>
					</div>

					<div class="text-right">
						<p class="text-sm text-gray-500 dark:text-gray-400">
							{{ getTimeUntilClass(cls) }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Class Details Modal -->
		<n-modal v-model:show="showDetailsModal">
			<n-card style="width: 500px" title="Dars tafsilotlari" :bordered="false" size="huge">
				<div v-if="selectedClass" class="space-y-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-xl flex items-center justify-center" :style="{ backgroundColor: selectedClass.color }">
							<n-icon size="24" color="white">
								<BookOpenIcon />
							</n-icon>
						</div>
						<div>
							<h4 class="text-lg font-semibold text-gray-900 dark:text-white">
								{{ selectedClass.courseTitle }}
							</h4>
							<p class="text-gray-500 dark:text-gray-400">
								{{ selectedClass.teacherName }}
							</p>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<h5 class="font-medium text-gray-900 dark:text-white mb-1">Vaqt</h5>
							<p class="text-sm dark:text-gray-400">{{ selectedClass.startTime }} - {{ selectedClass.endTime }}</p>
						</div>

						<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<h5 class="font-medium text-gray-900 dark:text-white mb-1">Xona</h5>
							<p class="text-sm dark:text-gray-400">
								{{ selectedClass.room }}
							</p>
						</div>

						<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<h5 class="font-medium text-gray-900 dark:text-white mb-1">Kun</h5>
							<p class="text-sm dark:text-gray-400">
								{{ selectedClass.dayName }}
							</p>
						</div>

						<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<h5 class="font-medium text-gray-900 dark:text-white mb-1">O'quvchilar</h5>
							<p class="text-sm dark:text-gray-400">{{ selectedClass.studentCount || 25 }} kishi</p>
						</div>
					</div>

					<div v-if="selectedClass.description" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<h5 class="font-medium text-gray-900 dark:text-white mb-1">Mavzu</h5>
						<p class="text-sm dark:text-gray-400">
							{{ selectedClass.description }}
						</p>
					</div>
				</div>

				<template #footer>
					<div class="flex justify-end gap-3">
						<n-button @click="showDetailsModal = false"> Yopish </n-button>
						<n-button type="primary" @click="joinClass" v-if="canJoinClass(selectedClass)"> Darsga qo'shilish </n-button>
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
const viewMode = ref<"week" | "day">("week");
const selectedDate = ref(Date.now());
const showDetailsModal = ref(false);
const selectedClass = ref<any>(null);

// Mock schedule data
const schedule = ref([
	{
		id: 1,
		courseId: 1,
		courseTitle: "Informatika",
		teacherName: "Jamshid Doniyorov",
		dayOfWeek: 1, // Monday
		dayName: "Dushanba",
		startTime: "09:00",
		endTime: "10:30",
		room: "Xona 201",
		color: "#4361ee",
		description: "Python o'zgaruvchilar va ma'lumot turlari",
		studentCount: 28,
	},
	{
		id: 2,
		courseId: 2,
		courseTitle: "Mobilografiya asoslari",
		teacherName: "Dilfuza Rahimova",
		dayOfWeek: 1,
		dayName: "Dushanba",
		startTime: "10:45",
		endTime: "12:15",
		room: "Xona 105",
		color: "#4895ef",
		description: "Kvadrat tenglamalar",
		studentCount: 25,
	},
	{
		id: 3,
		courseId: 1,
		courseTitle: "Informatika",
		teacherName: "Jamshid Doniyorov",
		dayOfWeek: 3, // Wednesday
		dayName: "Chorshanba",
		startTime: "09:00",
		endTime: "10:30",
		room: "Xona 201",
		color: "#4361ee",
		description: "Shartli operatorlar",
		studentCount: 28,
	},
	{
		id: 4,
		courseId: 2,
		courseTitle: "Mobilografiya asoslari",
		teacherName: "Dilfuza Rahimova",
		dayOfWeek: 3,
		dayName: "Chorshanba",
		startTime: "10:45",
		endTime: "12:15",
		room: "Xona 105",
		color: "#4895ef",
		description: "Funksiyalar",
		studentCount: 25,
	},
	{
		id: 5,
		courseId: 1,
		courseTitle: "Informatika",
		teacherName: "Jamshid Doniyorov",
		dayOfWeek: 5, // Friday
		dayName: "Juma",
		startTime: "09:00",
		endTime: "10:30",
		room: "Xona 201",
		color: "#4361ee",
		description: "Tsikllar",
		studentCount: 28,
	},
]);

// Week days
const weekDays = computed(() => {
	const today = new Date();
	const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

	return [
		{ key: 1, name: "Dushanba", isToday: currentDay === 1 },
		{ key: 2, name: "Seshanba", isToday: currentDay === 2 },
		{ key: 3, name: "Chorshanba", isToday: currentDay === 3 },
		{ key: 4, name: "Payshanba", isToday: currentDay === 4 },
		{ key: 5, name: "Juma", isToday: currentDay === 5 },
		{ key: 6, name: "Shanba", isToday: currentDay === 6 },
	];
});

// Time slots
const timeSlots = [{ time: "09:00 - 10:30" }, { time: "10:45 - 12:15" }, { time: "13:30 - 15:00" }, { time: "15:15 - 16:45" }];

// Computed
const todayClasses = computed(() => {
	const today = new Date();
	const currentDay = today.getDay();
	return schedule.value.filter((cls) => cls.dayOfWeek === currentDay);
});

const upcomingClasses = computed(() => {
	const today = new Date();
	const currentDay = today.getDay();
	const currentTime = today.getHours() * 60 + today.getMinutes();

	return schedule.value
		.filter((cls) => {
			if (cls.dayOfWeek === currentDay) {
				const [hours, minutes] = cls.startTime.split(":").map(Number);
				const classTime = hours * 60 + minutes;
				return classTime > currentTime;
			}
			return cls.dayOfWeek > currentDay;
		})
		.slice(0, 5);
});

// Methods
const formatToday = () => {
	const today = new Date();
	return today.toLocaleDateString("uz-UZ", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const getClassForTimeAndDay = (time: string, dayKey: number) => {
	return schedule.value.find((cls) => cls.dayOfWeek === dayKey && `${cls.startTime} - ${cls.endTime}` === time);
};

const getDayClasses = (timestamp: number) => {
	const date = new Date(timestamp);
	const dayOfWeek = date.getDay();
	return schedule.value.filter((cls) => cls.dayOfWeek === dayOfWeek);
};

const getClassStatus = (cls: any) => {
	const now = new Date();
	const currentDay = now.getDay();
	const currentTime = now.getHours() * 60 + now.getMinutes();

	if (cls.dayOfWeek === currentDay) {
		const [startHours, startMinutes] = cls.startTime.split(":").map(Number);
		const [endHours, endMinutes] = cls.endTime.split(":").map(Number);
		const startTime = startHours * 60 + startMinutes;
		const endTime = endHours * 60 + endMinutes;

		if (currentTime >= startTime && currentTime <= endTime) {
			return "success"; // Ongoing
		} else if (currentTime < startTime) {
			return "warning"; // Upcoming
		} else {
			return "default"; // Finished
		}
	} else if (cls.dayOfWeek > currentDay) {
		return "info"; // Future
	}

	return "default";
};

const getClassStatusText = (cls: any) => {
	const status = getClassStatus(cls);
	switch (status) {
		case "success":
			return "Davom etmoqda";
		case "warning":
			return "Tez orada";
		case "info":
			return "Kutilmoqda";
		default:
			return "Tugallangan";
	}
};

const getTimeUntilClass = (cls: any) => {
	const now = new Date();
	const currentDay = now.getDay();

	if (cls.dayOfWeek === currentDay) {
		const [hours, minutes] = cls.startTime.split(":").map(Number);
		const classTime = new Date();
		classTime.setHours(hours, minutes, 0, 0);

		const diff = classTime.getTime() - now.getTime();
		if (diff > 0) {
			const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
			const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

			if (hoursLeft > 0) {
				return `${hoursLeft} soat ${minutesLeft} daqiqa`;
			} else {
				return `${minutesLeft} daqiqa`;
			}
		}
	}

	const daysUntil = cls.dayOfWeek - currentDay;
	if (daysUntil > 0) {
		return `${daysUntil} kun`;
	}

	return "Keyingi hafta";
};

const viewClassDetails = (cls: any) => {
	selectedClass.value = cls;
	showDetailsModal.value = true;
};

const canJoinClass = (cls: any) => {
	const status = getClassStatus(cls);
	return status === "success" || status === "warning";
};

const joinClass = () => {
	message.success("Darsga qo'shilish funksiyasi");
	showDetailsModal.value = false;
};

// Lifecycle
onMounted(() => {
	// Load schedule
});
</script>

<style scoped>
@reference '../../assets/styles/main.css';
.card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6;
}

/* Custom table styling */
table {
	border-collapse: separate;
	border-spacing: 0;
}

th,
td {
	border: 1px solid rgba(156, 163, 175, 0.2);
}

th:first-child,
td:first-child {
	border-left: none;
}

th:last-child,
td:last-child {
	border-right: none;
}

thead tr:first-child th {
	border-top: none;
}

tbody tr:last-child td {
	border-bottom: none;
}

/* Schedule cell hover effect */
tbody td > div:hover {
	transform: scale(1.02);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
