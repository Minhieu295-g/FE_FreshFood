import {Cart, CartItemRequest} from "../types/cart";
import api from "./api";

export const addCartItemToCart = async (cartItem: CartItemRequest) => {
    try {
        const response = await api.post(`/cart-item/`, cartItem, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,

        });
        return response;
    } catch (error) {
        console.error("Add Cart Item thất bại:", error);
        throw error;
    }
}

export const getCartById = async (id: number): Promise<Cart> => {
    try {
        const response = await api.get(`/cart/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,

        });
        console.log("Ket qua tu api", response);
        console.log("Ket qua tu api", response.data.data);

        if (response.status == 200){
            return response.data.data;
        }
        throw new Error('Không tìm thấy');
    } catch (error) {
        console.error("Add Cart Item thất bại:", error);
        throw error;
    }
}
export const updateCartItem = async (id: number,cartItem: CartItemRequest) => {
    try {
        const response = await api.put(`/cart-item/${id}`, cartItem, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        })
        return response.data;
    }catch (error){

    }
}
export const deleteCartItem = async (id: number) => {
    try {
        const response = await api.delete(`/cart-item/${id}`, {
            headers:{
                "Content-Type": "application/json",
            },
            withCredentials: true
        })
        return response.data;
    }catch(error){

    }
}