export type IPagination = {
    search: string;
    sortBy: string;
    orderType: "asc" | "desc";
    page: number;
    pageSize: number;
}; 