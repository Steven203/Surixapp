import useSWR from 'swr'
import { toast } from 'sonner'
import { mutate as mutateGlobal } from 'swr'
import { listasApi } from '@/api/listas'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { ItemLista } from '@/types/lista'
import { useRutaSugerida } from './useRutaSugerida'

export function useLista() {
    const usuario = useAuthStore(s => s.usuario)
    const { itemsLocales, limpiarLocales } = useListaStore()

    const {
        data: listas,
        mutate: mutarListas,
        isLoading,
    } = useSWR(
        usuario ? `/api/listas/usuario/${usuario.id}` : null,
        () => listasApi.getByUsuario(usuario!.id)
    )

    const listaActiva = listas?.find(l => l.estado === 'EN_PROCESO')
    const listasFinalizadas = listas?.filter(l => l.estado === 'FINALIZADA') ?? []

    const {
        data: items,
        mutate: mutarItems,
    } = useSWR(
        listaActiva ? `/api/listas/${listaActiva.id}/items` : null,
        () => listasApi.getItems(listaActiva!.id)
    )

    // ruta sugerida ordenada por orden_logico
    const itemsOrdenados = useRutaSugerida(items)

    // cálculos para el mapa
    const nombreEstanteActivo = itemsOrdenados.find(
        i => !i.recogido
    )?.estanteNombre ?? null

    const estantesConProductos = new Set(
        items?.map(i => i.estanteNombre).filter((n): n is string => !!n)
    )

    const estantesCompletados = new Set(
        Array.from(estantesConProductos).filter(nombre => {
            const itemsDelEstante = items?.filter(i => i.estanteNombre === nombre) ?? []
            return itemsDelEstante.length > 0 && itemsDelEstante.every(i => i.recogido)
        })
    )

    // métricas
    const itemsRecogidos = items?.filter(i => i.recogido).length ?? 0
    const totalItems = items?.length ?? 0
    const progreso = totalItems > 0
        ? Math.round((itemsRecogidos / totalItems) * 100)
        : 0
    const totalEstimado = items?.reduce(
        (acc, i) => acc + i.productoPrecio * i.cantidad, 0
    ) ?? 0

    const crearLista = async () => {
        if (!usuario) return
        try {
            await listasApi.create(usuario.id)
            mutarListas()
            toast.success('Lista creada — agrega productos desde el catálogo')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const marcarRecogido = async (item: ItemLista) => {
        if (item.recogido) return
        try {
            await listasApi.marcarRecogido(item.id)
            mutarItems()
            toast.success(`✓ ${item.productoNombre} recogido`)
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const desmarcarRecogido = async (item: ItemLista) => {
        try {
            await listasApi.desmarcarRecogido(item.id)
            mutarItems()
            toast.success(`↩ ${item.productoNombre} devuelto al estante`)
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const eliminarItem = async (item: ItemLista) => {
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

    const actualizarCantidad = async (itemId: number, cantidad: number) => {
        if (!cantidad || cantidad < 1) {
            toast.error('La cantidad debe ser mayor a 0')
            return false
        }
        try {
            await listasApi.updateCantidad(itemId, cantidad)
            mutarItems()
            toast.success('Cantidad actualizada')
            return true
        } catch (err: any) {
            toast.error(err.message)
            return false
        }
    }

    const eliminarLista = async () => {
        if (!listaActiva) return
        try {
            await listasApi.delete(listaActiva.id)
            await mutarListas()
            await mutarItems()
            await mutateGlobal(`/api/listas/${listaActiva.id}/items`, [])
            if (usuario)
                await mutateGlobal(`/api/listas/usuario/${usuario.id}`)
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const finalizar = async (forzar = false) => {
        if (!listaActiva) return

        if (totalItems === 0) {
            toast('Tu lista está vacía', {
                description: '¿Deseas eliminarla?',
                action: {
                    label: 'Eliminar lista',
                    onClick: async () => {
                        await eliminarLista()
                        toast.success('Lista eliminada')
                    },
                },
                cancel: { label: 'Cancelar', onClick: () => {} },
            })
            return
        }

        if (itemsRecogidos === 0 && !forzar) {
            toast('No has recogido ningún producto', {
                description: '¿Deseas eliminar la lista o seguir comprando?',
                action: {
                    label: 'Eliminar lista',
                    onClick: async () => {
                        await eliminarLista()
                        toast.success('Lista eliminada')
                    },
                },
                cancel: { label: 'Seguir comprando', onClick: () => {} },
            })
            return
        }

        if (itemsRecogidos < totalItems && !forzar) {
            const pendientes = totalItems - itemsRecogidos
            toast(`${pendientes} producto${pendientes > 1 ? 's' : ''} sin recoger`, {
                description: '¿Deseas finalizar de todas formas?',
                action: {
                    label: 'Finalizar igual',
                    onClick: () => finalizar(true),
                },
                cancel: { label: 'Seguir comprando', onClick: () => {} },
            })
            return
        }

        try {
            await listasApi.finalizar(listaActiva.id, forzar)
            await mutarListas()
            await mutarItems()
            await mutateGlobal(`/api/listas/${listaActiva.id}/items`, [])
            if (usuario)
                await mutateGlobal(`/api/listas/usuario/${usuario.id}`)
            toast.success('¡Compra finalizada!')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const sincronizarItemsLocales = async () => {
        if (!listaActiva) return
        if (itemsLocales.length === 0) {
            limpiarLocales()
            return
        }
        let agregados = 0
        for (const item of itemsLocales) {
            try {
                await listasApi.addItem(listaActiva.id, item.producto.id, item.cantidad)
                agregados++
            } catch { /* ignora duplicados */ }
        }
        limpiarLocales()
        mutarItems()
        if (agregados > 0)
            toast.success(`${agregados} producto${agregados > 1 ? 's' : ''} sincronizado${agregados > 1 ? 's' : ''}`)
    }

    return {
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
        mutarItems,
        mutarListas,
    }
}