'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Props = {
    progreso: number
    itemsRecogidos: number
    totalItems: number
    totalEstimado: number
    finalizada: boolean
    finalizando: boolean
    onFinalizar: () => void
}

export default function ListaActions({
    progreso,
    itemsRecogidos,
    totalItems,
    totalEstimado,
    finalizada,
    finalizando,
    onFinalizar,
}: Props) {
    const router = useRouter()

    return (
        <div className="space-y-4">
            {/* barra de progreso */}
            {totalItems > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progreso</span>
                        <span className="font-medium">
                            {itemsRecogidos}/{totalItems} productos
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progreso}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 text-right">
                        {progreso}% completado
                    </p>
                </div>
            )}

            {/* total y botón */}
            {totalItems > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Total estimado</span>
                        <span className="text-xl font-bold text-slate-800">
                            ${totalEstimado.toLocaleString()}
                        </span>
                    </div>
                    {!finalizada ? (
                        <Button
                            className="w-full"
                            onClick={onFinalizar}
                            disabled={finalizando}
                        >
                            {finalizando ? 'Finalizando...' : '✓ Finalizar compra'}
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => router.push('/lista')}
                        >
                            Crear nueva lista
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}