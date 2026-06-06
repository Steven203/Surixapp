export type Categoria = {
  id: number
  nombre: string
  descripcion: string | null
}

export type CategoriaFormData = {
  nombre: string
  descripcion?: string
}

export type CategoriaUpdateData = Partial<CategoriaFormData>