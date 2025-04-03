"use client"

import { Edit, Trash2, Tag, Calendar } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import type { ProductVariant } from "../../../types/product"
import { formatCurrency } from "../../../ultils/product-utils"

interface ProductVariantCardProps {
    variant: ProductVariant
    index: number
    isEditMode: boolean
    onEdit: (variant: ProductVariant, index: number) => void
    onDelete: (index: number) => void
}

export const ProductVariantCard = ({ variant, index, isEditMode, onEdit, onDelete }: ProductVariantCardProps) => {
    console.log(variant)
    return (
        <Card key={variant.id}>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-[100px]">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                            <img
                                src={variant.thumbnailUrl || "/placeholder.svg"}
                                alt={variant.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h4 className="font-medium">{variant.name}</h4>
                            <Badge variant={variant.status === "AVAILABLE" ? "success" : "secondary"}>
                                {variant.status === "AVAILABLE" ? "Đang bán" : "Ngừng bán"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex items-center">
                                <Tag className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">Đơn vị: {variant.unit}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">
                  HSD: {new Date(variant.expiredDate).toLocaleDateString("vi-VN")}
                </span>
                            </div>
                        </div>

                        <div className="mt-2 flex flex-col md:flex-row md:items-end justify-between">
                            <div>
                                <div className="font-bold text-lg text-gray-900">{formatCurrency(variant.price)}</div>
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

