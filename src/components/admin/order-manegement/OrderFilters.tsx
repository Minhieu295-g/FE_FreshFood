"use client"

import { useState } from "react"
import { Search, X, Calendar } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { OrderFilters as OrderFiltersType, OrderStatus, PaymentStatus, PaymentMethod } from "../../../types/order"
import { statusConfig, paymentStatusConfig, paymentMethodConfig } from "../../../types/order"

interface OrderFiltersProps {
    filters: OrderFiltersType
    onFilterChange: (filters: OrderFiltersType) => void
    onResetFilters: () => void
}

export const OrderFilters = ({ filters, onFilterChange, onResetFilters }: OrderFiltersProps) => {
    const [startDate, setStartDate] = useState(filters.startDate || "")
    const [endDate, setEndDate] = useState(filters.endDate || "")
    const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "")

    const handleApplyFilters = () => {
        onFilterChange({
            ...filters,
            startDate,
            endDate,
            searchQuery,
        })
    }

    const handleStatusChange = (value: string) => {
        onFilterChange({
            ...filters,
            status: value === "all" ? undefined : (value as OrderStatus),
        })
    }

    const handlePaymentStatusChange = (value: string) => {
        onFilterChange({
            ...filters,
            paymentStatus: value === "all" ? undefined : (value as PaymentStatus),
        })
    }

    const handlePaymentMethodChange = (value: string) => {
        onFilterChange({
            ...filters,
            paymentMethod: value === "all" ? undefined : (value as PaymentMethod),
        })
    }

    return (
        <Card className="mb-6 border-gray-200 shadow-sm">
        <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
    <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder="Chọn trạng thái" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="all">Tất cả trạng thái</SelectItem>
    {Object.entries(statusConfig).map(([key, value]) => (
        <SelectItem key={key} value={key}>
        {value.label}
        </SelectItem>
    ))}
    </SelectContent>
    </Select>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán</label>
    <Select value={filters.paymentStatus || "all"} onValueChange={handlePaymentStatusChange}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder="Chọn trạng thái thanh toán" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="all">Tất cả trạng thái</SelectItem>
    {Object.entries(paymentStatusConfig).map(([key, value]) => (
        <SelectItem key={key} value={key}>
        {value.label}
        </SelectItem>
    ))}
    </SelectContent>
    </Select>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
    <Select value={filters.paymentMethod || "all"} onValueChange={handlePaymentMethodChange}>
    <SelectTrigger className="w-full">
    <SelectValue placeholder="Chọn phương thức thanh toán" />
    </SelectTrigger>
    <SelectContent>
    <SelectItem value="all">Tất cả phương thức</SelectItem>
    {Object.entries(paymentMethodConfig).map(([key, value]) => (
        <SelectItem key={key} value={key}>
        {value.label}
        </SelectItem>
    ))}
    </SelectContent>
    </Select>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
    <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
        placeholder="Mã đơn, tên khách hàng, email..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
        />
        {searchQuery && (
            <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    onClick={() => setSearchQuery("")}
>
    <X className="h-4 w-4" />
        </button>
)}
    </div>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
    <div className="grid grid-cols-2 gap-2">
    <div className="relative">
    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-10" />
        </div>
        <div className="relative">
    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-10" />
        </div>
        </div>
        </div>

        <div className="flex items-end justify-end gap-2">
    <Button variant="outline" size="sm" onClick={onResetFilters}>
        Đặt lại bộ lọc
    </Button>
    <Button size="sm" onClick={handleApplyFilters}>
        Áp dụng
    </Button>
    </div>
    </div>
    </CardContent>
    </Card>
)
}

