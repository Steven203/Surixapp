import useSWR from 'swr'
import { toast } from 'sonner'
import { usuariosApi } from '@/api/usuarios'
import { UsuarioCreateData, UsuarioUpdateData } from '@/types/usuario'

export function useUsuarios() {
  const { data: usuarios, mutate, isLoading } = useSWR('/api/usuarios', usuariosApi.list)

  const crear = async (data: UsuarioCreateData) => {
    try {
      await usuariosApi.create(data)
      await mutate()
      toast.success('Usuario creado exitosamente')
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear'
      toast.error(message)
      return false
    }
  }

  const asignarRol = async (usuarioId: number, roleId: number, rolNombre: string) => {
    try {
      await usuariosApi.assignRole(usuarioId, roleId)
      await mutate()
      toast.success(`Rol ${rolNombre} asignado`)
      return true
    } catch (err: any) {
      toast.error(err.message ?? 'Error al asignar rol')
      return false
    }
  }

  const actualizar = async (id: number, data: UsuarioUpdateData) => {
    try {
      await usuariosApi.update(id, data)
      await mutate()
      toast.success('Usuario actualizado')
      return true
    } catch (err: any) {
      toast.error(err.message ?? 'Error al actualizar')
      return false
    }
  }

  const removerRol = async (usuarioId: number, roleId: number, rolNombre: string) => {
    try {
      await usuariosApi.removeRole(usuarioId, roleId)
      mutate()
      toast.success(`Rol ${rolNombre} removido`)
    } catch (err: any) {
      toast.error(err.message ?? 'Error al remover rol')
    }
  }

  const eliminar = async (id: number, username: string) => {
    toast('¿Eliminar este usuario?', {
      description: username,
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await usuariosApi.delete(id)
            await mutate()
            toast.success('Usuario eliminado')
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al eliminar'
            toast.error(message)
          }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => { } },
    })
  }

  return {
    usuarios,
    isLoading,
    crear,
    asignarRol,
    removerRol,
    actualizar,
    eliminar,
  }
}