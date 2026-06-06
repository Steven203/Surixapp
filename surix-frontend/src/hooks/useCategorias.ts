import useSWR from 'swr'
import { toast } from 'sonner'
import { categoriasApi } from '@/api/categorias'
import { CategoriaFormData, CategoriaUpdateData } from '@/types/categoria'

export function useCategorias() {
  const { data: categorias, mutate, isLoading } = useSWR('/api/categorias', categoriasApi.list)

  const crear = async (data: CategoriaFormData) => {
    try {
      await categoriasApi.create(data)
      await mutate()
      toast.success('Categoría creada exitosamente')
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la categoría'
      toast.error(message)
      return false
    }
  }

  const actualizar = async (id: number, data: CategoriaUpdateData) => {
    try {
      await categoriasApi.update(id, data)
      await mutate()
      toast.success('Categoría actualizada')
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar'
      toast.error(message)
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
                    } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : 'Error al eliminar'
                        toast.error(message)
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
    actualizar,
    eliminar,
  }
}