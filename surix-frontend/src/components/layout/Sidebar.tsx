'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const links = [
    { href: '/admin/productos', label: '📦 Productos' },
    { href: '/admin/estantes', label: '🗂️ Estantes' },
    { href: '/admin/categorias', label: '🏷️ Categorías' },
    { href: '/admin/usuarios', label: '👤 Usuarios' },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const logout = useAuthStore(s => s.logout)
    const usuario = useAuthStore(s => s.usuario)
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/catalogo')
    }

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">🛒 Surix App</h1>
                    <p className="text-sm text-slate-400 mt-1">{usuario?.username}</p>
                    <span className="text-xs bg-slate-700 px-2 py-0.5 rounded mt-1 inline-block">
                        ADMIN
                    </span>
                </div>
                {/* botón cerrar en móvil */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded hover:bg-slate-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            pathname === link.href
                                ? 'bg-slate-700 text-white font-medium'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    🚪 Cerrar sesión
                </button>
            </div>
        </aside>
    )
}