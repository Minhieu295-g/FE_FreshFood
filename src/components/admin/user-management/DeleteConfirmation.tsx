"use client"

import { AlertTriangle, Loader2, X } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../components/ui/alert-dialog"
import { Button } from "../../../components/ui/button"
import type {User, UserResponseDTO} from "../../../types/User"

interface DeleteConfirmationProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserResponseDTO | null
    onConfirm: () => Promise<void>
    isDeleting: boolean
}

export const DeleteConfirmation = ({ open, onOpenChange, user, onConfirm, isDeleting }: DeleteConfirmationProps) => {
    if (!user) return null

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Xác nhận xóa người dùng
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa người dùng <strong>{user.fullName}</strong> ({user.username})? Hành động này không
                        thể hoàn tác.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" disabled={isDeleting}>
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Xóa
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

