export type ItemLista = {
    id: number
    productoId: number
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