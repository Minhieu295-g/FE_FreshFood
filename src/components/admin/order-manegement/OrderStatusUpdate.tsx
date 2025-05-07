"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { Order, OrderStatus } from "../../../types/order"
import { statusConfig } from "../../../types/order"

interface OrderStatusUpdateProps {
    order: Order | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateStatus: (orderId: number, status: OrderStatus, note?: string) => void
}

export const OrderStatusUpdate = ({ order, open, onOpenChange, onUpdateStatus }: OrderStatusUpdateProps) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("")
    const [note, setNote] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset form when dialog opens/closes
    const handleOpenChange = (open: boolean) => {
        if (open && order) {
            setSelectedStatus(order.status)
            setNote(order.note || "")
        } else {
            setSelectedStatus("")
            setNote("")
        }
        onOpenChange(open)
    }

    // Handle form submission
    const handleSubmit = async () => {
        if (!order || !selectedStatus) return

        setIsSubmitting(true)
        try {
            await onUpdateStatus(order.id, selectedStatus, note)
            onOpenChange(false)
        } catch (error) {
            console.error("Error updating order status:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!order) return null

    // Get available status options based on current status
    const getAvailableStatuses = (): OrderStatus[] => {
        switch (order.status) {
            case "pending":
                return ["processing", "cancelled"]
            case "processing":
                return ["shipped", "cancelled"]
            case "shipped":
                return ["delivered", "returned"]
            case "delivered":
                return ["returned"]
            case "cancelled":
                return ["pending"]
            case "returned":
                return ["processing"]
            default:
                return []
        }
    }

    const availableStatuses = getAvailableStatuses()

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Đơn hàng #{order.orderNumber}</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
                            <OrderStatusBadge status={order.status} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái mới</Label>
                        <RadioGroup
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                            className="grid grid-cols-1 gap-2"
                        >
                            {availableStatuses.map((status) => (
                                <div key={status} className="flex items-center space-x-2 rounded-md border p-3">
                                    <RadioGroupItem value={status} id={status} />
                                    <Label htmlFor={status} className="flex items-center gap-2 cursor-pointer">
                                        <span className={`w-2 h-2 rounded-full ${statusConfig[status].color.split(" ")[0]}`} />
                                        {statusConfig[status].label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú</Label>
                        <Textarea
                            id="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú về việc thay đổi trạng thái (không bắt buộc)"
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={!selectedStatus || selectedStatus === order.status || isSubmitting}>
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
