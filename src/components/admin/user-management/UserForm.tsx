"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Save, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import type {User, UserRequestDTO, UserResponseDTO} from "../../../types/User"

interface UserFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (user: UserRequestDTO) => Promise<void>
    user?: UserResponseDTO
    title: string
}

export const UserForm = ({ open, onOpenChange, onSave, user, title }: UserFormProps) => {
    const [formData, setFormData] = useState<UserRequestDTO>({
        username: "",
        fullName: "",
        numberPhone: "",
        email: "",
        password: "",
        provider: "LOCAL",
        role: "CUSTOMER",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                fullName: user.fullName,
                numberPhone: user.numberPhone,
                email: user.email,
                provider: "LOCAL",
                providerId: "",
                role: "CUSTOMER",
                password: "",
            })
        } else {
            // Reset form khi thêm mới
            setFormData({
                username: "",
                fullName: "",
                numberPhone: "",
                email: "",
                password: "",
                provider: "LOCAL",
                providerId: "",
                role: "CUSTOMER",
            })
        }
        setErrors({})
    }, [user, open])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.username.trim()) {
            newErrors.username = "Tên đăng nhập không được để trống"
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ tên không được để trống"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (!formData.numberPhone.trim()) {
            newErrors.numberPhone = "Số điện thoại không được để trống"
        } else if (!/^[0-9]{10,11}$/.test(formData.numberPhone)) {
            newErrors.numberPhone = "Số điện thoại không hợp lệ"
        }

        // Chỉ kiểm tra mật khẩu khi thêm mới người dùng LOCAL
        if (!user && formData.provider === "LOCAL" && !formData.password) {
            newErrors.password = "Mật khẩu không được để trống"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            await onSave(formData)
            onOpenChange(false)
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Tên đăng nhập
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!!user} // Không cho phép sửa username nếu đang chỉnh sửa
                                className={errors.username ? "border-red-500" : ""}
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            Họ và tên
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={errors.fullName ? "border-red-500" : ""}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numberPhone" className="text-right">
                            Số điện thoại
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="numberPhone"
                                name="numberPhone"
                                value={formData.numberPhone}
                                onChange={handleChange}
                                className={errors.numberPhone ? "border-red-500" : ""}
                            />
                            {errors.numberPhone && <p className="text-red-500 text-sm mt-1">{errors.numberPhone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="provider" className="text-right">
                            Nhà cung cấp
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.provider}
                                onValueChange={(value: "LOCAL" | "FACEBOOK" | "GOOGLE") =>
                                    setFormData((prev) => ({ ...prev, provider: value }))
                                }
                                disabled={!!user} // Không cho phép sửa provider nếu đang chỉnh sửa
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOCAL">Hệ thống</SelectItem>
                                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                    <SelectItem value="GOOGLE">Google</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.provider !== "LOCAL" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="providerId" className="text-right">
                                ID nhà cung cấp
                            </Label>
                            <div className="col-span-3">
                                <Input id="providerId" name="providerId" value={formData.providerId || ""} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {(!user || (user && formData.provider === "LOCAL")) && formData.provider === "LOCAL" && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                {user ? "Mật khẩu mới" : "Mật khẩu"}
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    className={errors.password ? "border-red-500" : ""}
                                    placeholder={user ? "Để trống nếu không thay đổi" : ""}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Vai trò
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.role}
                                onValueChange={(value: "CUSTOMER" | "ADMIN" | "STAFF") =>
                                    setFormData((prev) => ({ ...prev, role: value }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                                    <SelectItem value="STAFF">Nhân viên</SelectItem>
                                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

