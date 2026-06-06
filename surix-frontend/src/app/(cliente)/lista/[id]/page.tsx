'use client'

import { useParams, useRouter } from 'next/navigation'
import { useListaDetalle } from '@/hooks/useListaDetalle'
import { ItemLista } from '@/types/lista'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import EstanteMap from '@/components/estantes/EstanteMap'

export default function ListaDetallePage() {
    const { id } = useParams()
    const router = useRouter()
    const listaId = Number(id)

    const {
        lista,
        items,
        estantes,
        isLoading,
        totalEstimado,
        itemsRecogidos,
        totalItems,
        estantesConProductos,
        estantesCompletados,
    } = useListaDetalle(listaId)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-slate-400">Cargando...</p>
            </div>
        )
    }

    if (!lista) {
        return (
            <div className="text-center py-20 space-y-3">
                <p className="text-slate-400">Lista no encontrada</p>
                <Button variant="outline" onClick={() => router.push('/lista')}>
                    Volver
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.push('/lista')}
                        className="text-sm text-slate-400 hover:text-slate-600 mb-1 flex items-center gap-1"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">
                        Lista #{listaId}
                    </h1>
                </div>
                <Badge variant={lista.estado === 'FINALIZADA' ? 'secondary' : 'default'}>
                    {lista.estado === 'FINALIZADA' ? 'Finalizada' : 'En proceso'}
                </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    { valor: totalItems, label: 'Productos' },
                    { valor: itemsRecogidos, label: 'Recogidos', color: 'text-green-600' },
                    { valor: `$${totalEstimado.toLocaleString()}`, label: 'Total' },
                ].map(({ valor, label, color }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                        <p className={`text-2xl font-bold ${color ?? 'text-slate-800'}`}>{valor}</p>
                        <p className="text-xs text-slate-400 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {estantes && estantes.length > 0 && items && items.length > 0 && (
                <div className="space-y-2">
                    <h2 className="font-semibold text-slate-700">🗺️ Mapa de la compra</h2>
                    <EstanteMap
                        estantes={estantes}
                        items={items}
                        nombreEstanteActivo={null}
                        estantesConProductos={estantesConProductos}
                        estantesCompletados={estantesCompletados}
                    />
                </div>
            )}

            <div className="space-y-2">
                <h2 className="font-semibold text-slate-700">Productos</h2>
                {items?.map((item: ItemLista, index: number) => (
                    <div key={item.id} className={`bg-white rounded-xl border p-4 ${
                        item.recogido ? 'border-green-200 bg-green-50' : 'border-slate-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                item.recogido ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {item.recogido ? '✓' : index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium ${
                                    item.recogido ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}>
                                    {item.productoNombre}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-xs text-slate-400">x{item.cantidad}</span>
                                    <span className="text-xs text-slate-300">·</span>
                                    <span className="text-xs font-medium text-slate-600">
                                        ${(item.productoPrecio * item.cantidad).toLocaleString()}
                                    </span>
                                    {item.estanteNombre && (
                                        <>
                                            <span className="text-xs text-slate-300">·</span>
                                            <span className="text-xs text-blue-600">
                                                📍 {item.estanteNombre}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <Badge variant={item.recogido ? 'default' : 'outline'} className="text-xs flex-shrink-0">
                                {item.recogido ? 'Recogido' : 'No recogido'}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Total de la compra</span>
                    <span className="text-xl font-bold text-slate-800">
                        ${totalEstimado.toLocaleString()}
                    </span>
                </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => router.push('/lista')}>
                ← Volver a mis listas
            </Button>
        </div>
    )
}