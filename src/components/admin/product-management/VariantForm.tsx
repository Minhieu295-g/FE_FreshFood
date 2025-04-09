"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Calendar, Upload, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../../../components/ui/button"
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
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../../components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type { ProductVariant } from "../../../types/product"
import { Toast } from "./Toast"
import type { ToastState } from "../../../types/product"

interface VariantFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentVariant: Partial<ProductVariant>
    setCurrentVariant: (variant: Partial<ProductVariant>) => void
    variantEditIndex: number | null
    onSave: () => void
}

export const VariantForm = ({
                                open,
                                onOpenChange,
                                currentVariant,
                                setCurrentVariant,
                                variantEditIndex,
                                onSave,
                            }: VariantFormProps) => {
    // File upload state
    const [variantThumbnail, setVariantThumbnail] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Toast state
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Ref for file input
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    // Handle thumbnail change
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setVariantThumbnail(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = () => {
                setThumbnailPreview(reader.result as string)
                // Also update the variant's thumbnailUrl for display
                setCurrentVariant({
                    ...currentVariant,
                    thumbnailUrl: reader.result as string,
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle save with validation
    const handleSave = () => {
        // Validate required fields
        if (!currentVariant.name) {
            setToast({
                show: true,
                message: "Vui lòng nhập tên biến thể",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        if (!currentVariant.price || currentVariant.price <= 0) {
            setToast({
                show: true,
                message: "Vui lòng nhập giá hợp lệ cho biến thể",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        if (!currentVariant.unit) {
            setToast({
                show: true,
                message: "Vui lòng chọn đơn vị cho biến thể",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        // If this is a new variant (not editing), require a thumbnail
        if (variantEditIndex === null && !variantThumbnail && !currentVariant.thumbnailUrl) {
            setToast({
                show: true,
                message: "Vui lòng chọn ảnh cho biến thể",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        setIsSubmitting(true)

        // Simulate API call delay
        setTimeout(() => {
            onSave()
            setIsSubmitting(false)
            resetForm()
        }, 500)
    }

    // Reset form
    const resetForm = () => {
        setVariantThumbnail(null)
        setThumbnailPreview("")
    }

    // Unit options for the select
    const unitOptions = [
        { value: "KG", label: "Kilogram (KG)" },
        { value: "G", label: "Gram (G)" },
        { value: "L", label: "Liter (L)" },
        { value: "ML", label: "Milliliter (ML)" },
        { value: "BOX", label: "Hộp (BOX)" },
        { value: "CAN", label: "Lon (CAN)" },
        { value: "BOTTLE", label: "Chai (BOTTLE)" },
        { value: "PIECE", label: "Cái (PIECE)" },
        { value: "BAG", label: "Túi (BAG)" },
        { value: "BUNDLE", label: "Bó (BUNDLE)" },
        { value: "PACK", label: "Gói (PACK)" },
    ]

    // Status options for the select
    const statusOptions = [
        { value: "AVAILABLE", label: "Đang bán (AVAILABLE)" },
        { value: "OUT_OF_STOCK", label: "Hết hàng (OUT_OF_STOCK)" },
        { value: "DISCONTINUED", label: "Ngừng kinh doanh (DISCONTINUED)" },
        { value: "PRE_ORDER", label: "Đặt trước (PRE_ORDER)" },
        { value: "ARCHIVED", label: "Đã lưu trữ (ARCHIVED)" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{variantEditIndex !== null ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}</DialogTitle>
                    <DialogDescription>
                        {variantEditIndex !== null
                            ? "Chỉnh sửa thông tin biến thể sản phẩm"
                            : "Nhập thông tin cho biến thể sản phẩm mới"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                                <img
                                    src={thumbnailPreview || currentVariant.thumbnailUrl || "/placeholder.svg"}
                                    alt="Variant thumbnail"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                    id="variant-thumbnail"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Chọn ảnh
                                </Button>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <Label htmlFor="variantName">Tên biến thể</Label>
                                <Input
                                    id="variantName"
                                    value={currentVariant.name}
                                    onChange={(e) =>
                                        setCurrentVariant({
                                            ...currentVariant,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Ví dụ: Hộp 1kg, Gói 500g, ..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="variantPrice">Giá bán</Label>
                                    <Input
                                        id="variantPrice"
                                        type="number"
                                        value={currentVariant.price}
                                        onChange={(e) =>
                                            setCurrentVariant({
                                                ...currentVariant,
                                                price: Number.parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        placeholder="Nhập giá bán"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="variantDiscount">Giảm giá (%)</Label>
                                    <Input
                                        id="variantDiscount"
                                        type="number"
                                        value={currentVariant.discountPercentage}
                                        onChange={(e) =>
                                            setCurrentVariant({
                                                ...currentVariant,
                                                discountPercentage: Number.parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        placeholder="Nhập % giảm giá"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="variantUnit">Đơn vị</Label>
                                    <Select
                                        value={currentVariant.unit}
                                        onValueChange={(value) =>
                                            setCurrentVariant({
                                                ...currentVariant,
                                                unit: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger id="variantUnit">
                                            <SelectValue placeholder="Chọn đơn vị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unitOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="variantExpiredDate">Hạn sử dụng</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {currentVariant.expiredDate
                                                    ? format(new Date(currentVariant.expiredDate), "MM/dd/yyyy")
                                                    : "Chọn ngày"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <CalendarComponent
                                                mode="single"
                                                selected={currentVariant.expiredDate ? new Date(currentVariant.expiredDate) : undefined}
                                                onSelect={(date) =>
                                                    setCurrentVariant({
                                                        ...currentVariant,
                                                        expiredDate: date
                                                            ? date.toISOString().split("T")[0]
                                                            : new Date().toISOString().split("T")[0],
                                                    })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="variantStatus">Trạng thái</Label>
                                <Select
                                    value={currentVariant.status}
                                    onValueChange={(value) =>
                                        setCurrentVariant({
                                            ...currentVariant,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger id="variantStatus">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : variantEditIndex !== null ? (
                            "Cập nhật"
                        ) : (
                            "Thêm biến thể"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>

            {/* Toast notification */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </Dialog>
    )
}

