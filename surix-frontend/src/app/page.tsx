'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
    const router = useRouter()
    const usuario = useAuthStore(s => s.usuario)

    const handleCTA = () => {
        if (!usuario) {
            router.push('/catalogo')
            return
        }
        if (usuario.roles.includes('ADMIN')) router.push('/admin/productos')
        else router.push('/lista')
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* navbar */}
            <header className="border-b border-slate-100 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-800">🛒 Surix App</span>
                    <div className="flex items-center gap-3">
                        {!usuario ? (
                            <>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="text-sm text-slate-600 hover:text-slate-800"
                                >
                                    Iniciar sesión
                                </button>
                                <Button
                                    size="sm"
                                    onClick={() => router.push('/register')}
                                >
                                    Crear cuenta
                                </Button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-slate-500">
                                    Hola, {usuario.username}
                                </span>
                                <Button size="sm" onClick={handleCTA}>
                                    Ir a la app →
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* hero */}
            <section className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="space-y-4">
                        <span className="text-6xl">🛒</span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
                            Haz tu mercado{' '}
                            <span className="text-blue-600">inteligente</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            Crea tu lista de compras, sigue la ruta más eficiente
                            por el supermercado y ahorra tiempo en cada visita.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-base px-8"
                            onClick={handleCTA}
                        >
                            Empezar ahora — es gratis
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base px-8"
                            onClick={() => router.push('/catalogo')}
                        >
                            Ver catálogo
                        </Button>
                    </div>

                    <p className="text-xs text-slate-400">
                        Sin tarjeta de crédito · Sin instalación · Solo entra y compra
                    </p>
                </div>
            </section>

            {/* beneficios */}
            <section className="bg-slate-50 px-6 py-16">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
                        ¿Por qué Surix App?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🗺️',
                                titulo: 'Ruta sugerida',
                                descripcion: 'El mapa del supermercado te guía por el camino más corto para recoger todos tus productos.',
                            },
                            {
                                icon: '📋',
                                titulo: 'Lista digital',
                                descripcion: 'Crea tu lista desde casa, agrega productos del catálogo y llévala en tu celular.',
                            },
                            {
                                icon: '✓',
                                titulo: 'Marca lo recogido',
                                descripcion: 'Toca cada producto para marcarlo como recogido y lleva el control de tu compra en tiempo real.',
                            },
                        ].map(({ icon, titulo, descripcion }) => (
                            <div
                                key={titulo}
                                className="bg-white rounded-2xl p-6 space-y-3 border border-slate-200"
                            >
                                <span className="text-4xl">{icon}</span>
                                <h3 className="font-semibold text-slate-800">{titulo}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* cómo funciona */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
                        Así de simple
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                paso: '1',
                                titulo: 'Explora el catálogo',
                                descripcion: 'Busca productos por nombre o categoría y agrégalos a tu lista con un click.',
                            },
                            {
                                paso: '2',
                                titulo: 'Sigue la ruta',
                                descripcion: 'El mapa del supermercado te indica en qué estante está cada producto y en qué orden recogerlos.',
                            },
                            {
                                paso: '3',
                                titulo: 'Marca y listo',
                                descripcion: 'Toca cada producto al recogerlo. Cuando termines, finaliza tu compra.',
                            },
                        ].map(({ paso, titulo, descripcion }) => (
                            <div key={paso} className="flex gap-5 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {paso}
                                </div>
                                <div className="space-y-1 pt-1">
                                    <h3 className="font-semibold text-slate-800">{titulo}</h3>
                                    <p className="text-sm text-slate-500">{descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className="bg-blue-600 px-6 py-16">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">
                        ¿Listo para hacer tu mercado inteligente?
                    </h2>
                    <p className="text-blue-100">
                        Únete y empieza a ahorrar tiempo en cada visita al supermercado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 text-base px-8"
                            onClick={() => router.push('/register')}
                        >
                            Crear cuenta gratis
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-black hover:bg-blue-400 text-base px-8"
                            onClick={() => router.push('/catalogo')}
                        >
                            Ver catálogo sin registro
                        </Button>
                    </div>
                </div>
            </section>

            {/* footer */}
            <footer className="border-t border-slate-100 px-6 py-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700">🛒 Surix App</span>
                    <p className="text-xs text-slate-400">
                        Proyecto académico — Universidad de Nariño · 2026
                    </p>
                    <div className="flex gap-4 text-xs text-slate-400">
                        <button onClick={() => router.push('/catalogo')}
                            className="hover:text-slate-600">Catálogo</button>
                        <button onClick={() => router.push('/login')}
                            className="hover:text-slate-600">Iniciar sesión</button>
                        <button onClick={() => router.push('/register')}
                            className="hover:text-slate-600">Registrarse</button>
                    </div>
                </div>
            </footer>
        </div>
    )
}