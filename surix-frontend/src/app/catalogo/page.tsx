'use client'

import { useProductos } from '@/hooks/useProductos'
import { Producto } from '@/types/producto'
import Navbar from '@/components/layout/Navbar'
import ProductoCard from '@/components/productos/ProductoCard'
import ProductoFiltros from '@/components/productos/ProductoFiltros'
import { useState, useEffect } from 'react'
import { usePagination } from '@/hooks/usePagination'
import Pagination from '@/components/ui/pagination'

export default function CatalogoPage() {
    const {
        categorias,
        productosFiltrados,
        isLoading,
        busqueda,
        setBusqueda,
        categoriaFiltro,
        setCategoriaFiltro,
        agregando,
        estaEnLista,
        totalEnLista,
        handleAgregar,
        handleVerLista,
    } = useProductos()

    const [perPage, setPerPage] = useState(12)

    useEffect(() => {
        const update = () => setPerPage(window.innerWidth < 640 ? 8 : 16)
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    const { page, setPage, totalPages, itemsPagina } = usePagination(
        productosFiltrados, perPage
    )

    // reinicia a página 1 cuando cambian filtros
    useEffect(() => { setPage(1) }, [busqueda, categoriaFiltro])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar
                leftContent={
                    <>
                        <span className="text-xl font-bold text-slate-800">🛒 Surix App</span>
                    </>
                }
                centerContent={
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="¿Qué estás buscando?"
                        className="w-full border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-slate-50"
                    />
                }
                rightContent={
                    <button
                        onClick={handleVerLista}
                        className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <span className="text-xl">🛒</span>
                        {totalEnLista > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {totalEnLista}
                            </span>
                        )}
                    </button>
                }
                logoHref="/"
            />

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {categorias && categorias.length > 0 && (
                    <ProductoFiltros
                        categorias={categorias}
                        categoriaFiltro={categoriaFiltro}
                        onCambiar={setCategoriaFiltro}
                    />
                )}

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {isLoading
                            ? 'Cargando productos...'
                            : `${productosFiltrados.length} producto${productosFiltrados.length !== 1 ? 's' : ''}`}
                    </p>

                    {busqueda && (
                        <button
                            onClick={() => setBusqueda('')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Limpiar ✕
                        </button>
                    )}
                </div>

                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse"
                            >
                                <div className="h-24 bg-slate-100 rounded-lg" />
                                <div className="h-4 bg-slate-100 rounded w-3/4" />
                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && productosFiltrados.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <div className="text-5xl">🔍</div>
                        <p className="text-slate-500 font-medium">No encontramos productos</p>
                        <p className="text-slate-400 text-sm">Intenta con otro nombre o categoría</p>
                        {busqueda && (
                            <button
                                onClick={() => setBusqueda('')}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}

                {!isLoading && itemsPagina.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {itemsPagina.map((p: Producto) => (
                                <ProductoCard
                                    key={p.id}
                                    producto={p}
                                    onAgregar={() => handleAgregar(p)}
                                    cargando={agregando === p.id}
                                    yaEnLista={estaEnLista(p.id)}
                                />
                            ))}
                        </div>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </div>
        </div>
    )
}