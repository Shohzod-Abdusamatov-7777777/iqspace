import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { IPagination } from '@/types/base';

const defaultPagination: IPagination = {
    search: '',
    sortBy: '',
    orderType: 'asc',
    page: 1,
    pageSize: 10,
};

export default function usePagination(
    initial?: Partial<IPagination>,
    persist = true
) {
    const route = useRoute();
    const router = useRouter();
    const totalItems = ref(0);

    const merged = { ...defaultPagination, ...initial };

    const createPagination = (): IPagination => {
        const filter: IPagination = { ...merged };
        if (persist) {
            for (const key in filter) {
                if (route.query[key] !== undefined) {
                    if (key === 'page' || key === 'pageSize') {
                        filter[key] = Number(route.query[key]) as any;
                    } else if (key === 'orderType') {
                        filter[key] = (route.query[key] === 'desc' ? 'desc' : 'asc') as any;
                    } else {
                        filter[key] = route.query[key] as any;
                    }
                }
            }
        }
        return filter;
    };

    const pagination = ref<IPagination>(createPagination());

    watch(
        () => pagination.value,
        (newVal) => {
            if (persist) {
                const query: Record<string, any> = { ...route.query };
                for (const key in newVal) {
                    query[key] = newVal[key];
                }
                router.replace({ query });
            }
        },
        { deep: true }
    );

    return { pagination, totalItems };
} 