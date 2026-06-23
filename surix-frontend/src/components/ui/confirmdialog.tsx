'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

type Props = {
    open: boolean
    titulo: string
    descripcion: string
    resumen?: { label: string; valor: string | number }[]
    labelConfirmar?: string
    labelCancelar?: string
    variante?: 'destructive' | 'default'
    onConfirmar: () => void
    onCancelar: () => void
}

export default function ConfirmDialog({
    open,
    titulo,
    descripcion,
    resumen,
    labelConfirmar = 'Confirmar',
    labelCancelar = 'Cancelar',
    variante = 'default',
    onConfirmar,
    onCancelar,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={v => { if (!v) onCancelar() }}>
            <DialogContent className="max-w-[92vw] sm:max-w-md rounded-2xl p-5 sm:p-6">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-base sm:text-lg">
                        {titulo}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm">
                        {descripcion}
                    </DialogDescription>
                </DialogHeader>

                {resumen && resumen.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 my-2">
                        {resumen.map(({ label, valor }) => (
                            <div key={label} className="text-center">
                                <p className="text-lg font-bold text-slate-800">{valor}</p>
                                <p className="text-xs text-slate-400">{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-3">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={onCancelar}
                    >
                        {labelCancelar}
                    </Button>
                    <Button
                        variant={variante}
                        className="w-full sm:w-auto"
                        onClick={onConfirmar}
                    >
                        {labelConfirmar}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}