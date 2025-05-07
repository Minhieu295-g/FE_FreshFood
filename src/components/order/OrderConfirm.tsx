"use client"
import React, {useContext, useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import { CreditCard, MapPin, MessageCircle, Package, Receipt, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useLocation } from "react-router-dom"
import {CartItem} from "../../types/cart";
import {getDeliveryAddressDefault, getDeliveryFee} from "../../api/deliveryAddressApi";
import {DeliveryAddressResponse, DeliveryFeeResponse} from "../../types/address";
import {toast} from "react-toastify";
import {createOrder} from "../../api/orderApi";
import {OrderRequest, OrderSuccessProps} from "../../types/order";
import {UserContext} from "../../contexts/UserContext";
import { format } from "date-fns";

const OrderConfirmation = () => {
    const [selectedMethod, setSelectedMethod] = useState("COD")
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddressResponse>();
    const [deliveryFee, setDeliveryFee] = useState<DeliveryFeeResponse>();
    const [formData, setFormData] = useState({
        note: "",
    })
    const location = useLocation()
    const selectedCartItems = location.state?.selectedCartItems || []
    const navigate = useNavigate();
    const { getQuantityCartItem } = useContext(UserContext)!

    const calculateTotalPrice = (items: CartItem[]) => {
        return items.reduce((total: number, item) => total + item.productVariant.price * item.quantity, 0)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

    }

    useEffect(() => {
        const fetchDeliveryInfo = async () => {
            try {
                const userData = localStorage.getItem("user");
                if (userData==null){
                    return;
                }
                const user = JSON.parse(userData);
                console.log(user)
                const address = await getDeliveryAddressDefault(user.userId, true)
                setDeliveryAddress(address)

                if (address && address.id) {
                    const fee = await getDeliveryFee(address.id)
                    setDeliveryFee(fee)
                }
            } catch (error) {
                console.error("Failed to fetch delivery info:", error)
            }
        }

        fetchDeliveryInfo()
    }, [])

    const handleOrder = async () => {
        try {
            const userData = localStorage.getItem("user");
            if (!userData) {
                toast.error("Vui lòng đăng nhập trước khi đặt hàng!");
                return;
            }
            const user = JSON.parse(userData);

            if (!deliveryAddress || !deliveryFee) {
                toast.error("Thông tin giao hàng chưa đầy đủ!");
                return;
            }

            const orderData: OrderRequest = {
                totalPrice: Number(totalPrice) + Number(deliveryFee?.deliveryFee),
                note: formData.note || "",
                deliveryFee: Number(deliveryFee?.deliveryFee) || 0,
                expectedDeliveryDate: deliveryFee?.deliveryDate || "",
                paymentMethod: selectedMethod ?? "COD",
                voucherId: 0,
                deliveryAddressId: deliveryAddress?.id ?? 0,
                userId: user?.userId ?? 0,
                cartItems: selectedCartItems
            };
            console.log("Order data : ")
            console.log(orderData)

            try {
                const response = await createOrder(orderData);
                const orderDetails: OrderSuccessProps = {
                    orderNumber: response.data,
                    orderDate: format(new Date(), "dd/MM/yyyy HH:mm"),
                    deliveryFee: orderData.deliveryFee,
                    deliveryDate: orderData.expectedDeliveryDate,
                    totalAmount: orderData.totalPrice,
                    paymentMethod: "Thanh toán khi nhận hàng (COD)",
                    shippingAddress: {
                        name: deliveryAddress.name,
                        phone: "(+84) " + deliveryAddress.numberPhone,
                        address: deliveryAddress.detailAddress,
                        city: deliveryAddress.provinceName,
                        district: deliveryAddress.districtName,
                        ward: deliveryAddress.wardName,
                    },
                    items: selectedCartItems.map((cartItem : CartItem, index: number) => ({
                        id: cartItem.productVariant.id,
                        name: cartItem.productVariant.name,
                        price: cartItem.productVariant.price,
                        quantity: cartItem.quantity,
                        image: cartItem.productVariant.thumbnailUrl,
                        variant: cartItem.productVariant.unit,
                    }))                  }

                if (orderData.paymentMethod === "BANK_TRANSFER") {
                    orderDetails.orderNumber = ""
                    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
                    window.location.href = response.data;  // 🔥 Redirect đến VNPay
                } else {
                    getQuantityCartItem()
                    toast.success("Đặt hàng thành công!");
                    navigate("/order-success", {state: {orderDetails}});
                }
            } catch (error) {
                console.error("Lỗi khi đặt hàng:", error);
                toast.error("Đặt hàng thất bại, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Đặt hàng thất bại, vui lòng thử lại!");
        }
    };
    const totalPrice = calculateTotalPrice(selectedCartItems)
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
                            <p className="font-medium">{deliveryAddress?.name}</p>
                            <p className="text-muted-foreground">(+84) {deliveryAddress?.numberPhone}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">
                                {deliveryAddress?.detailAddress}
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
                            {selectedCartItems.map((item: CartItem) => (
                                <tr key={item.id} className="">
                                    {/* Thumbnail */}
                                    <td className="p-2">
                                        <div className="h-20 w-20 rounded-md overflow-hidden border">
                                            <img
                                                src={item.productVariant.thumbnailUrl}
                                                alt={item.productVariant.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </td>

                                    {/* Tên sản phẩm + Loại */}
                                    <td className="p-2">
                                        <p className="font-medium">{item.productVariant.name}</p>
                                        <p className="text-sm text-muted-foreground">Loại: {item.productVariant.unit}</p>
                                    </td>

                                    {/* Đơn giá */}
                                    <td className="p-2 text-sm">₫{item.productVariant.price.toLocaleString("vi-VN")}</td>

                                    {/* Số lượng */}
                                    <td className="p-2 text-sm">{item.quantity}</td>

                                    {/* Thành tiền */}
                                    <td className="p-2 text-sm text-right font-medium">
                                        ₫{(item.productVariant.price * item.quantity).toLocaleString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
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
                            <Receipt className="h-5 w-5 text-primary mr-2"/>
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
                                <MessageCircle className="h-5 w-5 text-primary mr-2"/>
                                <h2 className="text-lg font-semibold">Lời nhắn cho người bán</h2>
                            </div>
                            <Textarea placeholder="Nhập lời nhắn của bạn..." className="resize-none" name={"note"} value={formData.note} onChange={handleChange} />
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
                                    <span className="font-medium">{deliveryFee?.deliveryDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phí vận chuyển:</span>
                                    <span className="font-medium">  ₫{Number(deliveryFee?.deliveryFee).toLocaleString("vi-VN")} </span>
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
                                    selectedMethod === "COD"
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "hover:border-gray-300"
                                }`}
                                onClick={() => setSelectedMethod("COD")}
                            >
                                Thanh toán khi nhận hàng
                            </div>
                            <div
                                key={"BANK_TRANSFER"}
                                className={`py-2 px-4 border rounded-md cursor-pointer transition-all ${
                                    selectedMethod === "BANK_TRANSFER"
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "hover:border-gray-300"
                                }`}
                                onClick={() => setSelectedMethod("BANK_TRANSFER")}
                            >
                                Thanh toán qua ngân hàng
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4"/>

                    {/* Order summary */}
                    <div className="flex flex-col items-end">
                        <div className="flex gap-4 mb-2">
                            <span className="text-muted-foreground">Tổng tiền hàng:</span>
                            <span className="font-medium">   ₫{totalPrice.toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <span className="text-muted-foreground">Phí vận chuyển:</span>
                            <span className="font-medium">₫{Number(deliveryFee?.deliveryFee).toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex gap-4 mb-4">
                            <span className="text-lg font-semibold">Tổng thanh toán:</span>
                            <span className="text-lg font-bold text-destructive">   ₫{(totalPrice + Number(deliveryFee?.deliveryFee)).toLocaleString("vi-VN")} </span>
                        </div>
                        <Button size="lg" className="bg-destructive bg-red-600 hover:bg-destructive/90" onClick={handleOrder}>
                            Đặt hàng
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderConfirmation

