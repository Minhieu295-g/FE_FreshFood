export interface PaginatedResponse<T> {
    items: T[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
export interface SearchParams {
    product?: string[];
    category?: string[];
    productVariant?: string[];
    page?: number;
    size?: number;
    sort?: string; // ví dụ: 'price,asc'
}