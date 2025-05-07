export interface ReviewResponse {
    id: number;
    userId: number;
    username: string;
    fullName: string;
    rating: number;
    comment: string;
    date: string;
    productId: number;
    reply: ReviewReplyResponse;
    images: ReviewImageResponse[];
}
export interface ReviewImageResponse {
    id: number;
    imageUrl: string
}
export interface ReviewRequest {
    userId: number;
    productId: number;
    rating: number;
    comment: string;
}
export interface ReviewReplyRequest {
    reviewId: number;
    userId: number;
    replyText: string;
}
export interface ReviewReplyResponse{
    id: number;
    userId: number;
    username: string;
    fullName: string;
    reply: string;
    date: string
}