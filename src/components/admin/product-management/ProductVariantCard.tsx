"use client"

import type React from "react"

import { Edit, Trash2, Upload } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import type { ProductVariant } from "../../../types/product"

interface ProductVariantCardProps {
    variant: ProductVariant
    index: number
    isEditMode: boolean
    onEdit: (variant: ProductVariant, index: number) => void
    onDelete: (index: number) => void
    onThumbnailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ProductVariantCard = ({
                                       variant,
                                       index,
                                       isEditMode,
                                       onEdit,
                                       onDelete,
                                       onThumbnailChange,
                                   }: ProductVariantCardProps) => {
    // Format price with Vietnamese currency
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(variant.price)

    // Map status to display text and color
    const statusMap: Record<string, { text: string; color: string }> = {
        active: { text: "Đang bán", color: "bg-green-100 text-green-800" },
        out_of_stock: { text: "Hết hàng", color: "bg-red-100 text-red-800" },
        discontinued: { text: "Ngừng kinh doanh", color: "bg-gray-100 text-gray-800" },
        pre_order: { text: "Đặt trước", color: "bg-blue-100 text-blue-800" },
        archived: { text: "Đã lưu trữ", color: "bg-yellow-100 text-yellow-800" },
    }

    const status = statusMap[variant.status] || { text: "Không xác định", color: "bg-gray-100 text-gray-800" }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-[100px] relative">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                            <img
                                src={variant.thumbnailUrl || "/placeholder.svg"}
                                alt={variant.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {isEditMode && onThumbnailChange && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onThumbnailChange}
                                    className="hidden"
                                    id={`variant-thumbnail-${variant.id}`}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => document.getElementById(`variant-thumbnail-${variant.id}`)?.click()}
                                >
                                    <Upload className="h-3 w-3 mr-1" />
                                    Chọn ảnh
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h4 className="font-medium">{variant.name}</h4>
                            <Badge className={status.color}>{status.text}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div>
                                <span className="font-medium">Đơn vị:</span> {variant.unit}
                            </div>
                            <div>
                                <span className="font-medium">Hạn sử dụng:</span>{" "}
                                {new Date(variant.expiredDate).toLocaleDateString("vi-VN")}
                            </div>
                        </div>

                        <div className="mt-2 flex flex-col md:flex-row md:items-end justify-between">
                            <div>
                                <div className="font-bold text-lg text-gray-900">{formattedPrice}</div>
                                {variant.discountPercentage > 0 && (
                                    <div className="text-sm text-green-600">Giảm {variant.discountPercentage}%</div>
                                )}
                            </div>

                            {isEditMode && (
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    <Button variant="outline" size="sm" onClick={() => onEdit(variant, index)}>
                                        <Edit className="h-4 w-4 mr-1" />
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => onDelete(index)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Xóa
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

