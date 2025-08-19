<template>
	<div class="space-y-6">
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Xabarlar</h1>
				<p class="dark:text-gray-400 mt-1">O'qituvchilar va o'quvchilar bilan muloqot qiling</p>
			</div>

			<n-button type="primary" @click="showComposeModal = true">
				<template #icon>
					<n-icon>
						<PlusIcon />
					</n-icon>
				</template>
				Yangi xabar
			</n-button>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Sidebar - Contacts -->
			<div class="lg:col-span-1">
				<div class="card">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Kontaktlar</h3>
						<n-badge :value="unreadCount" :max="99">
							<n-icon size="20" class="text-gray-500">
								<MailIcon />
							</n-icon>
						</n-badge>
					</div>

					<!-- Search contacts -->
					<div class="mb-4">
						<n-input v-model:value="contactSearch" placeholder="Qidirish..." size="small" clearable>
							<template #prefix>
								<n-icon>
									<SearchIcon />
								</n-icon>
							</template>
						</n-input>
					</div>

					<!-- Contacts list -->
					<div class="space-y-2 max-h-96 overflow-y-auto">
						<div
							v-for="contact in filteredContacts"
							:key="contact.id"
							class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
							:class="{
								'bg-blue-50 dark:bg-blue-900/20': selectedContact?.id === contact.id,
								'hover:bg-gray-50 dark:hover:bg-gray-700': selectedContact?.id !== contact.id,
							}"
							@click="selectContact(contact)"
						>
							<div class="relative">
								<div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
									{{ contact.avatar }}
								</div>
								<div
									v-if="contact.unreadCount > 0"
									class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"
								>
									{{ contact.unreadCount }}
								</div>
							</div>

							<div class="flex-1 min-w-0">
								<h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
									{{ contact.name }}
								</h4>
								<p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
									{{ contact.role }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Messages Area -->
			<div class="lg:col-span-3">
				<div class="card h-[600px] flex flex-col">
					<!-- Chat header -->
					<div v-if="selectedContact" class="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-600">
						<div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
							{{ selectedContact.avatar }}
						</div>
						<div class="flex-1">
							<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
								{{ selectedContact.name }}
							</h3>
							<p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
								{{ selectedContact.role }}
							</p>
						</div>
						<n-dropdown :options="chatMenuOptions" @select="handleChatMenu">
							<n-button quaternary circle>
								<template #icon>
									<n-icon>
										<MoreVerticalIcon />
									</n-icon>
								</template>
							</n-button>
						</n-dropdown>
					</div>

					<!-- Empty state -->
					<div v-if="!selectedContact" class="flex-1 flex items-center justify-center">
						<div class="text-center">
							<n-icon size="64" color="#d1d5db">
								<MessageCircleIcon />
							</n-icon>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">Suhbatni tanlang</h3>
							<p class="text-gray-500 dark:text-gray-400">Xabar almashish uchun kontaktni tanlang yoki yangi xabar yozing</p>
						</div>
					</div>

					<!-- Messages list -->
					<div v-else class="flex-1 overflow-y-auto py-4 space-y-4">
						<div
							v-for="msg in currentMessages"
							:key="msg.id"
							class="flex"
							:class="{
								'justify-end': msg.from_user_id === authStore.user?.id,
								'justify-start': msg.from_user_id !== authStore.user?.id,
							}"
						>
							<div
								class="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
								:class="{
									'bg-blue-500 text-white': msg.from_user_id === authStore.user?.id,
									'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white': msg.from_user_id !== authStore.user?.id,
								}"
							>
								<p class="text-sm">{{ msg.content }}</p>
								<p class="text-xs mt-1 opacity-70">
									{{ formatTime(msg.sent_at) }}
								</p>
							</div>
						</div>
					</div>

					<!-- Message input -->
					<div v-if="selectedContact" class="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
						<n-input v-model:value="newMessage" placeholder="Xabar yozing..." @keyup.enter="sendMessage" :disabled="sending" />
						<n-button type="primary" @click="sendMessage" :loading="sending" :disabled="!newMessage.trim()">
							<template #icon>
								<n-icon>
									<MailIcon />
								</n-icon>
							</template>
						</n-button>
					</div>
				</div>
			</div>
		</div>

		<!-- Compose Message Modal -->
		<n-modal v-model:show="showComposeModal">
			<n-card style="width: 500px" title="Yangi xabar" :bordered="false" size="huge">
				<n-form ref="composeFormRef" :model="composeForm" :rules="composeFormRules" label-placement="top">
					<n-form-item path="to_user_id" label="Kimga">
						<n-select v-model:value="composeForm.to_user_id" :options="recipientOptions" placeholder="Qabul qiluvchini tanlang" filterable />
					</n-form-item>

					<n-form-item path="subject" label="Mavzu">
						<n-input v-model:value="composeForm.subject" placeholder="Xabar mavzusi" />
					</n-form-item>

					<n-form-item path="content" label="Xabar">
						<n-input v-model:value="composeForm.content" type="textarea" placeholder="Xabar matnini kiriting..." :rows="4" />
					</n-form-item>
				</n-form>

				<template #footer>
					<div class="flex justify-end gap-3">
						<n-button @click="showComposeModal = false"> Bekor qilish </n-button>
						<n-button type="primary" @click="sendComposedMessage" :loading="composing">
							<template #icon>
								<n-icon>
									<MailIcon />
								</n-icon>
							</template>
							Yuborish
						</n-button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from "vue";
import { useMessage, type FormInst } from "naive-ui";
import { useAuthStore } from "@/stores/auth";

const message = useMessage();
const authStore = useAuthStore();

// Refs
const composeFormRef = ref<FormInst | null>(null);

// State
const sending = ref(false);
const composing = ref(false);
const showComposeModal = ref(false);
const contactSearch = ref("");
const selectedContact = ref<any>(null);
const newMessage = ref("");

// Mock data
const contacts = ref([
	{
		id: 2,
		name: "Jamshid Doniyorov",
		role: "teacher",
		avatar: "JD",
		unreadCount: 2,
	},
	{
		id: 3,
		name: "Dilfuza Rahimova",
		role: "teacher",
		avatar: "DR",
		unreadCount: 0,
	},
	{
		id: 5,
		name: "Zebo Karimova",
		role: "teacher",
		avatar: "ZK",
		unreadCount: 1,
	},
	{
		id: 6,
		name: "Shoira Nazarova",
		role: "student",
		avatar: "SN",
		unreadCount: 0,
	},
]);

const messages = ref([
	{
		id: 1,
		from_user_id: 2,
		from_user_name: "Jamshid Doniyorov",
		to_user_id: 4,
		to_user_name: "Ali Karimov",
		subject: "Topshiriq haqida",
		content: "Salom Ali! Ertangi topshiriqni unutmang.",
		is_read: false,
		sent_at: "2024-07-01T10:30:00Z",
	},
	{
		id: 2,
		from_user_id: 4,
		from_user_name: "Ali Karimov",
		to_user_id: 2,
		to_user_name: "Jamshid Doniyorov",
		subject: "Topshiriq haqida",
		content: "Rahmat, unutmayman!",
		is_read: true,
		sent_at: "2024-07-01T10:35:00Z",
	},
	{
		id: 3,
		from_user_id: 3,
		from_user_name: "Dilfuza Rahimova",
		to_user_id: 4,
		to_user_name: "Ali Karimov",
		subject: "Mobilografiya darsi",
		content: "Ertangi darsda yangi mavzuni boshlash.",
		is_read: true,
		sent_at: "2024-07-01T11:15:00Z",
	},
]);

const composeForm = reactive({
	to_user_id: null,
	subject: "",
	content: "",
});

// Options
const chatMenuOptions = [
	{
		label: "Profil ko'rish",
		key: "profile",
		icon: () => h("UserIcon"),
	},
	{
		label: "Xabarlarni tozalash",
		key: "clear",
		icon: () => h("Trash2Icon"),
	},
];

const composeFormRules = {
	to_user_id: [{ required: true, message: "Qabul qiluvchini tanlang", trigger: "change" }],
	subject: [{ required: true, message: "Mavzuni kiriting", trigger: "blur" }],
	content: [{ required: true, message: "Xabar matnini kiriting", trigger: "blur" }],
};

// Computed
const filteredContacts = computed(() => {
	if (!contactSearch.value) return contacts.value;
	return contacts.value.filter((contact) => contact.name.toLowerCase().includes(contactSearch.value.toLowerCase()));
});

const unreadCount = computed(() => {
	return contacts.value.reduce((sum, contact) => sum + contact.unreadCount, 0);
});

const currentMessages = computed(() => {
	if (!selectedContact.value) return [];

	const currentUserId = authStore.user?.id;
	const contactId = selectedContact.value.id;

	return messages.value
		.filter(
			(msg) =>
				(msg.from_user_id === currentUserId && msg.to_user_id === contactId) || (msg.from_user_id === contactId && msg.to_user_id === currentUserId),
		)
		.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
});

const recipientOptions = computed(() => {
	return contacts.value.map((contact) => ({
		label: `${contact.name} (${contact.role})`,
		value: contact.id,
	}));
});

// Methods
const selectContact = (contact: any) => {
	selectedContact.value = contact;
	// Mark messages as read
	contact.unreadCount = 0;
};

const formatTime = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleTimeString("uz-UZ", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const sendMessage = async () => {
	if (!newMessage.value.trim() || !selectedContact.value) return;

	try {
		sending.value = true;

		// Create new message
		const message = {
			id: messages.value.length + 1,
			from_user_id: authStore.user?.id || 0,
			from_user_name: authStore.user?.name || "",
			to_user_id: selectedContact.value.id,
			to_user_name: selectedContact.value.name,
			subject: "Suhbat",
			content: newMessage.value.trim(),
			is_read: false,
			sent_at: new Date().toISOString(),
		};

		messages.value.push(message);
		newMessage.value = "";

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));
	} catch (error) {
		message.error("Xabar yuborishda xatolik yuz berdi");
	} finally {
		sending.value = false;
	}
};

const sendComposedMessage = async () => {
	try {
		await composeFormRef.value?.validate();
		composing.value = true;

		// Create new message
		const newMsg = {
			id: messages.value.length + 1,
			from_user_id: authStore.user?.id || 0,
			from_user_name: authStore.user?.name || "",
			to_user_id: composeForm.to_user_id,
			to_user_name: contacts.value.find((c) => c.id === composeForm.to_user_id)?.name || "",
			subject: composeForm.subject,
			content: composeForm.content,
			is_read: false,
			sent_at: new Date().toISOString(),
		};

		messages.value.push(newMsg);

		// Reset form
		composeForm.to_user_id = null;
		composeForm.subject = "";
		composeForm.content = "";

		showComposeModal.value = false;
		message.success("Xabar muvaffaqiyatli yuborildi");

		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));
	} catch (error) {
		message.error("Xabar yuborishda xatolik yuz berdi");
	} finally {
		composing.value = false;
	}
};

const handleChatMenu = (key: string) => {
	switch (key) {
		case "profile":
			message.info("Profil ko'rish funksiyasi");
			break;
		case "clear":
			message.warning("Xabarlarni tozalash funksiyasi");
			break;
	}
};

// Lifecycle
onMounted(() => {
	// Load messages and contacts
});
</script>

<style scoped>
@reference '../assets/styles/main.css';
.card {
	@apply bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6;
}

/* Custom scrollbar for messages */
.overflow-y-auto::-webkit-scrollbar {
	width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #d1d5db;
	border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #9ca3af;
}
</style>
