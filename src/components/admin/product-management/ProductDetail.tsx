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
import type {Product, ProductImage, ProductVariant, ToastState} from "../../../types/product"
import type { Category} from "../../../types/category"
import { ProductVariantCard } from "./ProductVariantCard"
import { EmptyVariants } from "../../admin/product-management/EmptyVariants"
import {useEffect, useRef, useState} from "react";
import {Toast} from "./Toast";

interface ProductDetailProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedProduct: Product | null
    isEditMode: boolean
    setIsEditMode: (value: boolean) => void
    setSelectedProduct: (product: Product | null) => void
    categories: Category[]
    onUpdate: (changes: ProductChanges) => void
    onAddVariant: () => void
    onEditVariant: (variant: ProductVariant, index: number) => void
    onDeleteVariant: (index: number) => void
}

// Define the structure for tracking changes
export interface ProductChanges {
    modifiedProduct: Product
    originalProduct: Product
    productThumbnail: File | null
    addedImages: { file: File; altText: string }[]
    deletedImageIds: number[]
    addedVariants: ProductVariant[]
    modifiedVariants: ProductVariant[]
    deletedVariantIds: number[]
    variantThumbnails: { [variantId: number]: File | null }
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
    // Original product state for comparison
    const [originalProduct, setOriginalProduct] = useState<Product | null>(null)

    // File upload states
    const [productThumbnail, setProductThumbnail] = useState<File | null>(null)
    const [addedImages, setAddedImages] = useState<{ file: File; altText: string; index: number }[]>([])
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([])
    const [variantThumbnails, setVariantThumbnails] = useState<{ [variantId: number]: File | null }>({})

    // Track added and modified variants
    const [addedVariants, setAddedVariants] = useState<ProductVariant[]>([])
    const [modifiedVariants, setModifiedVariants] = useState<ProductVariant[]>([])
    const [deletedVariantIds, setDeletedVariantIds] = useState<number[]>([])

    // Preview states
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
    const [newImageAltText, setNewImageAltText] = useState<string>("")
    const [showAltTextInput, setShowAltTextInput] = useState<boolean>(false)
    const [tempImageFile, setTempImageFile] = useState<File | null>(null)
    const [changes, setChanges] = useState<ProductChanges | null>(null);

    // Toast state
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Refs for file inputs
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const imagesInputRef = useRef<HTMLInputElement>(null)

    // Initialize original product when selected product changes
    useEffect(() => {
        if (selectedProduct && open) {
            // Deep clone the selected product to keep as original
            setOriginalProduct(JSON.parse(JSON.stringify(selectedProduct)))

            // Reset all tracking states
            setProductThumbnail(null)
            setAddedImages([])
            setDeletedImageIds([])
            setVariantThumbnails({})
            setAddedVariants([])
            setModifiedVariants([])
            setDeletedVariantIds([])
            setThumbnailPreview("")
            setNewImageAltText("")
            setShowAltTextInput(false)
            setTempImageFile(null)
        }
    }, [selectedProduct, open])

