import {CartItem} from "../types/cart";

export interface OrderRequest {
    totalPrice: number;
    note: string;
    deliveryFee: number;
    expectedDeliveryDate: string;
    paymentMethod: string;
    voucherId: number;
    deliveryAddressId: number;
    userId: number;
    cartItems: CartItem[]
}
