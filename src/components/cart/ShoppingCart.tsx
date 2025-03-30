"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import { deleteCartItem, getCartById, updateCartItem } from "../../api/cartApi"
import { type Cart, type CartItem, mapCartItemToRequest } from "../../types/cart"
import { UserContext } from "../../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, RefreshCw, CreditCard, Truck, Shield } from "lucide-react"

const ShoppingCart: React.FC = () => {
    const [shipping, setShipping] = useState("Miễn phí")
    const { getQuantityCartItem } = useContext(UserContext)!
    const [cart, setCart] = useState<Cart>()
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState<number | null>(null)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const formatPriceVND = (price: number) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    const navigate = useNavigate()
    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true)
            try {
                const userData = localStorage.getItem("user")
                if (!userData) {
                    setIsLoading(false)
                    return
                }

                const user = JSON.parse(userData)
                const data = await getCartById(user.cartId)
                setCart(data)

                // Auto-select all items by default
                if (data?.cartItem?.length > 0) {
                    setSelectedItems(data.cartItem.map((item) => item.id))
                }
            } catch (err) {
                console.error("Error fetching cart:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCart()
    }, [])

    useEffect(() => {
        if (!cart?.cartItem) return

        const newTotal = cart.cartItem
            .filter((item) => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + item.productVariant.price * item.quantity, 0)

        setTotalPrice(newTotal)
    }, [selectedItems, cart])

    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedItems(e.target.checked ? (cart?.cartItem ? cart.cartItem.map((p) => p.id) : []) : [])
    }

    const handleUpdateCartItem = async (type: string, id: number, cartItem: CartItem) => {
        try {
            setIsUpdating(id)
            let newQuantity = cartItem.quantity

            if (type === "minus") {
                newQuantity = cartItem.quantity - 1
                if (newQuantity === 0) {
                    await handleDeleteCartItem(id)
                    return
                }
            } else if (type === "plus") {
                newQuantity = cartItem.quantity + 1
            }

            const updatedCartItem: CartItem = { ...cartItem, quantity: newQuantity }
            const cartItemRequest = mapCartItemToRequest(updatedCartItem, id)

            const response = await updateCartItem(id, cartItemRequest)
            if (response.status === 200) {
                setCart((prevCart) => {
                    if (!prevCart) return prevCart
                    return {
                        ...prevCart,
                        cartItem: prevCart.cartItem.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)),
                    }
                })
            }
            getQuantityCartItem()
        } catch (error) {
            console.error("Error updating cart item quantity:", error)
        } finally {
            setIsUpdating(null)
        }
    }

    const handleDeleteCartItem = async (id: number) => {
        try {
            setIsDeleting(id)
            const response = await deleteCartItem(id)
            if (response.status === 200) {
                setCart((prevCart) => {
                    if (!prevCart) return prevCart
                    return {
                        ...prevCart,
                        cartItem: prevCart.cartItem.filter((item) => item.id !== id),
                    }
                })
                getQuantityCartItem()
                setSelectedItems((prev) => prev.filter((itemId) => itemId !== id))
            }
        } catch (error) {
            console.error("Error deleting cart item:", error)
        } finally {
            setIsDeleting(null)
        }
    }

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán")
            return
        }

        const selectedCartItems = cart?.cartItem.filter((item) => selectedItems.includes(item.id)) || []

        navigate("/order-confirm", { state: { selectedCartItems } })
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Đang tải giỏ hàng...</p>
            </div>
        )
    }

    if (!cart || cart.cartItem.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="bg-gray-50 p-8 rounded-xl text-center max-w-md w-full">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-600 mb-6">
                        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm để tìm sản phẩm bạn yêu thích.
                    </p>
                    {/*<Link*/}
                    {/*    href="/products"*/}
                    {/*    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"*/}
                    {/*>*/}
                    {/*    <ArrowLeft className="w-4 h-4 mr-2" />*/}
                    {/*    Tiếp tục mua sắm*/}
                    {/*</Link>*/}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Giỏ hàng của tôi</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Cart items */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="bg-gray-50 text-left text-sm text-gray-500 uppercase">
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            onChange={handleSelectAll}
                                            checked={selectedItems.length === cart.cartItem.length && cart.cartItem.length > 0}
                                        />
                                    </th>
                                    <th className="px-4 py-3">Sản phẩm</th>
                                    <th className="px-4 py-3 text-center">Giá</th>
                                    <th className="px-4 py-3 text-center">Số lượng</th>
                                    <th className="px-4 py-3 text-center">Tổng</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {cart.cartItem.map((cartItem) => (
                                    <tr key={cartItem.id} className={`${isDeleting === cartItem.id ? "opacity-50" : ""}`}>
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                checked={selectedItems.includes(cartItem.id)}
                                                onChange={() => handleCheckboxChange(cartItem.id)}
                                                disabled={isDeleting === cartItem.id}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                                    <img
                                                        src={cartItem.productVariant.thumbnailUrl || "/placeholder.svg"}
                                                        alt={cartItem.productVariant.name}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {cartItem.productVariant.name}
                                                    </h3>
                                                    {cartItem.productVariant.name && (
                                                        <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                                            {cartItem.productVariant.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm">{formatPriceVND(cartItem.productVariant.price)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="inline-flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    type="button"
                                                    className={`p-2 text-gray-600 hover:text-gray-900 ${
                                                        cartItem.quantity <= 1 ? "text-gray-300 cursor-not-allowed" : ""
                                                    }`}
                                                    onClick={() => handleUpdateCartItem("minus", cartItem.id, cartItem)}
                                                    disabled={isUpdating === cartItem.id || cartItem.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">
                            {isUpdating === cartItem.id ? (
                                <span className="inline-block h-4 w-4 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></span>
                            ) : (
                                cartItem.quantity
                            )}
                          </span>
                                                <button
                                                    type="button"
                                                    className="p-2 text-gray-600 hover:text-gray-900"
                                                    onClick={() => handleUpdateCartItem("plus", cartItem.id, cartItem)}
                                                    disabled={isUpdating === cartItem.id}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center text-sm font-medium">
                                            {formatPriceVND(cartItem.productVariant.price * cartItem.quantity)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-red-500"
                                                onClick={() => handleDeleteCartItem(cartItem.id)}
                                                disabled={isDeleting === cartItem.id}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 justify-between">
                            {/*<Link*/}
                            {/*    href="/products"*/}
                            {/*    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"*/}
                            {/*>*/}
                            {/*    <ArrowLeft className="w-4 h-4 mr-2" />*/}
                            {/*    Tiếp tục mua sắm*/}
                            {/*</Link>*/}
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Cập nhật giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-4">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-800">Tổng giỏ hàng</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Tạm tính ({selectedItems.length} sản phẩm):</span>
                                <span className="font-medium">{formatPriceVND(totalPrice)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
                                <span className="text-gray-600">Phí vận chuyển:</span>
                                <span className="font-medium text-green-600">{shipping}</span>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-gray-800 font-medium">Tổng cộng:</span>
                                <span className="text-xl font-bold text-gray-900">{formatPriceVND(totalPrice)}</span>
                            </div>

                            <button
                                type="button"
                                className={`w-full mt-4 py-3 px-4 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center ${
                                    selectedItems.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                                }`}
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Tiến hành thanh toán
                            </button>

                            {/* Additional info */}
                            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">Miễn phí vận chuyển</h4>
                                        <p className="text-xs text-gray-500">Cho đơn hàng từ 300.000đ</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">Đảm bảo chất lượng</h4>
                                        <p className="text-xs text-gray-500">Sản phẩm chính hãng 100%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart

