import { apiFetch } from './client'
import { Usuario } from '@/types/usuario'

export const usuariosApi = {
    list: () =>
        apiFetch<Usuario[]>('/api/usuarios'),

    getById: (id: number) =>
        apiFetch<Usuario>(`/api/usuarios/${id}`),

    create: (data: { username: string; password: string }) =>
        apiFetch<Usuario>('/api/usuarios', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    assignRole: (usuarioId: number, roleId: number) =>
        apiFetch<Usuario>(`/api/usuarios/${usuarioId}/roles/${roleId}`, {
            method: 'POST',
        }),
}