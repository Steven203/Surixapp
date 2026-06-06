import useSWR from 'swr'
import { toast } from 'sonner'
import { productosApi } from '@/api/productos'
import { estantesApi } from '@/api/estantes'
import { categoriasApi } from '@/api/categorias'
import { ProductoFormData, ProductoUpdateData } from '@/types/producto'

export function useProductosAdmin() {
    const { data: productos, mutate, isLoading } = useSWR('/api/productos', productosApi.list)
    const { data: estantes } = useSWR('/api/estantes', estantesApi.list)
    const { data: categorias } = useSWR('/api/categorias', categoriasApi.list)

    const crear = async (data: ProductoFormData) => {
        try {
            await productosApi.create(data)
            await mutate()
            toast.success('Producto creado exitosamente')
            return true
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al crear el producto'
            toast.error(message)
            return false
        }
    }

    const actualizar = async (id: number, data: ProductoUpdateData) => {
        try {
            await productosApi.update(id, data)
            await mutate()
            toast.success('Producto actualizado')
            return true
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al actualizar'
            toast.error(message)
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
                        await mutate()
                        toast.success('Producto eliminado')
                    } catch (err: unknown) {
                        toast.error(err instanceof Error ? err.message : 'Error al eliminar')
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => { } },
        })
    }

    return {
        productos,
        estantes,
        categorias,
        isLoading,
        crear,
        eliminar,
        actualizar,
    }
}