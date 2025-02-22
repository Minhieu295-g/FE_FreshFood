import {Category} from "./category";
import {ProductImage} from "./productImage";
import {ProductVariant} from "./productVariant";

export interface Product {
    id: number;
    name: string;
    description: string;
    thumbnailUrl: string;
    category: Category;
    productImages: ProductImage[];
    productVariants: ProductVariant[];
}