import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useListaStore } from '@/store/listaStore'
import { authApi } from '@/api/auth'
import { listasApi } from '@/api/listas'
import { Usuario } from '@/types/usuario'

export function useAuth() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const { setUsuario, logout, usuario } = useAuthStore()
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
            const response = await authApi.login(username, password)
            const usuario: Usuario = {
                id: response.id,
                username: response.username,
                roles: response.roles,
            }
            setUsuario(usuario, response.token)   // ← pasa el token
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
            const response = await authApi.register(username, password)
            const usuario: Usuario = {
                id: response.id,
                username: response.username,
                roles: response.roles,
            }
            setUsuario(usuario, response.token)   // ← pasa el token
            if (itemsLocales.length > 0) {
                await sincronizarItemsLocales(usuario.id)
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