"use client"

import { useEffect, useState } from "react"
import { useLoaderData } from "react-router-dom"
import ProductImageGallery from "./ProductImageGallery"
import ProductInfo from "./ProductInfo"
import ProductDetails from "./ProductDetail"
import type { Product } from "../../types/product"
import { Loader2 } from "lucide-react"

const ProductDetailsMain = () => {
    const product = useLoaderData() as Product
    const [loading, setLoading] = useState(true)
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])

    useEffect(() => {
        if (product) {
            setLoading(false)

            // Simulate fetching recently viewed products
            setTimeout(() => {
                setRecentlyViewed([product, product, product])
            }, 1000)
        }
    }, [product])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 text-green-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex text-sm">
                    <li className="flex items-center">
                        <a href="/" className="text-gray-500 hover:text-green-600">
                            Trang chủ
                        </a>
                        <span className="mx-2 text-gray-400">/</span>
                    </li>
                    <li className="flex items-center">
                        <a href="/category" className="text-gray-500 hover:text-green-600">
                            {product.category.name}
                        </a>
                        <span className="mx-2 text-gray-400">/</span>
                    </li>
                    <li className="text-green-600 font-medium truncate">{product.name}</li>
                </ol>
            </nav>

            {/* Product main section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="p-6 lg:border-r border-gray-100">
                        <ProductImageGallery product={product} />
                    </div>
                    <div className="p-6">
                        <ProductInfo product={product} />
                    </div>
                </div>
            </div>

            {/* Product details section */}
            <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <ProductDetails product={product} />
            </div>

            {/* Recently viewed products */}
            {recentlyViewed.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Sản phẩm đã xem gần đây</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentlyViewed.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={item.thumbnailUrl || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <p className="text-xs text-green-600 font-medium">{item.category.name}</p>
                                    <h4 className="font-medium text-gray-800 mt-1 line-clamp-2">{item.name}</h4>
                                    <p className="text-green-600 font-bold mt-2">100,000 đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetailsMain

