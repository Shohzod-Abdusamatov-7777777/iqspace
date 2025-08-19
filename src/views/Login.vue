<template>
	<div class="lms-eduvicard-bg">
		<!-- Modern abstract SVG background with multiple circles -->
		<svg class="lms-eduvicard-bg-svg" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<circle cx="250" cy="200" r="180" fill="var(--color-primary-light, #b5c7ff)" fill-opacity="0.13" />
			<circle cx="1000" cy="180" r="140" fill="var(--color-primary, #4361ee)" fill-opacity="0.09" />
			<circle cx="600" cy="700" r="260" fill="var(--color-primary, #4361ee)" fill-opacity="0.07" />
			<circle cx="900" cy="600" r="120" fill="var(--color-primary-light, #b5c7ff)" fill-opacity="0.10" />
			<circle cx="400" cy="600" r="90" fill="var(--color-primary, #4361ee)" fill-opacity="0.06" />
		</svg>

		<div class="lms-eduvicard-modal">
			<div class="lms-eduvicard-left">
				<div class="lms-eduvicard-logo">
					<img src="/src/assets/images/logo/2.3.png" alt="IqSpace" style="height: 180px; object-fit: cover" />
				</div>
				<p class="lms-eduvicard-desc">Bilim va intellekt rivojlantirishga yo'naltirilgan zamonaviy ta'lim platformasi</p>
			</div>
			<div class="lms-eduvicard-right lms-login-swipe-in">
				<h3 class="lms-login-form-title">Tizimga kirish</h3>
				<n-form ref="formRef" :model="loginForm" :rules="rules" @submit="handleLogin" class="lms-eduvicard-form">
					<n-form-item path="phone" label="Telefon raqami">
						<n-input v-model:value="loginForm.phone" placeholder="+998901234567" size="large" :disabled="loading" aria-label="Telefon raqami">
							<template #prefix>
								<n-icon>
									<PhoneIcon />
								</n-icon>
							</template>
						</n-input>
					</n-form-item>
					<n-form-item path="password" label="Parol">
						<n-input
							v-model:value="loginForm.password"
							placeholder="Parol"
							size="large"
							:type="showPassword ? 'text' : 'password'"
							:disabled="loading"
							aria-label="Parol"
						>
							<template #prefix>
								<n-icon>
									<LockIcon />
								</n-icon>
							</template>
							<template #suffix>
								<n-icon @click="showPassword = !showPassword" style="cursor: pointer">
									<EyeIcon v-if="!showPassword" />
									<EyeOffIcon v-else />
								</n-icon>
							</template>
						</n-input>
					</n-form-item>
					<n-button type="primary" size="large" block :loading="loading" attr-type="submit" class="lms-eduvicard-btn" aria-label="Kirish">
						Kirish
					</n-button>
				</n-form>
				<div class="lms-eduvicard-footer">
					<span>&copy; {{ new Date().getFullYear() }} Tubix LMS</span>
				</div>
			</div>
		</div>
		
		<!-- Voice Navigation -->
		<VoiceNavigation 
			@login-command="handleVoiceLogin" 
			@voice-login-data="handleVoiceLoginData" 
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage, NIcon, NForm, NFormItem, NInput, NButton } from "naive-ui";
import { PhoneIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import VoiceNavigation from "@/components/common/VoiceNavigation.vue";

const loginForm = ref({ phone: "+998900000000", password: "123456" });
const rules = {};
const loading = ref(false);
const showPassword = ref(false);
const formRef = ref();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();

async function handleLogin(e: Event) {
	e.preventDefault();
	try {
		await formRef.value?.validate?.();
		loading.value = true;

		await authStore.login({ phone: loginForm.value.phone, password: loginForm.value.password });

		message.success("Muvaffaqiyatli kirdingiz!");
		router.push("/dashboard");
	} catch (err: any) {
		console.error('Login error:', err);
		message.error(err?.response?.data?.message || err?.message || "Login xatoligi");
	} finally {
		loading.value = false;
	}
}

// Handle voice login command
function handleVoiceLogin() {
	handleLogin(new Event('submit'));
}

// Handle voice login data from VoiceNavigation component
function handleVoiceLoginData(data: { phone: string, password: string }) {
	// Update form with voice input data
	loginForm.value.phone = data.phone;
	loginForm.value.password = data.password;
	
	// Automatically trigger login
	handleLogin(new Event('submit'));
}
</script>

<style scoped>
.lms-eduvicard-bg {
	min-height: 100vh;
	width: 100vw;
	background: linear-gradient(120deg, var(--color-secondary-50, #f8fafc) 0%, var(--color-primary-100, #e0e7ff) 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

.lms-eduvicard-bg-svg {
	position: absolute;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	z-index: 0;
	pointer-events: none;
	filter: blur(0.5px);
}

.lms-eduvicard-modal {
	position: relative;
	z-index: 1;
	background: var(--color-secondary-100, #fff);
	border-radius: 22px;
	box-shadow: 0 8px 40px rgba(60, 60, 120, 0.13);
	width: 100%;
	max-width: 820px;
	min-height: 420px;
	display: flex;
	flex-direction: row;
	overflow: hidden;
	animation: fadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.lms-eduvicard-left {
	flex: 1.1;
	background: linear-gradient(135deg, var(--color-primary, #4361ee) 0%, var(--color-primary-light, #b5c7ff) 100%);
	color: var(--color-secondary-50, #fff);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 44px 28px 44px 28px;
	min-width: 0;
}

.lms-eduvicard-right {
	flex: 1;
	background: var(--color-secondary-100, #fff);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 44px 32px 44px 32px;
	min-width: 0;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(32px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}

.lms-eduvicard-logo {
	margin-bottom: 18px;
}

.lms-eduvicard-title {
	font-size: 2rem;
	font-weight: 800;
	margin-bottom: 8px;
	color: var(--color-secondary-50, #fff);
}

.lms-eduvicard-desc {
	color: var(--color-primary-100, #e0e7ff);
	margin-bottom: 22px;
	font-size: 1.08rem;
	text-align: center;
}

.lms-login-form-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 24px;
	color: var(--color-secondary-700, #374151);
	text-align: center;
}

.lms-eduvicard-form {
	width: 100%;
	max-width: 340px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 0;
}

.lms-eduvicard-btn.n-button {
	border-radius: 12px !important;
	font-size: 1.05rem;
	margin-top: 16px;
	background: linear-gradient(180deg, var(--color-primary, #4361ee) 80%, var(--color-primary-500, #b5c7ff) 100%);
	color: #fff;
	border: none;
	font-weight: 600;
	letter-spacing: 0.5px;
	box-shadow: 0 2px 8px rgba(67, 97, 238, 0.08);
	transition: filter 0.18s, box-shadow 0.18s;
}

.lms-eduvicard-btn.n-button:hover {
	filter: brightness(1.08);
	box-shadow: 0 4px 16px rgba(67, 97, 238, 0.13);
}

.lms-eduvicard-footer {
	margin-top: 22px;
	color: var(--color-secondary-400, #94a3b8);
	font-size: 0.95rem;
	opacity: 0.85;
	text-align: center;
}

@media (max-width: 900px) {
	.lms-eduvicard-modal {
		flex-direction: column;
		min-width: 0;
		max-width: 98vw;
	}

	.lms-eduvicard-left,
	.lms-eduvicard-right {
		padding: 32px 6vw 24px 6vw;
		min-width: 0;
	}

	.lms-eduvicard-form {
		max-width: 98vw;
	}
}

.lms-login-form-title {
	font-size: 1.45rem;
	font-weight: 700;
	color: var(--color-primary, #4361ee);
	margin-bottom: 18px;
	text-align: center;
}

</style>
