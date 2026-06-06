import { apiFetch } from './client'
import { Categoria, CategoriaFormData, CategoriaUpdateData } from '@/types/categoria'

export const categoriasApi = {
    list: () => apiFetch<Categoria[]>('/api/categorias'),
    getById: (id: number) => apiFetch<Categoria>(`/api/categorias/${id}`),
    create: (data: CategoriaFormData) =>
        apiFetch<Categoria>('/api/categorias', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    update: (id: number, data: CategoriaUpdateData) =>
        apiFetch<Categoria>(`/api/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
    delete: (id: number) =>
        apiFetch<void>(`/api/categorias/${id}`, { 
          method: 'DELETE' }),
}