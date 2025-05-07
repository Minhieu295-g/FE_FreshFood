"use client"

import { X } from "lucide-react"
import { useEffect } from "react"
import type { ToastState } from "../../../types/User"

interface ToastProps {
    toast: ToastState
    onClose: () => void
}

export const Toast = ({ toast, onClose }: ToastProps) => {
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [toast.show, onClose])

    if (!toast.show) return null

    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500",
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`${bgColor[toast.type]} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[300px]`}
            >
                <span>{toast.message}</span>
                <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

