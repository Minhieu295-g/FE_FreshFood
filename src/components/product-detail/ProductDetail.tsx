"use client"

import { useState } from "react"
import type { Product } from "../../types/product"
import { Info, MessageSquare, Leaf, Star } from "lucide-react"

const ProductDetails = ({ product }: { product: Product }) => {
    const [activeTab, setActiveTab] = useState("details")

    // Sample review data
    const reviews = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            rating: 5,
            date: "15/03/2023",
            comment: "Sản phẩm rất tươi và ngon, giao hàng nhanh.",
        },
        { id: 2, name: "Trần Thị B", rating: 4, date: "10/03/2023", comment: "Chất lượng tốt, đóng gói cẩn thận." },
        { id: 3, name: "Lê Văn C", rating: 5, date: "05/03/2023", comment: "Rất hài lòng với sản phẩm, sẽ mua lại." },
    ]

    return (
        <div>
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "details"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("details")}
                >
                    <Info className="h-4 w-4 mr-2" />
                    Thông tin sản phẩm
                </button>
                <button
                    className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "reviews"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Đánh giá
                    <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">30</span>
                </button>
                <button
                    className={`flex items-center py-3 px-4 text-sm font-medium focus:outline-none ${
                        activeTab === "storage"
                            ? "border-b-2 border-green-500 text-green-600"
                            : "text-gray-600 hover:text-green-500"
                    }`}
                    onClick={() => setActiveTab("storage")}
                >
                    <Leaf className="h-4 w-4 mr-2" />
                    Bảo quản
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
                {activeTab === "details" && (
                    <div className="prose prose-green max-w-none">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{product.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                <p className="text-gray-700 leading-relaxed mt-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl vel
                                    ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel
                                    ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                      </svg>
                    </span>
                                        <span className="text-gray-700">100% tự nhiên, không chất bảo quản</span>
                                    </li>
                                    <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                      </svg>
                    </span>
                                        <span className="text-gray-700">Giàu vitamin và khoáng chất</span>
                                    </li>
                                    <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                      </svg>
                    </span>
                                        <span className="text-gray-700">Thu hoạch trong ngày</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-3">Thông tin dinh dưỡng</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Calories</span>
                                        <span className="font-medium">120 kcal</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Protein</span>
                                        <span className="font-medium">5g</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Carbohydrates</span>
                                        <span className="font-medium">20g</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Fat</span>
                                        <span className="font-medium">2g</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Fiber</span>
                                        <span className="font-medium">3g</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">Đánh giá từ khách hàng</h2>
                                <div className="flex items-center mt-1">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-5 w-5 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-600">4.8/5 (30 đánh giá)</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                Viết đánh giá
                            </button>
                        </div>

                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-200 pb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{review.name}</h3>
                                            <div className="flex items-center mt-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "storage" && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Hướng dẫn bảo quản</h2>
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                            <p className="text-green-700">
                                Để đảm bảo sản phẩm luôn tươi ngon và giữ được hương vị tốt nhất, vui lòng làm theo các hướng dẫn bảo
                                quản dưới đây.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </span>
                                    Nhiệt độ bảo quản
                                </h3>
                                <p className="text-gray-700">
                                    Bảo quản ở nhiệt độ 2-5°C trong ngăn mát tủ lạnh để giữ độ tươi ngon tối đa.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                      />
                    </svg>
                  </span>
                                    Đóng gói
                                </h3>
                                <p className="text-gray-700">
                                    Giữ sản phẩm trong bao bì gốc hoặc hộp kín để tránh tiếp xúc với không khí và mùi từ các thực phẩm
                                    khác.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                      />
                    </svg>
                  </span>
                                    Thời hạn sử dụng
                                </h3>
                                <p className="text-gray-700">
                                    Sử dụng trong vòng 3-5 ngày kể từ ngày mua để đảm bảo chất lượng tốt nhất.
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-500 mr-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                      />
                    </svg>
                  </span>
                                    Lưu ý đặc biệt
                                </h3>
                                <p className="text-gray-700">
                                    Rửa sạch trước khi sử dụng. Không nên rửa trước khi bảo quản để tránh làm hỏng sản phẩm.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDetails

