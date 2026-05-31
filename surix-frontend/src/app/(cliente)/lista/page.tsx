'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { toast } from 'sonner'
import { listasApi } from '@/api/listas'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { ListaCompra, ItemLista } from '@/types/lista'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ListaPage() {
    const router = useRouter()
    const usuario = useAuthStore(s => s.usuario)
    const { itemsLocales, limpiarLocales } = useListaStore()

    const { data: listas, mutate: mutarListas, isLoading } = useSWR(
        usuario ? `/api/listas/usuario/${usuario.id}` : null,
        () => listasApi.getByUsuario(usuario!.id)
    )

    const listaActiva = listas?.find(l => l.estado === 'EN_PROCESO')
    const listasFinalizadas = listas?.filter(l => l.estado === 'FINALIZADA') ?? []

    const { data: items, mutate: mutarItems } = useSWR(
        listaActiva ? `/api/listas/${listaActiva.id}/items` : null,
        () => listasApi.getItems(listaActiva!.id)
    )

    const [editandoItem, setEditandoItem] = useState<number | null>(null)
    const [nuevaCantidad, setNuevaCantidad] = useState('')
    const [finalizando, setFinalizando] = useState(false)
    const [sincronizando, setSincronizando] = useState(false)

    const itemsRecogidos = items?.filter(i => i.recogido).length ?? 0
    const totalItems = items?.length ?? 0
    const progreso = totalItems > 0 ? Math.round((itemsRecogidos / totalItems) * 100) : 0
    const totalEstimado = items?.reduce(
        (acc, i) => acc + i.productoPrecio * i.cantidad, 0
    ) ?? 0

    // sincronizar items locales cuando hay lista activa
    useEffect(() => {
        if (!listaActiva || itemsLocales.length === 0 || sincronizando) return
        sincronizarItemsLocales()
    }, [listaActiva?.id])

    const sincronizarItemsLocales = async () => {
        if (!listaActiva || itemsLocales.length === 0) return
        setSincronizando(true)
        let agregados = 0
        for (const item of itemsLocales) {
            try {
                await listasApi.addItem(listaActiva.id, item.producto.id, item.cantidad)
                agregados++
            } catch {
                // ignora duplicados
            }
        }
        limpiarLocales()
        mutarItems()
        setSincronizando(false)
        if (agregados > 0)
            toast.success(`${agregados} producto${agregados > 1 ? 's' : ''} sincronizado${agregados > 1 ? 's' : ''}`)
    }

    const handleCrearLista = async () => {
        try {
            await listasApi.create(usuario!.id)
            mutarListas()
            toast.success('Lista creada — agrega productos desde el catálogo')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleMarcarRecogido = async (item: ItemLista) => {
        if (item.recogido) return
        try {
            await listasApi.marcarRecogido(item.id)
            mutarItems()
            toast.success(`✓ ${item.productoNombre} recogido`)
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleEliminarItem = async (item: ItemLista) => {
        toast('¿Eliminar este producto?', {
            description: item.productoNombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await listasApi.removeItem(item.id)
                        mutarItems()
                        toast.success('Producto eliminado')
                    } catch (err: any) {
                        toast.error(err.message)
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => {} },
        })
    }

    const handleActualizarCantidad = async (itemId: number) => {
        const cant = parseInt(nuevaCantidad)
        if (!cant || cant < 1) {
            toast.error('La cantidad debe ser mayor a 0')
            return
        }
        try {
            await listasApi.updateCantidad(itemId, cant)
            mutarItems()
            setEditandoItem(null)
            setNuevaCantidad('')
            toast.success('Cantidad actualizada')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleFinalizar = async (forzar = false) => {
        if (!listaActiva) return
        if (totalItems === 0) {
            toast.error('Agrega productos antes de finalizar')
            return
        }
        if (itemsRecogidos < totalItems && !forzar) {
            const pendientes = totalItems - itemsRecogidos
            toast(`${pendientes} producto${pendientes > 1 ? 's' : ''} sin recoger`, {
                description: '¿Deseas finalizar de todas formas?',
                action: {
                    label: 'Finalizar igual',
                    onClick: () => handleFinalizar(true),
                },
                cancel: { label: 'Seguir comprando', onClick: () => {} },
            })
            return
        }
        setFinalizando(true)
        try {
            await listasApi.finalizar(listaActiva.id, forzar)
            mutarListas()
            mutarItems()
            toast.success('¡Compra finalizada!')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setFinalizando(false)
        }
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
                                Crea una lista y agrega productos desde el catálogo
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={handleCrearLista}>
                                + Crear lista
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/catalogo')}
                            >
                                Ver catálogo
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
                            <p className="text-slate-500 text-sm">Lista #{listaActiva.id}</p>
                        </div>
                        <Badge>En proceso</Badge>
                    </div>

                    {sincronizando && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 text-center">
                            Sincronizando productos del catálogo...
                        </div>
                    )}

                    {/* progreso */}
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

                    {/* ruta sugerida */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-slate-700">
                                🗺️ Ruta sugerida
                            </h2>
                            <button
                                onClick={() => router.push('/catalogo')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                + Agregar del catálogo
                            </button>
                        </div>

                        {totalItems === 0 && (
                            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                                <p className="text-slate-400 text-sm">
                                    Tu lista está vacía
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/catalogo')}
                                >
                                    Ir al catálogo
                                </Button>
                            </div>
                        )}

                        {items?.map((item: ItemLista, index: number) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl border p-4 transition-all ${
                                    item.recogido
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-slate-200'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* número / check */}
                                    <button
                                        onClick={() => handleMarcarRecogido(item)}
                                        disabled={item.recogido}
                                        className={`
                                            w-8 h-8 rounded-full flex items-center justify-center
                                            text-sm font-bold flex-shrink-0 mt-0.5 transition-colors
                                            ${item.recogido
                                                ? 'bg-green-500 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
                                            }
                                        `}
                                    >
                                        {item.recogido ? '✓' : index + 1}
                                    </button>

                                    {/* info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium ${
                                            item.recogido
                                                ? 'line-through text-slate-400'
                                                : 'text-slate-800'
                                        }`}>
                                            {item.productoNombre}
                                        </p>

                                        {/* cantidad editable */}
                                        {editandoItem === item.id ? (
                                            <div className="flex items-center gap-2 mt-1">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={nuevaCantidad}
                                                    onChange={e => setNuevaCantidad(e.target.value)}
                                                    className="w-16 border border-slate-200 rounded px-2 py-0.5 text-sm"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleActualizarCantidad(item.id)}
                                                    className="text-xs text-green-600 font-medium hover:text-green-800"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditandoItem(null)
                                                        setNuevaCantidad('')
                                                    }}
                                                    className="text-xs text-slate-400 hover:text-slate-600"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="text-xs text-slate-400">
                                                    x{item.cantidad}
                                                </span>
                                                {!item.recogido && (
                                                    <button
                                                        onClick={() => {
                                                            setEditandoItem(item.id)
                                                            setNuevaCantidad(String(item.cantidad))
                                                        }}
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
                                    </div>

                                    {/* eliminar */}
                                    {!item.recogido && (
                                        <button
                                            onClick={() => handleEliminarItem(item)}
                                            className="text-slate-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* total y finalizar */}
                    {totalItems > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600 font-medium">
                                    Total estimado
                                </span>
                                <span className="text-xl font-bold text-slate-800">
                                    ${totalEstimado.toLocaleString()}
                                </span>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => handleFinalizar(false)}
                                disabled={finalizando}
                            >
                                {finalizando ? 'Finalizando...' : '✓ Finalizar compra'}
                            </Button>
                        </div>
                    )}

                    {/* historial */}
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