    // Handle product thumbnail change
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setProductThumbnail(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = () => {
                setThumbnailPreview(reader.result as string)

                // Update the product thumbnail URL for immediate display
                if (selectedProduct) {
                    setSelectedProduct({
                        ...selectedProduct,
                        thumbnailUrl: reader.result as string,
                    })
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle product images change
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setTempImageFile(file)
            setShowAltTextInput(true)
        }
    }

    // Handle adding image with alt text
    const handleAddImageWithAltText = () => {
        if (!tempImageFile || !selectedProduct) return

        const file = tempImageFile
        const altText = newImageAltText || file.name

        // Create a new negative ID for the image
        const newImageId = -Math.floor(Math.random() * 1000) - 1

        // Create preview and add to product images
        const reader = new FileReader()
        reader.onload = () => {
            // Add to product images with a new negative ID
            const newImage: ProductImage = {
                id: newImageId,
                imageUrl: reader.result as string,
                altText: altText,
            }

            // Add to added images tracking
            setAddedImages((prev) => [
                ...prev,
                {
                    file,
                    altText,
                    index: selectedProduct.productImages.length,
                },
            ])

            // Update the product images
            setSelectedProduct({
                ...selectedProduct,
                productImages: [...selectedProduct.productImages, newImage],
            })
        }
        reader.readAsDataURL(file)

        // Reset the temp states
        setTempImageFile(null)
        setNewImageAltText("")
        setShowAltTextInput(false)
    }

    // Handle variant thumbnail change
    const handleVariantThumbnailChange = (variantId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setVariantThumbnails((prev) => ({ ...prev, [variantId]: file }))

            // Create preview and update variant
            const reader = new FileReader()
            reader.onload = () => {
                if (selectedProduct) {
                    const updatedVariants = selectedProduct.productVariants.map((variant) =>
                        variant.id === variantId ? { ...variant, thumbnailUrl: reader.result as string } : variant,
                    )

                    setSelectedProduct({
                        ...selectedProduct,
                        productVariants: updatedVariants,
                    })

                    // Track modified variant if it's not a new one
                    if (!addedVariants.some((v) => v.id === variantId)) {
                        const variantToModify = selectedProduct.productVariants.find((v) => v.id === variantId)
                        if (variantToModify) {
                            setModifiedVariants((prev) => {
                                // Remove if already in the array
                                const filtered = prev.filter((v) => v.id !== variantId)
                                // Add the updated variant
                                return [...filtered, { ...variantToModify, thumbnailUrl: reader.result as string }]
                            })
                        }
                    }
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove product image
    const handleRemoveProductImage = (imageId: number) => {
        if (selectedProduct) {
            // If it's a real image (has a positive ID), add to deleted images
            if (imageId > 0) {
                setDeletedImageIds((prev) => [...prev, imageId])
            } else {
                // If it's a new image (negative ID), remove from added images
                setAddedImages((prev) =>
                    prev.filter((img) => {
                        const imgIndex = selectedProduct.productImages.findIndex((pi) => pi.id === imageId)
                        return img.index !== imgIndex
                    }),
                )
            }

            // Update the product images
            setSelectedProduct({
                ...selectedProduct,
                productImages: selectedProduct.productImages.filter((img) => img.id !== imageId),
            })
        }
    }

    // Track variant changes
    useEffect(() => {
        if (selectedProduct && originalProduct) {
            // Find added variants (those with negative IDs)
            const newAddedVariants = selectedProduct.productVariants.filter((variant) => variant.id < 0)
            setAddedVariants(newAddedVariants)

            // Find modified variants (excluding added ones)
            const existingVariants = selectedProduct.productVariants.filter((variant) => variant.id > 0)

            const newModifiedVariants = existingVariants.filter((variant) => {
                const originalVariant = originalProduct.productVariants.find((v) => v.id === variant.id)

                if (!originalVariant) return false

                // Compare properties to see if anything changed
                return (
                    variant.name !== originalVariant.name ||
                    variant.price !== originalVariant.price ||
                    variant.discountPercentage !== originalVariant.discountPercentage ||
                    variant.unit !== originalVariant.unit ||
                    variant.expiredDate !== originalVariant.expiredDate ||
                    variant.status !== originalVariant.status ||
                    variant.thumbnailUrl !== originalVariant.thumbnailUrl
                )
            })

            // Only update if there's a change to avoid infinite loop
            if (JSON.stringify(newModifiedVariants) !== JSON.stringify(modifiedVariants)) {
                setModifiedVariants(newModifiedVariants)
            }

            // Find deleted variants
            const currentVariantIds = new Set(selectedProduct.productVariants.map((v) => v.id))
            const newDeletedVariantIds = originalProduct.productVariants
                .filter((v) => v.id > 0 && !currentVariantIds.has(v.id))
                .map((v) => v.id)

            // Only update if there's a change
            if (JSON.stringify(newDeletedVariantIds) !== JSON.stringify(deletedVariantIds)) {
                setDeletedVariantIds(newDeletedVariantIds)
            }
        }
    }, [selectedProduct, originalProduct])

    // Handle save changes
    const handleSaveChanges = () => {
        if (!selectedProduct || !originalProduct) return

        // Validate required fields
        if (!selectedProduct.name || !selectedProduct.description || !selectedProduct.category) {
            setToast({
                show: true,
                message: "Vui lòng điền đầy đủ thông tin sản phẩm",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        // Prepare changes object
        const newChanges: ProductChanges = {
            modifiedProduct: selectedProduct,
            originalProduct,
            productThumbnail,
            addedImages: addedImages.map(({ file, altText }) => ({ file, altText })),
            deletedImageIds,
            addedVariants,
            modifiedVariants,
            deletedVariantIds,
            variantThumbnails,
        }

        setChanges(newChanges);
        onUpdate(newChanges)
    }
    useEffect(() => {
        if (changes) {
            console.log("Changes vừa được cập nhật:", changes);
        }
    }, [changes]);

    if (!selectedProduct) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-4xl max-h-[90vh] overflow-y-auto"
                style={{ width: "70vw", maxWidth: "1200px", height: "90vh" }}
            >
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
                                            src={thumbnailPreview || selectedProduct.thumbnailUrl || "/placeholder.svg"}
                                            alt={selectedProduct.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {isEditMode && (
                                        <div className="space-y-2">
                                            <Label htmlFor="thumbnailUrl">Ảnh đại diện</Label>
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
                                    )}

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedProduct.productImages.map((image, index) => (
                                                <div key={image.id} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                                                    <img
                                                        src={image.imageUrl || "/placeholder.svg"}
                                                        alt={image.altText}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    {isEditMode && (
                                                        <button
                                                            className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                                                            onClick={() => handleRemoveProductImage(image.id)}
                                                            type="button"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditMode && !showAltTextInput && (
                                                <div
                                                    className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
                                                    onClick={() => imagesInputRef.current?.click()}
                                                >
                                                    <input
                                                        ref={imagesInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImagesChange}
                                                        className="hidden"
                                                        id="product-images"
                                                    />
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Alt text input for new image */}
                                        {showAltTextInput && (
                                            <div className="mt-4 space-y-2">
                                                <Label htmlFor="imageAltText">Mô tả ảnh (Alt Text)</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="imageAltText"
                                                        value={newImageAltText}
                                                        onChange={(e) => setNewImageAltText(e.target.value)}
                                                        placeholder="Nhập mô tả cho ảnh"
                                                    />
                                                    <Button variant="outline" size="sm" onClick={handleAddImageWithAltText}>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Thêm
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShowAltTextInput(false)
                                                            setTempImageFile(null)
                                                            setNewImageAltText("")
                                                        }}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Hủy
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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
                                                    <div key={variant.id} className="relative">
                                                        {isEditMode && variant.id > 0 && modifiedVariants.some((v) => v.id === variant.id) && (
                                                            <div className="absolute -top-2 -right-2 z-10">
                                                                <Badge className="bg-amber-500">Đã chỉnh sửa</Badge>
                                                            </div>
                                                        )}
                                                        {isEditMode && variant.id < 0 && (
                                                            <div className="absolute -top-2 -right-2 z-10">
                                                                <Badge className="bg-green-500">Mới</Badge>
                                                            </div>
                                                        )}
                                                        <ProductVariantCard
                                                            variant={variant}
                                                            index={index}
                                                            isEditMode={isEditMode}
                                                            onEdit={onEditVariant}
                                                            onDelete={onDeleteVariant}
                                                            onThumbnailChange={
                                                                isEditMode ? (e) => handleVariantThumbnailChange(variant.id, e) : undefined
                                                            }
                                                        />
                                                    </div>
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
                            <Button onClick={handleSaveChanges}>
                                <Save className="h-4 w-4 mr-1" />
                                Lưu thay đổi
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>

            {/* Toast notification */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </Dialog>
    )
}



