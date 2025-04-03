"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../../components/ui/pagination"

interface ProductPaginationProps {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
    onItemsPerPageChange: (value: number) => void
}

export const ProductPagination = ({
                                      totalItems,
                                      itemsPerPage,
                                      currentPage,
                                      onPageChange,
                                      onItemsPerPageChange,
                                  }: ProductPaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">
                    Hiển thị {indexOfFirstItem}-{indexOfLastItem} trên {totalItems} sản phẩm
                </p>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number.parseInt(value))}>
                    <SelectTrigger className="w-[110px] h-8">
                        <SelectValue placeholder="10 / trang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 / trang</SelectItem>
                        <SelectItem value="10">10 / trang</SelectItem>
                        <SelectItem value="20">20 / trang</SelectItem>
                        <SelectItem value="50">50 / trang</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber: number

                        if (totalPages <= 5) {
                            pageNumber = i + 1
                        } else if (currentPage <= 3) {
                            pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i
                        } else {
                            pageNumber = currentPage - 2 + i
                        }

                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink isActive={pageNumber === currentPage} onClick={() => onPageChange(pageNumber)}>
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

