"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

export interface ToastProps {
    message: string
    type: "success" | "error" | "info"
    show: boolean
    onClose: () => void
}

export const Toast = ({ message, type, show, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(show)
    }, [show])

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case "error":
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            case "info":
                return <Info className="h-5 w-5 text-blue-500" />
            default:
                return null
        }
    }

    const getBackgroundColor = () => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200"
            case "error":
                return "bg-red-50 border-red-200"
            case "info":
                return "bg-blue-50 border-blue-200"
            default:
                return "bg-gray-50 border-gray-200"
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <div
                className={`${getBackgroundColor()} rounded-lg border shadow-sm p-4 flex items-start gap-3 animate-in slide-in-from-right`}
            >
                {getIcon()}
                <div className="flex-1">
                    <p className="text-sm text-gray-700">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false)
                        onClose()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

