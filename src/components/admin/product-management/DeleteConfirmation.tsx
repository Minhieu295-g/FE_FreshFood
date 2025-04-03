"use client"

import { Trash2 } from "lucide-react"
import { Button } from "../../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import type { Product } from "../../../types/product"

interface DeleteConfirmationProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    productsToDelete: number[]
    products: Product[]
    onConfirm: () => void
}

export const DeleteConfirmation = ({
                                       open,
                                       onOpenChange,
                                       productsToDelete,
                                       products,
                                       onConfirm,
                                   }: DeleteConfirmationProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa{" "}
                        {productsToDelete.length > 1 ? `${productsToDelete.length} sản phẩm` : "sản phẩm này"} không? Hành động này
                        không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {productsToDelete.length === 1 && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                                <img
                                    src={products.find((p) => p.id === productsToDelete[0])?.thumbnailUrl || "/placeholder.svg"}
                                    alt="Product to delete"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{products.find((p) => p.id === productsToDelete[0])?.name}</p>
                                <p className="text-sm text-gray-500">ID: {productsToDelete[0]}</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xác nhận xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

