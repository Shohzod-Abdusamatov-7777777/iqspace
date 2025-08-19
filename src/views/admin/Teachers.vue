<template>
	<div class="teachers-page">
		<div class="page-header">
			<h1 class="page-title">O'qituvchilar</h1>
			<div class="header-actions">
				<button @click="showAddModal = true" class="btn btn-primary">
					<i class="icon-plus"></i>
					O'qituvchi qo'shish
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon">
					<i class="icon-users"></i>
				</div>
				<div class="stat-content">
					<p class="stat-value">{{ totalTeachers }}</p>
					<p class="stat-label">Jami o'qituvchilar</p>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon active">
					<i class="icon-check-circle"></i>
				</div>
				<div class="stat-content">
					<p class="stat-value">{{ activeTeachers }}</p>
					<p class="stat-label">Faol o'qituvchilar</p>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<i class="icon-book"></i>
				</div>
				<div class="stat-content">
					<p class="stat-value">{{ totalCourses }}</p>
					<p class="stat-label">Jami kurslar</p>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<i class="icon-star"></i>
				</div>
				<div class="stat-content">
					<p class="stat-value">{{ averageRating }}</p>
					<p class="stat-label">O'rtacha reyting</p>
				</div>
			</div>
		</div>

		<!-- Search and Filter -->
		<div class="table-controls">
			<div class="search-box">
				<input v-model="searchQuery" type="text" placeholder="Ism yoki mutaxassislik bo'yicha qidirish..." class="search-input" />
				<i class="icon-search"></i>
			</div>
			<div class="filters">
				<select v-model="filterDepartment" class="filter-select">
					<option value="">Barcha bo'limlar</option>
					<option value="programming">Dasturlash</option>
					<option value="design">Dizayn</option>
					<option value="marketing">Marketing</option>
					<option value="business">Biznes</option>
				</select>
				<select v-model="filterStatus" class="filter-select">
					<option value="">Barcha holatlar</option>
					<option value="active">Faol</option>
					<option value="inactive">Nofaol</option>
					<option value="vacation">Ta'tilda</option>
				</select>
			</div>
		</div>

		<!-- Teachers Table -->
		<div class="table-container">
			<table class="data-table">
				<thead>
					<tr>
						<th>O'qituvchi</th>
						<th>Mutaxassislik</th>
						<th>Bo'lim</th>
						<th>Kurslar</th>
						<th>O'quvchilar</th>
						<th>Reyting</th>
						<th>Holati</th>
						<th>Amallar</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="teacher in filteredTeachers" :key="teacher.id">
						<td>
							<div class="teacher-info">
								<img :src="teacher.avatar || '/default-avatar.png'" :alt="teacher.name" class="teacher-avatar" />
								<div>
									<p class="teacher-name">{{ teacher.name }}</p>
									<p class="teacher-email">{{ teacher.email }}</p>
								</div>
							</div>
						</td>
						<td>{{ teacher.specialization }}</td>
						<td>{{ teacher.department }}</td>
						<td>{{ teacher.courses }}</td>
						<td>{{ teacher.students }}</td>
						<td>
							<div class="rating">
								<i class="icon-star filled"></i>
								<span>{{ teacher.rating }}</span>
							</div>
						</td>
						<td>
							<span :class="['status-badge', `status-${teacher.status}`]">
								{{ getStatusText(teacher.status) }}
							</span>
						</td>
						<td>
							<div class="action-buttons">
								<button @click="viewTeacher(teacher)" class="btn-icon">
									<i class="icon-eye"></i>
								</button>
								<button @click="editTeacher(teacher)" class="btn-icon">
									<i class="icon-edit"></i>
								</button>
								<button @click="deleteTeacher(teacher)" class="btn-icon danger">
									<i class="icon-trash"></i>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Add/Edit Teacher Modal -->
		<div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
			<div class="modal">
				<div class="modal-header">
					<h2>{{ editingTeacher ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish" }}</h2>
					<button @click="closeModal" class="btn-close">×</button>
				</div>
				<form @submit.prevent="saveTeacher" class="teacher-form">
					<div class="form-grid">
						<div class="form-group">
							<label>To'liq ism</label>
							<input v-model="teacherForm.name" type="text" required />
						</div>
						<div class="form-group">
							<label>Email</label>
							<input v-model="teacherForm.email" type="email" required />
						</div>
						<div class="form-group">
							<label>Telefon</label>
							<input v-model="teacherForm.phone" type="tel" required />
						</div>
						<div class="form-group">
							<label>Tug'ilgan sana</label>
							<input v-model="teacherForm.birthDate" type="date" required />
						</div>
						<div class="form-group">
							<label>Bo'lim</label>
							<select v-model="teacherForm.department" required>
								<option value="">Tanlang</option>
								<option value="programming">Dasturlash</option>
								<option value="design">Dizayn</option>
								<option value="marketing">Marketing</option>
								<option value="business">Biznes</option>
							</select>
						</div>
						<div class="form-group">
							<label>Mutaxassislik</label>
							<input v-model="teacherForm.specialization" type="text" required />
						</div>
						<div class="form-group">
							<label>Tajriba (yil)</label>
							<input v-model.number="teacherForm.experience" type="number" min="0" required />
						</div>
						<div class="form-group">
							<label>Holati</label>
							<select v-model="teacherForm.status" required>
								<option value="active">Faol</option>
								<option value="inactive">Nofaol</option>
								<option value="vacation">Ta'tilda</option>
							</select>
						</div>
					</div>
					<div class="form-group full-width">
						<label>Biografiya</label>
						<textarea v-model="teacherForm.bio" rows="4"></textarea>
					</div>
					<div class="modal-footer">
						<button type="button" @click="closeModal" class="btn btn-secondary">Bekor qilish</button>
						<button type="submit" class="btn btn-primary">
							{{ editingTeacher ? "Saqlash" : "Qo'shish" }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NButton, NIcon, NTag, NPopconfirm, NInput, NSelect, NModal, NCard, NForm, NFormItem, NGrid, NFormItemGi, useMessage } from "naive-ui";
import { PlusIcon, SearchIcon, XIcon, EditIcon, Trash2Icon, StarIcon, UsersIcon, BookOpenIcon, CheckCircle2Icon, EyeIcon } from "lucide-vue-next";
import { useTeachersStore } from "@/stores/teachers";

const teachersStore = useTeachersStore();

const searchQuery = ref("");
const filterDepartment = ref("");
const filterStatus = ref("");
const showAddModal = ref(false);
const editingTeacher = ref(null);

const teacherForm = ref({
	name: "",
	email: "",
	phone: "",
	birthDate: "",
	department: "",
	specialization: "",
	experience: 0,
	status: "active",
	bio: "",
});

const teachers = computed(() => teachersStore.teachers);

const totalTeachers = computed(() => teachers.value.length);
const activeTeachers = computed(() => teachers.value.filter((t) => t.status === "active").length);
const totalCourses = computed(() => teachers.value.reduce((sum, t) => sum + t.courses, 0));
const averageRating = computed(() => {
	const total = teachers.value.reduce((sum, t) => sum + t.rating, 0);
	return teachers.value.length ? (total / teachers.value.length).toFixed(1) : "0.0";
});

const filteredTeachers = computed(() => {
	return teachers.value.filter((teacher) => {
		const matchesSearch =
			teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			teacher.specialization.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			teacher.email.toLowerCase().includes(searchQuery.value.toLowerCase());
		const matchesDepartment = !filterDepartment.value || teacher.department === filterDepartment.value;
		const matchesStatus = !filterStatus.value || teacher.status === filterStatus.value;

		return matchesSearch && matchesDepartment && matchesStatus;
	});
});

function getStatusText(status: string) {
	const statusMap = {
		active: "Faol",
		inactive: "Nofaol",
		vacation: "Ta'tilda",
	};
	return statusMap[status] || status;
}

function viewTeacher(teacher) {
	// Navigate to teacher details
	console.log("View teacher:", teacher);
}

function editTeacher(teacher) {
	editingTeacher.value = teacher;
	teacherForm.value = { ...teacher };
	showAddModal.value = true;
}

async function deleteTeacher(teacher) {
	if (confirm(`"${teacher.name}" o'qituvchini o'chirmoqchimisiz?`)) {
		await teachersStore.deleteTeacher(teacher.id);
	}
}

async function saveTeacher() {
	try {
		if (editingTeacher.value) {
			await teachersStore.updateTeacher(teacherForm.value.id, teacherForm.value);
		} else {
			await teachersStore.createTeacher(teacherForm.value);
		}
		closeModal();
	} catch (error) {
		console.error("Error saving teacher:", error);
	}
}

function closeModal() {
	showAddModal.value = false;
	editingTeacher.value = null;
	teacherForm.value = {
		name: "",
		email: "",
		phone: "",
		birthDate: "",
		department: "",
		specialization: "",
		experience: 0,
		status: "active",
		bio: "",
	};
}

onMounted(async () => {
	await teachersStore.fetchTeachers();
});
</script>

<style scoped>
.teachers-page {
	padding: 24px;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32px;
}

.page-title {
	font-size: 28px;
	font-weight: 600;
	color: #1f2937;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 32px;
}

.stat-card {
	background: white;
	border-radius: 12px;
	padding: 24px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	gap: 16px;
}

.stat-icon {
	width: 56px;
	height: 56px;
	background: #f3f4f6;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	color: #6b7280;
}

.stat-icon.active {
	background: #10b981;
	color: white;
}

.stat-content {
	flex: 1;
}

.stat-value {
	font-size: 28px;
	font-weight: 600;
	color: #1f2937;
	margin: 0;
}

.stat-label {
	font-size: 14px;
	color: #6b7280;
	margin: 0;
}

.table-controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	margin-bottom: 24px;
}

.search-box {
	position: relative;
	flex: 1;
	max-width: 400px;
}

.search-input {
	width: 100%;
	padding: 10px 16px 10px 44px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
}

.search-box i {
	position: absolute;
	left: 16px;
	top: 50%;
	transform: translateY(-50%);
	color: #6b7280;
}

.filters {
	display: flex;
	gap: 12px;
}

.filter-select {
	padding: 10px 16px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
	background: white;
}

.table-container {
	background: white;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
	width: 100%;
	border-collapse: collapse;
}

.data-table th {
	background: #f9fafb;
	padding: 12px 16px;
	text-align: left;
	font-weight: 500;
	color: #6b7280;
	font-size: 14px;
	border-bottom: 1px solid #e5e7eb;
}

.data-table td {
	padding: 16px;
	border-bottom: 1px solid #f3f4f6;
}

.teacher-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.teacher-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	object-fit: cover;
}

