"use client"

import { type ChangeEvent, useState } from "react"
import { Upload, X } from "lucide-react"
import { Input } from "../../../components/ui/input"

interface FileUploadProps {
    id: string
    label: string
    accept?: string
    onFileChange: (file: File | null) => void
    previewUrl?: string
    className?: string
}

export const FileUpload = ({ id, label, accept = "image/*", onFileChange, previewUrl, className }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | null>(previewUrl || null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        onFileChange(file)

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }

    const clearFile = () => {
        onFileChange(null)
        setPreview(null)
    }

    return (
        <div className={className}>
            {preview && (
                <div className="relative mb-2">
                    <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                    <button
                        type="button"
                        onClick={clearFile}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Input id={id} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
                <label
                    htmlFor={id}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    {label}
                </label>
            </div>
        </div>
    )
}

