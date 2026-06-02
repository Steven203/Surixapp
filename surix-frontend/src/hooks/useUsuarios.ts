import useSWR from 'swr'
import { toast } from 'sonner'
import { usuariosApi } from '@/api/usuarios'

export function useUsuarios() {
    const { data: usuarios, mutate, isLoading } = useSWR(
        '/api/usuarios',
        usuariosApi.list
    )

    const crear = async (data: { username: string; password: string }) => {
        try {
            await usuariosApi.create(data)
            mutate()
            toast.success('Usuario creado exitosamente')
            return true
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear el usuario')
            return false
        }
    }

    const asignarRol = async (
        usuarioId: number,
        roleId: number,
        rolNombre: string
    ) => {
        try {
            await usuariosApi.assignRole(usuarioId, roleId)
            mutate()
            toast.success(`Rol ${rolNombre} asignado correctamente`)
        } catch (err: any) {
            toast.error(err.message ?? 'Error al asignar rol')
        }
    }

    return {
        usuarios,
        isLoading,
        crear,
        asignarRol,
    }
}