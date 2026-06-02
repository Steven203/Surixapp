import useSWR from 'swr'
import { toast } from 'sonner'
import { estantesApi } from '@/api/estantes'
import { Estante } from '@/types/estante'

export function useEstantes() {
    const { data: estantes, mutate, isLoading } = useSWR(
        '/api/estantes',
        estantesApi.list
    )

    const siguienteOrden = estantes && estantes.length > 0
        ? Math.max(...estantes.map(e => e.ordenLogico)) + 1
        : 1

    const crear = async (data: Omit<Estante, 'id'>) => {
        try {
            await estantesApi.create(data)
            mutate()
            toast.success('Estante creado exitosamente')
            return true
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear el estante')
            return false
        }
    }

    const eliminar = async (id: number, nombre: string) => {
        toast('¿Eliminar este estante?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await estantesApi.delete(id)
                        mutate()
                        toast.success('Estante eliminado')
                    } catch (err: any) {
                        toast.error(err.message ?? 'Error al eliminar')
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => {} },
        })
    }

    return {
        estantes,
        isLoading,
        siguienteOrden,
        crear,
        eliminar,
    }
}