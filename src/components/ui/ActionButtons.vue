<template>
	<n-space :size="size">
		<!-- View Button -->
		<n-button 
			v-if="showView"
			:size="buttonSize" 
			type="info"
			:ghost="ghost"
			@click="handleView"
			:title="viewTooltip"
		>
			<template #icon>
				<n-icon :component="EyeIcon" />
			</template>
			<span v-if="showLabels">Ko'rish</span>
		</n-button>

		<!-- Edit Button -->
		<n-button 
			v-if="showEdit"
			:size="buttonSize" 
			type="primary"
			:ghost="ghost"
			@click="handleEdit"
			:title="editTooltip"
		>
			<template #icon>
				<n-icon :component="EditIcon" />
			</template>
			<span v-if="showLabels">Tahrirlash</span>
		</n-button>

		<!-- Delete Button with Confirmation -->
		<n-popconfirm 
			v-if="showDelete"
			:show-icon="false"
			:on-positive-click="handleDelete"
			:positive-text="confirmText"
			:negative-text="cancelText"
		>
			<template #trigger>
				<n-button 
					:size="buttonSize" 
					type="error"
					:ghost="ghost"
					:title="deleteTooltip"
				>
					<template #icon>
						<n-icon :component="Trash2Icon" />
					</template>
					<span v-if="showLabels">O'chirish</span>
				</n-button>
			</template>
			<span>{{ deleteMessage }}</span>
		</n-popconfirm>

		<!-- Custom Actions -->
		<slot name="actions" :item="item" />
	</n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NIcon, NSpace, NPopconfirm } from 'naive-ui';
import { EyeIcon, EditIcon, Trash2Icon } from 'lucide-vue-next';

interface ActionButtonsProps {
	item: any;
	itemName?: string;
	size?: 'small' | 'medium' | 'large';
	buttonSize?: 'tiny' | 'small' | 'medium' | 'large';
	ghost?: boolean;
	showView?: boolean;
	showEdit?: boolean;
	showDelete?: boolean;
	showLabels?: boolean;
	viewTooltip?: string;
	editTooltip?: string;
	deleteTooltip?: string;
	confirmText?: string;
	cancelText?: string;
	deleteMessageTemplate?: string;
}

const props = withDefaults(defineProps<ActionButtonsProps>(), {
	size: 'small',
	buttonSize: 'small',
	ghost: true,
	showView: true,
	showEdit: true,
	showDelete: true,
	showLabels: false,
	viewTooltip: 'Ko\'rish',
	editTooltip: 'Tahrirlash',
	deleteTooltip: 'O\'chirish',
	confirmText: 'Ha, o\'chirish',
	cancelText: 'Bekor qilish',
	deleteMessageTemplate: '{name} elementini o\'chirmoqchimisiz?'
});

const emit = defineEmits<{
	view: [item: any];
	edit: [item: any];
	delete: [item: any];
}>();

// Computed properties
const deleteMessage = computed(() => {
	const name = props.itemName || 
				props.item?.title || 
				props.item?.name || 
				props.item?.label || 
				'Bu';
	
	return props.deleteMessageTemplate.replace('{name}', `"${name}"`);
});

// Event handlers
function handleView(): void {
	emit('view', props.item);
}

function handleEdit(): void {
	emit('edit', props.item);
}

function handleDelete(): void {
	emit('delete', props.item);
}
</script>

<style scoped>
/* Additional styling if needed */
</style>