import api from "./api";
import {DeliveryAddressRequest, DistrictResponse, ProvinceResponse, WardResponse} from "../types/address";

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
