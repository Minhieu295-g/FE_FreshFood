import type React from "react";
import {BarChart3, Home, Settings, ShoppingBag, ShoppingCart, Users} from "lucide-react";

export const SidebarContent = () => {
    return (
        <div className="space-y-1 px-3">
            <SidebarItem icon={<Home />} label="Dashboard" active />
            <SidebarItem icon={<ShoppingBag />} label="Sản phẩm" />
            <SidebarItem icon={<ShoppingCart />} label="Đơn hàng" />
            <SidebarItem icon={<Users />} label="Khách hàng" />
            <SidebarItem icon={<BarChart3 />} label="Báo cáo" />
            <SidebarItem icon={<Settings />} label="Cài đặt" />
        </div>
    )
}

interface SidebarItemProps {
    icon: React.ReactNode
    label: string
    active?: boolean
}

const SidebarItem = ({ icon, label, active }: SidebarItemProps) => {
    return (
        <button
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                active ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            <span className={`mr-3 ${active ? "text-green-600" : "text-gray-500"}`}>{icon}</span>
            {label}
        </button>
    )
}

