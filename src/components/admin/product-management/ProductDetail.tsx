"use client"

import { Plus, Save, Upload, X } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Separator } from "../../../components/ui/separator"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { Product, ProductVariant } from "../../../types/product"
import type { Category} from "../../../types/category"
import { ProductVariantCard } from "./ProductVariantCard"
import { EmptyVariants } from "../../admin/product-management/EmptyVariants"

interface ProductDetailProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedProduct: Product | null
    isEditMode: boolean
    setIsEditMode: (value: boolean) => void
    setSelectedProduct: (product: Product | null) => void
    categories: Category[]
    onUpdate: () => void
    onAddVariant: () => void
    onEditVariant: (variant: ProductVariant, index: number) => void
    onDeleteVariant: (index: number) => void
}

export const ProductDetail = ({
                                  open,
                                  onOpenChange,
                                  selectedProduct,
                                  isEditMode,
                                  setIsEditMode,
                                  setSelectedProduct,
                                  categories,
                                  onUpdate,
                                  onAddVariant,
                                  onEditVariant,
                                  onDeleteVariant,
                              }: ProductDetailProps) => {
    if (!selectedProduct) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ width: "70vw", maxWidth: "1200px", height: "90vh" }}>
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Chỉnh sửa thông tin sản phẩm và các biến thể của sản phẩm"
                            : "Xem chi tiết thông tin sản phẩm và các biến thể của sản phẩm"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Product image */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-4">
                                        <img
                                            src={selectedProduct.thumbnailUrl || "/placeholder.svg"}
                                            alt={selectedProduct.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {isEditMode && (
                                        <div className="space-y-2">
                                            <Label htmlFor="thumbnailUrl">Ảnh đại diện</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="thumbnailUrl"
                                                    value={selectedProduct.thumbnailUrl}
                                                    onChange={(e) =>
                                                        setSelectedProduct({
                                                            ...selectedProduct,
                                                            thumbnailUrl: e.target.value,
                                                        })
                                                    }
                                                    placeholder="URL ảnh đại diện"
                                                />
                                                <Button variant="outline" size="icon">
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedProduct.productImages.map((image, index) => (
                                                <div key={image.id} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={image.imageUrl || "/placeholder.svg"}
                                                        alt={`Product image ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    {isEditMode && (
                                                        <button
                                                            className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                                                            onClick={() => {
                                                                const updatedImages = [...selectedProduct.productImages]
                                                                updatedImages.splice(index, 1)
                                                                setSelectedProduct({
                                                                    ...selectedProduct,
                                                                    productImages: updatedImages,
                                                                })
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditMode && (
                                                <button className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400">
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Product details */}
                        <div className="md:col-span-2">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Tên sản phẩm</Label>
                                            {isEditMode ? (
                                                <Input
                                                    id="name"
                                                    value={selectedProduct.name}
                                                    onChange={(e) =>
                                                        setSelectedProduct({
                                                            ...selectedProduct,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Nhập tên sản phẩm"
                                                />
                                            ) : (
                                                <div className="mt-1 text-gray-900 font-medium">{selectedProduct.name}</div>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Mô tả sản phẩm</Label>
                                            {isEditMode ? (
                                                <Textarea
                                                    id="description"
                                                    value={selectedProduct.description}
                                                    onChange={(e) =>
                                                        setSelectedProduct({
                                                            ...selectedProduct,
                                                            description: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Nhập mô tả sản phẩm"
                                                    rows={4}
                                                />
                                            ) : (
                                                <div className="mt-1 text-gray-700">{selectedProduct.description}</div>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="category">Danh mục</Label>
                                            {isEditMode ? (
                                                <Select
                                                    value={selectedProduct.category.id.toString()}
                                                    onValueChange={(value) => {
                                                        const category = categories.find((c) => c.id === Number.parseInt(value))
                                                        if (category) {
                                                            setSelectedProduct({
                                                                ...selectedProduct,
                                                                category,
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn danh mục" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="mt-1">
                                                    <Badge variant="outline">{selectedProduct.category.name}</Badge>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Product variants */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
                                                {isEditMode && (
                                                    <Button variant="outline" size="sm" onClick={onAddVariant}>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Thêm biến thể
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {selectedProduct.productVariants.map((variant, index) => (
                                                    <ProductVariantCard
                                                        key={variant.id}
                                                        variant={variant}
                                                        index={index}
                                                        isEditMode={isEditMode}
                                                        onEdit={onEditVariant}
                                                        onDelete={onDeleteVariant}
                                                    />
                                                ))}

                                                {selectedProduct.productVariants.length === 0 && (
                                                    <EmptyVariants isEditMode={isEditMode} onAddVariant={onAddVariant} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false)
                                setIsEditMode(false)
                            }}
                        >
                            {isEditMode ? "Hủy" : "Đóng"}
                        </Button>
                        {isEditMode && (
                            <Button onClick={onUpdate}>
                                <Save className="h-4 w-4 mr-1" />
                                Lưu thay đổi
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

