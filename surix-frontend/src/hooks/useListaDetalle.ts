import useSWR from 'swr'
import { listasApi } from '@/api/listas'
import { estantesApi } from '@/api/estantes'

export function useListaDetalle(listaId: number) {
    const { data: lista, isLoading } = useSWR(
        `/api/listas/${listaId}`,
        () => listasApi.getById(listaId)
    )

    const { data: items } = useSWR(
        `/api/listas/${listaId}/detalle`,
        () => listasApi.getItemsHistorico(listaId)
    )

    const { data: estantes } = useSWR('/api/estantes', estantesApi.list)

    const totalEstimado = items?.reduce(
        (acc, i) => acc + i.productoPrecio * i.cantidad, 0
    ) ?? 0

    const itemsRecogidos = items?.filter(i => i.recogido).length ?? 0
    const totalItems = items?.length ?? 0

    const estantesConProductos = new Set(
        items?.map(i => i.estanteNombre).filter((n): n is string => !!n)
    )

    const estantesCompletados = new Set(
        Array.from(estantesConProductos).filter(nombre => {
            const itemsDelEstante = items?.filter(i => i.estanteNombre === nombre) ?? []
            return itemsDelEstante.length > 0 && itemsDelEstante.every(i => i.recogido)
        })
    )

    return {
        lista,
        items,
        estantes,
        isLoading,
        totalEstimado,
        itemsRecogidos,
        totalItems,
        estantesConProductos,
        estantesCompletados,
    }
}