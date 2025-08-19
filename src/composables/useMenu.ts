import { computed } from 'vue';
import {
    HomeIcon,
    ShieldIcon,
    UsersIcon,
    PanelLeft,
    BookOpenIcon,
    BarChartIcon,
    SettingsIcon,
    ClipboardListIcon,
    CalendarIcon,
    GraduationCapIcon,
    StarIcon,
    MessageCircleIcon,
    MailIcon,
    UserIcon
} from 'lucide-vue-next';
import type { MenuItem } from '@/types';

const iconMap: Record<string, any> = {
    HomeIcon,
    ShieldIcon,
    UsersIcon,
    PanelLeft,
    BookOpenIcon,
    BarChartIcon,
    SettingsIcon,
    ClipboardListIcon,
    CalendarIcon,
    GraduationCapIcon,
    StarIcon,
    MessageCircleIcon,
    MailIcon,
    UserIcon
};

const menuItems: MenuItem[] = [
    {
        id: 'overview',
        title: 'Bosh sahifa',
        icon: 'HomeIcon',
        path: '/dashboard',
        roles: ['admin', 'teacher', 'student']
    },
    {
        id: 'admin',
        title: 'Boshqaruv',
        icon: 'ShieldIcon',
        path: '',
        roles: ['admin'],
        children: [
            { id: 'admin-users', title: 'Foydalanuvchilar', icon: 'UsersIcon', path: '/dashboard/admin/users', roles: ['admin'] },
            { id: 'admin-teachers', title: 'O\'qituvchilar', icon: 'PanelLeft', path: '/dashboard/admin/teachers', roles: ['admin'] },
            { id: 'admin-courses', title: 'Kurslar', icon: 'BookOpenIcon', path: '/dashboard/admin/courses', roles: ['admin'] },
            { id: 'admin-stats', title: 'Statistika', icon: 'BarChartIcon', path: '/dashboard/admin/stats', roles: ['admin'] },
            { id: 'admin-settings', title: 'Sozlamalar', icon: 'SettingsIcon', path: '/dashboard/admin/settings', roles: ['admin'] }
        ]
    },
    {
        id: 'teacher',
        title: 'O\'qituvchi',
        icon: 'PanelLeft',
        path: '',
        roles: ['teacher'],
        children: [
            { id: 'teacher-courses', title: 'Mening kurslarim', icon: 'BookOpenIcon', path: '/dashboard/teacher/courses', roles: ['teacher'] },
            { id: 'teacher-assignments', title: 'Topshiriqlar', icon: 'ClipboardListIcon', path: '/dashboard/teacher/assignments', roles: ['teacher'] },
            { id: 'teacher-students', title: 'O\'quvchilar', icon: 'UsersIcon', path: '/dashboard/teacher/students', roles: ['teacher'] },
            { id: 'teacher-schedule', title: 'Dars jadvali', icon: 'CalendarIcon', path: '/dashboard/teacher/schedule', roles: ['teacher'] }
        ]
    },
    {
        id: 'student',
        title: 'Ta\'lim',
        icon: 'GraduationCapIcon',
        path: '',
        roles: ['student'],
        children: [
            { id: 'student-courses', title: 'Mening kurslarim', icon: 'BookOpenIcon', path: '/dashboard/student/courses', roles: ['student'] },
            { id: 'student-assignments', title: 'Topshiriqlar', icon: 'ClipboardListIcon', path: '/dashboard/student/assignments', roles: ['student'] },
            { id: 'student-grades', title: 'Baholar', icon: 'StarIcon', path: '/dashboard/student/grades', roles: ['student'] },
            { id: 'student-schedule', title: 'Dars jadvali', icon: 'CalendarIcon', path: '/dashboard/student/schedule', roles: ['student'] }
        ]
    },
    {
        id: 'communication',
        title: 'Aloqa',
        icon: 'MessageCircleIcon',
        path: '',
        roles: ['admin', 'teacher', 'student'],
        children: [
            { id: 'messages', title: 'Xabarlar', icon: 'MailIcon', path: '/dashboard/messages', roles: ['admin', 'teacher', 'student'] }
        ]
    },
    {
        id: 'profile',
        title: 'Profil',
        icon: 'UserIcon',
        path: '/dashboard/profile',
        roles: ['admin', 'teacher', 'student']
    }
];

function mapIcons(items: MenuItem[]): MenuItem[] {
    return items.map(item => {
        const iconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : undefined;
        const mapped: MenuItem = {
            ...item,
            icon: iconComponent,
            children: item.children ? mapIcons(item.children) : undefined
        };
        return mapped;
    });
}

export function useMenu(userRole: string) {
    return computed(() => {
        const filtered = menuItems
            .filter(item => item.roles.includes(userRole))
            .map(item => ({
                ...item,
                children: item.children?.filter(child => child.roles.includes(userRole))
            }));
        return mapIcons(filtered);
    });
}

// Helper function to filter menu items based on user role
export function getMenuItemsForRole(userRole: string): MenuItem[] {
    return menuItems
        .filter(item => item.roles.includes(userRole))
        .map(item => ({
            ...item,
            children: item.children?.filter(child => child.roles.includes(userRole))
        }));
}

// Helper function to get flat menu items for breadcrumbs
export function getFlatMenuItems(items: MenuItem[] = menuItems): MenuItem[] {
    const flatItems: MenuItem[] = [];
    items.forEach(item => {
        flatItems.push(item);
        if (item.children) {
            flatItems.push(...getFlatMenuItems(item.children));
        }
    });
    return flatItems;
}

// Helper function to find menu item by path
export function findMenuItemByPath(path: string, items: MenuItem[] = menuItems): MenuItem | null {
    for (const item of items) {
        if (item.path === path) {
            return item;
        }
        if (item.children) {
            const found = findMenuItemByPath(path, item.children);
            if (found) return found;
        }
    }
    return null;
} 