import React, { useEffect, useState } from 'react';
import {getProvinces, getDistricts, getWards, addDeliveryAddress} from '../../api/deliveryAddressApi';

interface DeliveryAddressRequest {
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

interface ProvinceResponse {
    provinceId: number;
    provinceName: string;
}

interface DistrictResponse {
    districtId: number;
    districtName: string;
}

interface WardResponse {
    wardId: number;
    wardName: string;
}

const DeliveryAddress: React.FC = () => {
    const [formData, setFormData] = useState<DeliveryAddressRequest>({
        name: '',
        numberPhone: '',
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        provinceName: '',
        districtName: '',
        wardName: '',
        detailAddress: '',
        userId: 0,
    });
    const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
    const [districts, setDistricts] = useState<DistrictResponse[]>([]);
    const [wards, setWards] = useState<WardResponse[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            const data = await getProvinces();
            setProvinces(data);
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = parseInt(e.target.value);
        const province = provinces.find((p) => p.provinceId === provinceId);
        setFormData((prev) => ({ ...prev, provinceId, provinceName: province?.provinceName || '' }));
        const data = await getDistricts({ provinceId, provinceName: province?.provinceName || '' });
        setDistricts(data);
        setWards([]);
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = parseInt(e.target.value);
        const district = districts.find((d) => d.districtId === districtId);
        setFormData((prev) => ({ ...prev, districtId, districtName: district?.districtName || '' }));
        const data = await getWards({ districtId, districtName: district?.districtName || '' });
        setWards(data);
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = parseInt(e.target.value);
        const ward = wards.find((w) => w.wardId === wardId);
        if (ward) {
            setFormData((prev) => ({ ...prev, wardId: ward.wardId, wardName: ward.wardName }));
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = localStorage.getItem("user");
        if (!userData) {
            alert("Vui lòng đăng nhập trước khi thêm địa chỉ.");
            return;
        }

        const user = JSON.parse(userData);
        const updatedFormData = { ...formData, userId: user.userId };
        console.log(updatedFormData);
        try {
            const response = await addDeliveryAddress(updatedFormData);
            console.log("Đã thêm địa chỉ thành công:", response);
            alert("Thêm địa chỉ thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            alert("Thêm địa chỉ thất bại, vui lòng thử lại.");
        }
    };


    return (
        <div className="bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10 mb-10">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">Tạo địa chỉ giao hàng</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên người nhận</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                name="numberPhone"
                                type="text"
                                value={formData.numberPhone}
                                onChange={handleChange}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                            <select
                                value={formData.provinceId}
                                onChange={handleProvinceChange}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
                                {provinces.map((province) => (
                                    <option key={province.provinceId} value={province.provinceId}>
                                        {province.provinceName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                            <select
                                value={formData.districtId}
                                onChange={handleDistrictChange}
                                disabled={!districts.length}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((district) => (
                                    <option key={district.districtId} value={district.districtId}>
                                        {district.districtName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                            <select
                                value={formData.wardId}
                                onChange={handleWardChange}
                                disabled={!wards.length}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward) => (
                                    <option key={`ward-${ward.wardId}`} value={ward.wardId}>
                                        {ward.wardName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Địa chỉ chi tiết</label>
                            <textarea
                                name="detailAddress"
                                value={formData.detailAddress}
                                onChange={handleChange}
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                        >
                            Tạo địa chỉ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAddress;
