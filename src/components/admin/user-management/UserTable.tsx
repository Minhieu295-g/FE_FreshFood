"use client"

import { Edit, Trash2, Facebook, Mail, Phone } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Checkbox } from "../../../components/ui/checkbox"
import type {User, UserResponseDTO} from "../../../types/User"

interface UserTableProps {
    users: UserResponseDTO[]
    selectedUsers: number[]
    onSelectAll: (checked: boolean) => void
    onSelectUser: (userId: number, checked: boolean) => void
    onEditUser: (user: UserResponseDTO) => void
    onDeleteUser: (user: UserResponseDTO) => void
}

export const UserTable = ({
                              users,
                              selectedUsers,
                              onSelectAll,
                              onSelectUser,
                              onEditUser,
                              onDeleteUser,
                          }: UserTableProps) => {
    const allSelected = users.length > 0 && selectedUsers.length === users.length

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case "FACEBOOK":
                return <Facebook className="h-4 w-4 text-blue-600" />
            case "GOOGLE":
                return (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                            fill="#FFC107"
                        />
                        <path
                            d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                            fill="#FF3D00"
                        />
                        <path
                            d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z"
                            fill="#4CAF50"
                        />
                        <path
                            d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                            fill="#1976D2"
                        />
                    </svg>
                )
            default:
                return <Mail className="h-4 w-4 text-gray-600" />
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <Badge className="bg-red-500">Quản trị viên</Badge>
            case "STAFF":
                return <Badge className="bg-blue-500">Nhân viên</Badge>
            default:
                return <Badge className="bg-green-500">Khách hàng</Badge>
        }
    }

    return (
        <div className="rounded-md border">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left w-10">
                            <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
                        </th>
                        <th className="px-4 py-3 text-left">Tên người dùng</th>
                        <th className="px-4 py-3 text-left">Thông tin liên hệ</th>
                        <th className="px-4 py-3 text-left">Nhà cung cấp</th>
                        <th className="px-4 py-3 text-left">Vai trò</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                                />
                            </td>
                            <td className="px-4 py-3">
                                <div>
                                    <div className="font-medium">{user.fullName}</div>
                                    <div className="text-sm text-gray-500">{user.username}</div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center text-sm">
                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                        {user.numberPhone}
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    {getProviderIcon(user.provider)}
                                    <span>{user.provider === "LOCAL" ? "Hệ thống" : user.provider}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEditUser(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDeleteUser(user)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

