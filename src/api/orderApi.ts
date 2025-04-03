import api from "./api";
import {OrderRequest, OrderResponse} from "../types/order";
import {ApiResponse, PaginatedResponse} from "../types/api";
import {ProductDefault} from "../types/productDefault";

export const createOrder = async (order: OrderRequest) =>{
    try {
        const response = await api.post(`/order/`, order , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("create order thất bại:", error);
        throw error;
    }
}
export const getOrdersByUserId = async (userId: number): Promise<ApiResponse<PaginatedResponse<OrderResponse>>> => {
    try {
        const response = await api.get(`/order/list/${userId}` , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Get orders thất bại:", error);
        throw error;
    }
}