// types/lista.ts
export type ItemLista = {
    id: number
    productoId: number
    productoNombre: string
    productoPrecio: number
    estanteNombre: string
    ordenLogico: number       // ← clave para la ruta sugerida
    cantidad: number
    recogido: boolean
}