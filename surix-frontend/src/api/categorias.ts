import { apiFetch } from './client'
import { Categoria } from '@/types/categoria'

export const categoriasApi = {
    list: () =>
        apiFetch<Categoria[]>('/api/categorias'),

    create: (data: { nombre: string; descripcion?: string }) =>
        apiFetch<Categoria>('/api/categorias', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: number, data: { nombre: string; descripcion?: string }) =>
        apiFetch<Categoria>(`/api/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        apiFetch<void>(`/api/categorias/${id}`, {
            method: 'DELETE',
        }),
}