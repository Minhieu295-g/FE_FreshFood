"use client"

import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { OrderPagination as OrderPaginationType } from "../../../types/order"

interface OrderPaginationProps {
    pagination: OrderPaginationType
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}

export const OrderPagination = ({ pagination, onPageChange, onLimitChange }: OrderPaginationProps) => {
    const { page, limit, total } = pagination
    const totalPages = Math.ceil(total / limit)

    const handlePrevPage = () => {
        if (page > 1) {
            onPageChange(page - 1)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            onPageChange(page + 1)
        }
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages is less than max pages to show
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate start and end of page range
            let start = Math.max(2, page - 1)
            let end = Math.min(totalPages - 1, page + 1)

            // Adjust if we're at the beginning
            if (page <= 2) {
                end = 4
            }

            // Adjust if we're at the end
            if (page >= totalPages - 1) {
                start = totalPages - 3
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push("...")
            }

            // Add page numbers
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push("...")
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hiển thị</span>
                <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
                    <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">trên tổng số {total} đơn hàng</span>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
                    Trước
                </Button>

                {getPageNumbers().map((pageNum, index) =>
                        pageNum === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
                        ) : (
                            <Button
                                key={`page-${pageNum}`}
                                variant={pageNum === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => typeof pageNum === "number" && onPageChange(pageNum)}
                            >
                                {pageNum}
                            </Button>
                        ),
                )}

                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
                    Sau
                </Button>
            </div>
        </div>
    )
}

