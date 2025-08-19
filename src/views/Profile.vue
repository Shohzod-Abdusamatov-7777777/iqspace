<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profil sozlamalari</h1>
				<p class="dark:text-gray-400 mt-1">Shaxsiy ma'lumotlaringizni boshqaring va xavfsizlik sozlamalarini o'zgartiring</p>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Profile Card -->
			<div class="lg:col-span-1">
				<div class="card text-center">
					<div class="mb-6">
						<div class="relative inline-block">
							<div class="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
								{{ authStore.user?.avatar || "U" }}
							</div>
							<button
								class="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
							>
								<n-icon size="16">
									<EditIcon />
								</n-icon>
							</button>
						</div>

						<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
							{{ authStore.user?.name || "Foydalanuvchi" }}
						</h2>
						<p class="text-gray-500 dark:text-gray-400 capitalize">
							{{ getRoleLabel(authStore.user?.role) }}
						</p>
					</div>

					<div class="space-y-3">
						<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<span class="text-sm dark:text-gray-400">Telefon</span>
							<span class="text-sm font-medium text-gray-900 dark:text-white">
								{{ authStore.user?.phone || "Kiritilmagan" }}
							</span>
						</div>

						<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<span class="text-sm dark:text-gray-400">Email</span>
							<span class="text-sm font-medium text-gray-900 dark:text-white">
								{{ authStore.user?.email || "Kiritilmagan" }}
							</span>
						</div>

						<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<span class="text-sm dark:text-gray-400">Oxirgi kirish</span>
							<span class="text-sm font-medium text-gray-900 dark:text-white">
								{{ formatDate(authStore.user?.last_login) }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Settings Forms -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Personal Information -->
				<div class="card">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shaxsiy ma'lumotlar</h3>

					<n-form ref="profileFormRef" :model="profileForm" :rules="profileFormRules" label-placement="top">
						<n-grid :cols="2" :x-gap="12">
							<n-form-item-gi path="name" label="Ism va Familiya">
								<n-input v-model:value="profileForm.name" placeholder="Ism va Familiya" />
							</n-form-item-gi>

							<n-form-item-gi path="email" label="Email">
								<n-input v-model:value="profileForm.email" placeholder="email@example.com" />
							</n-form-item-gi>

							<n-form-item-gi path="phone" label="Telefon">
								<n-input v-model:value="profileForm.phone" placeholder="+998901234567" />
							</n-form-item-gi>

							<n-form-item-gi v-if="authStore.isTeacher" path="experience" label="Tajriba">
								<n-input v-model:value="profileForm.experience" placeholder="5 yil" />
							</n-form-item-gi>

							<n-form-item-gi v-if="authStore.isTeacher" :span="2" path="bio" label="Bio">
								<n-input v-model:value="profileForm.bio" type="textarea" placeholder="O'zingiz haqingizda qisqacha..." :rows="3" />
							</n-form-item-gi>

							<n-form-item-gi v-if="authStore.isTeacher" :span="2" path="subjects" label="Fanlar">
								<n-select v-model:value="profileForm.subjects" :options="subjectOptions" multiple placeholder="Fanlarni tanlang" />
							</n-form-item-gi>
						</n-grid>

						<div class="flex justify-end">
							<n-button type="primary" @click="saveProfile" :loading="saving">
								<template #icon>
									<n-icon>
										<SaveIcon />
									</n-icon>
								</template>
								Saqlash
							</n-button>
						</div>
					</n-form>
				</div>

				<!-- Security Settings -->
				<div class="card">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Xavfsizlik sozlamalari</h3>

					<n-form ref="securityFormRef" :model="securityForm" :rules="securityFormRules" label-placement="top">
						<n-form-item path="currentPassword" label="Joriy parol">
							<n-input
								v-model:value="securityForm.currentPassword"
								type="password"
								placeholder="Joriy parolingizni kiriting"
								show-password-on="click"
							/>
						</n-form-item>

						<n-form-item path="newPassword" label="Yangi parol">
							<n-input v-model:value="securityForm.newPassword" type="password" placeholder="Yangi parolni kiriting" show-password-on="click" />
						</n-form-item>

						<n-form-item path="confirmPassword" label="Yangi parolni tasdiqlash">
							<n-input
								v-model:value="securityForm.confirmPassword"
								type="password"
								placeholder="Yangi parolni takrorlab kiriting"
								show-password-on="click"
							/>
						</n-form-item>

						<div class="flex justify-end">
							<n-button type="primary" @click="changePassword" :loading="changingPassword">
								<template #icon>
									<n-icon>
										<SaveIcon />
									</n-icon>
								</template>
								Parolni o'zgartirish
							</n-button>
						</div>
					</n-form>
				</div>

				<!-- Theme Preferences -->
				<div class="card">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tema sozlamalari</h3>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h4 class="text-sm font-medium text-gray-900 dark:text-white">Qorong'u tema</h4>
								<p class="text-xs text-gray-500 dark:text-gray-400">Interfeys uchun qorong'u yoki yorug' temani tanlang</p>
							</div>
							<n-switch :value="themeStore.isDark" @update:value="themeStore.toggleTheme" />
						</div>

						<div class="flex items-center justify-between">
							<div>
								<h4 class="text-sm font-medium text-gray-900 dark:text-white">Yon panel</h4>
								<p class="text-xs text-gray-500 dark:text-gray-400">Yon panelni avtomatik yashirish</p>
							</div>
							<n-switch :value="!themeStore.sidebarCollapsed" @update:value="themeStore.toggleSidebar" />
						</div>
					</div>
				</div>

				<!-- Account Actions -->
				<div class="card">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hisob amalları</h3>

					<div class="space-y-4">
						<div
							class="flex items-center justify-between p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20"
						>
							<div>
								<h4 class="text-sm font-medium text-orange-900 dark:text-orange-100">Ma'lumotlarni eksport qilish</h4>
								<p class="text-xs text-orange-700 dark:text-orange-300">Shaxsiy ma'lumotlaringizni yuklab oling</p>
							</div>
							<n-button size="small" @click="exportData">
								<template #icon>
									<n-icon>
										<DownloadIcon />
									</n-icon>
								</template>
								Eksport
							</n-button>
						</div>

						<div class="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
							<div>
								<h4 class="text-sm font-medium text-red-900 dark:text-red-100">Hisobni o'chirish</h4>
								<p class="text-xs text-red-700 dark:text-red-300">Bu amalni qaytarib bo'lmaydi</p>
							</div>
							<n-button type="error" size="small" @click="deleteAccount">
								<template #icon>
									<n-icon>
										<Trash2Icon />
									</n-icon>
								</template>
								O'chirish
							</n-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import "@/assets/styles/main.css";
import { reactive, ref, onMounted } from "vue";
import { NForm, NFormItem, NFormItemGi, NInput, NButton, NGrid, NSelect, NSwitch, useMessage, type FormInst, NIcon } from "naive-ui";
import { SaveIcon, EditIcon, DownloadIcon, Trash2Icon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const message = useMessage();
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Refs
const profileFormRef = ref<FormInst | null>(null);
const securityFormRef = ref<FormInst | null>(null);

// State
const saving = ref(false);
const changingPassword = ref(false);

// Forms
const profileForm = reactive({
	name: "",
	email: "",
	phone: "",
	experience: "",
	bio: "",
	subjects: [] as string[],
});

const securityForm = reactive({
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
});

// Options
const subjectOptions = [
	{ label: "Dasturlash", value: "Dasturlash" },
	{ label: "Mobilografiya", value: "Mobilografiya" },
	{ label: "Rassomchilik", value: "Rassomchilik" },
	{ label: "Biologiya", value: "Biologiya" },
	{ label: "Fizika", value: "Fizika" },
	{ label: "Tarix", value: "Tarix" },
	{ label: "Geografiya", value: "Geografiya" },
];

// Form validation
const profileFormRules = {
	name: [{ required: true, message: "Ism va familiyani kiriting", trigger: "blur" }],
	email: [{ type: "email" as const, message: "Email manzili noto'g'ri formatda", trigger: "blur" }],
	phone: [
		{ required: true, message: "Telefon raqamini kiriting", trigger: "blur" },
		{ pattern: /^\+?\d{9,15}$/, message: "Telefon raqami noto'g'ri formatda", trigger: "blur" },
	],
};

const securityFormRules = {
	currentPassword: [{ required: true, message: "Joriy parolni kiriting", trigger: "blur" }],
	newPassword: [
		{ required: true, message: "Yangi parolni kiriting", trigger: "blur" },
		{ min: 6, message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak", trigger: "blur" },
	],
	confirmPassword: [
		{ required: true, message: "Parolni tasdiqlang", trigger: "blur" },
		{
			validator: (rule: any, value: string) => {
				return value === securityForm.newPassword;
			},
			message: "Parollar mos kelmaydi",
			trigger: "blur",
		},
	],
};

// Methods
const getRoleLabel = (role?: string) => {
	switch (role) {
		case "admin":
			return "Administrator";
		case "teacher":
			return "O'qituvchi";
		case "student":
			return "O'quvchi";
		default:
			return "Foydalanuvchi";
	}
};

const formatDate = (dateString?: string) => {
	if (!dateString) return "Noma'lum";
	return new Date(dateString).toLocaleDateString("uz-UZ");
};

const loadProfile = () => {
	const user = authStore.user;
	if (user) {
		profileForm.name = user.name;
		profileForm.email = user.email || "";
		profileForm.phone = user.phone;
		profileForm.experience = user.experience || "";
		profileForm.bio = user.bio || "";
		profileForm.subjects = user.subjects || [];
	}
};

const saveProfile = async () => {
	try {
		await profileFormRef.value?.validate();
		saving.value = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update user in store
		if (authStore.user) {
			authStore.setUser({
				...authStore.user,
				name: profileForm.name,
				email: profileForm.email,
				phone: profileForm.phone,
				experience: profileForm.experience,
				bio: profileForm.bio,
				subjects: profileForm.subjects,
			});
		}

		message.success("Profil muvaffaqiyatli yangilandi");
	} catch (error: any) {
		message.error("Saqlashda xatolik yuz berdi");
	} finally {
		saving.value = false;
	}
};

const changePassword = async () => {
	try {
		await securityFormRef.value?.validate();
		changingPassword.value = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		message.success("Parol muvaffaqiyatli o'zgartirildi");

		// Reset form
		securityForm.currentPassword = "";
		securityForm.newPassword = "";
		securityForm.confirmPassword = "";
	} catch (error: any) {
		message.error("Parolni o'zgartirishda xatolik yuz berdi");
	} finally {
		changingPassword.value = false;
	}
};

const exportData = () => {
	const userData = {
		user: authStore.user,
		exportDate: new Date().toISOString(),
	};

	const dataStr = JSON.stringify(userData, null, 2);
	const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

	const exportFileDefaultName = `user-data-${Date.now()}.json`;

	const linkElement = document.createElement("a");
	linkElement.setAttribute("href", dataUri);
	linkElement.setAttribute("download", exportFileDefaultName);
	linkElement.click();

	message.success("Ma'lumotlar eksport qilindi");
};

const deleteAccount = () => {
	message.warning("Bu funksiya hali ishlamaydi");
};

// Lifecycle
onMounted(() => {
	loadProfile();
});
</script>

<style scoped>
@reference '../assets/styles/main.css';

.card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6;
}
</style>
