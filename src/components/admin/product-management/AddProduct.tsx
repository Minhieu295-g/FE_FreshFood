"use client"

import * as React from "react"

import { useState, useRef } from "react"
import { Plus, Save, Upload, X, RefreshCw, Package } from "lucide-react"
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
import type { Product, ProductRequestDTO, ProductVariantRequestDTO } from "../../../types/product"
import type { Category } from "../../../types/category"
import { addProductWithVariants } from "../../../api/productApi"
import { Toast } from "./Toast"
import type { ToastState } from "../../../types/product"

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
    // File upload states
    const [productThumbnail, setProductThumbnail] = useState<File | null>(null)
    const [productImages, setProductImages] = useState<File[]>([])
    const [variantThumbnails, setVariantThumbnails] = useState<{ [key: number]: File | null }>({})

    // Preview states
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([])
    const [variantPreviews, setVariantPreviews] = useState<{ [key: number]: string }>({})

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Toast state
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Refs for file inputs
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const imagesInputRef = useRef<HTMLInputElement>(null)

    // Add this useEffect to sync variant thumbnails when variants change
    React.useEffect(() => {
        if (newProduct.productVariants) {
            // Initialize any new variants that don't have thumbnails yet
            const updatedThumbnails = { ...variantThumbnails }

            newProduct.productVariants.forEach((_, index) => {
                if (updatedThumbnails[index] === undefined) {
                    // Initialize with null, but don't overwrite existing values
                    updatedThumbnails[index] = null
                }
            })

            // Remove any thumbnails for variants that no longer exist
            Object.keys(updatedThumbnails).forEach((key) => {
                const index = Number.parseInt(key)
                const variantCount = newProduct.productVariants?.length ?? 0
                if (index >= variantCount) {
                    delete updatedThumbnails[index]
                }

            })

            setVariantThumbnails(updatedThumbnails)
        }
    }, [newProduct.productVariants])

    // Handle product thumbnail change
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setProductThumbnail(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = () => {
                setThumbnailPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle product images change
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setProductImages([...productImages, ...files])

            // Create previews
            files.forEach((file) => {
                const reader = new FileReader()
                reader.onload = () => {
                    setImagesPreviews((prev) => [...prev, reader.result as string])
                }
                reader.readAsDataURL(file)
            })
        }
    }

    // Handle variant thumbnail change
    const handleVariantThumbnailChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setVariantThumbnails((prev) => ({ ...prev, [index]: file }))

            // Create preview
            const reader = new FileReader()
            reader.onload = () => {
                setVariantPreviews((prev) => ({ ...prev, [index]: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove product image
    const removeProductImage = (index: number) => {
        const newImages = [...productImages]
        newImages.splice(index, 1)
        setProductImages(newImages)

        const newPreviews = [...imagesPreviews]
        newPreviews.splice(index, 1)
        setImagesPreviews(newPreviews)
    }

    // Submit form
    const handleSubmit = async () => {
        // Validate form
        if (!newProduct.name || !newProduct.description) {
            setToast({
                show: true,
                message: "Vui lòng nhập tên và mô tả sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        if (!newProduct.category) {
            setToast({
                show: true,
                message: "Vui lòng chọn danh mục sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        if (!productThumbnail) {
            setToast({
                show: true,
                message: "Vui lòng chọn ảnh đại diện cho sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        if (!newProduct.productVariants || newProduct.productVariants.length === 0) {
            setToast({
                show: true,
                message: "Vui lòng thêm ít nhất một biến thể sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        // Check if all variants have thumbnails
        console.log("variantThumbnails: ", variantThumbnails)
        const variantIndices = newProduct.productVariants.map((_, index) => index)
        const missingThumbnails = variantIndices.filter((index) => {
            const variant = newProduct.productVariants?.[index]
            return !variantThumbnails[index] && !variant?.thumbnailUrl
        })

        if (missingThumbnails.length > 0) {
            setToast({
                show: true,
                message: `Vui lòng chọn ảnh cho tất cả các biến thể sản phẩm`,
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        // Prepare data for API
        const productData: ProductRequestDTO = {
            name: newProduct.name || "",
            description: newProduct.description || "",
            categoryId: newProduct.category?.id || 0,
        }

        // Prepare variants data
        const variantsData: ProductVariantRequestDTO[] = newProduct.productVariants.map((variant) => ({
            productId:0,
            name: variant.name,
            price: variant.price,
            discountPercentage: variant.discountPercentage,
            unit: mapUnitToEnum(variant.unit),
            expiryDate: formatDateForAPI(variant.expiredDate),
            status: mapStatusToEnum(variant.status),
        }))

        // Finally, let's modify the variantThumbnailsArray creation to handle cases where we're using an existing thumbnailUrl:

        // Get variant thumbnails as array
        const variantThumbnailsArray = newProduct.productVariants.map((variant, index) => {
            // If we have a new file uploaded, use that
            if (variantThumbnails[index]) {
                return variantThumbnails[index] as File
            }

            // Otherwise, we need to create a placeholder or fetch the existing image
            // This is a fallback that should rarely be needed if validation is working
            return new File([""], "placeholder.jpg", { type: "image/jpeg" })
        })

        setIsSubmitting(true)

        try {



            await addProductWithVariants(productData, productThumbnail, productImages, variantsData, variantThumbnailsArray)

            // Show success message
            setToast({
                show: true,
                message: "Thêm sản phẩm thành công",
                type: "success",
            })

            // Reset form
            resetForm()

            // Call onSave callback
            onSave()

            // Close modal after a delay
            setTimeout(() => {
                onOpenChange(false)
                setToast({ ...toast, show: false })
            }, 2000)
        } catch (error) {
            console.error("Error adding product:", error)
            setToast({
                show: true,
                message: "Có lỗi xảy ra khi thêm sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setProductThumbnail(null)
        setProductImages([])
        setVariantThumbnails({})
        setThumbnailPreview("")
        setImagesPreviews([])
        setVariantPreviews({})
    }

    // Helper functions for mapping values to API enums
    const mapUnitToEnum = (unit: string): ProductVariantRequestDTO["unit"] => {
        const unitMap: { [key: string]: ProductVariantRequestDTO["unit"] } = {
            kg: "KG",
            g: "G",
            l: "L",
            ml: "ML",
            box: "BOX",
            can: "CAN",
            bottle: "BOTTLE",
            piece: "PIECE",
            bag: "BAG",
            bundle: "BUNDLE",
            pack: "PACK",
        }

        return unitMap[unit.toLowerCase()] || "PIECE"
    }

    const mapStatusToEnum = (status: string): ProductVariantRequestDTO["status"] => {
        const statusMap: { [key: string]: ProductVariantRequestDTO["status"] } = {
            active: "AVAILABLE",
            out_of_stock: "OUT_OF_STOCK",
            discontinued: "DISCONTINUED",
            pre_order: "PRE_ORDER",
            archived: "ARCHIVED",
        }

        return statusMap[status.toLowerCase()] || "AVAILABLE"
    }

    const formatDateForAPI = (date: string): string => {
        // Convert from YYYY-MM-DD to MM/DD/YYYY
        if (!date) return new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })

        const [year, month, day] = date.split("-")
        return `${month}/${day}/${year}`
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ width: "70vw", maxWidth: "1200px", height: "90vh" }}>
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
                                            src={thumbnailPreview || newProduct.thumbnailUrl || "/placeholder.svg"}
                                            alt="Product thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newThumbnailUrl">Ảnh đại diện</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="hidden"
                                                id="product-thumbnail"
                                            />
                                            <Button variant="outline" className="w-full" onClick={() => thumbnailInputRef.current?.click()}>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Chọn ảnh đại diện
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {imagesPreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={preview || "/placeholder.svg"}
                                                        alt={`Product image ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                                                        onClick={() => removeProductImage(index)}
                                                        type="button"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div
                                                className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
                                                onClick={() => imagesInputRef.current?.click()}
                                            >
                                                <input
                                                    ref={imagesInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImagesChange}
                                                    className="hidden"
                                                    id="product-images"
                                                />
                                                <Plus className="h-5 w-5" />
                                            </div>
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
                                                    <Card key={index} className="overflow-hidden">
                                                        <CardContent className="p-4">
                                                            <div className="flex flex-col md:flex-row gap-4">
                                                                <div className="md:w-[100px]">
                                                                    <div
                                                                        className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                                                                        <img
                                                                            src={variantPreviews[index] || (variant.thumbnailUrl ? variant.thumbnailUrl : "/placeholder.svg")}
                                                                            alt={variant.name}
                                                                            className="h-full w-full object-cover"
                                                                        />

                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleVariantThumbnailChange(index, e)}
                                                                        className="hidden"
                                                                        id={`variant-thumbnail-${index}`}
                                                                    />
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-full text-xs"
                                                                        onClick={() => document.getElementById(`variant-thumbnail-${index}`)?.click()}
                                                                    >
                                                                        <Upload className="h-3 w-3 mr-1" />
                                                                        Chọn ảnh
                                                                    </Button>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                                        <h4 className="font-medium">{variant.name}</h4>
                                                                    </div>

                                                                    <div className="mt-2 flex flex-col md:flex-row md:items-end justify-between">
                                                                        <div>
                                                                            <div className="font-bold text-lg text-gray-900">
                                                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                                                    variant.price,
                                                                                )}
                                                                            </div>
                                                                            {variant.discountPercentage > 0 && (
                                                                                <div className="text-sm text-green-600">Giảm {variant.discountPercentage}%</div>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex gap-2 mt-2 md:mt-0">
                                                                            <Button variant="outline" size="sm" onClick={() => onEditVariant(variant, index)}>
                                                                                <Upload className="h-4 w-4 mr-1" />
                                                                                Sửa
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                                onClick={() => onDeleteVariant(index)}
                                                                            >
                                                                                <X className="h-4 w-4 mr-1" />
                                                                                Xóa
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}

                                                {(!newProduct.productVariants || newProduct.productVariants.length === 0) && (
                                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                        <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-600">Chưa có biến thể sản phẩm nào</p>
                                                        <Button variant="outline" size="sm" className="mt-4" onClick={onAddVariant}>
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Thêm biến thể
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-1" />
                                    Lưu sản phẩm
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>

            {/* Toast notification */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </Dialog>
    )
}

