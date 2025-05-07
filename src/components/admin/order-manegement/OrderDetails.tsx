"use client"

import { Download, Truck, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Separator } from "../../../components/ui/separator"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { Order } from "../../../types/order"
import { paymentMethodLabels } from "../../../types/order"

interface OrderDetailsProps {
    order: Order | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateStatus: (orderId: number, status: Order["status"]) => void
    onGenerateInvoice: (orderId: number) => void
    formatCurrency: (amount: number) => string
}

export const OrderDetails = ({
                                 order,
                                 open,
                                 onOpenChange,
                                 onUpdateStatus,
                                 onGenerateInvoice,
                                 formatCurrency,
                             }: OrderDetailsProps) => {
    if (!order) return null

    // Calculate subtotal
    const subtotal = order.totalPrice - order.shippingFee

    // Calculate price after discount
    const getPriceAfterDiscount = (price: number, discountPercentage: number) => {
        return price - (price * discountPercentage) / 100
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" style={{ width: "70vw", maxWidth: "1200px", height: "90vh" }}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="mr-2" onClick={() => onOpenChange(false)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span>Chi tiết đơn hàng #{order.orderNumber}</span>
                        <OrderStatusBadge status={order.status} />
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Order summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin đơn hàng</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Mã đơn hàng:</span>
                                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Ngày đặt hàng:</span>
                                    <span className="text-gray-900">{order.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Phương thức thanh toán:</span>
                                    <span className="text-gray-900">
                    {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                  </span>
                                </div>
                                {order.expectedDate && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 text-sm">Ngày giao dự kiến:</span>
                                        <span className="text-gray-900">{order.expectedDate}</span>
                                    </div>
                                )}
                                {order.note && (
                                    <div className="pt-2">
                                        <span className="text-gray-600 text-sm">Ghi chú của khách hàng:</span>
                                        <p className="mt-1 text-gray-900 text-sm bg-white p-2 rounded border border-gray-200">
                                            {order.note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin khách hàng</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                <div>
                                    <span className="text-gray-600 text-sm">Thông tin liên hệ:</span>
                                    <div className="mt-1">
                                        <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                        <p className="text-gray-700">{order.shippingAddress.numberPhone}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-600 text-sm">Địa chỉ giao hàng:</span>
                                    <div className="mt-1">
                                        <p className="text-gray-700 mt-1">
                                            {order.shippingAddress.detailAddress}, {order.shippingAddress.wardName},{" "}
                                            {order.shippingAddress.districtName}, {order.shippingAddress.provinceName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order items */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Sản phẩm đã đặt</h3>
                        <div className="bg-gray-50 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Sản phẩm
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Đơn giá
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Số lượng
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Thành tiền
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.product.thumbnailUrl || "/placeholder.svg"}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                                        <div className="text-xs text-gray-500">Đơn vị: {item.product.unit}</div>
                                                        {item.product.expiredDate && (
                                                            <div className="text-xs text-gray-500">HSD: {item.product.expiredDate}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                                                {item.product.discountPercentage > 0 ? (
                                                    <div>
                              <span className="text-gray-500 line-through mr-1">
                                {formatCurrency(item.product.price)}
                              </span>
                                                        <span className="text-gray-700">
                                {formatCurrency(
                                    getPriceAfterDiscount(item.product.price, item.product.discountPercentage),
                                )}
                              </span>
                                                        <div className="text-xs text-green-600">-{item.product.discountPercentage}%</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">{formatCurrency(item.product.price)}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                {formatCurrency(
                                                    item.product.discountPercentage > 0
                                                        ? getPriceAfterDiscount(item.product.price, item.product.discountPercentage) *
                                                        item.quantity
                                                        : item.product.price * item.quantity,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Order summary */}
                            <div className="border-t border-gray-200 px-4 py-4">
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="text-gray-900">{formatCurrency(order.shippingFee)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-gray-900">Tổng cộng:</span>
                                    <span className="font-bold text-lg text-green-600">{formatCurrency(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order actions */}
                    <div className="flex flex-wrap gap-3 justify-between">
                        <div className="flex flex-wrap gap-2">
                            {order.status === "pending" && (
                                <Button variant="default" onClick={() => onUpdateStatus(order.id, "processing")}>
                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                    Xác nhận đơn hàng
                                </Button>
                            )}

                            {order.status === "processing" && (
                                <Button variant="default" onClick={() => onUpdateStatus(order.id, "shipped")}>
                                    <Truck className="h-4 w-4 mr-1.5" />
                                    Chuyển sang đang giao
                                </Button>
                            )}

                            {order.status === "shipped" && (
                                <Button variant="default" onClick={() => onUpdateStatus(order.id, "delivered")}>
                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                    Xác nhận đã giao
                                </Button>
                            )}

                            {(order.status === "pending" || order.status === "processing") && (
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => onUpdateStatus(order.id, "cancelled")}
                                >
                                    <XCircle className="h-4 w-4 mr-1.5" />
                                    Hủy đơn hàng
                                </Button>
                            )}
                        </div>

                        <Button variant="outline" onClick={() => onGenerateInvoice(order.id)}>
                            <Download className="h-4 w-4 mr-1.5" />
                            Xuất hóa đơn
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
