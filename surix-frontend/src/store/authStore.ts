import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario } from '@/types/usuario'

type AuthStore = {
    usuario: Usuario | null
    token: string | null        // ← nuevo
    setUsuario: (usuario: Usuario, token: string) => void  // ← cambia
    logout: () => void
    isAdmin: () => boolean
    isCliente: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            usuario: null,
            token: null,
            setUsuario: (usuario, token) => {
                document.cookie = `auth-user=${JSON.stringify(usuario)}; path=/`
                set({ usuario, token })
            },
            logout: () => {
                document.cookie = 'auth-user=; path=/; max-age=0'
                set({ usuario: null, token: null })
            },
            isAdmin: () => get().usuario?.roles.includes('ADMIN') ?? false,
            isCliente: () => get().usuario?.roles.includes('CLIENTE') ?? false,
        }),
        { name: 'auth-storage' }
    )
)