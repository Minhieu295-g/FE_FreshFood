"use client"

import { Calendar, Upload } from "lucide-react"
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
import { Switch } from "../../../components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../../components/ui/calendar"
import type { ProductVariant } from "../../../types/product"

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
                                    src={currentVariant.thumbnailUrl || "/placeholder.svg"}
                                    alt="Variant thumbnail"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={currentVariant.thumbnailUrl}
                                    onChange={(e) =>
                                        setCurrentVariant({
                                            ...currentVariant,
                                            thumbnailUrl: e.target.value,
                                        })
                                    }
                                    placeholder="URL ảnh biến thể"
                                    className="text-xs"
                                />
                                <Button variant="outline" size="icon" className="flex-shrink-0">
                                    <Upload className="h-4 w-4" />
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
                                    <Input
                                        id="variantUnit"
                                        value={currentVariant.unit}
                                        onChange={(e) =>
                                            setCurrentVariant({
                                                ...currentVariant,
                                                unit: e.target.value,
                                            })
                                        }
                                        placeholder="Ví dụ: hộp, gói, kg, ..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="variantExpiredDate">Hạn sử dụng</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {currentVariant.expiredDate
                                                    ? format(new Date(currentVariant.expiredDate), "dd/MM/yyyy")
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

                            <div className="flex items-center justify-between">
                                <Label htmlFor="variantStatus">Trạng thái</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="variantStatus"
                                        checked={currentVariant.status === "active"}
                                        onCheckedChange={(checked) =>
                                            setCurrentVariant({
                                                ...currentVariant,
                                                status: checked ? "active" : "inactive",
                                            })
                                        }
                                    />
                                    <Label htmlFor="variantStatus">{currentVariant.status === "active" ? "Đang bán" : "Ngừng bán"}</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={onSave}>{variantEditIndex !== null ? "Cập nhật" : "Thêm biến thể"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

