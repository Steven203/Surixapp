import { apiFetch } from './client'
import { ListaCompra, ItemLista } from '@/types/lista'

export const listasApi = {
    getByUsuario: (usuarioId: number) =>
        apiFetch<ListaCompra[]>(`/api/listas/usuario/${usuarioId}`),

    getById: (id: number) =>
        apiFetch<ListaCompra>(`/api/listas/${id}`),

    create: (usuarioId: number) =>
        apiFetch<ListaCompra>('/api/listas', {
            method: 'POST',
            body: JSON.stringify({ usuarioId }),
        }),

    finalizar: (id: number, forzar = false) =>
        apiFetch<ListaCompra>(`/api/listas/${id}/finalizar?forzar=${forzar}`, {
            method: 'PATCH',
        }),

    getItems: (listaId: number) =>
        apiFetch<ItemLista[]>(`/api/listas/${listaId}/items`),

    addItem: (listaId: number, productoId: number, cantidad: number) =>
        apiFetch<ItemLista>(`/api/listas/${listaId}/items`, {
            method: 'POST',
            body: JSON.stringify({ productoId, cantidad }),
        }),

    updateCantidad: (itemId: number, cantidad: number) =>
        apiFetch<ItemLista>(`/api/listas/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ cantidad }),
        }),

    marcarRecogido: (itemId: number) =>
        apiFetch<ItemLista>(`/api/listas/items/${itemId}/recoger`, {
            method: 'PATCH',
        }),

    desmarcarRecogido: (itemId: number) =>
    apiFetch<ItemLista>(`/api/listas/items/${itemId}/devolver`, {
        method: 'PATCH',
    }),

    delete: (id: number) =>
        apiFetch<void>(`/api/listas/${id}`, {
            method: 'DELETE',
        }),

    removeItem: (itemId: number) =>
        apiFetch<void>(`/api/listas/items/${itemId}`, {
            method: 'DELETE',
        }),
}