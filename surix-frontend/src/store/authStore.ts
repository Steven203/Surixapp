import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario } from '@/types/usuario'

type AuthStore = {
    usuario: Usuario | null
    token: string | null
    setUsuario: (usuario: Usuario, token?: string) => void
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
                if (typeof document !== 'undefined') {
                    document.cookie = 'auth-user=${ encodeURIComponent(JSON.stringify(usuario)) }; path =/'
                }
                set(state => ({
                    usuario,
                    token: token ?? state.token,
                }))
            },
            logout: () => {
                if (typeof document !== 'undefined') {
                    document.cookie = 'auth-user=; path=/; max-age=0'
                }
                set({ usuario: null, token: null })
            },
            isAdmin: () => get().usuario?.roles.includes('ADMIN') ?? false,
            isCliente: () => get().usuario?.roles.includes('CLIENTE') ?? false,
        }),
        { name: 'auth-storage' }
    )
)