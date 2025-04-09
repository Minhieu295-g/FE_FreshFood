export interface Category{
    id: number
    name: string
}
export interface CategoryRequest{
    parentCategoryId: number
    name: string
}
export interface ParentCategory {
    id: number
    name: string
    imageUrl: string
    categories: Category[]
}
export interface CategoryFormData {
    name: string
}

export interface ParentCategoryFormData {
    name: string
    imageFile?: File | null
    imageUrl?: string
}
export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastState {
    show: boolean
    message: string
    type: ToastType
}
