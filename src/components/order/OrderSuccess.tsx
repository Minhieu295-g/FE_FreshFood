"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    CheckCircle,
    Package,
    Truck,
    Calendar,
    MapPin,
    Receipt,
    ArrowRight,
    Copy,
    ShoppingBag,
    Clock,
    ChevronDown,
    ChevronUp,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { motion } from "framer-motion"

interface OrderSuccessProps {
    orderNumber: string
    orderDate: string
    deliveryDate: string
    totalAmount: number
    paymentMethod: string
    shippingAddress: {
        name: string
        phone: string
        address: string
        city: string
        district: string
        ward: string
    }
    items: Array<{
        id: number
        name: string
        price: number
        quantity: number
        image: string
        variant?: string
    }>
}

const OrderSuccess = ({
                          orderNumber = "ORD-20240325-7812",
                          orderDate = "25/03/2024, 15:30",
                          deliveryDate = "28/03/2024",
                          totalAmount = 245000,
                          paymentMethod = "Thanh toán khi nhận hàng (COD)",
                          shippingAddress = {
                              name: "Lê Minh Hiếu",
                              phone: "(+84) 345778312",
                              address: "Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú",
                              city: "An Giang",
                              district: "Huyện An Phú",
                              ward: "Thị Trấn An Phú",
                          },
                          items = [
                              {
                                  id: 1,
                                  name: "Set 3 cuộn túi đựng rác tự phân hủy sinh học",
                                  price: 9500,
                                  quantity: 2,
                                  image: "https://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg",
                                  variant: "Set - 3 cuộn",
                              },
                              {
                                  id: 2,
                                  name: "Rau cải ngọt hữu cơ (500g)",
                                  price: 35000,
                                  quantity: 1,
                                  image: "/placeholder.svg?height=200&width=200",
                                  variant: "Gói 500g",
                              },
                              {
                                  id: 3,
                                  name: "Táo Envy New Zealand size 70-80 (1kg)",
                                  price: 185000,
                                  quantity: 1,
                                  image: "/placeholder.svg?height=200&width=200",
                                  variant: "Hộp 1kg",
                              },
                          ],
                      }: OrderSuccessProps) => {
    const [showAllItems, setShowAllItems] = useState(false)
    const [copied, setCopied] = useState(false)
    const [countdown, setCountdown] = useState(5)

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = 30000

    // Copy order number to clipboard
    const copyOrderNumber = () => {
        navigator.clipboard.writeText(orderNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Countdown effect for estimated delivery
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Items to display initially (if more than 2)
    const displayItems = showAllItems ? items : items.slice(0, 2)
    const hasMoreItems = items.length > 2

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Success message */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4"
                    >
                        <CheckCircle className="h-14 w-14 text-green-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Cảm ơn bạn đã mua sắm tại FreshMart. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                    </p>
                </motion.div>

                {/* Order information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Card className="mb-6 overflow-hidden border-green-100 shadow-md">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-white text-lg font-semibold">Mã đơn hàng: {orderNumber}</h2>
                                    <p className="text-green-100 text-sm">Đặt lúc: {orderDate}</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-3 sm:mt-0 flex items-center gap-1.5"
                                    onClick={copyOrderNumber}
                                >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? "Đã sao chép" : "Sao chép mã"}
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Delivery information */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Truck className="h-5 w-5 text-green-600 mr-2" />
                                        Thông tin giao hàng
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-600">Ngày giao hàng dự kiến:</p>
                                                <p className="font-medium text-gray-900">{deliveryDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-600">Địa chỉ giao hàng:</p>
                                                <p className="font-medium text-gray-900">{shippingAddress.name}</p>
                                                <p className="text-sm text-gray-700">{shippingAddress.phone}</p>
                                                <p className="text-sm text-gray-700">
                                                    {shippingAddress.address}, {shippingAddress.ward}, {shippingAddress.district},{" "}
                                                    {shippingAddress.city}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment information */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Receipt className="h-5 w-5 text-green-600 mr-2" />
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phương thức:</span>
                                            <span className="font-medium text-gray-900">{paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-900">Tổng cộng:</span>
                                            <span className="font-bold text-lg text-green-600">{formatCurrency(totalAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order items */}
                    <Card className="mb-6 border-green-100 shadow-md">
                        <CardContent className="p-6">
                            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                                <Package className="h-5 w-5 text-green-600 mr-2" />
                                Chi tiết đơn hàng
                            </h3>

                            <div className="space-y-4">
                                {displayItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                                            {item.variant && <p className="text-xs text-gray-500 mt-1">Loại: {item.variant}</p>}
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-gray-700">
                                                    {formatCurrency(item.price)} x {item.quantity}
                                                </p>
                                                <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {hasMoreItems && (
                                    <button
                                        className="w-full py-2 text-sm text-green-600 hover:text-green-700 flex items-center justify-center"
                                        onClick={() => setShowAllItems(!showAllItems)}
                                    >
                                        {showAllItems ? (
                                            <>
                                                <ChevronUp className="h-4 w-4 mr-1" />
                                                Thu gọn
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-4 w-4 mr-1" />
                                                Xem thêm {items.length - 2} sản phẩm
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order status */}
                    <Card className="mb-6 border-green-100 shadow-md overflow-hidden">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                            <h3 className="font-medium text-gray-900 flex items-center">
                                <Clock className="h-5 w-5 text-green-600 mr-2" />
                                Trạng thái đơn hàng
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200"></div>

                                <div className="relative pl-6 py-6 pr-4">
                                    <div className="flex items-start">
                                        <div className="absolute left-[22px] -translate-x-1/2 mt-1.5">
                                            <div className="h-4 w-4 rounded-full bg-green-500 ring-4 ring-green-50"></div>
                                        </div>
                                        <div className="ml-6">
                                            <h4 className="font-medium text-green-600">Đơn hàng đã được xác nhận</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{orderDate}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative pl-6 py-6 pr-4 border-t border-dashed border-gray-200">
                                    <div className="flex items-start">
                                        <div className="absolute left-[22px] -translate-x-1/2 mt-1.5">
                                            <div className="h-4 w-4 rounded-full bg-gray-300 ring-4 ring-green-50"></div>
                                        </div>
                                        <div className="ml-6">
                                            <h4 className="font-medium text-gray-600">Đang chuẩn bị hàng</h4>
                                            <p className="text-sm text-gray-600 mt-1">Chúng tôi đang chuẩn bị đơn hàng của bạn.</p>
                                            <div className="flex items-center mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${(5 - countdown) * 20}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500 min-w-[3rem]">
                          {Math.round((5 - countdown) * 20)}%
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next steps */}
                    <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 mb-8">
                        <h3 className="font-medium text-gray-900 mb-4">Bước tiếp theo</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Theo dõi đơn hàng</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Bạn có thể theo dõi trạng thái đơn hàng trong trang "Đơn hàng của tôi".
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Chuẩn bị nhận hàng</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Đơn hàng sẽ được giao đến địa chỉ của bạn vào ngày {deliveryDate}.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Đánh giá sản phẩm</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Sau khi nhận hàng, hãy đánh giá sản phẩm để giúp chúng tôi cải thiện dịch vụ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/orders">
                            <Button variant="outline" className="w-full sm:w-auto">
                                Xem đơn hàng của tôi
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button className="w-full sm:w-auto flex items-center gap-1.5">
                                <ShoppingBag className="h-4 w-4" />
                                Tiếp tục mua sắm
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Help section */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600">
                        Cần hỗ trợ?{" "}
                        <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                            Liên hệ với chúng tôi
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess

