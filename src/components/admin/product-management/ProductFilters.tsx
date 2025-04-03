"use client"

import { Search, X } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { Category } from "../../../types/category"

interface ProductFiltersProps {
    searchQuery: string
    setSearchQuery: (value: string) => void
    categoryFilter: string
    setCategoryFilter: (value: string) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
    sortBy: string
    setSortBy: (value: string) => void
    resetFilters: () => void
    categories: Category[]
}

export const ProductFilters = ({
                                   searchQuery,
                                   setSearchQuery,
                                   categoryFilter,
                                   setCategoryFilter,
                                   statusFilter,
                                   setStatusFilter,
                                   sortBy,
                                   setSortBy,
                                   resetFilters,
                                   categories,
                               }: ProductFiltersProps) => {
    return (
        <Card className="mb-6 border-gray-200 shadow-sm">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả danh mục</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="active">Đang bán</SelectItem>
                                <SelectItem value="inactive">Ngừng bán</SelectItem>
                                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                                <SelectItem value="name-desc">Tên Z-A</SelectItem>
                                <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                                <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm theo tên sản phẩm"
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

                <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Đặt lại bộ lọc
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

