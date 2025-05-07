"use client"

import { X } from "lucide-react"
import type { ToastState } from "../../../types/category"

interface ToastProps {
    toast: ToastState
    onClose: () => void
}

export const Toast = ({ toast, onClose }: ToastProps) => {
    if (!toast.show) return null

    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
    }[toast.type]

    return (
        <div
            className="fixed bottom-4 right-4 z-50 flex items-center justify-between w-80 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in-up"
            style={{ backgroundColor: bgColor }}
        >
            <p>{toast.message}</p>
            <button onClick={onClose} className="ml-4 focus:outline-none">
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