.teacher-name {
	font-weight: 500;
	color: #1f2937;
	margin: 0;
}

.teacher-email {
	font-size: 12px;
	color: #6b7280;
	margin: 0;
}

.rating {
	display: flex;
	align-items: center;
	gap: 4px;
}

.icon-star.filled {
	color: #fbbf24;
}

.status-badge {
	display: inline-flex;
	align-items: center;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 500;
}

.status-active {
	background: #d1fae5;
	color: #065f46;
}

.status-inactive {
	background: #fee2e2;
	color: #991b1b;
}

.status-vacation {
	background: #e0e7ff;
	color: #3730a3;
}

.action-buttons {
	display: flex;
	gap: 8px;
}

.btn-icon {
	width: 36px;
	height: 36px;
	border: 1px solid #e5e7eb;
	background: white;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-icon:hover {
	background: #f3f4f6;
}

.btn-icon.danger:hover {
	background: #fee2e2;
	border-color: #fecaca;
	color: #dc2626;
}

.btn {
	padding: 10px 20px;
	border-radius: 8px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	border: none;
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.btn-primary {
	background: #3b82f6;
	color: white;
}

.btn-primary:hover {
	background: #2563eb;
}

.btn-secondary {
	background: #f3f4f6;
	color: #1f2937;
}

.btn-secondary:hover {
	background: #e5e7eb;
}

/* Modal Styles */
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: white;
	border-radius: 16px;
	width: 90%;
	max-width: 600px;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24px;
	border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
	margin: 0;
	font-size: 20px;
	font-weight: 600;
}

.btn-close {
	width: 32px;
	height: 32px;
	border: none;
	background: none;
	font-size: 24px;
	color: #6b7280;
	cursor: pointer;
	border-radius: 8px;
}

.btn-close:hover {
	background: #f3f4f6;
}

.teacher-form {
	padding: 24px;
}

.form-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin-bottom: 16px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.form-group.full-width {
	grid-column: 1 / -1;
}

.form-group label {
	font-size: 14px;
	font-weight: 500;
	color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
	padding: 10px 16px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
	background: white;
}

.form-group textarea {
	resize: vertical;
}

.modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 24px;
}
</style>
