import {CartItem} from "../types/cart";
import {ProductVariant} from "./productVariant";
import {DeliveryAddressResponse} from "./address";

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

export interface OrderSuccessProps{
    orderNumber: string
    orderDate: string
    deliveryDate: string
    deliveryFee: number
    totalAmount: number
    paymentMethod: string
    shippingAddress: {
        name: string
        phone: string
        address: string
        city: string
        district: string
        ward: string
    }
    items: Array<{
        id: number
        name: string
        price: number
        quantity: number
        image: string
        variant?: string
    }>
}

export interface OrderItemResponse  {
    id: number,
    quantity: number,
    product: ProductVariant
}
export interface OrderResponse {
    id: number,
    orderNumber: string,
    date: string,
    totalPrice: number,
    shippingFee: number,
    expectedDate: string,
    paymentMethod: string,
    status: OrderStatus,
    note: string,
    items: OrderItemResponse[],
    shippingAddress: DeliveryAddressResponse
}
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
