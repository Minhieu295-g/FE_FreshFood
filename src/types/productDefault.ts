export interface ProductDefault {
    id: number,
    name: string,
    price: number,
    thumbnailUrl: string,
    discountPercentage: number,
    product?: ProductDefault
}