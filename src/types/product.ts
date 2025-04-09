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

export interface ProductRequestDTO {
    name: string;
    description: string;
    categoryId: number;
}

export interface ProductVariantRequestDTO {
    productId: number;
    name: string;
    price: number;
    discountPercentage: number;
    unit: "KG" | "G" | "L" | "ML" | "BOX" | "CAN" | "BOTTLE" | "PIECE" | "BAG" | "BUNDLE" | "PACK";
    expiryDate: string;  // MM/dd/yyyy
    status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED" | "PRE_ORDER" | "ARCHIVED";
}


