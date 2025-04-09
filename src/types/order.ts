import {CartItem} from "../types/cart";
import {ProductVariant} from "./product";
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
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
export type PaymentStatus = "paid" | "pending" | "failed"
export type PaymentMethod = "cod" | "momo" | "bank_transfer" | "credit_card"

export interface OrderItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    variant?: string
    productId: number
    variantId: number
}

export interface ShippingAddress {
    id: number
    name: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
    isDefault: boolean
}

export interface Order {
    id: string
    orderNumber: string
    date: string
    total: number
    status: OrderStatus
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    items: OrderItem[]
    shippingAddress: ShippingAddress
    trackingNumber?: string
    estimatedDelivery?: string
    userId: number
    userName: string
    userEmail: string
    notes?: string
    adminNotes?: string
}

export interface OrderStatusUpdate {
    orderId: string
    status: OrderStatus
    notes?: string
}

export interface OrderFilters {
    status?: OrderStatus
    paymentStatus?: PaymentStatus
    paymentMethod?: PaymentMethod
    startDate?: string
    endDate?: string
    searchQuery?: string
    userId?: number
}

export interface OrderSortOptions {
    field: "date" | "total" | "orderNumber"
    direction: "asc" | "desc"
}

export interface OrderPagination {
    page: number
    limit: number
    total: number
}

export const statusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
    pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "Clock",
    },
    processing: {
        label: "Đang xử lý",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "RefreshCw",
    },
    shipped: {
        label: "Đang giao hàng",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: "Truck",
    },
    delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "CheckCircle",
    },
    cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "XCircle",
    },
    returned: {
        label: "Đã trả hàng",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "AlertTriangle",
    },
}

export const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
    paid: {
        label: "Đã thanh toán",
        color: "bg-green-100 text-green-800 border-green-200",
    },
    pending: {
        label: "Chờ thanh toán",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    failed: {
        label: "Thất bại",
        color: "bg-red-100 text-red-800 border-red-200",
    },
}

export const paymentMethodConfig: Record<PaymentMethod, { label: string }> = {
    cod: {
        label: "Thanh toán khi nhận hàng (COD)",
    },
    momo: {
        label: "Ví MoMo",
    },
    bank_transfer: {
        label: "Chuyển khoản ngân hàng",
    },
    credit_card: {
        label: "Thẻ tín dụng/ghi nợ",
    },
}
