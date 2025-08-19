<template>
	<n-space vertical size="large">
		<!-- Page Header -->
		<n-space justify="space-between" align="center">
			<n-h2 type="primary">O'qituvchilar</n-h2>
			<n-space>
				<n-button secondary>
					<template #icon>
						<SearchIcon />
					</template>
					Qidirish
				</n-button>
				<n-button type="primary">
					<template #icon>
						<PlusIcon />
					</template>
					Yangi o'qituvchi
				</n-button>
			</n-space>
		</n-space>

		<!-- Teachers Grid -->
		<n-grid cols="1 m:2 l:3" x-gap="24" y-gap="24" responsive="screen">
			<n-gi v-for="teacher in teachers" :key="teacher.id">
				<n-card hoverable>
					<n-space vertical>
						<n-space align="center">
							<n-avatar :size="64" color="#18a058">
								{{ teacher.initials }}
							</n-avatar>
							<n-space vertical size="small">
								<n-text strong>{{ teacher.name }}</n-text>
								<n-text depth="3">{{ teacher.subject }}</n-text>
							</n-space>
						</n-space>
						<n-space vertical size="small">
							<n-space align="center" size="small">
								<PhoneIcon :size="18" />
								<n-text>{{ teacher.phone }}</n-text>
							</n-space>
							<n-space align="center" size="small">
								<MailIcon :size="18" />
								<n-text>{{ teacher.email }}</n-text>
							</n-space>
						</n-space>
					</n-space>
				</n-card>
			</n-gi>
		</n-grid>
	</n-space>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton, NCard, NSpace, NGrid, NGi, NH2, NAvatar, NText } from "naive-ui";
import { PlusIcon, SearchIcon, PhoneIcon, MailIcon } from "lucide-vue-next";
import { TeacherService } from "@/services";

const teachers = ref([]);

onMounted(async () => {
	const res = await TeacherService.getTeachers();
	teachers.value = res.items || res;
});
</script>
