"use client"

import { useState } from "react"
import { CreditCard, MapPin, MessageCircle, Package, Receipt, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

const OrderConfirmation = () => {
    const [selectedMethod, setSelectedMethod] = useState("cod")

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Xác Nhận Đơn Hàng</h1>

            {/* Shipping Address */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-primary mr-2 text-red-500"  />
                        <CardTitle className="text-lg font-semibold text-primary text-red-500">Địa Chỉ Nhận Hàng</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-medium">Lê Minh Hiếu</p>
                            <p className="text-muted-foreground">(+84) 345778312</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">
                                Trung Tâm Dạy Nghề & Giáo Dục Thường Xuyên Huyện An Phú, Đường Không Tên, Thị Trấn An Phú, Huyện An Phú,
                                An Giang
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Thay Đổi
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center">
                        <Package className="h-5 w-5 text-primary mr-2" />
                        <CardTitle className="text-lg font-semibold text-primary">Chi Tiết Sản Phẩm</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left p-2 font-medium text-sm w-[120px]">Sản phẩm</th>
                                <th className="text-left p-2 font-medium text-sm"></th>
                                <th className="text-left p-2 font-medium text-sm">Đơn giá</th>
                                <th className="text-left p-2 font-medium text-sm">Số lượng</th>
                                <th className="text-right p-2 font-medium text-sm">Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="p-2">
                                    <div className="h-20 w-20 rounded-md overflow-hidden border">
                                        <img
                                            src="http://res.cloudinary.com/digtjnoh3/image/upload/v1740147420/u72kxxkaiedgkvh4swbl.jpg"
                                            alt="Sản phẩm"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-2">
                                    <p className="font-medium">Set 3 cuộn túi đựng rác tự phân hủy sinh học</p>
                                    <p className="text-sm text-muted-foreground">Loại: Set - 3 cuộn</p>
                                </td>
                                <td className="p-2 text-sm">₫9.500</td>
                                <td className="p-2 text-sm">1</td>
                                <td className="p-2 text-sm text-right font-medium">₫9.500</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Voucher */}
            <Card className="mb-4 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Receipt className="h-5 w-5 text-primary mr-2" />
                            <h2 className="text-lg font-semibold">Shopee Voucher</h2>
                        </div>
                        <Button variant="destructive" size="sm">
                            Chọn voucher
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Message and Shipping Info */}
            <Card className="mb-4 shadow-sm">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Message for seller */}
                        <div>
                            <div className="flex items-center mb-3">
                                <MessageCircle className="h-5 w-5 text-primary mr-2" />
                                <h2 className="text-lg font-semibold">Lời nhắn cho người bán</h2>
                            </div>
                            <Textarea placeholder="Nhập lời nhắn của bạn..." className="resize-none" />
                        </div>

                        {/* Shipping info */}
                        <div>
                            <div className="flex items-center mb-3">
                                <Truck className="h-5 w-5 text-primary mr-2" />
                                <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Ngày giao hàng dự kiến:</span>
                                    <span className="font-medium">20/03/2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                                    <span className="font-medium">₫5.000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method and Total */}
            <Card className="shadow-sm">
                <CardContent className="p-4">
                    {/* Payment method */}
                    <div className="mb-6">
                        <div className="flex items-center mb-3">
                            <CreditCard className="h-5 w-5 text-primary mr-2" />
                            <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <div
                                className={`py-2 px-4 border rounded-md cursor-pointer transition-all ${
                                    selectedMethod === "shopeepay"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "hover:border-muted-foreground"
                                }`}
                                onClick={() => setSelectedMethod("shopeepay")}
                            >
                                Ví ShopeePay
                            </div>
                            <div
                                className={`py-2 px-4 border rounded-md cursor-pointer transition-all ${
                                    selectedMethod === "cod"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "hover:border-muted-foreground"
                                }`}
                                onClick={() => setSelectedMethod("cod")}
                            >
                                Thanh toán khi nhận hàng
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order summary */}
                    <div className="flex flex-col items-end">
                        <div className="flex gap-4 mb-2">
                            <span className="text-muted-foreground">Tổng tiền hàng:</span>
                            <span className="font-medium">₫9.500</span>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <span className="text-muted-foreground">Phí vận chuyển:</span>
                            <span className="font-medium">₫5.000</span>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <span className="text-lg font-semibold">Tổng thanh toán:</span>
                            <span className="text-lg font-bold text-destructive">₫14.500</span>
                        </div>
                        <Button size="lg" className="bg-destructive bg-red-600 hover:bg-destructive/90">
                            Đặt hàng
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderConfirmation

