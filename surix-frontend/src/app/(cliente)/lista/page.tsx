'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLista } from '@/hooks/useLista'
import { useEstantes } from '@/hooks/useEstantes'
import { useListaStore } from '@/store/listaStore'
import { ListaCompra } from '@/types/lista'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import RutaSugerida from '@/components/lista/RutaSugerida'
import ListaActions from '@/components/lista/ListaActions'
import EstanteMap from '@/components/estantes/EstanteMap'

export default function ListaPage() {
    const router = useRouter()
    const { itemsLocales } = useListaStore()
    const [finalizando, setFinalizando] = useState(false)
    const [sincronizando, setSincronizando] = useState(false)

    const {
        listaActiva,
        listasFinalizadas,
        items,
        itemsOrdenados,
        isLoading,
        itemsRecogidos,
        totalItems,
        progreso,
        totalEstimado,
        nombreEstanteActivo,
        estantesConProductos,
        estantesCompletados,
        crearLista,
        marcarRecogido,
        desmarcarRecogido,
        eliminarItem,
        actualizarCantidad,
        eliminarLista,
        finalizar,
        sincronizarItemsLocales,
    } = useLista()

    const { estantes } = useEstantes()

    useEffect(() => {
        if (!listaActiva || sincronizando) return
        if (itemsLocales.length === 0) return
        setSincronizando(true)
        sincronizarItemsLocales().finally(() => setSincronizando(false))
    }, [listaActiva?.id, itemsLocales.length])

    const handleFinalizar = async () => {
        setFinalizando(true)
        await finalizar()
        setFinalizando(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-slate-400">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="space-y-5">

            {/* sin lista activa */}
            {!listaActiva && (
                <div className="space-y-5">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Mi lista</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Organiza tu compra y sigue la ruta más eficiente
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
                        <div className="text-5xl">🛒</div>
                        <div>
                            <h2 className="font-semibold text-slate-700">
                                No tienes una lista activa
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Agrega productos desde el catálogo para empezar
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={() => router.push('/catalogo')}>
                                Ir al catálogo
                            </Button>
                        </div>
                    </div>

                    {/* historial */}
                    {listasFinalizadas.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="font-semibold text-slate-700">
                                Historial de compras
                            </h2>
                            {listasFinalizadas.map((lista: ListaCompra) => (
                                <button
                                    key={lista.id}
                                    onClick={() => router.push(`/lista/${lista.id}`)}
                                    className="w-full bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 transition-colors text-left"
                                >
                                    <div>
                                        <p className="font-medium text-slate-700">
                                            Lista #{lista.id}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {lista.items.length} productos
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">Finalizada</Badge>
                                        <span className="text-slate-300">→</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* lista activa */}
            {listaActiva && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                Mi lista activa
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Lista #{listaActiva.id}
                            </p>
                        </div>
                        <Badge>En proceso</Badge>
                    </div>

                    {sincronizando && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 text-center">
                            Sincronizando productos del catálogo...
                        </div>
                    )}

                    {/* acciones — progreso y finalizar */}
                    <ListaActions
                        progreso={progreso}
                        itemsRecogidos={itemsRecogidos}
                        totalItems={totalItems}
                        totalEstimado={totalEstimado}
                        finalizada={false}
                        finalizando={finalizando}
                        onFinalizar={handleFinalizar}
                    />

                    {/* mapa del supermercado */}
                    {estantes && estantes.length > 0 && items && (
                        <div className="space-y-2">
                            <h2 className="font-semibold text-slate-700">
                                🗺️ Mapa del supermercado
                            </h2>
                            <EstanteMap
                                estantes={estantes}
                                items={items}
                                nombreEstanteActivo={nombreEstanteActivo}
                                estantesConProductos={estantesConProductos}
                                estantesCompletados={estantesCompletados}
                            />
                        </div>
                    )}

                    {/* ruta sugerida */}
                    <RutaSugerida
                        items={itemsOrdenados}
                        onMarcar={marcarRecogido}
                        onDesmarcar={desmarcarRecogido}
                        onEliminar={eliminarItem}
                        onActualizarCantidad={actualizarCantidad}
                    />

                    {/* historial colapsado */}
                    {listasFinalizadas.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="font-semibold text-slate-700 text-sm">
                                Compras anteriores
                            </h2>
                            {listasFinalizadas.map((lista: ListaCompra) => (
                                <button
                                    key={lista.id}
                                    onClick={() => router.push(`/lista/${lista.id}`)}
                                    className="w-full bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between hover:border-slate-300 transition-colors text-left"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            Lista #{lista.id}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {lista.items.length} productos
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            Finalizada
                                        </Badge>
                                        <span className="text-slate-300 text-sm">→</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}