import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Producto } from '@/types/producto'
import { ListaCompra } from '@/types/lista'

type ItemLocal = {
    producto: Producto
    cantidad: number
}

type ListaStore = {
    // lista sincronizada con el backend (con login)
    listaActiva: ListaCompra | null
    setListaActiva: (lista: ListaCompra) => void
    clearLista: () => void

    // items locales (sin login)
    itemsLocales: ItemLocal[]
    agregarLocal: (producto: Producto, cantidad?: number) => void
    actualizarLocal: (productoId: number, cantidad: number) => void
    eliminarLocal: (productoId: number) => void
    limpiarLocales: () => void
    totalLocal: () => number
}

export const useListaStore = create<ListaStore>()(
    persist(
        (set, get) => ({
            listaActiva: null,
            setListaActiva: (lista) => set({ listaActiva: lista }),
            clearLista: () => set({ listaActiva: null }),

            itemsLocales: [],

            agregarLocal: (producto, cantidad = 1) => {
                const items = get().itemsLocales
                const existe = items.find(i => i.producto.id === producto.id)
                if (existe) {
                    set({
                        itemsLocales: items.map(i =>
                            i.producto.id === producto.id
                                ? { ...i, cantidad: i.cantidad + cantidad }
                                : i
                        )
                    })
                } else {
                    set({ itemsLocales: [...items, { producto, cantidad }] })
                }
            },

            actualizarLocal: (productoId, cantidad) => {
                set({
                    itemsLocales: get().itemsLocales.map(i =>
                        i.producto.id === productoId ? { ...i, cantidad } : i
                    )
                })
            },

            eliminarLocal: (productoId) => {
                set({
                    itemsLocales: get().itemsLocales.filter(
                        i => i.producto.id !== productoId
                    )
                })
            },

            limpiarLocales: () => set({ itemsLocales: [] }),

            totalLocal: () => get().itemsLocales.reduce(
                (acc, i) => acc + i.producto.precio * i.cantidad, 0
            ),
        }),
        { name: 'lista-storage' }
    )
)