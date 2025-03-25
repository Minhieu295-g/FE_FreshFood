"use client"

import type React from "react"
import { useState } from "react"
import type { User } from "../../types/User"
import { RegisterUser } from "../../api/userAPI"
import { Eye, EyeOff, CheckCircle, AlertCircle, UserIcon, Mail, Phone, Lock, UserCheck } from "lucide-react"
import Link from "react-router-dom"

interface FormErrors {
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    phone?: string
    api?: string
}

const Register = () => {
    const [errors, setErrors] = useState<FormErrors>({})
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
        phone: "",
    })

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        digit: false,
        special: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        // Clear specific error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined })
        }

        // Update password strength indicators
        if (name === "password") {
            setPasswordStrength({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                digit: /\d/.test(value),
                special: /[^a-zA-Z0-9]/.test(value),
            })
        }
    }

    const submitApi = async (user: User) => {
        setIsLoading(true)
        try {
            const response = await RegisterUser(user)
            if (response.status === 201 || response.status === 200) {
                setSuccessMessage("Đăng ký tài khoản thành công!")
                // Reset form after successful registration
                setFormData({
                    username: "",
                    password: "",
                    confirmPassword: "",
                    fullName: "",
                    email: "",
                    phone: "",
                })
                setPasswordStrength({
                    length: false,
                    uppercase: false,
                    digit: false,
                    special: false,
                })
            } else {
                const errorData = await response.data
                setErrors({ api: errorData.message || "Đăng ký tài khoản thất bại" })
            }
        } catch (e) {
            setErrors({ api: "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau." })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const { username, password, confirmPassword, email, phone } = formData

        const newErrors: FormErrors = {}

        // Username validation
        if (!username) {
            newErrors.username = "Vui lòng nhập tên đăng nhập"
        } else if (username.length < 8) {
            newErrors.username = "Tên đăng nhập phải có ít nhất 8 ký tự"
        }

        // Email validation
        const EMAIL_PATTERN = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/
        if (!email) {
            newErrors.email = "Vui lòng nhập email"
        } else if (!EMAIL_PATTERN.test(email)) {
            newErrors.email = "Email không hợp lệ"
        }

        // Password validation
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu"
        } else if (password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
        } else {
            const hasUppercase = /[A-Z]/.test(password)
            const hasDigit = /\d/.test(password)
            const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password)

            if (!hasUppercase) {
                newErrors.password = "Mật khẩu phải có ít nhất một ký tự viết hoa"
            }
            if (!hasDigit) {
                newErrors.password = "Mật khẩu phải có ít nhất một chữ số"
            }
            if (!hasSpecialCharacter) {
                newErrors.password = "Mật khẩu phải có ít nhất một ký tự đặc biệt"
            }
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không trùng khớp"
        }

        // Phone validation
        const vietnamesePhoneNumberPattern = /^(03|05|07|08|09)\d{8}$/
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại"
        } else if (!vietnamesePhoneNumberPattern.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            const { confirmPassword, ...userData } = formData
            submitApi(userData)
        } else {
            setSuccessMessage("")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <UserCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Hoặc{" "}
                        <div className="font-medium text-green-600 hover:text-green-500">
                            đăng nhập nếu bạn đã có tài khoản
                        </div>
                    </p>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-green-800">Đăng ký thành công!</h3>
                            <p className="mt-1 text-sm text-green-700">{successMessage}</p>
                            <div

                                className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                            >
                                Đăng nhập ngay
                                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Error message */}
                {errors.api && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Đăng ký thất bại</h3>
                            <p className="mt-1 text-sm text-red-700">{errors.api}</p>
                        </div>
                    </div>
                )}

                {/* Registration form */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        {/* Username field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    className={`pl-10 pr-3 py-2 block w-full rounded-lg border ${
                                        errors.username
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.username}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Tên đăng nhập phải có ít nhất 8 ký tự</p>
                        </div>

                        {/* Full name field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="fullName"
                                    type="text"
                                    className="pl-10 pr-3 py-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-150"
                                    placeholder="Nhập họ và tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    className={`pl-10 pr-3 py-2 block w-full rounded-lg border ${
                                        errors.email
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                    placeholder="Nhập địa chỉ email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="phone"
                                    type="tel"
                                    className={`pl-10 pr-3 py-2 block w-full rounded-lg border ${
                                        errors.phone
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.phone}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Ví dụ: 0912345678</p>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`pl-10 pr-10 py-2 block w-full rounded-lg border ${
                                        errors.password
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.password}
                                </p>
                            )}

                            {/* Password strength indicators */}
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-gray-500 mb-1">Mật khẩu phải có:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <div
                                        className={`text-xs flex items-center ${passwordStrength.length ? "text-green-600" : "text-gray-500"}`}
                                    >
                                        <div
                                            className={`h-2 w-2 rounded-full mr-1 ${passwordStrength.length ? "bg-green-500" : "bg-gray-300"}`}
                                        ></div>
                                        Ít nhất 8 ký tự
                                    </div>
                                    <div
                                        className={`text-xs flex items-center ${passwordStrength.uppercase ? "text-green-600" : "text-gray-500"}`}
                                    >
                                        <div
                                            className={`h-2 w-2 rounded-full mr-1 ${passwordStrength.uppercase ? "bg-green-500" : "bg-gray-300"}`}
                                        ></div>
                                        Ít nhất 1 chữ hoa
                                    </div>
                                    <div
                                        className={`text-xs flex items-center ${passwordStrength.digit ? "text-green-600" : "text-gray-500"}`}
                                    >
                                        <div
                                            className={`h-2 w-2 rounded-full mr-1 ${passwordStrength.digit ? "bg-green-500" : "bg-gray-300"}`}
                                        ></div>
                                        Ít nhất 1 chữ số
                                    </div>
                                    <div
                                        className={`text-xs flex items-center ${passwordStrength.special ? "text-green-600" : "text-gray-500"}`}
                                    >
                                        <div
                                            className={`h-2 w-2 rounded-full mr-1 ${passwordStrength.special ? "bg-green-500" : "bg-gray-300"}`}
                                        ></div>
                                        Ít nhất 1 ký tự đặc biệt
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm password field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`pl-10 pr-10 py-2 block w-full rounded-lg border ${
                                        errors.confirmPassword
                                            ? "border-red-300 ring-red-500"
                                            : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    } shadow-sm focus:outline-none focus:ring-1 transition duration-150`}
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    "Đăng ký tài khoản"
                                )}
                            </button>
                        </div>

                        {/* Terms and conditions */}
                        <div className="text-xs text-center text-gray-500">
                            Bằng cách đăng ký, bạn đồng ý với{" "}
                            <a href="#" className="text-green-600 hover:text-green-500">
                                Điều khoản dịch vụ
                            </a>{" "}
                            và{" "}
                            <a href="#" className="text-green-600 hover:text-green-500">
                                Chính sách bảo mật
                            </a>{" "}
                            của chúng tôi.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register

