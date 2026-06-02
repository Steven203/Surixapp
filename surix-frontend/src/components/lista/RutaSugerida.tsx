'use client'

import { useRouter } from 'next/navigation'
import { ItemLista as ItemListaType } from '@/types/lista'
import ItemLista from './ItemLista'

type Props = {
    items: ItemListaType[]
    onMarcar: (item: ItemListaType) => void
    onDesmarcar: (item: ItemListaType) => void  // ← nuevo
    onEliminar: (item: ItemListaType) => void
    onActualizarCantidad: (itemId: number, cantidad: number) => Promise<boolean>
}

export default function RutaSugerida({
    items, onMarcar, onDesmarcar, onEliminar, onActualizarCantidad
}: Props) {
    const router = useRouter()
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-700">🗺️ Ruta sugerida</h2>
                <button onClick={() => router.push('/catalogo')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    + Agregar del catálogo
                </button>
            </div>

            {items.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                    <p className="text-slate-400 text-sm">Tu lista está vacía</p>
                    <button onClick={() => router.push('/catalogo')}
                        className="text-blue-600 text-sm hover:underline">
                        Ir al catálogo
                    </button>
                </div>
            )}

            {items.map((item, index) => (
                <ItemLista
                    key={item.id}
                    item={item}
                    index={index}
                    onMarcar={onMarcar}
                    onDesmarcar={onDesmarcar}
                    onEliminar={onEliminar}
                    onActualizarCantidad={onActualizarCantidad}
                />
            ))}
        </div>
    )
}