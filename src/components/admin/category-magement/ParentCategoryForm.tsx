"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Save, RefreshCw } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import type { ParentCategory, ParentCategoryFormData, ToastState } from "../../../types/category"
import { Toast } from "./Toast"

interface ParentCategoryFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: ParentCategory | null
    onSubmit: (data: FormData) => Promise<void>
    title: string
    description: string
}

export const ParentCategoryForm = ({
                                       open,
                                       onOpenChange,
                                       initialData,
                                       onSubmit,
                                       title,
                                       description,
                                   }: ParentCategoryFormProps) => {
    const [formData, setFormData] = useState<ParentCategoryFormData>({
        name: initialData?.name || "",
        imageUrl: initialData?.imageUrl || "",
        imageFile: null,
    })

    const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setFormData({ ...formData, imageFile: file })

            // Create preview
            const reader = new FileReader()
            reader.onload = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            setToast({
                show: true,
                message: "Please enter a category name",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
            return
        }

        setIsSubmitting(true)

        try {
            const data = new FormData()
            data.append("name", formData.name)

            if (formData.imageFile) {
                data.append("image", formData.imageFile)
            }

            await onSubmit(data)

            // Reset form
            setFormData({
                name: "",
                imageUrl: "",
                imageFile: null,
            })
            setImagePreview("")

            // Close dialog
            onOpenChange(false)
        } catch (error) {
            console.error("Error submitting form:", error)
            setToast({
                show: true,
                message: "An error occurred. Please try again.",
                type: "error",
            })
            setTimeout(() => setToast({ ...toast, show: false }), 3000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 relative">
                            <img
                                src={imagePreview || "/placeholder.svg?height=128&width=128"}
                                alt="Category preview"
                                className="w-full h-full object-cover"
                            />
                            {formData.imageFile && (
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white"
                                    onClick={() => {
                                        setFormData({ ...formData, imageFile: null })
                                        setImagePreview(initialData?.imageUrl || "")
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter category name"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
        </Dialog>
    )
}

