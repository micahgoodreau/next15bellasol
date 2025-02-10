"use client"

import {
    Dialog,
    DialogOverlay,
    DialogContent,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { AlertConfirmation } from "./AlertConfirmation"

export function Modal({
    children,
}: {
    children: React.ReactNode
}) {
    const [showExitConfirmation, setShowExitConfirmation] = useState(false)
    const router = useRouter()

    const closeModal = () => {
        router.back()
    }

    const handleOpenChange = () => {
        const isUserFormModified = localStorage.getItem("userFormModified")
        if (isUserFormModified && JSON.parse(isUserFormModified)) {
            setShowExitConfirmation(true)
        } else {
            router.back()
        }
    }

    return (
        <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
            <DialogTitle className="text-lg font-bold">Edit User</DialogTitle>
            <DialogOverlay>
                <DialogContent className="overflow-y-hidden">
                    <DialogDescription>
                        <span className="text-sm text-gray-500">Edit user details</span>
                    </DialogDescription>
                    <AlertConfirmation
                        open={showExitConfirmation}
                        setOpen={setShowExitConfirmation}
                        confirmationAction={closeModal}
                        message="You haven't saved your changes. Please confirm you want to exit without saving."
                    />
                    {children}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
}