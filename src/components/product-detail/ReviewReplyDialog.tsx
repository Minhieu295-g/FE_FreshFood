"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { addReviewReply, updateReviewReply } from "../../api/reviewApi"
import type { ReviewReplyRequest, ReviewReplyResponse } from "../../types/review"
import { Loader2 } from "lucide-react"

interface ReviewReplyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    reviewId: number
    userId: number
    existingReply?: ReviewReplyResponse
    onSuccess: () => void
}

export function ReviewReplyDialog({
                                      open,
                                      onOpenChange,
                                      reviewId,
                                      userId,
                                      existingReply,
                                      onSuccess,
                                  }: ReviewReplyDialogProps) {
    const [replyText, setReplyText] = useState(existingReply?.reply || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditMode = !!existingReply

    const handleSubmit = async () => {
        if (!replyText.trim()) {
            setError("Vui lòng nhập nội dung phản hồi")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const replyRequest: ReviewReplyRequest = {
                reviewId,
                userId,
                replyText: replyText.trim(),
            }

            if (isEditMode && existingReply) {
                await updateReviewReply(existingReply.id, replyRequest)
            } else {
                await addReviewReply(replyRequest)
            }

            onSuccess()
            onOpenChange(false)
        } catch (err) {
            console.error("Error submitting reply:", err)
            setError("Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại sau.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Chỉnh sửa phản hồi" : "Phản hồi đánh giá"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Nhập nội dung phản hồi của bạn..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? "Cập nhật" : "Gửi phản hồi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
