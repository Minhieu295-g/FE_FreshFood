"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { BarChart3, Home, Settings, ShoppingBag, ShoppingCart, Users, ChevronRight, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible"

// Define navigation items with sub-items
const navigationItems = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/admin",
    },
    {
        label: "Sản phẩm",
        icon: ShoppingBag,
        href: "/admin/products",
        subItems: [
            { label: "Tất cả sản phẩm", href: "/admin/products" },
            { label: "Thêm sản phẩm", href: "/admin/products/add" },
            { label: "Danh mục", href: "/admin/categories" },
            { label: "Thuộc tính", href: "/admin/attributes" },
        ],
    },
    {
        label: "Đơn hàng",
        icon: ShoppingCart,
        href: "/admin/orders",
        subItems: [
            { label: "Tất cả đơn hàng", href: "/admin/orders" },
            { label: "Đơn hàng mới", href: "/admin/orders?status=pending" },
            { label: "Đơn đang xử lý", href: "/admin/orders?status=processing" },
            { label: "Đơn đang giao", href: "/admin/orders?status=shipped" },
            { label: "Đơn đã giao", href: "/admin/orders?status=delivered" },
            { label: "Đơn đã hủy", href: "/admin/orders?status=cancelled" },
        ],
    },
    {
        label: "Khách hàng",
        icon: Users,
        href: "/admin/customers",
    },
    {
        label: "Báo cáo",
        icon: BarChart3,
        href: "/admin/reports",
        subItems: [
            { label: "Doanh số", href: "/admin/reports/sales" },
            { label: "Sản phẩm", href: "/admin/reports/products" },
            { label: "Khách hàng", href: "/admin/reports/customers" },
        ],
    },
    {
        label: "Cài đặt",
        icon: Settings,
        href: "/admin/settings",
        subItems: [
            { label: "Cửa hàng", href: "/admin/settings/store" },
            { label: "Thanh toán", href: "/admin/settings/payment" },
            { label: "Vận chuyển", href: "/admin/settings/shipping" },
            { label: "Người dùng", href: "/admin/settings/users" },
        ],
    },
]

interface AdminSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const location = useLocation()
    const pathname = location.pathname

    // If sidebar is closed, don't render it
    if (!isOpen) {
        return null
    }

    return (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
            <div className="flex flex-col h-full">
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center text-white">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">FreshMart Admin</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="lg:flex">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navigationItems.map((item) => (
                            <SidebarNavItem key={item.label} item={item} pathname={pathname} />
                        ))}
                    </nav>
                </div>

                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@freshmart.com</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Navigation item component with collapsible sub-items
interface NavItemProps {
    item: {
        label: string
        icon: React.ElementType
        href: string
        subItems?: Array<{ label: string; href: string }>
    }
    pathname: string
}

function SidebarNavItem({ item, pathname }: NavItemProps) {
    const Icon = item.icon
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
    const hasSubItems = item.subItems && item.subItems.length > 0
    const [isOpen, setIsOpen] = useState(isActive)

    // For items with sub-items, use Collapsible
    if (hasSubItems) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <button
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
            <span className={`mr-3 ${isActive ? "text-green-600" : "text-gray-500"}`}>
              <Icon className="h-4 w-4" />
            </span>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="pl-10 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => {
                            const isSubActive =
                                pathname === subItem.href || (subItem.href.includes("?") && pathname === subItem.href.split("?")[0])

                            return (
                                <Link
                                    key={subItem.label}
                                    to={"/"}
                                    className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                        isSubActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {subItem.label}
                                </Link>
                            )
                        })}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        )
    }

    // For items without sub-items
    return (
        <Link
            to={"/"}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                isActive ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
      <span className={`mr-3 ${isActive ? "text-green-600" : "text-gray-500"}`}>
        <Icon className="h-4 w-4" />
      </span>
            {item.label}
        </Link>
    )
}

