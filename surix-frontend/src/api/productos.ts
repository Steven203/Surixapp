import { apiFetch } from './client'
import { Producto, ProductoFormData, ProductoUpdateData } from '@/types/producto'

export const productosApi = {
  list: () => apiFetch<Producto[]>('/api/productos'),

  getById: (id: number) => apiFetch<Producto>(`/api/productos/${id}`),

  create: (data: ProductoFormData) =>
    apiFetch<Producto>('/api/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: ProductoUpdateData) =>
    apiFetch<Producto>(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/api/productos/${id}`, {
      method: 'DELETE',
    }),
}