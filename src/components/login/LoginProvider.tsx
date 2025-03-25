"use client"

import { useState } from "react"
import { LoginByFacebook, LoginByGoogle } from "../../api/userAPI"
import Link from "react-router-dom"

const LoginProvider = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [isFacebookLoading, setIsFacebookLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLoginGoogle = async () => {
        try {
            setIsGoogleLoading(true)
            setError("")
            const response = await LoginByGoogle()
            console.log(response)
            window.location.href = response.data
        } catch (err: any) {
            setError("Không thể đăng nhập bằng Google. Vui lòng thử lại sau.")
            console.error("Google login error:", err)
        } finally {
            setIsGoogleLoading(false)
        }
    }

    const handleLoginFacebook = async () => {
        try {
            setIsFacebookLoading(true)
            setError("")
            const response = await LoginByFacebook()
            console.log(response)
            window.location.href = response.data
        } catch (err: any) {
            setError("Không thể đăng nhập bằng Facebook. Vui lòng thử lại sau.")
            console.error("Facebook login error:", err)
        } finally {
            setIsFacebookLoading(false)
        }
    }

    return (
        <div className="mt-6">
            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
                </div>
            </div>

            {/* Error message */}
            {error && <div className="mt-4 text-sm text-center text-red-600">{error}</div>}

            {/* Social login buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={handleLoginGoogle}
                    disabled={isGoogleLoading || isFacebookLoading}
                    className="relative flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    aria-label="Đăng nhập với Google"
                >
                    {isGoogleLoading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <>
                            <img className="h-5 w-5" src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/" alt="Google" />
                            <span className="hidden sm:inline">Google</span>
                        </>
                    )}
                </button>

                <button
                    onClick={handleLoginFacebook}
                    disabled={isGoogleLoading || isFacebookLoading}
                    className="relative flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    aria-label="Đăng nhập với Facebook"
                >
                    {isFacebookLoading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <>
                            <img
                                className="h-5 w-5"
                                src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                                alt="Facebook"
                            />
                            <span className="hidden sm:inline">Facebook</span>
                        </>
                    )}
                </button>
            </div>

            {/* Registration link */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <div  className="font-medium text-green-600 hover:text-green-500 transition-colors">
                        Đăng ký ngay
                    </div>
                </p>
            </div>
        </div>
    )
}

export default LoginProvider

