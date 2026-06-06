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

export type ProductoFormData = {
  nombre: string
  precio: number
  stock: number
  descripcion?: string
  estanteId: number
  categoriaId: number
}

export type ProductoUpdateData = Partial<ProductoFormData>