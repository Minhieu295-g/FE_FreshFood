"use client"

import { Eye, Download, Pencil } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { Order } from "../../../types/order"
import { paymentMethodLabels } from "../../../types/order"

interface OrderTableProps {
    orders: Order[]
    onViewOrder: (order: Order) => void
    onEditOrder: (order: Order) => void
    onGenerateInvoice: (orderId: number) => void
    formatCurrency: (amount: number) => string
}

export const OrderTable = ({
                               orders,
                               onViewOrder,
                               onEditOrder,
                               onGenerateInvoice,
                               formatCurrency,
                           }: OrderTableProps) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Mã đơn hàng
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Khách hàng
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Ngày đặt
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Tổng tiền
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Trạng thái
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Thanh toán
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Thao tác
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.shippingAddress.name}</div>
                                <div className="text-sm text-gray-500">{order.shippingAddress.numberPhone}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.date}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalPrice)}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">
                      {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => onViewOrder(order)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onEditOrder(order)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onGenerateInvoice(order.id)}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
