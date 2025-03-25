export interface ProvinceResponse {
    provinceId: number,
    provinceName: string,
}
export interface DistrictResponse {
    districtId: number,
    districtName: string,
}
export interface WardResponse {
    wardId: number,
    wardName: string,
}
export interface DeliveryAddressRequest {
    name: string;
    numberPhone: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    provinceName: string;
    districtName: string;
    wardName: string;
    detailAddress: string;
    userId: number;
}
export interface DeliveryAddressResponse {
    id: number;
    name: string;
    numberPhone: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    provinceName: string;
    districtName: string;
    wardName: string;
    detailAddress: string;
    default: boolean;
}
export interface DeliveryFeeResponse {
    deliveryFee: string;
    deliveryDate: string;
}