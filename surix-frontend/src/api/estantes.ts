import { apiFetch } from './client'
import { Estante, EstanteFormData, EstanteUpdateData } from '@/types/estante'

export const estantesApi = {
  list: () => apiFetch<Estante[]>('/api/estantes'),

  getById: (id: number) => apiFetch<Estante>(`/api/estantes/${id}`),

  create: (data: EstanteFormData) =>
    apiFetch<Estante>('/api/estantes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: EstanteUpdateData) =>
    apiFetch<Estante>(`/api/estantes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/api/estantes/${id}`, {
      method: 'DELETE',
    }),
}