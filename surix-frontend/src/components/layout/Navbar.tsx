'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

type Props = {
    busqueda: string
    onBusqueda: (v: string) => void
    totalEnLista: number
    onVerLista: () => void
}

export default function Navbar({
    busqueda,
    onBusqueda,
    totalEnLista,
    onVerLista,
}: Props) {
    const router = useRouter()
    const usuario = useAuthStore(s => s.usuario)
    const logout = useAuthStore(s => s.logout)

    const handleLogout = () => {
        logout()
        router.refresh()
    }

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* logo */}
                <h1
                    onClick={() => router.push('/catalogo')}
                    className="text-lg font-bold text-slate-800 flex-shrink-0 cursor-pointer"
                >
                    🛒 Surix App
                </h1>

                {/* buscador */}
                <div className="flex-1 max-w-md">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => onBusqueda(e.target.value)}
                        placeholder="¿Qué estás buscando?"
                        className="w-full border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-slate-50"
                    />
                </div>

                {/* acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {!usuario ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/login')}
                        >
                            Iniciar sesión
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 hidden sm:block">
                                {usuario.username}
                            </span>
                            {usuario.roles.includes('ADMIN') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push('/admin/productos')}
                                >
                                    Admin →
                                </Button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Salir
                            </button>
                        </div>
                    )}

                    {/* carrito */}
                    <button
                        onClick={onVerLista}
                        className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <span className="text-xl">🛒</span>
                        {totalEnLista > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {totalEnLista}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}