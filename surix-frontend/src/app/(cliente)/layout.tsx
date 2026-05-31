'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
    const usuario = useAuthStore(s => s.usuario)
    const logout = useAuthStore(s => s.logout)
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛒</span>
                        <div>
                            <h1 className="font-bold text-slate-800 leading-none">Surix App</h1>
                            <p className="text-xs text-slate-400">{usuario?.username}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Salir →
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
}