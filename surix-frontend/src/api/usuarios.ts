import { apiFetch } from './client'

import { Usuario, UsuarioCreateData, UsuarioUpdateData } from '@/types/usuario'

export const usuariosApi = {

  list: () => apiFetch<Usuario[]>('/api/usuarios'),

  getById: (id: number) => apiFetch<Usuario>(`/api/usuarios/${id}`),

  create: (data: UsuarioCreateData) => apiFetch<Usuario>('/api/usuarios', {

    method: 'POST',

    body: JSON.stringify(data),

  }),

  assignRole: (usuarioId: number, roleId: number) => apiFetch<Usuario>(`/api/usuarios/${usuarioId}/roles/${roleId}`, {

    method: 'POST',

  }),

  removeRole: (usuarioId: number, roleId: number) => apiFetch<Usuario>(`/api/usuarios/${usuarioId}/roles/${roleId}`, {

    method: 'DELETE',

  }),

  update: (id: number, data: UsuarioUpdateData) => apiFetch<Usuario>(`/api/usuarios/${id}`, {

    method: 'PUT',

    body: JSON.stringify(data),

  }),

  delete: (id: number) => apiFetch<void>(`/api/usuarios/${id}`, {

    method: 'DELETE',

  }),

} 