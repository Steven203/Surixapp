import { apiFetch } from './client'
import { Producto } from '@/types/producto'

export const productosApi = {
    list: () =>
        apiFetch<Producto[]>('/api/productos'),

    getById: (id: number) =>
        apiFetch<Producto>(`/api/productos/${id}`),

    create: (data: {
        nombre: string
        precio: number
        stock: number
        descripcion?: string
        estanteId: number
        categoriaId?: number
    }) =>
        apiFetch<Producto>('/api/productos', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: Partial<Producto>) =>
        apiFetch<Producto>(`/api/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiFetch<void>(`/api/productos/${id}`, {
            method: 'DELETE',
        }),
}