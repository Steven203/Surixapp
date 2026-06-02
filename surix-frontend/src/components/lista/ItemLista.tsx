'use client'

import { useState } from 'react'
import { ItemLista as ItemListaType } from '@/types/lista'

type Props = {
    item: ItemListaType
    index: number
    onMarcar: (item: ItemListaType) => void
    onDesmarcar: (item: ItemListaType) => void  // ← nuevo
    onEliminar: (item: ItemListaType) => void
    onActualizarCantidad: (itemId: number, cantidad: number) => Promise<boolean>
}

export default function ItemLista({
    item,
    index,
    onMarcar,
    onDesmarcar,
    onEliminar,
    onActualizarCantidad,
}: Props) {
    const [editando, setEditando] = useState(false)
    const [nuevaCantidad, setNuevaCantidad] = useState('')

    const handleGuardar = async () => {
        const ok = await onActualizarCantidad(item.id, parseInt(nuevaCantidad))
        if (ok) { setEditando(false); setNuevaCantidad('') }
    }

    return (
        <div className={`bg-white rounded-xl border p-4 transition-all ${
            item.recogido ? 'border-green-200 bg-green-50' : 'border-slate-200'
        }`}>
            <div className="flex items-start gap-3">
                {/* número / check — ahora toggle */}
                <button
                    onClick={() => item.recogido ? onDesmarcar(item) : onMarcar(item)}
                    title={item.recogido ? 'Devolver al estante' : 'Marcar como recogido'}
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        text-sm font-bold flex-shrink-0 mt-0.5 transition-colors cursor-pointer
                        ${item.recogido
                            ? 'bg-green-500 text-white hover:bg-red-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                    `}
                >
                    {item.recogido ? '✓' : index + 1}
                </button>

                {/* info */}
                <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                        item.recogido ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                        {item.productoNombre}
                    </p>

                    {editando ? (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="number"
                                min="1"
                                value={nuevaCantidad}
                                onChange={e => setNuevaCantidad(e.target.value)}
                                className="w-16 border border-slate-200 rounded px-2 py-0.5 text-sm"
                                autoFocus
                            />
                            <button onClick={handleGuardar}
                                className="text-xs text-green-600 font-medium hover:text-green-800">
                                Guardar
                            </button>
                            <button onClick={() => { setEditando(false); setNuevaCantidad('') }}
                                className="text-xs text-slate-400 hover:text-slate-600">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-slate-400">x{item.cantidad}</span>
                            {!item.recogido && (
                                <button
                                    onClick={() => { setEditando(true); setNuevaCantidad(String(item.cantidad)) }}
                                    className="text-xs text-blue-500 hover:text-blue-700"
                                >
                                    editar
                                </button>
                            )}
                            <span className="text-xs text-slate-300">·</span>
                            <span className="text-xs font-medium text-slate-600">
                                ${(item.productoPrecio * item.cantidad).toLocaleString()}
                            </span>
                            {item.estanteNombre && (
                                <>
                                    <span className="text-xs text-slate-300">·</span>
                                    <span className="text-xs text-blue-600 font-medium">
                                        📍 {item.estanteNombre}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* hint cuando está recogido */}
                    {item.recogido && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            Toca ✓ para devolver al estante
                        </p>
                    )}
                </div>

                {/* eliminar — solo si no está recogido */}
                {!item.recogido && (
                    <button
                        onClick={() => onEliminar(item)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}