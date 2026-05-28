import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario } from '@/types/usuario'

type AuthStore = {
    usuario: Usuario | null
    setUsuario: (usuario: Usuario) => void
    logout: () => void
    isAdmin: () => boolean
    isCliente: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            usuario: null,
            setUsuario: (usuario) => {
                // guarda en cookie para que el middleware pueda leerla
                document.cookie = `auth-user=${JSON.stringify(usuario)}; path=/`
                set({ usuario })
            },
            logout: () => {
                // borra la cookie al salir
                document.cookie = 'auth-user=; path=/; max-age=0'
                set({ usuario: null })
            },
            isAdmin: () => get().usuario?.roles.includes('ADMIN') ?? false,
            isCliente: () => get().usuario?.roles.includes('CLIENTE') ?? false,
        }),
        { name: 'auth-storage' }
    )
)