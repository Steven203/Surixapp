'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useListaStore } from '@/store/listaStore'
import { listasApi } from '@/api/listas'

export default function LoginPage() {
  const router = useRouter()
  const setUsuario = useAuthStore(s => s.setUsuario)
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? null

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { itemsLocales, limpiarLocales } = useListaStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const usuario = await authApi.login(username, password)
      setUsuario(usuario)

      // si tiene items locales y es cliente → crear lista y sincronizar
      if (itemsLocales.length > 0 && usuario.roles.includes('CLIENTE')) {
        try {
          const listas = await listasApi.getByUsuario(usuario.id)
          let listaActiva = listas.find((l: any) => l.estado === 'EN_PROCESO')
          if (!listaActiva) {
            listaActiva = await listasApi.create(usuario.id)
          }
          for (const item of itemsLocales) {
            try {
              await listasApi.addItem(listaActiva.id, item.producto.id, item.cantidad)
            } catch { /* ignora duplicados */ }
          }
          await limpiarLocales()
        } catch { /* silencioso */ }
      }

      if (usuario.roles.includes('ADMIN')) {
        router.push('/admin/productos')
      } else if (usuario.roles.includes('CLIENTE')) {
        router.push(redirect ?? '/lista')
      } else {
        setError('El usuario no tiene un rol asignado')
      }
    } catch (err: any) {
      setError(err.message ?? 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">🛒 Surix App</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="tu usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}