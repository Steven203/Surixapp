'use client'

import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

type Props = {
    open: boolean
    onClose: () => void
    titulo: string
    children: React.ReactNode
}

export default function EditModal({ open, onClose, titulo, children }: Props) {
    return (
        <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{titulo}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}