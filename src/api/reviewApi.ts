import api from "./api";
import {ApiResponse, PaginatedResponse} from "../types/api";
import {ReviewReplyRequest, ReviewRequest, ReviewResponse} from "../types/review";

export const getReviews = async (id: number): Promise<ApiResponse<PaginatedResponse<ReviewResponse>>> => {
    const response = await api.get(`review/product/${id}`);
    if (response.status === 200) {
        console.log(response.data);
        return response.data;
    }

    throw new Error('Không tìm thấy sản phẩm.');
}
export const addReview = async (
    review: ReviewRequest,
    images: File[],
) => {
    try {
        console.log("review", review)
        console.log("images", images)
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));
        formData.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }));
        const config = { timeout: 60000 };
        const response = await api.post("/review/", formData, config);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};


export const updateReview = async (
    reviewId: number,
    review: ReviewRequest,
    newImages: File[],
    removedImageIds: number[] = [],
) => {
    try {
        const formData = new FormData()
        newImages.forEach((image) => formData.append("images", image))
        formData.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }))

        if (removedImageIds.length > 0) {
            formData.append("removedImageIds", new Blob([JSON.stringify(removedImageIds)], { type: "application/json" }))
        }

        const config = { timeout: 60000 }
        const response = await api.put(`/review/${reviewId}`, formData, config)
        return response.data
    } catch (error) {
        console.error("Error updating review:", error)
        throw error
    }
}

export const deleteReview = async (reviewId: number) => {
    try {
        const response = await api.delete(`/review/${reviewId}`)
        return response.data
    } catch (error) {
        console.error("Error deleting review:", error)
        throw error
    }
}
export const addReviewReply = async (replyRequest: ReviewReplyRequest) => {
    try {
        const response = await api.post("/review-reply/", replyRequest)
        return response.data
    } catch (error) {
        console.error("Error adding review reply:", error)
        throw error
    }
}

export const updateReviewReply = async (replyId: number, replyRequest: ReviewReplyRequest) => {
    try {
        const response = await api.put(`/review-reply/${replyId}`, replyRequest)
        return response.data
    } catch (error) {
        console.error("Error updating review reply:", error)
        throw error
    }
}

export const deleteReviewReply = async (replyId: number) => {
    try {
        const response = await api.delete(`/review-reply/${replyId}`)
        console.log("data", response.data)
        return response.data
    } catch (error) {
        console.error("Error deleting review reply:", error)
        throw error
    }
}
