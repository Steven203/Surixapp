'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { toast } from 'sonner'
import { productosApi } from '@/api/productos'
import { categoriasApi } from '@/api/categorias'
import { listasApi } from '@/api/listas'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { Producto } from '@/types/producto'
import { Categoria } from '@/types/categoria'
import { Button } from '@/components/ui/button'
import ProductoCard from '@/components/productos/ProductoCard'

export default function CatalogoPage() {
    const router = useRouter()
    const usuario = useAuthStore(s => s.usuario)
    const { agregarLocal, itemsLocales } = useListaStore()

    const { data: productos, isLoading } = useSWR('/api/productos', productosApi.list)
    const { data: categorias } = useSWR('/api/categorias', categoriasApi.list)

    const [busqueda, setBusqueda] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null)
    const [agregando, setAgregando] = useState<number | null>(null)

    const productosFiltrados = productos?.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        const coincideCategoria = categoriaFiltro === null || p.categoriaId === categoriaFiltro
        return coincideNombre && coincideCategoria
    }) ?? []

    const totalEnLista = itemsLocales.length

    const handleAgregar = async (producto: Producto) => {
        setAgregando(producto.id)
        try {
            if (usuario?.roles.includes('CLIENTE')) {
                const listas = await listasApi.getByUsuario(usuario.id)
                let listaActiva = listas.find(l => l.estado === 'EN_PROCESO')
                if (!listaActiva) {
                    listaActiva = await listasApi.create(usuario.id)
                }
                await listasApi.addItem(listaActiva.id, producto.id, 1)
                toast.success(`${producto.nombre} agregado a tu lista`)
            } else {
                agregarLocal(producto, 1)
                toast.success(`${producto.nombre} agregado`, {
                    description: 'Inicia sesión para guardar tu lista',
                    action: {
                        label: 'Iniciar sesión',
                        onClick: () => router.push('/login?redirect=/lista'),
                    },
                })
            }
        } catch (err: any) {
            toast.error(err.message ?? 'Error al agregar el producto')
        } finally {
            setAgregando(null)
        }
    }

    const handleVerLista = () => {
        if (usuario) {
            router.push('/lista')
        } else {
            router.push('/login?redirect=/lista')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    <h1 className="text-lg font-bold text-slate-800 flex-shrink-0">
                        🛒 Surix App
                    </h1>

                    {/* buscador */}
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            placeholder="¿Qué estás buscando?"
                            className="w-full border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-slate-50"
                        />
                    </div>

                    {/* acciones */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {!usuario && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/login')}
                            >
                                Iniciar sesión
                            </Button>
                        )}
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
                        {usuario?.roles.includes('ADMIN') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/admin/productos')}
                            >
                                Admin →
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

                {/* filtros por categoría */}
                {categorias && categorias.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setCategoriaFiltro(null)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                categoriaFiltro === null
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            Todos
                        </button>
                        {categorias.map((c: Categoria) => (
                            <button
                                key={c.id}
                                onClick={() => setCategoriaFiltro(
                                    categoriaFiltro === c.id ? null : c.id
                                )}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    categoriaFiltro === c.id
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                            >
                                {c.nombre}
                            </button>
                        ))}
                    </div>
                )}

                {/* contador resultados */}
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

                {/* skeleton loading */}
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
                        <p className="text-slate-500 font-medium">No encontramos productos</p>
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

                {/* grid de productos */}
                {!isLoading && productosFiltrados.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {productosFiltrados.map((p: Producto) => (
                            <ProductoCard
                                key={p.id}
                                producto={p}
                                onAgregar={() => handleAgregar(p)}
                                cargando={agregando === p.id}
                                yaEnLista={itemsLocales.some(i => i.producto.id === p.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}