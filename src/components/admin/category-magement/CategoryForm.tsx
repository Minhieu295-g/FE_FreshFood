"use client"

import type React from "react"

import { useState } from "react"
import { Save, RefreshCw } from "lucide-react"
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
import type { Category, ToastState } from "../../../types/category"
import { Toast } from "./Toast"

interface CategoryFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Category | null
    onSubmit: (name: string) => Promise<void>
    title: string
    description: string
}

export const CategoryForm = ({ open, onOpenChange, initialData, onSubmit, title, description }: CategoryFormProps) => {
    const [name, setName] = useState(initialData?.name || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
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
            await onSubmit(name)

            // Reset form
            setName("")

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
                    <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" />
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

