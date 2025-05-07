"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Star, Upload, X } from "lucide-react"
import type { ReviewRequest } from "../../types/review"
import { addReview } from "../../api/reviewApi"

interface AddReviewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    productId: number
    userId: number
    onSuccess: () => void
}

export function AddReviewDialog({ open, onOpenChange, productId, userId, onSuccess }: AddReviewDialogProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const handleRatingChange = (value: number) => {
        setRating(value)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files)
            const newPreviews = newImages.map((file) => URL.createObjectURL(file))

            setImages((prev) => [...prev, ...newImages])
            setPreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))

        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previews[index])
        setPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Vui lòng chọn số sao đánh giá")
            return
        }

        if (comment.trim() === "") {
            setError("Vui lòng nhập nội dung đánh giá")
            return
        }

        setError("")
        setIsSubmitting(true)

        try {

            const reviewData: ReviewRequest = {
                userId,
                productId,
                rating,
                comment,
            }

            await addReview(reviewData, images)

            // Reset form
            setRating(0)
            setComment("")
            setImages([])
            setPreviews([])

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting review:", error)
            setError("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Viết đánh giá sản phẩm</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

                    <div className="space-y-2">
                        <Label>Đánh giá của bạn</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(star)}
                                    className="focus:outline-none"
                                >
                                    <Star className={`h-8 w-8 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Nội dung đánh giá</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hình ảnh (không bắt buộc)</Label>

                        <div className="grid grid-cols-4 gap-2">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview || "/placeholder.svg"}
                                        alt={`Preview ${index}`}
                                        className="h-20 w-20 object-cover rounded-md border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {previews.length < 5 && (
                                <label className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                    <Upload className="h-6 w-6 text-gray-400" />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Tối đa 5 hình ảnh (2MB mỗi ảnh)</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-500 hover:bg-green-600">
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
