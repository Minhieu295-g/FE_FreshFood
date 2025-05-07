"use client"

import { type ChangeEvent, useState } from "react"
import { Plus, X } from "lucide-react"

interface MultipleFileUploadProps {
    id: string
    label: string
    accept?: string
    onFilesChange: (files: File[]) => void
    previewUrls?: string[]
    className?: string
    maxFiles?: number
}

export const MultipleFileUpload = ({
                                       id,
                                       label,
                                       accept = "image/*",
                                       onFilesChange,
                                       previewUrls = [],
                                       className,
                                       maxFiles = 10,
                                   }: MultipleFileUploadProps) => {
    const [previews, setPreviews] = useState<string[]>(previewUrls)
    const [files, setFiles] = useState<File[]>([])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length === 0) return

        const newFiles = [...files, ...selectedFiles].slice(0, maxFiles)
        setFiles(newFiles)
        onFilesChange(newFiles)

        // Generate previews
        const newPreviews = [...previews]
        selectedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string].slice(0, maxFiles))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
        onFilesChange(newFiles)

        const newPreviews = [...previews]
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                        <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
                {previews.length < maxFiles && (
                    <label
                        htmlFor={id}
                        className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer"
                    >
                        <Plus className="h-5 w-5" />
                        <input id={id} type="file" accept={accept} onChange={handleFileChange} className="hidden" multiple />
                    </label>
                )}
            </div>
        </div>
    )
}

