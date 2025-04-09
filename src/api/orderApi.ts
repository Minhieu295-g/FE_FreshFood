import api from "./api";
import {OrderRequest, OrderResponse} from "../types/order";
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

// Mẫu dữ liệu để demo
const sampleOrders: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-20240325-7812",
        date: "25/03/2024, 15:30",
        total: 245000,
        status: "delivered",
        paymentMethod: "cod",
        paymentStatus: "paid",
        items: [
            {
                id: 1,
                name: "Set 3 cuộn túi đựng rác tự phân hủy sinh học",
                price: 9500,
                quantity: 2,
                image: "https://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg",
                variant: "Set - 3 cuộn",
                productId: 101,
                variantId: 201,
            },
            {
                id: 2,
                name: "Rau cải ngọt hữu cơ (500g)",
                price: 35000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728028836/ripempxa3z48aqc1clfa.jpg",
                variant: "Gói 500g",
                productId: 102,
                variantId: 202,
            },
            {
                id: 3,
                name: "Táo Envy New Zealand size 70-80 (1kg)",
                price: 185000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 1kg",
                productId: 103,
                variantId: 203,
            },
        ],
        shippingAddress: {
            id: 1,
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
            isDefault: true,
        },
        trackingNumber: "VNPOST123456789",
        estimatedDelivery: "28/03/2024",
        userId: 1001,
        userName: "Lê Minh Hiếu",
        userEmail: "hieu.le@example.com",
    },
    {
        id: "2",
        orderNumber: "ORD-20240320-6543",
        date: "20/03/2024, 09:15",
        total: 178000,
        status: "shipped",
        paymentMethod: "momo",
        paymentStatus: "paid",
        items: [
            {
                id: 4,
                name: "Thịt heo hữu cơ (500g)",
                price: 89000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Gói 500g",
                productId: 104,
                variantId: 204,
            },
        ],
        shippingAddress: {
            id: 2,
            name: "Nguyễn Văn An",
            phone: "(+84) 987654321",
            address: "123 Đường Lê Lợi",
            city: "Hồ Chí Minh",
            district: "Quận 1",
            ward: "Phường Bến Nghé",
            isDefault: true,
        },
        trackingNumber: "VNPOST987654321",
        estimatedDelivery: "23/03/2024",
        userId: 1002,
        userName: "Nguyễn Văn An",
        userEmail: "an.nguyen@example.com",
    },
    {
        id: "3",
        orderNumber: "ORD-20240315-5421",
        date: "15/03/2024, 14:20",
        total: 65000,
        status: "cancelled",
        paymentMethod: "credit_card",
        paymentStatus: "failed",
        items: [
            {
                id: 5,
                name: "Sữa tươi hữu cơ (1L)",
                price: 65000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 1L",
                productId: 105,
                variantId: 205,
            },
        ],
        shippingAddress: {
            id: 3,
            name: "Trần Thị Bình",
            phone: "(+84) 123456789",
            address: "456 Đường Nguyễn Huệ",
            city: "Hà Nội",
            district: "Quận Hoàn Kiếm",
            ward: "Phường Hàng Bài",
            isDefault: true,
        },
        userId: 1003,
        userName: "Trần Thị Bình",
        userEmail: "binh.tran@example.com",
        notes: "Khách hàng hủy đơn vì đổi ý",
    },
    {
        id: "4",
        orderNumber: "ORD-20240310-4321",
        date: "10/03/2024, 11:45",
        total: 320000,
        status: "processing",
        paymentMethod: "bank_transfer",
        paymentStatus: "paid",
        items: [
            {
                id: 6,
                name: "Gạo hữu cơ (5kg)",
                price: 160000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Túi 5kg",
                productId: 106,
                variantId: 206,
            },
        ],
        shippingAddress: {
            id: 4,
            name: "Phạm Văn Cường",
            phone: "(+84) 912345678",
            address: "789 Đường Trần Hưng Đạo",
            city: "Đà Nẵng",
            district: "Quận Hải Châu",
            ward: "Phường Thạch Thang",
            isDefault: true,
        },
        estimatedDelivery: "15/03/2024",
        userId: 1004,
        userName: "Phạm Văn Cường",
        userEmail: "cuong.pham@example.com",
    },
    {
        id: "5",
        orderNumber: "ORD-20240305-3210",
        date: "05/03/2024, 16:30",
        total: 95000,
        status: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
        items: [
            {
                id: 7,
                name: "Trứng gà hữu cơ (10 quả)",
                price: 45000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 10 quả",
                productId: 107,
                variantId: 207,
            },
            {
                id: 8,
                name: "Rau xà lách hữu cơ (300g)",
                price: 25000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Gói 300g",
                productId: 108,
                variantId: 208,
            },
        ],
        shippingAddress: {
            id: 5,
            name: "Võ Thị Dung",
            phone: "(+84) 867543210",
            address: "101 Đường Lê Duẩn",
            city: "Huế",
            district: "Thành phố Huế",
            ward: "Phường Phú Hội",
            isDefault: true,
        },
        userId: 1005,
        userName: "Võ Thị Dung",
        userEmail: "dung.vo@example.com",
    },
]

// Lấy danh sách đơn hàng với bộ lọc và phân trang
export const getOrders = async (
    filters: OrderFilters = {},
    sort: OrderSortOptions = { field: "date", direction: "desc" },
    pagination: Partial<OrderPagination> = { page: 1, limit: 10 },
): Promise<{ data: Order[]; pagination: OrderPagination }> => {
    // Giả lập API call
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredOrders = [...sampleOrders]

            // Áp dụng bộ lọc
            if (filters.status) {
                filteredOrders = filteredOrders.filter((order) => order.status === filters.status)
            }

            if (filters.paymentStatus) {
                filteredOrders = filteredOrders.filter((order) => order.paymentStatus === filters.paymentStatus)
            }

            if (filters.paymentMethod) {
                filteredOrders = filteredOrders.filter((order) => order.paymentMethod === filters.paymentMethod)
            }

            if (filters.userId) {
                filteredOrders = filteredOrders.filter((order) => order.userId === filters.userId)
            }

            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase()
                filteredOrders = filteredOrders.filter(
                    (order) =>
                        order.orderNumber.toLowerCase().includes(query) ||
                        order.userName.toLowerCase().includes(query) ||
                        order.userEmail.toLowerCase().includes(query) ||
                        order.items.some((item) => item.name.toLowerCase().includes(query)),
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
                    return sort.direction === "asc" ? a.total - b.total : b.total - a.total
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
export const getOrderById = async (id: string): Promise<Order | null> => {
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
    // Giả lập API call
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
                adminNotes: update.notes || sampleOrders[orderIndex].adminNotes,
            }

            sampleOrders[orderIndex] = updatedOrder
            resolve(updatedOrder)
        }, 500)
    })
}

// Xuất hóa đơn
export const generateInvoice = async (orderId: string): Promise<string> => {
    // Giả lập API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`https://example.com/invoices/${orderId}.pdf`)
        }, 1000)
    })
}

