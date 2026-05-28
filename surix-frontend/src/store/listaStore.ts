import { create } from 'zustand'
import { ListaCompra } from '@/types/lista'

type ListaStore = {
    listaActiva: ListaCompra | null
    setListaActiva: (lista: ListaCompra) => void
    clearLista: () => void
}

export const useListaStore = create<ListaStore>((set) => ({
    listaActiva: null,
    setListaActiva: (lista) => set({ listaActiva: lista }),
    clearLista: () => set({ listaActiva: null }),
}))