"use client"

import { Plus, Package } from "lucide-react"
import { Button } from "../../../components/ui/button"

interface EmptyVariantsProps {
    isEditMode: boolean
    onAddVariant: () => void
}

export const EmptyVariants = ({ isEditMode, onAddVariant }: EmptyVariantsProps) => {
    return (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Chưa có biến thể sản phẩm nào</p>
            {isEditMode && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onAddVariant}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm biến thể
                </Button>
            )}
        </div>
    )
}

