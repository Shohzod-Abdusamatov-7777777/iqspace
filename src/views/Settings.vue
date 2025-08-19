<template>
	<div class="space-y-8">
		<!-- Page Header -->
		<div class="flex justify-between items-center">
			<h2 class="text-3xl font-semibold text-blue-600">Sozlamalar</h2>
		</div>

		<!-- Personal Information Section -->
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h4 class="text-xl font-semibold text-gray-800 mb-6">Shaxsiy ma'lumotlar</h4>

			<n-form ref="formRef" :model="personalForm" :rules="personalRules" label-placement="top" size="large" class="space-y-4">
				<n-form-item label="Ism va Familiya" path="fullName">
					<n-input v-model:value="personalForm.fullName" placeholder="Ism va Familiya" />
				</n-form-item>

				<n-form-item label="Elektron pochta" path="email">
					<n-input v-model:value="personalForm.email" placeholder="Elektron pochta" type="email" />
				</n-form-item>

				<n-form-item label="Telefon raqami" path="phoneNumber">
					<n-input v-model:value="personalForm.phoneNumber" placeholder="Telefon raqami" />
				</n-form-item>
			</n-form>
		</div>

		<!-- Security Section -->
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h4 class="text-xl font-semibold text-gray-800 mb-6">Xavfsizlik</h4>

			<n-form ref="securityFormRef" :model="securityForm" :rules="securityRules" label-placement="top" size="large" class="space-y-4">
				<n-form-item label="Joriy parol" path="currentPassword">
					<n-input v-model:value="securityForm.currentPassword" type="password" placeholder="Joriy parol" show-password-on="click" />
				</n-form-item>

				<n-form-item label="Yangi parol" path="newPassword">
					<n-input v-model:value="securityForm.newPassword" type="password" placeholder="Yangi parol" show-password-on="click" />
				</n-form-item>

				<n-form-item label="Yangi parolni tasdiqlash" path="confirmPassword">
					<n-input v-model:value="securityForm.confirmPassword" type="password" placeholder="Yangi parolni tasdiqlash" show-password-on="click" />
				</n-form-item>
			</n-form>
		</div>

		<!-- Notifications Section -->
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h4 class="text-xl font-semibold text-gray-800 mb-6">Bildirishnomalar</h4>

			<n-space vertical size="large">
				<n-switch v-model:value="notificationSettings.emailNotifications" size="large">
					<template #checked>Email bildirishnomalar yoqilgan</template>
					<template #unchecked>Email bildirishnomalar o'chirilgan</template>
				</n-switch>

				<n-switch v-model:value="notificationSettings.smsNotifications" size="large">
					<template #checked>SMS bildirishnomalar yoqilgan</template>
					<template #unchecked>SMS bildirishnomalar o'chirilgan</template>
				</n-switch>

				<n-switch v-model:value="notificationSettings.pushNotifications" size="large">
					<template #checked>Push bildirishnomalar yoqilgan</template>
					<template #unchecked>Push bildirishnomalar o'chirilgan</template>
				</n-switch>
			</n-space>
		</div>

		<!-- Language and Theme Section -->
		<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
			<h4 class="text-xl font-semibold text-gray-800 mb-6">Til va mavzu</h4>

			<n-space vertical size="large">
				<n-form-item label="Til">
					<n-select v-model:value="settings.language" :options="languageOptions" size="large" placeholder="Tilni tanlang" />
				</n-form-item>

				<n-form-item label="Mavzu">
					<n-radio-group v-model:value="settings.theme" size="large">
						<n-space>
							<n-radio value="light">Yorug'</n-radio>
							<n-radio value="dark">Qorong'u</n-radio>
							<n-radio value="auto">Avtomatik</n-radio>
						</n-space>
					</n-radio-group>
				</n-form-item>
			</n-space>
		</div>

		<!-- Save Button -->
		<div class="flex justify-end">
			<n-button size="large" :loading="saveLoading" @click="handleSave">
				<template #icon>
					<SaveIcon />
				</template>
				O'zgarishlarni saqlash
			</n-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NForm, NFormItem, NInput, NButton, NSwitch, NSelect, NRadio, NRadioGroup, NSpace, useMessage } from "naive-ui";
import { SaveIcon } from "lucide-vue-next";

const message = useMessage();

const formRef = ref(null);
const securityFormRef = ref(null);
const saveLoading = ref(false);

const personalForm = ref({
	fullName: "John Doe",
	email: "john.doe@example.com",
	phoneNumber: "+998901234567",
});

const securityForm = ref({
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
});

const notificationSettings = ref({
	emailNotifications: true,
	smsNotifications: false,
	pushNotifications: true,
});

const settings = ref({
	language: "uz",
	theme: "light",
});

const personalRules = {
	fullName: [{ required: true, message: "Ism va familiyani kiriting", trigger: "blur" }],
	email: [
		{ required: true, message: "Elektron pochtani kiriting", trigger: "blur" },
		{ type: "email", message: "To'g'ri email formatini kiriting", trigger: "blur" },
	],
	phoneNumber: [{ required: true, message: "Telefon raqamini kiriting", trigger: "blur" }],
};

const securityRules = {
	currentPassword: [{ required: true, message: "Joriy parolni kiriting", trigger: "blur" }],
	newPassword: [
		{ required: true, message: "Yangi parolni kiriting", trigger: "blur" },
		{ min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak", trigger: "blur" },
	],
	confirmPassword: [
		{ required: true, message: "Parolni tasdiqlang", trigger: "blur" },
		{
			validator: (rule: any, value: string) => {
				return value === securityForm.value.newPassword;
			},
			message: "Parollar mos kelmaydi",
			trigger: "blur",
		},
	],
};

const languageOptions = [
	{ label: "O'zbekcha", value: "uz" },
	{ label: "Русский", value: "ru" },
	{ label: "English", value: "en" },
];

const handleSave = async () => {
	try {
		saveLoading.value = true;

		// Validate forms
		const personalValid = await formRef.value?.validate();
		const securityValid = securityForm.value.currentPassword ? await securityFormRef.value?.validate() : true;

		if (personalValid && securityValid) {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			message.success("Sozlamalar muvaffaqiyatli saqlandi!");

			// Clear password fields
			securityForm.value = {
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			};
		}
	} catch (error) {
		message.error("Xatolik yuz berdi");
	} finally {
		saveLoading.value = false;
	}
};
</script>
