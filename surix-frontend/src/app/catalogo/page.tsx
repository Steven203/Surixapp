'use client'

import { useProductos } from '@/hooks/useProductos'
import { Producto } from '@/types/producto'
import Navbar from '@/components/layout/Navbar'
import ProductoCard from '@/components/productos/ProductoCard'
import ProductoFiltros from '@/components/productos/ProductoFiltros'

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

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar
                busqueda={busqueda}
                onBusqueda={setBusqueda}
                totalEnLista={totalEnLista}
                onVerLista={handleVerLista}
            />

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

                {/* filtros */}
                {categorias && categorias.length > 0 && (
                    <ProductoFiltros
                        categorias={categorias}
                        categoriaFiltro={categoriaFiltro}
                        onCambiar={setCategoriaFiltro}
                    />
                )}

                {/* contador */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {isLoading
                            ? 'Cargando productos...'
                            : `${productosFiltrados.length} producto${productosFiltrados.length !== 1 ? 's' : ''}`
                        }
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

                {/* skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}
                                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse">
                                <div className="h-24 bg-slate-100 rounded-lg" />
                                <div className="h-4 bg-slate-100 rounded w-3/4" />
                                <div className="h-4 bg-slate-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {/* sin resultados */}
                {!isLoading && productosFiltrados.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <div className="text-5xl">🔍</div>
                        <p className="text-slate-500 font-medium">
                            No encontramos productos
                        </p>
                        <p className="text-slate-400 text-sm">
                            Intenta con otro nombre o categoría
                        </p>
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

                {/* grid */}
                {!isLoading && productosFiltrados.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {productosFiltrados.map((p: Producto) => (
                            <ProductoCard
                                key={p.id}
                                producto={p}
                                onAgregar={() => handleAgregar(p)}
                                cargando={agregando === p.id}
                                yaEnLista={estaEnLista(p.id)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}