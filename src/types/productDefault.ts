export interface ProductDefault {
    id: number,
    productVariantId: number;
    name: string,
    price: number,
    thumbnailUrl: string,
    discountPercentage: number,
    product?: ProductDefault
}