<template>
	<n-space vertical size="large">
		<!-- Page Header -->
		<n-space justify="space-between" align="center">
			<n-h2 style="color: var(--primary-color)">Dars jadvali</n-h2>
			<n-space>
				<n-button secondary>
					<template #icon>
						<CalendarRangeIcon />
					</template>
					Haftalik
				</n-button>
				<n-button>
					<template #icon>
						<CalendarDaysIcon />
					</template>
					Kunlik
				</n-button>
			</n-space>
		</n-space>

		<!-- Schedule Table -->
		<n-card>
			<n-table :bordered="false" :single-line="false">
				<thead>
					<tr>
						<th>Vaqt</th>
						<th>Dushanba</th>
						<th>Seshanba</th>
						<th>Chorshanba</th>
						<th>Payshanba</th>
						<th>Juma</th>
						<th>Shanba</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="timeSlot in schedule" :key="timeSlot.id">
						<td><n-text strong>{{ timeSlot.time }}</n-text></td>
						<td v-for="(day, index) in timeSlot.days" :key="index">
							<div v-if="day.course">
								<n-text strong>{{ day.course }}</n-text>
								<n-text size="small" depth="3">{{ day.teacher }}</n-text>
							</div>
						</td>
					</tr>
				</tbody>
			</n-table>
		</n-card>
	</n-space>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton, NCard, NSpace, NTable, NH2, NText } from "naive-ui";
import { CalendarRangeIcon, CalendarDaysIcon } from "lucide-vue-next";
import { ScheduleService } from "@/services";

const schedule = ref([]);

onMounted(async () => {
	schedule.value = await ScheduleService.getSchedule();
});
</script>
