"use client"

import { useEffect, useState, useContext } from "react"
import type { Product } from "../../types/product"
import {deleteReview, deleteReviewReply, getReviews} from "../../api/reviewApi"
import {
    Info,
    MessageSquare,
    Leaf,
    Star,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Reply,
    MessageCircle
} from "lucide-react"
import type {ReviewReplyResponse, ReviewResponse} from "../../types/review"
import { AddReviewDialog } from "./AddReviewDialog"
import { EditReviewDialog } from "./EditReviewDialog"
import { ReviewImageGallery } from "./ReviewImageGallery"
import { Button } from "../../components/ui/button"
import { UserContext } from "../../contexts/UserContext"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import {ReviewReplyDialog} from "./ReviewReplyDialog";

const ProductDetails = ({ product }: { product: Product }) => {
    const [activeTab, setActiveTab] = useState("details")
    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [isAddReviewOpen, setIsAddReviewOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null)
    const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null)
    const [replyingToReviewId, setReplyingToReviewId] = useState<number | null>(null)
    const [editingReply, setEditingReply] = useState<{ reviewId: number; reply: ReviewReplyResponse } | null>(null)
    const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null)
    const [reviewStats, setReviewStats] = useState({
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0],
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeletingReply, setIsDeletingReply] = useState(false)

    // Get current user from context
    const { user } = useContext(UserContext)!
    const currentUserId = user?.userId || 0
    // const isAdminOrStaff ="ADMIN"
    console.log("user", user)
    const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF"

    const fetchReviews = async (page = 1) => {
        setIsLoading(true)
        try {
            const data = await getReviews(product.id)

            // Sort reviews to put the current user's reviews at the top
            const sortedReviews = [...data.data.items].sort((a, b) => {
                if (a.userId === currentUserId && b.userId !== currentUserId) return -1
                if (a.userId !== currentUserId && b.userId === currentUserId) return 1
                return new Date(b.date).getTime() - new Date(a.date).getTime() // Most recent first
            })

            setReviews(sortedReviews)
            setCurrentPage(page)
            setTotalPages(Math.ceil(data.data.totalPages / 5))

            // Calculate review statistics
            if (data.data.items.length > 0) {
                const total = data.data.items.length
                const sum = data.data.items.reduce((acc, review) => acc + review.rating, 0)
                const average = sum / total

                const distribution = [0, 0, 0, 0, 0]
                data.data.items.forEach((review) => {
                    if (review.rating >= 1 && review.rating <= 5) {
                        distribution[review.rating - 1]++
                    }
                })

                setReviewStats({
                    average: Number.parseFloat(average.toFixed(1)),
                    total,
                    distribution,
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews(1)
    }, [product.id, activeTab])

    const handleReviewSuccess = () => {
        fetchReviews(currentPage)
    }

    const handleEditReview = (review: ReviewResponse) => {
        setEditingReview(review)
    }

    const handleDeleteReview = async () => {
        if (!deletingReviewId) return

        setIsDeleting(true)
        try {
            await deleteReview(deletingReviewId)
            fetchReviews(currentPage)
        } catch (error) {
            console.error("Error deleting review:", error)
        } finally {
            setIsDeleting(false)
            setDeletingReviewId(null)
        }
    }

    const handleReplyToReview = (reviewId: number) => {
        setReplyingToReviewId(reviewId)
    }

    const handleEditReply = (reviewId: number, reply: ReviewReplyResponse) => {
        setEditingReply({ reviewId, reply })
    }

    const handleDeleteReply = async () => {
        if (!deletingReplyId) return

        setIsDeletingReply(true)
        try {
            await deleteReviewReply(deletingReplyId)
            fetchReviews(currentPage)
        } catch (error) {
            console.error("Error deleting review reply:", error)
        } finally {
            setIsDeletingReply(false)
            setDeletingReplyId(null)
        }
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        fetchReviews(page)
    }

    const userHasReviewed = reviews.some((review) => review.userId === currentUserId)

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
                    <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{reviewStats.total}</span>
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
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-800">Đánh giá từ khách hàng</h2>
                                <div className="flex items-center mt-1">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= Math.round(reviewStats.average) ? "fill-current" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-600">
                    {reviewStats.average}/5 ({reviewStats.total} đánh giá)
                  </span>
                                </div>

                                {/* Rating distribution */}
                                <div className="mt-4 space-y-2 max-w-md">
                                    {[5, 4, 3, 2, 1].map((rating) => {
                                        const count = reviewStats.distribution[rating - 1]
                                        const percentage = reviewStats.total > 0 ? Math.round((count / reviewStats.total) * 100) : 0

                                        return (
                                            <div key={rating} className="flex items-center gap-2">
                                                <div className="flex items-center w-12">
                                                    <span className="text-sm text-gray-600">{rating}</span>
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                                                </div>
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                                                </div>
                                                <span className="text-sm text-gray-600 w-12">{count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {!userHasReviewed && (
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() => setIsAddReviewOpen(true)}
                                >
                                    Viết đánh giá
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có đánh giá nào</h3>
                                <p className="text-gray-600 mb-4">Hãy là người đầu tiên đánh giá sản phẩm này</p>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() => setIsAddReviewOpen(true)}
                                >
                                    Viết đánh giá
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className={`border-b border-gray-200 pb-6 ${
                                                review.userId === currentUserId ? "bg-green-50 p-4 rounded-lg border border-green-100" : ""
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center">
                                                        <h3 className="font-medium text-gray-800">{review.fullName}</h3>
                                                        {review.userId === currentUserId && (
                                                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Đánh giá của bạn
                              </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                                                            ))}
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    {review.userId === currentUserId && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditReview(review)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDeletingReviewId(review.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}

                                                    {isAdminOrStaff && !review.reply && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReplyToReview(review.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            <Reply className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-3 text-gray-700">{review.comment}</p>

                                            {/* Review images */}
                                            {review.images && review.images.length > 0 && <ReviewImageGallery images={review.images} />}

                                            {/* Review Reply */}
                                            {review.reply && (
                                                <div className="mt-4 pl-6 border-l-2 border-green-200">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center">
                                                                    <MessageCircle className="h-4 w-4 text-green-600 mr-2" />
                                                                    <h4 className="font-medium text-gray-800 text-sm">
                                                                        Phản hồi từ {review.reply.fullName}
                                                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      Nhân viên
                                    </span>
                                                                    </h4>
                                                                </div>
                                                                <span className="text-xs text-gray-500 ml-6">{review.reply.date}</span>
                                                            </div>

                                                            {isAdminOrStaff && (
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEditReply(review.id, review.reply)}
                                                                        className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => setDeletingReplyId(review.reply.id)}
                                                                        className="h-7 w-7 p-0 text-red-600 hover:text-red-800"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="mt-2 text-gray-700 ml-6">{review.reply.reply}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center mt-8 space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
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

            {/* Add Review Dialog */}
            <AddReviewDialog
                open={isAddReviewOpen}
                onOpenChange={setIsAddReviewOpen}
                productId={product.id}
                userId={currentUserId}
                onSuccess={handleReviewSuccess}
            />

            {/* Edit Review Dialog */}
            {editingReview && (
                <EditReviewDialog
                    open={!!editingReview}
                    onOpenChange={(open) => {
                        if (!open) setEditingReview(null)
                    }}
                    review={editingReview}
                    onSuccess={handleReviewSuccess}
                />
            )}

            {/* Reply to Review Dialog */}
            {replyingToReviewId && (
                <ReviewReplyDialog
                    open={!!replyingToReviewId}
                    onOpenChange={(open) => {
                        if (!open) setReplyingToReviewId(null)
                    }}
                    reviewId={replyingToReviewId}
                    userId={currentUserId}
                    onSuccess={handleReviewSuccess}
                />
            )}

            {/* Edit Reply Dialog */}
            {editingReply && (
                <ReviewReplyDialog
                    open={!!editingReply}
                    onOpenChange={(open) => {
                        if (!open) setEditingReply(null)
                    }}
                    reviewId={editingReply.reviewId}
                    userId={currentUserId}
                    existingReply={editingReply.reply}
                    onSuccess={handleReviewSuccess}
                />
            )}

            {/* Delete Review Confirmation Dialog */}
            <AlertDialog
                open={!!deletingReviewId}
                onOpenChange={(open) => {
                    if (!open) setDeletingReviewId(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteReview} className="bg-red-500 hover:bg-red-600">
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Reply Confirmation Dialog */}
            <AlertDialog
                open={!!deletingReplyId}
                onOpenChange={(open) => {
                    if (!open) setDeletingReplyId(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa phản hồi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteReply} className="bg-red-500 hover:bg-red-600">
                            {isDeletingReply ? "Đang xóa..." : "Xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ProductDetails
