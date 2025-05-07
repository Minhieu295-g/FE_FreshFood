"use client"

import React, { useState, useEffect } from "react"
import { Filter, ChevronDown, Package, RefreshCw } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { OrderFilters } from "./OrderFilters"
import { OrderTable } from "./OrderTable"
import { OrderDetails } from "./OrderDetails"
import { OrderStatusUpdate } from "./OrderStatusUpdate"
import { OrderPagination } from "./OrderPagination"
import { Toast } from "./Toast"
import type {
    Order,
    OrderFilters as OrderFiltersType,
    OrderStatus,
    OrderPagination as OrderPaginationType,
} from "../../../types/order"
import {getOrders, getOrderById, updateOrderStatus, generateInvoice, sampleOrders} from "../../../api/orderApi"
import {Badge} from "../../ui/badge";

export const OrderManagement = () => {
    // State for orders
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showOrderDetails, setShowOrderDetails] = useState(false)
    const [showStatusUpdate, setShowStatusUpdate] = useState(false)

    // State for filters and pagination
    const [filters, setFilters] = useState<OrderFiltersType>({})
    const [activeTab, setActiveTab] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)
    const [pagination, setPagination] = useState<OrderPaginationType>({
        page: 1,
        limit: 10,
        total: 0,
    })

    // State for toast notifications
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "info" as "success" | "error" | "info",
    })

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }
    const getStatusCount = (status: string) => {
        if (status === "all") return sampleOrders.length
        return sampleOrders.filter((order) => order.status === status).length
    }
    // Fetch orders
    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            const result = await getOrders(
                filters,
                { field: "date", direction: "desc" },
                { page: pagination.page, limit: pagination.limit },
            )
            setOrders(result.data)
            setPagination(result.pagination)
        } catch (error) {
            console.error("Error fetching orders:", error)
            showToast("Có lỗi xảy ra khi tải danh sách đơn hàng", "error")
        } finally {
            setIsLoading(false)
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchOrders()
    }, [filters, pagination.page, pagination.limit])

    // Handle tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value)
        if (value === "all") {
            setFilters({ ...filters, status: undefined })
        } else {
            setFilters({ ...filters, status: value as OrderStatus })
        }
        setPagination({ ...pagination, page: 1 })
    }

    // Handle filter change
    const handleFilterChange = (newFilters: OrderFiltersType) => {
        setFilters(newFilters)
        setPagination({ ...pagination, page: 1 })
    }

    // Reset filters
    const resetFilters = () => {
        setFilters({})
        setActiveTab("all")
        setShowFilters(false)
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setPagination({ ...pagination, page })
    }

    // Handle items per page change
    const handleLimitChange = (limit: number) => {
        setPagination({ ...pagination, page: 1, limit })
    }

    // View order details
    const handleViewOrder = async (order: Order) => {
        try {
            const orderDetails = await getOrderById(order.id)
            if (orderDetails) {
                setSelectedOrder(orderDetails)
                setShowOrderDetails(true)
            }
        } catch (error) {
            console.error("Error fetching order details:", error)
            showToast("Có lỗi xảy ra khi tải chi tiết đơn hàng", "error")
        }
    }

    // Edit order status
    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order)
        setShowStatusUpdate(true)
    }

    // Update order status
    const handleUpdateStatus = async (orderId: number, status: OrderStatus, notes?: string) => {
        try {
            const updatedOrder = await updateOrderStatus({ orderId, status, notes })

            // Update order in list
            setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))

            // Update selected order if viewing details
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(updatedOrder)
            }

            showToast(`Đã cập nhật trạng thái đơn hàng thành ${getStatusLabel(status)}`, "success")
        } catch (error) {
            console.error("Error updating order status:", error)
            showToast("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng", "error")
        }
    }

    // Generate invoice
    const handleGenerateInvoice = async (orderId: number) => {
        try {
            setToast({
                show: true,
                message: "Đang tạo hóa đơn...",
                type: "info",
            })

            const invoiceUrl = await generateInvoice(orderId)

            // Open invoice in new tab
            window.open(invoiceUrl, "_blank")

            showToast("Đã tạo hóa đơn thành công", "success")
        } catch (error) {
            console.error("Error generating invoice:", error)
            showToast("Có lỗi xảy ra khi tạo hóa đơn", "error")
        }
    }

    // Show toast notification
    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToast({
            show: true,
            message,
            type,
        })

        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)
    }

    // Get status label
    const getStatusLabel = (status: OrderStatus): string => {
        const statusMap: Record<OrderStatus, string> = {
            pending: "Chờ xác nhận",
            processing: "Đang xử lý",
            shipped: "Đang giao hàng",
            delivered: "Đã giao hàng",
            cancelled: "Đã hủy",
            returned: "Đã trả hàng",
        }

        return statusMap[status] || status
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Page title and actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
                    <p className="text-gray-600 mt-1">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
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

                    <Button variant="outline" size="sm" className="flex items-center gap-1.5" onClick={fetchOrders}>
                        <RefreshCw className="h-4 w-4" />
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <OrderFilters filters={filters} onFilterChange={handleFilterChange} onResetFilters={resetFilters} />
            )}

            {/* Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
                <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-2">
                    <TabsTrigger value="all">Tất cả  <Badge variant="secondary" className="ml-1.5">
                        {getStatusCount("all")}
                    </Badge> </TabsTrigger>
                    <TabsTrigger value="pending">Chờ xác nhận   {getStatusCount("pending") > 0 && (
                        <Badge variant="secondary" className="ml-1.5">
                            {getStatusCount("pending")}
                        </Badge>
                    )} </TabsTrigger>
                    <TabsTrigger value="processing"> Đang xử lý {getStatusCount("processing") > 0 && (
                        <Badge variant="secondary" className="ml-1.5">
                            {getStatusCount("processing")}
                        </Badge>
                    )}</TabsTrigger>
                    <TabsTrigger value="shipped">  Đang giao {getStatusCount("shipped") > 0 && (
                        <Badge variant="secondary" className="ml-1.5">
                            {getStatusCount("shipped")}
                        </Badge>
                    )}</TabsTrigger>
                    <TabsTrigger value="delivered">Đã giao
                        {getStatusCount("delivered") > 0 && (
                            <Badge variant="secondary" className="ml-1.5">
                                {getStatusCount("delivered")}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">Đã hủy
                        {getStatusCount("cancelled") > 0 && (
                            <Badge variant="secondary" className="ml-1.5">
                                {getStatusCount("cancelled")}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="returned">Đã trả
                        {getStatusCount("returned") > 0 && (
                            <Badge variant="secondary" className="ml-1.5">
                                {getStatusCount("returned")}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                    {isLoading ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <RefreshCw className="h-10 w-10 text-green-500 animate-spin mb-4" />
                                    <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center justify-center py-12">
                                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
                                    <p className="text-gray-600 text-center max-w-md mb-6">
                                        {Object.keys(filters).length > 0
                                            ? "Không tìm thấy đơn hàng phù hợp với bộ lọc của bạn."
                                            : "Chưa có đơn hàng nào trong hệ thống."}
                                    </p>
                                    {Object.keys(filters).length > 0 && (
                                        <Button variant="outline" onClick={resetFilters}>
                                            Xóa bộ lọc
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <OrderTable
                            orders={orders}
                            onViewOrder={handleViewOrder}
                            onEditOrder={handleEditOrder}
                            onGenerateInvoice={handleGenerateInvoice}
                            formatCurrency={formatCurrency}
                        />
                    )}
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            {!isLoading && orders.length > 0 && (
                <OrderPagination pagination={pagination} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            )}

            {/* Order details dialog */}
            <OrderDetails
                order={selectedOrder}
                open={showOrderDetails}
                onOpenChange={setShowOrderDetails}
                onUpdateStatus={handleUpdateStatus}
                onGenerateInvoice={handleGenerateInvoice}
                formatCurrency={formatCurrency}
            />

            {/* Order status update dialog */}
            <OrderStatusUpdate
                order={selectedOrder}
                open={showStatusUpdate}
                onOpenChange={setShowStatusUpdate}
                onUpdateStatus={handleUpdateStatus}
            />

            {/* Toast notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    )
}
