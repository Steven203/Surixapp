import useSWR from 'swr'
import { toast } from 'sonner'
import { categoriasApi } from '@/api/categorias'

export function useCategorias() {
    const { data: categorias, mutate, isLoading } = useSWR(
        '/api/categorias',
        categoriasApi.list
    )

    const crear = async (data: { nombre: string; descripcion?: string }) => {
        try {
            await categoriasApi.create(data)
            mutate()
            toast.success('Categoría creada exitosamente')
            return true
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear la categoría')
            return false
        }
    }

    const eliminar = async (id: number, nombre: string) => {
        toast('¿Eliminar esta categoría?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await categoriasApi.delete(id)
                        mutate()
                        toast.success('Categoría eliminada')
                    } catch (err: any) {
                        toast.error(err.message ?? 'Error al eliminar')
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => {} },
        })
    }

    return {
        categorias,
        isLoading,
        crear,
        eliminar,
    }
}