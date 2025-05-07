import api from "./api";
import {OrderRequest, OrderResponse, OrderStatusUpdateRequest} from "../types/order";
import type { Order, OrderFilters, OrderPagination, OrderSortOptions, OrderStatusUpdate } from "../types/order"
import {ApiResponse, PaginatedResponse} from "../types/api";

export const createOrder = async (order: OrderRequest) =>{
    try {
        const response = await api.post(`/order/`, order , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("create order thất bại:", error);
        throw error;
    }
}

export const getOrdersByUserId = async (userId: number): Promise<ApiResponse<PaginatedResponse<OrderResponse>>> => {
    try {
        const response = await api.get(`/order/list/${userId}` , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Get orders thất bại:", error);
        throw error;
    }
}
export const getAllOrders= async (): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    try {
        const response = await api.get(`/order/list/` , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Get orders thất bại:", error);
        throw error;
    }
}
export let sampleOrders: Order[] = [
    {
        id: 1,
        orderNumber: "ORD-20240325-7812",
        date: "25/03/2024, 15:30",
        totalPrice: 245000,
        shippingFee: 30000,
        expectedDate: "28/03/2024",
        status: "delivered",
        paymentMethod: "COD",
        note: "",
        items: [
            {
                id: 1,
                quantity: 2,
                product: {
                    id: 201,
                    name: "Set 3 cuộn túi đựng rác tự phân hủy sinh học",
                    price: 9500,
                    discountPercentage: 0,
                    thumbnailUrl: "https://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg",
                    unit: "Set",
                    expiredDate: "31/12/2025",
                    status: "active",
                },
            },
            {
                id: 2,
                quantity: 1,
                product: {
                    id: 202,
                    name: "Rau cải ngọt hữu cơ",
                    price: 35000,
                    discountPercentage: 5,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728028836/ripempxa3z48aqc1clfa.jpg",
                    unit: "500g",
                    expiredDate: "15/04/2024",
                    status: "active",
                },
            },
            {
                id: 3,
                quantity: 1,
                product: {
                    id: 203,
                    name: "Táo Envy New Zealand size 70-80",
                    price: 185000,
                    discountPercentage: 10,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "1kg",
                    expiredDate: "30/05/2024",
                    status: "active",
                },
            },
        ],
        shippingAddress: {
            id: 1,
            name: "Lê Minh Hiếu",
            numberPhone: "(+84) 345778312",
            provinceId: 1,
            districtId: 2,
            wardId: 3,
            provinceName: "An Giang",
            districtName: "Huyện An Phú",
            wardName: "Thị Trấn An Phú",
            detailAddress: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            default: true,
        },
    },
    {
        id: 2,
        orderNumber: "ORD-20240320-6543",
        date: "20/03/2024, 09:15",
        totalPrice: 178000,
        shippingFee: 30000,
        expectedDate: "23/03/2024",
        status: "shipped",
        paymentMethod: "MOMO",
        note: "",
        items: [
            {
                id: 4,
                quantity: 2,
                product: {
                    id: 204,
                    name: "Thịt heo hữu cơ",
                    price: 89000,
                    discountPercentage: 0,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "500g",
                    expiredDate: "10/04/2024",
                    status: "active",
                },
            },
        ],
        shippingAddress: {
            id: 2,
            name: "Nguyễn Văn An",
            numberPhone: "(+84) 987654321",
            provinceId: 4,
            districtId: 5,
            wardId: 6,
            provinceName: "Hồ Chí Minh",
            districtName: "Quận 1",
            wardName: "Phường Bến Nghé",
            detailAddress: "123 Đường Lê Lợi",
            default: true,
        },
    },
    {
        id: 3,
        orderNumber: "ORD-20240315-5421",
        date: "15/03/2024, 14:20",
        totalPrice: 65000,
        shippingFee: 30000,
        expectedDate: "",
        status: "cancelled",
        paymentMethod: "CREDIT_CARD",
        note: "Khách hàng hủy đơn vì đổi ý",
        items: [
            {
                id: 5,
                quantity: 1,
                product: {
                    id: 205,
                    name: "Sữa tươi hữu cơ",
                    price: 65000,
                    discountPercentage: 0,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "1L",
                    expiredDate: "20/05/2024",
                    status: "active",
                },
            },
        ],
        shippingAddress: {
            id: 3,
            name: "Trần Thị Bình",
            numberPhone: "(+84) 123456789",
            provinceId: 7,
            districtId: 8,
            wardId: 9,
            provinceName: "Hà Nội",
            districtName: "Quận Hoàn Kiếm",
            wardName: "Phường Hàng Bài",
            detailAddress: "456 Đường Nguyễn Huệ",
            default: true,
        },
    },
    {
        id: 4,
        orderNumber: "ORD-20240310-4321",
        date: "10/03/2024, 11:45",
        totalPrice: 320000,
        shippingFee: 30000,
        expectedDate: "15/03/2024",
        status: "processing",
        paymentMethod: "BANK_TRANSFER",
        note: "",
        items: [
            {
                id: 6,
                quantity: 2,
                product: {
                    id: 206,
                    name: "Gạo hữu cơ",
                    price: 160000,
                    discountPercentage: 5,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "5kg",
                    expiredDate: "31/12/2024",
                    status: "active",
                },
            },
        ],
        shippingAddress: {
            id: 4,
            name: "Phạm Văn Cường",
            numberPhone: "(+84) 912345678",
            provinceId: 10,
            districtId: 11,
            wardId: 12,
            provinceName: "Đà Nẵng",
            districtName: "Quận Hải Châu",
            wardName: "Phường Thạch Thang",
            detailAddress: "789 Đường Trần Hưng Đạo",
            default: true,
        },
    },
    {
        id: 5,
        orderNumber: "ORD-20240305-3210",
        date: "05/03/2024, 16:30",
        totalPrice: 95000,
        shippingFee: 30000,
        expectedDate: "",
        status: "pending",
        paymentMethod: "COD",
        note: "",
        items: [
            {
                id: 7,
                quantity: 1,
                product: {
                    id: 207,
                    name: "Trứng gà hữu cơ",
                    price: 45000,
                    discountPercentage: 0,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "10 quả",
                    expiredDate: "15/04/2024",
                    status: "active",
                },
            },
            {
                id: 8,
                quantity: 2,
                product: {
                    id: 208,
                    name: "Rau xà lách hữu cơ",
                    price: 25000,
                    discountPercentage: 0,
                    thumbnailUrl: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                    unit: "300g",
                    expiredDate: "10/04/2024",
                    status: "active",
                },
            },
        ],
        shippingAddress: {
            id: 5,
            name: "Võ Thị Dung",
            numberPhone: "(+84) 867543210",
            provinceId: 13,
            districtId: 14,
            wardId: 15,
            provinceName: "Huế",
            districtName: "Thành phố Huế",
            wardName: "Phường Phú Hội",
            detailAddress: "101 Đường Lê Duẩn",
            default: true,
        },
    },
]

// Lấy danh sách đơn hàng với bộ lọc và phân trang
export const getOrders = async (
    filters: OrderFilters = {},
    sort: OrderSortOptions = { field: "date", direction: "desc" },
    pagination: Partial<OrderPagination> = { page: 1, limit: 10 },
): Promise<{ data: Order[]; pagination: OrderPagination }> => {
    const response = await getAllOrders();
    const data = response?.data.items;
    sampleOrders = data;
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredOrders = [...data]

            // Áp dụng bộ lọc
            if (filters.status) {
                filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
            }

            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase()
                filteredOrders = filteredOrders.filter(
                    (order) =>
                        order.orderNumber.toLowerCase().includes(query) ||
                        order.shippingAddress.name.toLowerCase().includes(query) ||
                        order.items.some((item) => item.product.name.toLowerCase().includes(query)),
                )
            }

            if (filters.startDate && filters.endDate) {
                const start = new Date(filters.startDate)
                const end = new Date(filters.endDate)

                filteredOrders = filteredOrders.filter((order) => {
                    const orderDate = new Date(order.date.split(",")[0].split("/").reverse().join("-"))
                    return orderDate >= start && orderDate <= end
                })
            }

            // Sắp xếp
            filteredOrders.sort((a, b) => {
                if (sort.field === "date") {
                    const dateA = new Date(a.date.split(",")[0].split("/").reverse().join("-"))
                    const dateB = new Date(b.date.split(",")[0].split("/").reverse().join("-"))
                    return sort.direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
                } else if (sort.field === "total") {
                    return sort.direction === "asc" ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice
                } else if (sort.field === "orderNumber") {
                    return sort.direction === "asc"
                        ? a.orderNumber.localeCompare(b.orderNumber)
                        : b.orderNumber.localeCompare(a.orderNumber)
                }
                return 0
            })

            // Phân trang
            const page = pagination.page || 1
            const limit = pagination.limit || 10
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

            resolve({
                data: paginatedOrders,
                pagination: {
                    page,
                    limit,
                    total: filteredOrders.length,
                },
            })
        }, 500)
    })
}

// Lấy chi tiết đơn hàng
export const getOrderById = async (id: number): Promise<Order | null> => {
    // Giả lập API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const order = sampleOrders.find((order) => order.id === id) || null
            resolve(order)
        }, 300)
    })
}

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (update: OrderStatusUpdate): Promise<Order> => {
    const request: OrderStatusUpdateRequest = {
        status:  update.status
    }
    console.log("request", request)
    const response = await api.patch(`/order/${update.orderId}`,request , {
        withCredentials: true,
    });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const orderIndex = sampleOrders.findIndex((order) => order.id === update.orderId)

            if (orderIndex === -1) {
                reject(new Error("Không tìm thấy đơn hàng"))
                return
            }

            const updatedOrder = {
                ...sampleOrders[orderIndex],
                status: update.status,
                note: update.notes || sampleOrders[orderIndex].note,
            }

            sampleOrders[orderIndex] = updatedOrder
            resolve(updatedOrder)
        }, 500)
    })
}

// Xuất hóa đơn
export const generateInvoice = async (orderId: number): Promise<string> => {
    // Giả lập API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://example.com/invoices/${orderId}.pdf`)
        }, 1000)
    })
}
