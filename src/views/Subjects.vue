<template>
	<n-space vertical size="large">
		<!-- Page Header -->
		<n-space justify="space-between" align="center">
			<h2 class="text-3xl font-semibold text-blue-600">Fanlar</h2>
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
					Yangi fan
				</n-button>
			</n-space>
		</n-space>

		<!-- Subjects Grid -->
		<n-grid cols="1 m:2 l:3" x-gap="24" y-gap="24" responsive="screen">
			<n-gi v-for="subject in subjects" :key="subject.id">
				<n-card hoverable>
					<n-space vertical>
						<div :class="(bgMap[subject.color] || 'bg-blue-600') + ' h-40 flex items-center justify-center text-white rounded-xl shadow-lg'">
							<component :is="iconMap[subject.icon] || Code2Icon" :size="56" />
						</div>
						<h4 class="font-semibold text-gray-800 mb-2">{{ subject.title }}</h4>
						<span class="text-sm mb-4">{{ subject.description }}</span>
						<n-space align="center" size="small" class=" ">
							<BookOpenIcon />
							<span>{{ subject.courseCount }} kurs</span>
						</n-space>
					</n-space>
				</n-card>
			</n-gi>
		</n-grid>
	</n-space>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton, NCard, NSpace, NGrid, NGi } from "naive-ui";
import { PlusIcon, FilterIcon, BookOpenIcon, Code2Icon, SquareDotIcon, FlaskConicalIcon, DnaIcon, GlobeIcon, LandmarkIcon } from "lucide-vue-next";
import { SubjectService } from "@/services";

const subjects = ref([]);

onMounted(async () => {
	subjects.value = await SubjectService.getSubjects();
});

const iconMap = {
	"fas fa-code": Code2Icon,
	"fas fa-square-root-alt": SquareDotIcon,
	"fas fa-flask": FlaskConicalIcon,
	"fas fa-dna": DnaIcon,
	"fas fa-globe-asia": GlobeIcon,
	"fas fa-history": LandmarkIcon,
};

const bgMap = {
	"#4361ee": "bg-blue-600",
	"#4895ef": "bg-blue-500",
	"#3f37c9": "bg-purple-600",
	"#7209b7": "bg-green-600",
	"#f72585": "bg-pink-500",
	"#4cc9f0": "bg-yellow-600",
};
</script>
