    'use client'

    import { useAuthStore } from '@/store/authStore'
    import { useRouter, usePathname } from 'next/navigation'
    import useSWR from 'swr'
    import { listasApi } from '@/api/listas'
    import { toast } from 'sonner'
    import { useLista } from '@/hooks/useLista'

    export default function ClienteLayout({ children }: { children: React.ReactNode }) {
        const usuario = useAuthStore(s => s.usuario)
        const logout = useAuthStore(s => s.logout)
        const router = useRouter()
        const pathname = usePathname()
        const { items, eliminarLista } = useLista()

        const { data: listas } = useSWR(
            usuario ? `/api/listas/usuario/${usuario.id}` : null,
            () => listasApi.getByUsuario(usuario!.id)
        )

        const listaActiva = listas?.find(l => l.estado === 'EN_PROCESO')
        const estaEnLista = pathname === '/lista'

        const handleLogout = async () => {
            const tieneItems = (items?.length ?? 0) > 0

            if (listaActiva && tieneItems) {
                toast('Tienes una lista activa sin finalizar', {
                    description: '¿Qué deseas hacer?',
                    action: {
                        label: 'Cerrar sesión igual',
                        onClick: () => {
                            logout()
                            router.push('/catalogo')
                        },
                    },
                    cancel: { label: 'Continuar comprando', onClick: () => { } },
                })
                return
            }

            if (listaActiva && !tieneItems) {
                await eliminarLista()
            }

            logout()
            router.push('/')
        }

        return (
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🛒</span>
                            <div>
                                <h1 className="font-bold text-slate-800 leading-none">Surix App</h1>
                                <p className="text-xs text-slate-400">{usuario?.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {!estaEnLista && (
                                <button
                                    onClick={() => router.push('/lista')}
                                    className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1"
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
                                className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Catálogo
                            </button>
                            <button
                                onClick={() => router.push('/perfil')}
                                className="text-sm text-slate-500 hover:text-slate-800"
                            >
                                {usuario?.username}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Salir →
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-4 py-6">
                    {children}
                </main>
            </div>
        )
    }