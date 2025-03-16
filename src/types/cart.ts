import {ProductVariant} from "./productVariant";

export interface CartItemRequest {
    cartId: number;
    productVariantId: number;
    quantity: number;
}
export interface CartItem {
    id: number;
    quantity: number;
    productVariant: ProductVariant;
}
export interface Cart {
    id: number;
    cartItem: CartItem[];
}
export function mapCartItemToRequest(cartItem: CartItem, cartId: number): CartItemRequest {
    return {
        cartId: cartId,
        productVariantId: cartItem.productVariant.id,
        quantity: cartItem.quantity,
    };
}
