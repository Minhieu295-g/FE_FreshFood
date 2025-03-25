import api from "./api";
import {
    DeliveryAddressRequest,
    DeliveryAddressResponse, DeliveryFeeResponse,
    DistrictResponse,
    ProvinceResponse,
    WardResponse
} from "../types/address";

export const getProvinces = async (): Promise<ProvinceResponse[]> => {
    try {
        const response = await api.get(`/delivery-address/list-provinces`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,

        });
        return response.data.data;
    } catch (error) {
        console.error("Get Province thất bại:", error);
        throw error;
    }
}

export const getDistricts = async (province: ProvinceResponse): Promise<DistrictResponse[]> => {
    try {
        const response = await api.get(`/delivery-address/list-districts`, {
            params: { provincetId: province.provinceId },
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.error("Get Province thất bại:", error);
        throw error;
    }
}

export const getWards = async (district: DistrictResponse): Promise<WardResponse[]> => {
    try {
        const response = await api.get(`/delivery-address/list-wards`, {
            params: { districtId: district.districtId },
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.error("Get Province thất bại:", error);
        throw error;
    }
}
export const addDeliveryAddress = async (deliveryAddress: DeliveryAddressRequest) =>{
    try {
        const response = await api.post(`/delivery-address/`, deliveryAddress , {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Get Province thất bại:", error);
        throw error;
    }
}
export const getDeliveryAddressDefault = async (userId: number, isDefault: boolean): Promise<DeliveryAddressResponse> => {
    try {
        const response = await api.get('/delivery-address/default', {
            params: { userId, isDefault }
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to get default delivery address:', error);
        throw error;
    }
};
export const getDeliveryFee = async (deliveryAddressId: number): Promise<DeliveryFeeResponse> => {
    try {
        const response = await api.get('/delivery-address/delivery-fee', {
            params: { deliveryAddressId }
        });
        const data = response.data.data;

        const deliveryDate = new Date(data.deliveryDate).toLocaleDateString('vi-VN');

        return {
            deliveryFee: data.deliveryFee,
            deliveryDate: deliveryDate
        };
    } catch (error) {
        console.error('Failed to get delivery fee:', error);
        throw error;
    }
};