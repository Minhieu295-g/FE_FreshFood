import api from "./api";
import {OrderRequest} from "../types/order";

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