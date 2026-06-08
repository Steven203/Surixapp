export type ItemLista = {
    id: number
    productoId: number | null    // ← nullable si el producto fue borrado
    productoNombre: string
    productoPrecio: number
    estanteNombre: string | null
    ordenLogico: number | null
    cantidad: number
    recogido: boolean
}

export type ListaCompra = {
    id: number
    usuarioId: number
    estado: 'EN_PROCESO' | 'FINALIZADA'
    items: ItemLista[]
}

export type CreateItemData = {
    productoId: number
    cantidad: number
}

export type UpdateItemData = {
    cantidad: number
}