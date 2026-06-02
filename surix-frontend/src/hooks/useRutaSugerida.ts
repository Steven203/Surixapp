import { ItemLista } from '@/types/lista'

export function useRutaSugerida(items: ItemLista[] | undefined) {
    if (!items) return []

    return [...items].sort((a, b) => {
        const oa = a.ordenLogico ?? Infinity
        const ob = b.ordenLogico ?? Infinity
        return oa - ob
    })
}