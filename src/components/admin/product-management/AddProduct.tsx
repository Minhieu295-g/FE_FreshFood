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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { Product, ProductImage} from "../../../types/product"
import type { Category} from "../../../types/category"

import { ProductVariantCard } from "./ProductVariantCard"
import { EmptyVariants } from "./EmptyVariants"

interface AddProductProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    newProduct: Partial<Product>
    setNewProduct: (product: Partial<Product>) => void
    categories: Category[]
    onSave: () => void
    onAddVariant: () => void
    onEditVariant: (variant: any, index: number) => void
    onDeleteVariant: (index: number) => void
}

export const AddProduct = ({
                               open,
                               onOpenChange,
                               newProduct,
                               setNewProduct,
                               categories,
                               onSave,
                               onAddVariant,
                               onEditVariant,
                               onDeleteVariant,
                           }: AddProductProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    <DialogDescription>Nhập thông tin sản phẩm mới và các biến thể của sản phẩm</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Product image */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-4">
                                        <img
                                            src={newProduct.thumbnailUrl || "/placeholder.svg"}
                                            alt="Product thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newThumbnailUrl">Ảnh đại diện</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="newThumbnailUrl"
                                                value={newProduct.thumbnailUrl}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
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

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {newProduct.productImages?.map((image, index) => (
                                                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={image.imageUrl || "/placeholder.svg"}
                                                        alt={`Product image ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                                                        onClick={() => {
                                                            const updatedImages = [...(newProduct.productImages || [])]
                                                            updatedImages.splice(index, 1)
                                                            setNewProduct({
                                                                ...newProduct,
                                                                productImages: updatedImages,
                                                            })
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                                                onClick={() => {
                                                    setNewProduct({
                                                        ...newProduct,
                                                        productImages: [
                                                            ...(newProduct.productImages || []),
                                                            { id: Date.now(), imageUrl: "/placeholder.svg?height=200&width=200" } as ProductImage,
                                                        ],
                                                    })
                                                }}
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
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
                                            <Label htmlFor="newName">Tên sản phẩm</Label>
                                            <Input
                                                id="newName"
                                                value={newProduct.name}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập tên sản phẩm"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="newDescription">Mô tả sản phẩm</Label>
                                            <Textarea
                                                id="newDescription"
                                                value={newProduct.description}
                                                onChange={(e) =>
                                                    setNewProduct({
                                                        ...newProduct,
                                                        description: e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập mô tả sản phẩm"
                                                rows={4}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="newCategory">Danh mục</Label>
                                            <Select
                                                value={newProduct.category?.id.toString()}
                                                onValueChange={(value) => {
                                                    const category = categories.find((c) => c.id === Number.parseInt(value))
                                                    if (category) {
                                                        setNewProduct({
                                                            ...newProduct,
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
                                        </div>

                                        <Separator />

                                        {/* Product variants */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-medium">Biến thể sản phẩm</h3>
                                                <Button variant="outline" size="sm" onClick={onAddVariant}>
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Thêm biến thể
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {newProduct.productVariants?.map((variant, index) => (
                                                    <ProductVariantCard
                                                        key={index}
                                                        variant={variant}
                                                        index={index}
                                                        isEditMode={true}
                                                        onEdit={onEditVariant}
                                                        onDelete={onDeleteVariant}
                                                    />
                                                ))}

                                                {(!newProduct.productVariants || newProduct.productVariants.length === 0) && (
                                                    <EmptyVariants isEditMode={true} onAddVariant={onAddVariant} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button onClick={onSave}>
                            <Save className="h-4 w-4 mr-1" />
                            Lưu sản phẩm
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

