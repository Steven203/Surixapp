import useSWR from 'swr'
import { toast } from 'sonner'
import { productosApi } from '@/api/productos'
import { estantesApi } from '@/api/estantes'
import { categoriasApi } from '@/api/categorias'

export function useProductosAdmin() {
    const { data: productos, mutate, isLoading } = useSWR(
        '/api/productos',
        productosApi.list
    )

    const { data: estantes } = useSWR('/api/estantes', estantesApi.list)
    const { data: categorias } = useSWR('/api/categorias', categoriasApi.list)

    const crear = async (data: {
        nombre: string
        precio: number
        stock: number
        descripcion?: string
        estanteId: number
        categoriaId?: number
    }) => {
        try {
            await productosApi.create(data)
            mutate()
            toast.success('Producto creado exitosamente')
            return true
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear el producto')
            return false
        }
    }

    const eliminar = async (id: number, nombre: string) => {
        toast('¿Eliminar este producto?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await productosApi.delete(id)
                        mutate()
                        toast.success('Producto eliminado')
                    } catch (err: any) {
                        toast.error(err.message ?? 'Error al eliminar')
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => {} },
        })
    }

    return {
        productos,
        estantes,
        categorias,
        isLoading,
        crear,
        eliminar,
    }
}