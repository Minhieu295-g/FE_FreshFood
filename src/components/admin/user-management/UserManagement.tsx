"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, RefreshCw, Users } from "lucide-react"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import type {UserRequestDTO, ToastState, UserResponseDTO} from "../../../types/User"
import { UserFilters } from "./UserFilters"
import { UserTable } from "./UserTable"
import { UserForm } from "./UserForm"
import { DeleteConfirmation } from "./DeleteConfirmation"
import { Toast } from "./Toast"
import { getUsers, addUser, updateUser, deleteUser } from "../../../api/userAPI"

export const UserManagement = () => {
    // State cho danh sách người dùng
    const [users, setUsers] = useState<UserResponseDTO[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserResponseDTO[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // State cho bộ lọc
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [providerFilter, setProviderFilter] = useState<string>("all")

    // State cho chọn người dùng
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])

    // State cho form thêm/sửa người dùng
    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState<UserResponseDTO | undefined>(undefined)

    // State cho xác nhận xóa
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [userToDelete, setUserToDelete] = useState<UserResponseDTO | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // State cho thông báo
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Lấy danh sách người dùng khi component được tải
    useEffect(() => {
        fetchUsers()
    }, [])

    // Lọc người dùng khi bộ lọc thay đổi
    useEffect(() => {
        filterUsers()
    }, [users, searchQuery, roleFilter, providerFilter])

    // Hàm lấy danh sách người dùng từ API
    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error)
            showToast("Không thể tải danh sách người dùng", "error")
        } finally {
            setIsLoading(false)
        }
    }

    // Hàm lọc người dùng
    const filterUsers = () => {
        let result = [...users]

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) =>
                    user.username.toLowerCase().includes(query) ||
                    user.fullName.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.numberPhone.includes(query),
            )
        }

        // Lọc theo vai trò
        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter)
        }

        // Lọc theo nhà cung cấp
        if (providerFilter !== "all") {
            result = result.filter((user) => user.provider === providerFilter)
        }

        setFilteredUsers(result)
    }

    // Đặt lại bộ lọc
    const resetFilters = () => {
        setSearchQuery("")
        setRoleFilter("all")
        setProviderFilter("all")
    }

    // Hiển thị thông báo
    const showToast = (message: string, type: ToastState["type"]) => {
        setToast({
            show: true,
            message,
            type,
        })

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }))
        }, 3000)
    }

    // Xử lý chọn tất cả người dùng
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(filteredUsers.map((user) => user.id))
        } else {
            setSelectedUsers([])
        }
    }

    // Xử lý chọn một người dùng
    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId])
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId))
        }
    }

    // Xử lý thêm người dùng mới
    const handleAddUser = () => {
        setEditingUser(undefined)
        setShowUserForm(true)
    }

    // Xử lý sửa người dùng
    const handleEditUser = (user: UserResponseDTO) => {
        setEditingUser(user)
        setShowUserForm(true)
    }

    // Xử lý xác nhận xóa người dùng
    const handleDeleteConfirm = (user: UserResponseDTO) => {
        setUserToDelete(user)
        setShowDeleteConfirm(true)
    }

    // Xử lý xác nhận xóa nhiều người dùng
    const handleBulkDeleteConfirm = () => {
        if (selectedUsers.length === 0) return

        // Tìm người dùng đầu tiên trong danh sách đã chọn để hiển thị
        const firstUser = users.find((user) => user.id === selectedUsers[0])
        if (firstUser) {
            setUserToDelete({
                ...firstUser,
                fullName: `${selectedUsers.length} người dùng đã chọn`,
            })
            setShowDeleteConfirm(true)
        }
    }

    // Xử lý lưu người dùng (thêm mới hoặc cập nhật)
    const handleSaveUser = async (userData: UserRequestDTO) => {
        try {
            if (editingUser) {
                // Cập nhật người dùng
                const updatedUser = await updateUser(editingUser.id, userData)
                setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)))
                showToast("Cập nhật người dùng thành công", "success")
            } else {
                // Thêm người dùng mới
                const newUser = await addUser(userData)
                setUsers([...users, newUser])
                showToast("Thêm người dùng mới thành công", "success")
            }
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error)
            showToast(editingUser ? "Không thể cập nhật người dùng" : "Không thể thêm người dùng mới", "error")
            throw error
        }
    }

    // Xử lý xóa người dùng
    const handleDeleteUser = async () => {
        if (!userToDelete) return

        setIsDeleting(true)
        try {
            if (selectedUsers.length > 1) {
                // Xóa nhiều người dùng
                for (const userId of selectedUsers) {
                    await deleteUser(userId)
                }
                setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
                setSelectedUsers([])
                showToast(`Đã xóa ${selectedUsers.length} người dùng thành công`, "success")
            } else {
                // Xóa một người dùng
                await deleteUser(userToDelete.id)
                setUsers(users.filter((user) => user.id !== userToDelete.id))
                setSelectedUsers(selectedUsers.filter((id) => id !== userToDelete.id))
                showToast("Xóa người dùng thành công", "success")
            }
            setShowDeleteConfirm(false)
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error)
            showToast("Không thể xóa người dùng", "error")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Tiêu đề trang và nút thêm mới */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
                    <p className="text-gray-600 mt-1">Quản lý danh sách người dùng trong hệ thống</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <Button className="flex items-center gap-1.5" onClick={handleAddUser}>
                        <Plus className="h-4 w-4" />
                        Thêm người dùng
                    </Button>
                </div>
            </div>

            {/* Bộ lọc */}
            <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                providerFilter={providerFilter}
                setProviderFilter={setProviderFilter}
                resetFilters={resetFilters}
            />

            {/* Hành động hàng loạt */}
            {selectedUsers.length > 0 && (
                <div className="flex items-center justify-between mb-4 p-2 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-700">
            Đã chọn <strong>{selectedUsers.length}</strong> người dùng
          </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleBulkDeleteConfirm}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa đã chọn
                    </Button>
                </div>
            )}

            {/* Danh sách người dùng */}
            {isLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                            <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-600">Đang tải danh sách người dùng...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredUsers.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng nào</h3>
                            <p className="text-gray-600 text-center max-w-md mb-6">
                                {searchQuery || roleFilter !== "all" || providerFilter !== "all"
                                    ? "Không tìm thấy người dùng phù hợp với bộ lọc của bạn."
                                    : "Chưa có người dùng nào trong hệ thống. Hãy thêm người dùng mới."}
                            </p>
                            {(searchQuery || roleFilter !== "all" || providerFilter !== "all") && (
                                <Button variant="outline" onClick={resetFilters}>
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <UserTable
                    users={filteredUsers}
                    selectedUsers={selectedUsers}
                    onSelectAll={handleSelectAll}
                    onSelectUser={handleSelectUser}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteConfirm}
                />
            )}

            {/* Form thêm/sửa người dùng */}
            <UserForm
                open={showUserForm}
                onOpenChange={setShowUserForm}
                onSave={handleSaveUser}
                user={editingUser}
                title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            />

            {/* Xác nhận xóa người dùng */}
            <DeleteConfirmation
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                user={userToDelete}
                onConfirm={handleDeleteUser}
                isDeleting={isDeleting}
            />

            {/* Thông báo */}
            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </div>
    )
}

