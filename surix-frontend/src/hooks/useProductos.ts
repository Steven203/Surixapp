import useSWR from 'swr'
import { productosApi } from '@/api/productos'
import { categoriasApi } from '@/api/categorias'
import { listasApi } from '@/api/listas'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { Producto } from '@/types/producto'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useProductos() {
    const router = useRouter()
    const usuario = useAuthStore(s => s.usuario)
    const { itemsLocales, agregarLocal, limpiarLocales } = useListaStore()

    const [busqueda, setBusqueda] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null)
    const [agregando, setAgregando] = useState<number | null>(null)

    const { data: productos, isLoading } = useSWR(
        '/api/productos',
        productosApi.list
    )

    const { data: categorias } = useSWR(
        '/api/categorias',
        categoriasApi.list
    )

    const { data: listas, mutate: mutarListas } = useSWR(
        usuario?.roles.includes('CLIENTE')
            ? `/api/listas/usuario/${usuario.id}`
            : null,
        () => listasApi.getByUsuario(usuario!.id)
    )

    const listaActiva = listas?.find(l => l.estado === 'EN_PROCESO')

    const { data: itemsLista, mutate: mutarItemsLista } = useSWR(
        listaActiva ? `/api/listas/${listaActiva.id}/items` : null,
        () => listasApi.getItems(listaActiva!.id),
        {
            fallbackData: [],          // ← si no hay lista, items vacíos
            revalidateOnFocus: true,
        }
    )

    // expirar items locales después de 24 horas


    // productos filtrados
    const productosFiltrados = productos?.filter(p => {
        const coincideNombre = p.nombre.toLowerCase()
            .includes(busqueda.toLowerCase())
        const coincideCategoria = categoriaFiltro === null
            || p.categoriaId === categoriaFiltro
        return coincideNombre && coincideCategoria
    }) ?? []

    // verificar si producto ya está en lista
    const estaEnLista = (productoId: number): boolean => {
        if (usuario?.roles.includes('CLIENTE')) {
            return itemsLista?.some(i => i.productoId === productoId) ?? false
        }
        return itemsLocales.some(i => i.producto.id === productoId)
    }

    const totalEnLista = usuario?.roles.includes('CLIENTE')
        ? itemsLista?.length ?? 0
        : itemsLocales.length

    const handleAgregar = async (producto: Producto) => {
        setAgregando(producto.id)
        try {
            if (usuario?.roles.includes('CLIENTE')) {
                let lista = listaActiva
                if (!lista) {
                    lista = await listasApi.create(usuario.id)
                    await mutarListas()   // ← actualiza listaActiva
                }
                await listasApi.addItem(lista.id, producto.id, 1)
                await mutarItemsLista()   // ← actualiza yaEnLista en cards
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
        if (usuario) router.push('/lista')
        else router.push('/login?redirect=/lista')
    }

    return {
        productos,
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
    }
}