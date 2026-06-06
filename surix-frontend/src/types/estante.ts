export type Estante = {
  id: number
  nombre: string
  coordX: number
  coordY: number
  ordenLogico: number
}

export type EstanteFormData = {
  nombre: string
  coordX: number
  coordY: number
  ordenLogico: number
}

export type EstanteUpdateData = Partial<EstanteFormData>