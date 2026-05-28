import { apiFetch } from './client'
import { Usuario } from '@/types/usuario'

export const authApi = {
    // busca todos los usuarios y encuentra el que coincide
    login: async (username: string, password: string): Promise<Usuario> => {
        const usuarios = await apiFetch<Usuario[]>('/api/usuarios')
        const usuario = usuarios.find(u => u.username === username)
        if (!usuario) throw new Error('Usuario no encontrado')
        // cuando tengas JWT esto cambia por un POST /api/auth/login
        return usuario
    },
}