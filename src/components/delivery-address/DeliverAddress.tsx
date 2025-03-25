"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getProvinces, getDistricts, getWards, addDeliveryAddress } from "../../api/deliveryAddressApi"
import { MapPin, User, Phone, Building, Map, Navigation, Home, Check, AlertCircle } from "lucide-react"

interface DeliveryAddressRequest {
    name: string
    numberPhone: string
    provinceId: number
    districtId: number
    wardId: number
    provinceName: string
    districtName: string
    wardName: string
    detailAddress: string
    userId: number
}

interface ProvinceResponse {
    provinceId: number
    provinceName: string
}

interface DistrictResponse {
    districtId: number
    districtName: string
}

interface WardResponse {
    wardId: number
    wardName: string
}

interface FormErrors {
    name?: string
    numberPhone?: string
    province?: string
    district?: string
    ward?: string
    detailAddress?: string
}

const DeliveryAddress: React.FC = () => {
    const [formData, setFormData] = useState<DeliveryAddressRequest>({
        name: "",
        numberPhone: "",
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        provinceName: "",
        districtName: "",
        wardName: "",
        detailAddress: "",
        userId: 0,
    })

    const [provinces, setProvinces] = useState<ProvinceResponse[]>([])
    const [districts, setDistricts] = useState<DistrictResponse[]>([])
    const [wards, setWards] = useState<WardResponse[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvinces()
                setProvinces(data)
            } catch (error) {
                console.error("Không thể tải danh sách tỉnh/thành phố:", error)
            }
        }
        fetchProvinces()
    }, [])

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = Number.parseInt(e.target.value)
        const province = provinces.find((p) => p.provinceId === provinceId)
        setFormData((prev) => ({
            ...prev,
            provinceId,
            provinceName: province?.provinceName || "",
            districtId: 0,
            districtName: "",
            wardId: 0,
            wardName: "",
        }))

        if (provinceId) {
            try {
                const data = await getDistricts({ provinceId, provinceName: province?.provinceName || "" })
                setDistricts(data)
                setWards([])
                setErrors((prev) => ({ ...prev, province: undefined }))
            } catch (error) {
                console.error("Không thể tải danh sách quận/huyện:", error)
            }
        } else {
            setDistricts([])
            setWards([])
        }
    }

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = Number.parseInt(e.target.value)
        const district = districts.find((d) => d.districtId === districtId)
        setFormData((prev) => ({
            ...prev,
            districtId,
            districtName: district?.districtName || "",
            wardId: 0,
            wardName: "",
        }))

        if (districtId) {
            try {
                const data = await getWards({ districtId, districtName: district?.districtName || "" })
                setWards(data)
                setErrors((prev) => ({ ...prev, district: undefined }))
            } catch (error) {
                console.error("Không thể tải danh sách phường/xã:", error)
            }
        } else {
            setWards([])
        }
    }

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardId = Number.parseInt(e.target.value)
        const ward = wards.find((w) => w.wardId === wardId)
        if (ward) {
            setFormData((prev) => ({ ...prev, wardId: ward.wardId, wardName: ward.wardName }))
            setErrors((prev) => ({ ...prev, ward: undefined }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên người nhận"
        }

        if (!formData.numberPhone.trim()) {
            newErrors.numberPhone = "Vui lòng nhập số điện thoại"
        } else if (!/^[0-9]{10,11}$/.test(formData.numberPhone)) {
            newErrors.numberPhone = "Số điện thoại không hợp lệ"
        }

        if (!formData.provinceId) {
            newErrors.province = "Vui lòng chọn tỉnh/thành phố"
        }

        if (!formData.districtId) {
            newErrors.district = "Vui lòng chọn quận/huyện"
        }

        if (!formData.wardId) {
            newErrors.ward = "Vui lòng chọn phường/xã"
        }

        if (!formData.detailAddress.trim()) {
            newErrors.detailAddress = "Vui lòng nhập địa chỉ chi tiết"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const userData = localStorage.getItem("user")
        if (!userData) {
            alert("Vui lòng đăng nhập trước khi thêm địa chỉ.")
            return
        }

        setIsLoading(true)

        try {
            const user = JSON.parse(userData)
            const updatedFormData = { ...formData, userId: user.userId }

            const response = await addDeliveryAddress(updatedFormData)
            console.log("Đã thêm địa chỉ thành công:", response)

            setIsSuccess(true)
            // Reset form after successful submission
            setFormData({
                name: "",
                numberPhone: "",
                provinceId: 0,
                districtId: 0,
                wardId: 0,
                provinceName: "",
                districtName: "",
                wardName: "",
                detailAddress: "",
                userId: 0,
            })

            setTimeout(() => {
                setIsSuccess(false)
            }, 3000)
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error)
            alert("Thêm địa chỉ thất bại, vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <MapPin className="mx-auto h-12 w-12 text-sky-500" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Thêm địa chỉ mới</h2>
                    <p className="mt-2 text-sm text-gray-600">Vui lòng nhập thông tin địa chỉ giao hàng của bạn</p>
                </div>

                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    {isSuccess && (
                        <div className="bg-green-50 p-4 flex items-center text-green-700 border-b border-green-100">
                            <Check className="h-5 w-5 mr-2" />
                            <span>Thêm địa chỉ thành công!</span>
                        </div>
                    )}

                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <User className="h-4 w-4 mr-2 text-sky-500" />
                                Tên người nhận
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`px-4 py-3 block w-full rounded-lg border ${
                                    errors.name
                                        ? "border-red-300 ring-red-500"
                                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                placeholder="Nhập tên người nhận"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Phone className="h-4 w-4 mr-2 text-sky-500" />
                                Số điện thoại
                            </label>
                            <input
                                name="numberPhone"
                                type="text"
                                value={formData.numberPhone}
                                onChange={handleChange}
                                className={`px-4 py-3 block w-full rounded-lg border ${
                                    errors.numberPhone
                                        ? "border-red-300 ring-red-500"
                                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                placeholder="Nhập số điện thoại"
                            />
                            {errors.numberPhone && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.numberPhone}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Building className="h-4 w-4 mr-2 text-sky-500" />
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    value={formData.provinceId || ""}
                                    onChange={handleProvinceChange}
                                    className={`px-4 py-3 block w-full rounded-lg border ${
                                        errors.province
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150 bg-white`}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((province) => (
                                        <option key={province.provinceId} value={province.provinceId}>
                                            {province.provinceName}
                                        </option>
                                    ))}
                                </select>
                                {errors.province && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.province}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                    <Map className="h-4 w-4 mr-2 text-sky-500" />
                                    Quận/Huyện
                                </label>
                                <select
                                    value={formData.districtId || ""}
                                    onChange={handleDistrictChange}
                                    disabled={!districts.length}
                                    className={`px-4 py-3 block w-full rounded-lg border ${
                                        errors.district
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150 bg-white ${!districts.length ? "opacity-60 cursor-not-allowed" : ""}`}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.districtId} value={district.districtId}>
                                            {district.districtName}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.district}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Navigation className="h-4 w-4 mr-2 text-sky-500" />
                                Phường/Xã
                            </label>
                            <select
                                value={formData.wardId || ""}
                                onChange={handleWardChange}
                                disabled={!wards.length}
                                className={`px-4 py-3 block w-full rounded-lg border ${
                                    errors.ward
                                        ? "border-red-300 ring-red-500"
                                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                } shadow-sm focus:outline-none focus:ring-1 transition duration-150 bg-white ${!wards.length ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward) => (
                                    <option key={`ward-${ward.wardId}`} value={ward.wardId}>
                                        {ward.wardName}
                                    </option>
                                ))}
                            </select>
                            {errors.ward && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.ward}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Home className="h-4 w-4 mr-2 text-sky-500" />
                                Địa chỉ chi tiết
                            </label>
                            <textarea
                                name="detailAddress"
                                value={formData.detailAddress}
                                onChange={handleChange}
                                rows={3}
                                className={`px-4 py-3 block w-full rounded-lg border ${
                                    errors.detailAddress
                                        ? "border-red-300 ring-red-500"
                                        : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                                } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                placeholder="Số nhà, tên đường, tòa nhà, khu vực..."
                            />
                            {errors.detailAddress && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.detailAddress}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center rounded-lg border border-transparent bg-sky-500 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Tạo địa chỉ mới"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DeliveryAddress

