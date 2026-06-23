'use client'

import { useAuthStore } from '@/store/authStore'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'
import { listasApi } from '@/api/listas'
import { toast } from 'sonner'
import { useLista } from '@/hooks/useLista'
import Navbar from '@/components/layout/Navbar'
import ConfirmDialog from '@/components/ui/confirmdialog'


export default function ClienteLayout({ children }: { children: React.ReactNode }) {
    const usuario = useAuthStore(s => s.usuario)
    const logout = useAuthStore(s => s.logout)
    const router = useRouter()
    const pathname = usePathname()
    const { items, eliminarLista, listaActiva } = useLista()
    const [confirmLogout, setConfirmLogout] = useState(false)

    const { data: listas } = useSWR(
        usuario ? `/api/listas/usuario/${usuario.id}` : null,
        () => listasApi.getByUsuario(usuario!.id)
    )

    const tieneItems = (items?.length ?? 0) > 0
    const estaEnLista = pathname === '/lista'

    const finalizarLogout = () => {
        logout()
        router.push('/login')
    }

    const handleLogout = () => {
        if (listaActiva && tieneItems) {
            setConfirmLogout(true)
            return
        }
        if (listaActiva && !tieneItems) {
            eliminarLista()
        }
        finalizarLogout()
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar
                leftContent={
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl">🛒</span>
                        <div className="min-w-0">
                            <h1 className="font-bold text-slate-800 leading-none whitespace-nowrap">
                                Surix App
                            </h1>
                            <p className="text-xs text-slate-400 truncate max-w-[140px] sm:max-w-none">
                                {usuario?.username}
                            </p>
                        </div>
                    </div>
                }
                rightContent={
                    <>
                        {!estaEnLista && (
                            <button
                                onClick={() => router.push('/lista')}
                                className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1 whitespace-nowrap"
                            >
                                🛒
                                {listaActiva && (listaActiva.items?.length ?? 0) > 0 && (
                                    <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {listaActiva.items?.length}
                                    </span>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => router.push('/catalogo')}
                            className="text-sm text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
                        >
                            Catálogo
                        </button>

                        <button
                            onClick={() => router.push('/perfil')}
                            className="text-sm text-slate-500 hover:text-slate-800 whitespace-nowrap"
                        >
                            Perfil
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-sm text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
                        >
                            Salir →
                        </button>
                    </>
                }
                logoHref="/"
            />

            <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {children}
            </main>

            <ConfirmDialog
                open={confirmLogout}
                titulo="Tienes una lista activa sin finalizar"
                descripcion="Tu lista quedará guardada y podrás continuar cuando vuelvas a ingresar."
                resumen={[
                    { label: 'Productos', valor: items?.length ?? 0 },
                    { label: 'Recogidos', valor: items?.filter(i => i.recogido).length ?? 0 },
                ]}
                labelConfirmar="Cerrar sesión igual"
                labelCancelar="Seguir comprando"
                variante="destructive"
                onConfirmar={() => {
                    setConfirmLogout(false)
                    finalizarLogout()
                }}
                onCancelar={() => setConfirmLogout(false)}
            />
        </div>
    )
}