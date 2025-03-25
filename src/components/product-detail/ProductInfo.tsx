"use client"

import { useState } from "react"
import type { Product } from "../../types/product"
import { ShoppingCart, TruckIcon, ShieldCheck, Share2 } from "lucide-react"

const ProductInfo = ({ product }: { product: Product }) => {
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1))
    const handleIncrease = () => setQuantity((prev) => prev + 1)

    const handleAddToCart = () => {
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
        // Add to cart logic here
    }

    // Calculate discount percentage
    const originalPrice = 110000
    const discountedPrice = 100000
    const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

    return (
        <div>
            {/* Category badge */}
            <div className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full mb-2">
                {product.category.name}
            </div>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">{product.name}</h1>

            {/* Ratings */}
            <div className="flex items-center mt-3">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-green-600 text-sm font-medium ml-2">4.8</span>
                <span className="text-gray-500 text-sm ml-2">(245 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end">
                <span className="text-3xl font-bold text-gray-800">{discountedPrice.toLocaleString("vi-VN")} đ</span>
                <span className="text-lg text-gray-400 line-through ml-2">{originalPrice.toLocaleString("vi-VN")} đ</span>
                <span className="ml-2 px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded">-{discountPercentage}%</span>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Quantity selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                <div className="flex items-center">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={handleDecrease}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-xl">−</span>
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            min={1}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-14 h-10 text-center border-x border-gray-300 focus:outline-none"
                        />
                        <button
                            onClick={handleIncrease}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-xl">+</span>
                        </button>
                    </div>
                    <span className="ml-3 text-sm text-gray-500">Còn 50 sản phẩm</span>
                </div>
            </div>

            {/* Add to cart button */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
                        addedToCart ? "bg-green-600 text-white" : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                    <ShoppingCart className="h-5 w-5" />
                    {addedToCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
                </button>
                <button className="flex-1 py-3 px-6 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                    Mua ngay
                </button>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Product info table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <TruckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-gray-800">Giao hàng nhanh</h4>
                        <p className="text-sm text-gray-600">Giao hàng trong vòng 24h</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-medium text-gray-800">Đảm bảo chất lượng</h4>
                        <p className="text-sm text-gray-600">Sản phẩm tươi mới mỗi ngày</p>
                    </div>
                </div>
            </div>

            {/* Product details table */}
            <div className="mt-6">
                <table className="w-full text-sm">
                    <tbody>
                    <tr className="border-t border-gray-200">
                        <td className="py-3 font-medium text-gray-700 w-1/3">Mã sản phẩm</td>
                        <td className="py-3 text-gray-600">SP{product.id.toString().padStart(4, "0")}</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                        <td className="py-3 font-medium text-gray-700">Trạng thái</td>
                        <td className="py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Còn hàng
                </span>
                        </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                        <td className="py-3 font-medium text-gray-700">Loại</td>
                        <td className="py-3 text-gray-600">{product.category.name}</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                        <td className="py-3 font-medium text-gray-700">Chia sẻ</td>
                        <td className="py-3">
                            <div className="flex space-x-2">
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductInfo

