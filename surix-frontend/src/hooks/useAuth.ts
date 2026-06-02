import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { authApi } from '@/api/auth'
import { listasApi } from '@/api/listas'
import { usuariosApi } from '@/api/usuarios'

export function useAuth() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const setUsuario = useAuthStore(s => s.setUsuario)
    const logout = useAuthStore(s => s.logout)
    const usuario = useAuthStore(s => s.usuario)

    const { itemsLocales, limpiarLocales } = useListaStore()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const sincronizarItemsLocales = async (usuarioId: number) => {
        if (itemsLocales.length === 0) return
        try {
            const listas = await listasApi.getByUsuario(usuarioId)
            let listaActiva = listas.find((l: any) => l.estado === 'EN_PROCESO')
            if (!listaActiva) {
                listaActiva = await listasApi.create(usuarioId)
            }
            for (const item of itemsLocales) {
                try {
                    await listasApi.addItem(listaActiva.id, item.producto.id, item.cantidad)
                } catch { /* ignora duplicados */ }
            }
            limpiarLocales()
        } catch { /* silencioso */ }
    }

    const redirigir = (roles: string[]) => {
        if (roles.includes('ADMIN')) router.push('/admin/productos')
        else if (roles.includes('CLIENTE')) router.push(redirect ?? '/lista')
        else setError('El usuario no tiene un rol asignado')
    }

    const login = async (username: string, password: string) => {
        setError('')
        setLoading(true)
        try {
            const usuario = await authApi.login(username, password)
            setUsuario(usuario)
            if (usuario.roles.includes('CLIENTE')) {
                await sincronizarItemsLocales(usuario.id)
            }
            redirigir(usuario.roles)
        } catch (err: any) {
            setError(err.message ?? 'Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    const register = async (username: string, password: string) => {
        setError('')
        setLoading(true)
        try {
            // crear usuario
            const nuevoUsuario = await usuariosApi.create({ username, password })
            // asignar rol CLIENTE automáticamente (id 2)
            const usuarioConRol = await usuariosApi.assignRole(nuevoUsuario.id, 2)
            setUsuario(usuarioConRol)
            if (itemsLocales.length > 0) {
                await sincronizarItemsLocales(usuarioConRol.id)
            }
            router.push(redirect ?? '/lista')
        } catch (err: any) {
            setError(err.message ?? 'Error al crear la cuenta')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return {
        usuario,
        loading,
        error,
        setError,
        login,
        register,
        handleLogout,
    }
}