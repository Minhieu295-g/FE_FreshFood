"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    Search,
    Filter,
    ChevronDown,
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Eye,
    Download,
    ShoppingBag,
    Calendar,
    Truck,
    RefreshCw,
    Loader2,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"

// Order status types
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"

// Order interface
interface OrderItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
    variant?: string
}

interface Order {
    id: string
    orderNumber: string
    date: string
    total: number
    status: OrderStatus
    paymentMethod: string
    paymentStatus: "paid" | "pending" | "failed"
    items: OrderItem[]
    shippingAddress: {
        name: string
        phone: string
        address: string
        city: string
        district: string
        ward: string
    }
    trackingNumber?: string
    estimatedDelivery?: string
}

// Status configuration for visual elements
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="h-4 w-4" />,
    },
    processing: {
        label: "Đang xử lý",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <RefreshCw className="h-4 w-4" />,
    },
    shipped: {
        label: "Đang giao hàng",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <Truck className="h-4 w-4" />,
    },
    delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="h-4 w-4" />,
    },
    returned: {
        label: "Đã trả hàng",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <AlertTriangle className="h-4 w-4" />,
    },
}

// Sample data for demonstration
const sampleOrders: Order[] = [
    {
        id: "1",
        orderNumber: "ORD-20240325-7812",
        date: "25/03/2024, 15:30",
        total: 245000,
        status: "delivered",
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        paymentStatus: "paid",
        items: [
            {
                id: 1,
                name: "Set 3 cuộn túi đựng rác tự phân hủy sinh học",
                price: 9500,
                quantity: 2,
                image: "https://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg",
                variant: "Set - 3 cuộn",
            },
            {
                id: 2,
                name: "Rau cải ngọt hữu cơ (500g)",
                price: 35000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728028836/ripempxa3z48aqc1clfa.jpg",
                variant: "Gói 500g",
            },
            {
                id: 3,
                name: "Táo Envy New Zealand size 70-80 (1kg)",
                price: 185000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 1kg",
            },
        ],
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
        trackingNumber: "VNPOST123456789",
        estimatedDelivery: "28/03/2024",
    },
    {
        id: "2",
        orderNumber: "ORD-20240320-6543",
        date: "20/03/2024, 09:15",
        total: 178000,
        status: "shipped",
        paymentMethod: "Ví MoMo",
        paymentStatus: "paid",
        items: [
            {
                id: 4,
                name: "Thịt heo hữu cơ (500g)",
                price: 89000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Gói 500g",
            },
        ],
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
        trackingNumber: "VNPOST987654321",
        estimatedDelivery: "23/03/2024",
    },
    {
        id: "3",
        orderNumber: "ORD-20240315-5421",
        date: "15/03/2024, 14:20",
        total: 65000,
        status: "cancelled",
        paymentMethod: "Thẻ tín dụng/ghi nợ",
        paymentStatus: "failed",
        items: [
            {
                id: 5,
                name: "Sữa tươi hữu cơ (1L)",
                price: 65000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 1L",
            },
        ],
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
    },
    {
        id: "4",
        orderNumber: "ORD-20240310-4321",
        date: "10/03/2024, 11:45",
        total: 320000,
        status: "processing",
        paymentMethod: "Chuyển khoản ngân hàng",
        paymentStatus: "paid",
        items: [
            {
                id: 6,
                name: "Gạo hữu cơ (5kg)",
                price: 160000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Túi 5kg",
            },
        ],
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
        estimatedDelivery: "15/03/2024",
    },
    {
        id: "5",
        orderNumber: "ORD-20240305-3210",
        date: "05/03/2024, 16:30",
        total: 95000,
        status: "pending",
        paymentMethod: "Thanh toán khi nhận hàng (COD)",
        paymentStatus: "pending",
        items: [
            {
                id: 7,
                name: "Trứng gà hữu cơ (10 quả)",
                price: 45000,
                quantity: 1,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Hộp 10 quả",
            },
            {
                id: 8,
                name: "Rau xà lách hữu cơ (300g)",
                price: 25000,
                quantity: 2,
                image: "http://res.cloudinary.com/digtjnoh3/image/upload/v1728029282/rcu73vzqfa39rvsxdgja.jpg",
                variant: "Gói 300g",
            },
        ],
        shippingAddress: {
            name: "Lê Minh Hiếu",
            phone: "(+84) 345778312",
            address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
            city: "An Giang",
            district: "Huyện An Phú",
            ward: "Thị Trấn An Phú",
        },
    },
]

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("date-desc")
    const [timeFilter, setTimeFilter] = useState("all-time")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Fetch orders (simulated)
    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            // Simulate API call
            setTimeout(() => {
                setOrders(sampleOrders)
                setFilteredOrders(sampleOrders)
                setIsLoading(false)
            }, 1000)
        }

        fetchOrders()
    }, [])

    // Filter orders based on active tab, search query, and time filter
    useEffect(() => {
        let result = [...orders]

        // Filter by status tab
        if (activeTab !== "all") {
            result = result.filter((order) => order.status === activeTab)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(query) ||
                    order.items.some((item) => item.name.toLowerCase().includes(query)),
            )
        }

        // Filter by time
        const now = new Date()
        if (timeFilter === "last-month") {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            result = result.filter((order) => new Date(order.date.split(",")[0].split("/").reverse().join("-")) >= lastMonth)
        } else if (timeFilter === "last-3-months") {
            const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
            result = result.filter(
                (order) => new Date(order.date.split(",")[0].split("/").reverse().join("-")) >= last3Months,
            )
        } else if (timeFilter === "last-6-months") {
            const last6Months = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
            result = result.filter(
                (order) => new Date(order.date.split(",")[0].split("/").reverse().join("-")) >= last6Months,
            )
        }

        // Sort orders
        result.sort((a, b) => {
            const dateA = new Date(a.date.split(",")[0].split("/").reverse().join("-"))
            const dateB = new Date(b.date.split(",")[0].split("/").reverse().join("-"))

            if (sortBy === "date-desc") {
                return dateB.getTime() - dateA.getTime()
            } else if (sortBy === "date-asc") {
                return dateA.getTime() - dateB.getTime()
            } else if (sortBy === "total-desc") {
                return b.total - a.total
            } else if (sortBy === "total-asc") {
                return a.total - b.total
            }

            return 0
        })

        setFilteredOrders(result)
    }, [orders, activeTab, searchQuery, timeFilter, sortBy])

    // Get count of orders by status
    const getStatusCount = (status: string) => {
        if (status === "all") return orders.length
        return orders.filter((order) => order.status === status).length
    }

    // Reset all filters
    const resetFilters = () => {
        setActiveTab("all")
        setSearchQuery("")
        setTimeFilter("all-time")
        setSortBy("date-desc")
        setShowFilters(false)
    }

    // Handle order selection for details view
    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
                        <p className="mt-1 text-gray-600">Xem và quản lý tất cả đơn hàng của bạn</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1.5"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4" />
                            Bộ lọc
                            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </Button>

                        <Link to="/shop">
                            <Button size="sm" className="w-full sm:w-auto flex items-center gap-1.5">
                                <ShoppingBag className="h-4 w-4" />
                                Tiếp tục mua sắm
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6 border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn thời gian" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-time">Tất cả thời gian</SelectItem>
                                            <SelectItem value="last-month">Tháng trước</SelectItem>
                                            <SelectItem value="last-3-months">3 tháng gần đây</SelectItem>
                                            <SelectItem value="last-6-months">6 tháng gần đây</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Sắp xếp theo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date-desc">Mới nhất trước</SelectItem>
                                            <SelectItem value="date-asc">Cũ nhất trước</SelectItem>
                                            <SelectItem value="total-desc">Giá trị cao nhất</SelectItem>
                                            <SelectItem value="total-asc">Giá trị thấp nhất</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Tìm theo mã đơn hàng hoặc sản phẩm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                        {searchQuery && (
                                            <button
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button variant="ghost" size="sm" onClick={resetFilters}>
                                    Đặt lại bộ lọc
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-2">
                        <TabsTrigger value="all" className="relative">
                            Tất cả
                            <Badge variant="secondary" className="ml-1.5">
                                {getStatusCount("all")}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="relative">
                            Chờ xác nhận
                            {getStatusCount("pending") > 0 && (
                                <Badge variant="secondary" className="ml-1.5">
                                    {getStatusCount("pending")}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="processing" className="relative">
                            Đang xử lý
                            {getStatusCount("processing") > 0 && (
                                <Badge variant="secondary" className="ml-1.5">
                                    {getStatusCount("processing")}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="shipped" className="relative">
                            Đang giao
                            {getStatusCount("shipped") > 0 && (
                                <Badge variant="secondary" className="ml-1.5">
                                    {getStatusCount("shipped")}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="delivered" className="relative">
                            Đã giao
                            {getStatusCount("delivered") > 0 && (
                                <Badge variant="secondary" className="ml-1.5">
                                    {getStatusCount("delivered")}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="relative">
                            Đã hủy
                            {getStatusCount("cancelled") > 0 && (
                                <Badge variant="secondary" className="ml-1.5">
                                    {getStatusCount("cancelled")}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-0">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
                                <p className="text-gray-600">Đang tải đơn hàng...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? "Không tìm thấy đơn hàng phù hợp với tìm kiếm của bạn."
                                        : "Bạn chưa có đơn hàng nào trong danh mục này."}
                                </p>
                                {searchQuery && (
                                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                                        Xóa tìm kiếm
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        formatCurrency={formatCurrency}
                                        onViewDetails={() => handleViewOrderDetails(order)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Pagination (simplified) */}
                {filteredOrders.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-1">
                            <Button variant="outline" size="sm" disabled>
                                Trước
                            </Button>
                            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                Sau
                            </Button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Order details dialog */}
            {selectedOrder && (
                <OrderDetailsDialog
                    order={selectedOrder}
                    formatCurrency={formatCurrency}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    )
}

// Order Card Component
interface OrderCardProps {
    order: Order
    formatCurrency: (amount: number) => string
    onViewDetails: () => void
}

const OrderCard = ({ order, formatCurrency, onViewDetails }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false)
    const status = statusConfig[order.status]

    // Show only first 2 items by default
    const displayItems = expanded ? order.items : order.items.slice(0, 2)
    const hasMoreItems = order.items.length > 2

    return (
        <Card className="border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Order header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">Đơn hàng #{order.orderNumber}</h3>
                            <Badge className={`${status.color} border`}>
                <span className="flex items-center gap-1">
                  {status.icon}
                    {status.label}
                </span>
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {order.date}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                        <Button variant="outline" size="sm" onClick={onViewDetails}>
                            <Eye className="h-4 w-4 mr-1.5" />
                            Chi tiết
                        </Button>
                    </div>
                </div>
            </div>

            {/* Order items */}
            <CardContent className="p-4">
                <div className="space-y-3">
                    {displayItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                {item.variant && <p className="text-xs text-gray-500">Loại: {item.variant}</p>}
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-gray-700">
                                        {formatCurrency(item.price)} x {item.quantity}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {hasMoreItems && (
                        <button
                            className="w-full py-2 text-sm text-green-600 hover:text-green-700 flex items-center justify-center"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                    Xem thêm {order.items.length - 2} sản phẩm
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Order actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {order.status === "delivered" && (
                        <Button variant="outline" size="sm" className="text-xs">
                            Đánh giá sản phẩm
                        </Button>
                    )}

                    {(order.status === "shipped" || order.status === "delivered") && (
                        <Button variant="outline" size="sm" className="text-xs">
                            Theo dõi đơn hàng
                        </Button>
                    )}

                    {order.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50">
                            Hủy đơn hàng
                        </Button>
                    )}

                    <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Hóa đơn
                    </Button>

                    {order.status === "delivered" && (
                        <Button variant="outline" size="sm" className="text-xs">
                            Mua lại
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

// Order Details Dialog Component
interface OrderDetailsDialogProps {
    order: Order
    formatCurrency: (amount: number) => string
    onClose: () => void
}

const OrderDetailsDialog = ({ order, formatCurrency, onClose }: OrderDetailsDialogProps) => {
    const status = statusConfig[order.status]

    // Calculate subtotal
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = 30000

    return (
        <Dialog open={true} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Chi tiết đơn hàng #{order.orderNumber}</span>
                        <Badge className={`${status.color} border`}>
              <span className="flex items-center gap-1">
                {status.icon}
                  {status.label}
              </span>
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin đơn hàng</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Mã đơn hàng:</span>
                                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Ngày đặt hàng:</span>
                                    <span className="text-gray-900">{order.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Trạng thái:</span>
                                    <span className="flex items-center gap-1">
                    {status.icon}
                                        <span className="font-medium">{status.label}</span>
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Phương thức thanh toán:</span>
                                    <span className="text-gray-900">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Trạng thái thanh toán:</span>
                                    <Badge
                                        variant={
                                            order.paymentStatus === "paid"
                                                ? ("success" as "destructive")
                                                : order.paymentStatus === "pending"
                                                    ? ("warning" as "secondary")
                                                    : "destructive"
                                        }
                                    >
                                        {order.paymentStatus === "paid"
                                            ? "Đã thanh toán"
                                            : order.paymentStatus === "pending"
                                                ? "Chờ thanh toán"
                                                : "Thất bại"}
                                    </Badge>

                                </div>
                                {order.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Mã vận đơn:</span>
                                        <span className="text-gray-900">{order.trackingNumber}</span>
                                    </div>
                                )}
                                {order.estimatedDelivery && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Ngày giao dự kiến:</span>
                                        <span className="text-gray-900">{order.estimatedDelivery}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                <p className="text-gray-700">{order.shippingAddress.phone}</p>
                                <p className="text-gray-700 mt-1">
                                    {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
                                    {order.shippingAddress.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order items */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Sản phẩm đã đặt</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Sản phẩm
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Đơn giá
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Số lượng
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Thành tiền
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        {item.variant && <div className="text-xs text-gray-500">Loại: {item.variant}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Order summary */}
                            <div className="border-t border-gray-200 px-4 py-4">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-gray-900">Tổng cộng:</span>
                                    <span className="font-bold text-lg text-green-600">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order actions */}
                    <div className="flex flex-wrap gap-3 justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>

                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-1.5" />
                            Tải hóa đơn
                        </Button>

                        {order.status === "shipped" && (
                            <Button>
                                <Truck className="h-4 w-4 mr-1.5" />
                                Theo dõi đơn hàng
                            </Button>
                        )}

                        {order.status === "delivered" && (
                            <Button>
                                <ShoppingBag className="h-4 w-4 mr-1.5" />
                                Mua lại
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OrderHistory

