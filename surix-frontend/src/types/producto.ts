export type Producto = {
    id: number
    nombre: string
    precio: number
    descripcion: string | null
    stock: number
    estanteId: number | null
    estanteNombre: string | null
    ordenLogico: number | null
    categoriaId: number | null
    categoriaNombre: string | null
}