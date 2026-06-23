import { useState, useMemo } from 'react'

export function usePagination<T>(items: T[] | undefined, perPage: number) {
  const [page, setPage] = useState(1)

  const totalPages = items ? Math.max(1, Math.ceil(items.length / perPage)) : 1

  const itemsPagina = useMemo(() => {
    if (!items) return []
    const start = (page - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, page, perPage])

  // si la lista cambia y la página actual queda fuera de rango, vuelve a la 1
  if (page > totalPages && totalPages > 0) {
    setPage(1)
  }

  return {
    page,
    setPage,
    totalPages,
    itemsPagina,
    totalItems: items?.length ?? 0,
  }
}