"use client"

import React, { useContext, useState } from "react"
import LoginProvider from "./LoginProvider"
import { UserContext } from "../../contexts/UserContext"
import { Eye, EyeOff, Lock, UserIcon, AlertCircle } from 'lucide-react'
import Link from "react-router-dom"

const Login: React.FC = () => {
    const [userAccount, setUserAccount] = useState({
        username: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const { login } = useContext(UserContext)!

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserAccount(prevState => ({
            ...prevState,
            [name]: value
        }))

        // Clear error when user types
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await login(userAccount)
            console.log(response)
            window.location.href = "/" // Redirect after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <UserIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Đăng nhập</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Đăng nhập để truy cập tài khoản của bạn
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Đăng nhập thất bại</h3>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Username/Email field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên đăng nhập / Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={userAccount.username}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 pr-3 py-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-150"
                                        placeholder="Nhập tên đăng nhập hoặc email"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={userAccount.password}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 pr-10 py-2 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition duration-150"
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me and Forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember_me"
                                        name="remember_me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <div className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                        Quên mật khẩu?
                                    </div>
                                </div>
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
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 mr-2" />
                                            Đăng nhập
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Social login options */}
                        <LoginProvider />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
