<template>
	<n-space vertical size="large">
		<!-- Page Header -->
		<n-space justify="space-between" align="center">
			<n-h2 style="color: var(--primary-color)">Bosh sahifa</n-h2>
			<n-space>
				<n-button secondary type="primary">
					<template #icon>
						<DownloadIcon />
					</template>
					Hisobot
				</n-button>
				<n-button>
					<template #icon>
						<PlusIcon />
					</template>
					Yangi kurs
				</n-button>
			</n-space>
		</n-space>

		<!-- Description -->
		<n-card>
			<n-text>
				IQSpace ta'lim platformasiga xush kelibsiz! Bu yerda siz o'z bilimlaringizni keyingi bosqichga olib chiqishingiz mumkin. Platformamizda 120
				dan ortiq fan va kurslar mavjud.
			</n-text>
		</n-card>

		<!-- Stats Grid -->
		<n-grid cols="1 m:2 l:4" x-gap="24" y-gap="24" responsive="screen">
			<n-gi>
				<n-card content-style="text-align: center;">
					<n-space vertical align="center">
						<UsersIcon :size="56" style="margin-bottom: 24px; color: var(--primary-color); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))" />
						<n-h3 style="color: var(--primary-color); margin-bottom: 8px">5,247</n-h3>
						<n-text>Faol o'quvchilar</n-text>
					</n-space>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card content-style="text-align: center;">
					<n-space vertical align="center">
						<BookOpenIcon :size="56" style="margin-bottom: 24px; color: var(--primary-color); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))" />
						<n-h3 style="color: var(--primary-color); margin-bottom: 8px">128</n-h3>
						<n-text>Kurslar</n-text>
					</n-space>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card content-style="text-align: center;">
					<n-space vertical align="center">
						<Users2Icon :size="56" style="margin-bottom: 24px; color: var(--primary-color); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))" />
						<n-h3 style="color: var(--primary-color); margin-bottom: 8px">63</n-h3>
						<n-text>O'qituvchilar</n-text>
					</n-space>
				</n-card>
			</n-gi>
			<n-gi>
				<n-card content-style="text-align: center;">
					<n-space vertical align="center">
						<AwardIcon :size="56" style="margin-bottom: 24px; color: var(--primary-color); filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))" />
						<n-h3 style="color: var(--primary-color); margin-bottom: 8px">96%</n-h3>
						<n-text>Muvaffaqiyat darajasi</n-text>
					</n-space>
				</n-card>
			</n-gi>
		</n-grid>

		<!-- Recent Courses -->
		<n-card>
			<n-space vertical size="large">
				<n-h3 style="margin-bottom: 24px">Yangi kurslar</n-h3>
				<n-grid cols="1 m:2 l:3" x-gap="24" y-gap="24" responsive="screen">
					<n-gi v-for="course in courses" :key="course.id">
						<n-card hoverable>
							<n-space vertical>
								<div :class="`h-40 flex items-center justify-center ${course.bgColor} text-white rounded-xl shadow-lg`">
									<component :is="course.icon" :size="56" />
								</div>
								<n-h4 style="margin-bottom: 8px">{{ course.title }}</n-h4>
								<n-space align="center" size="small" style="margin-bottom: 12px">
									<UserIcon />
									<n-text>{{ course.teacher }}</n-text>
								</n-space>
								<span class="text-sm mb-4">{{ course.description }}</span>
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
							</n-space>
						</n-card>
					</n-gi>
				</n-grid>
			</n-space>
		</n-card>
	</n-space>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton, NCard, NSpace, NGrid, NGi, NH2, NH3, NH4, NText } from "naive-ui";
import {
	DownloadIcon,
	PlusIcon,
	UsersIcon,
	BookOpenIcon,
	Users2Icon,
	AwardIcon,
	Code2Icon,
	UserIcon,
	StarIcon,
	SquareDotIcon,
	FlaskConicalIcon,
} from "lucide-vue-next";

const courses = ref([
	{
		id: 1,
		title: "Informatika",
		teacher: "Jamshid Doniyorov",
		description: "Informatika asoslarini oson va amaliy tarzda o'rganing",
		students: 245,
		rating: 4.8,
		icon: Code2Icon,
		bgColor: "bg-blue-600",
	},
	{
		id: 2,
		title: "Mobilografiya",
		teacher: "Dilfuza Rahimova",
		description: "Mobilografiyani zamonaviy usullarda o'rganing",
		students: 187,
		rating: 4.9,
		icon: SquareDotIcon,
		bgColor: "bg-blue-500",
	},
	{
		id: 3,
		title: "Rassomchilik",
		teacher: "Shodmon Yusupov",
		description: "Rassomchilik fanini amaliy tajribalar bilan o'rganish",
		students: 132,
		rating: 4.7,
		icon: FlaskConicalIcon,
		bgColor: "bg-purple-600",
	},
]);
</script>
