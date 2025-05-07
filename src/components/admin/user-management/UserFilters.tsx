"use client"

import { Search, X } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent } from "../../../components/ui/card"

interface UserFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    roleFilter: string
    setRoleFilter: (role: string) => void
    providerFilter: string
    setProviderFilter: (provider: string) => void
    resetFilters: () => void
}

export const UserFilters = ({
                                searchQuery,
                                setSearchQuery,
                                roleFilter,
                                setRoleFilter,
                                providerFilter,
                                setProviderFilter,
                                resetFilters,
                            }: UserFiltersProps) => {
    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                                <SelectItem value="STAFF">Nhân viên</SelectItem>
                                <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Select value={providerFilter} onValueChange={setProviderFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo nhà cung cấp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả nhà cung cấp</SelectItem>
                                <SelectItem value="LOCAL">Hệ thống</SelectItem>
                                <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                <SelectItem value="GOOGLE">Google</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-1 md:col-span-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={resetFilters}>
                            Đặt lại bộ lọc
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

