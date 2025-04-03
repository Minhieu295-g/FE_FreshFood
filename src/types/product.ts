import {Category} from "./category";

export interface ProductImage {
    id: number;
    imageUrl: string;
    altText: string;
}
export interface ProductVariant {
    id: number;
    name: string;
    price: number;
    discountPercentage: number;
    thumbnailUrl: string;
    unit: string;
    expiredDate: string;
    status: string;
}
export interface Product {
    id: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    productImages: ProductImage[];
    productVariants: ProductVariant[];
}

export interface ToastState {
    show: boolean
    message: string
    type: "success" | "error" | "info"
}