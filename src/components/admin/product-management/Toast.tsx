"use client"

import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import type { ToastState } from "../../../types/product"

interface ToastProps {
    toast: ToastState
    onClose: () => void
}

export const Toast = ({ toast, onClose }: ToastProps) => {
    if (!toast.show) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <div
                className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
                    toast.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : toast.type === "error"
                            ? "bg-red-50 border border-red-200"
                            : "bg-blue-50 border border-blue-200"
                }`}
            >
                {toast.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : toast.type === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                )}
                <p
                    className={`text-sm font-medium ${
                        toast.type === "success" ? "text-green-800" : toast.type === "error" ? "text-red-800" : "text-blue-800"
                    }`}
                >
                    {toast.message}
                </p>
                <button className="ml-auto text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

