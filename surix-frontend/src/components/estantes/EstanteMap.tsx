'use client'

import { Estante } from '@/types/estante'
import { ItemLista } from '@/types/lista'
import EstanteBlock from './EstanteBlock'

const CELDA = 80
const PADDING = 40

type Props = {
    estantes: Estante[]
    items: ItemLista[]
    nombreEstanteActivo: string | null
    estantesConProductos: Set<string>
    estantesCompletados: Set<string>
}

export default function EstanteMap({
    estantes,
    items,
    nombreEstanteActivo,
    estantesConProductos,
    estantesCompletados,
}: Props) {
    if (estantes.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <p className="text-slate-400 text-sm">No hay estantes registrados</p>
            </div>
        )
    }

    const maxX = Math.max(...estantes.map(e => e.coordX))
    const maxY = Math.max(...estantes.map(e => e.coordY))
    const anchoCanvas = maxX * CELDA + PADDING * 2
    const altoCanvas = maxY * CELDA + PADDING * 2

    const getEstado = (estante: Estante) => {
        if (estante.nombre === nombreEstanteActivo) return 'activo'
        if (estantesCompletados.has(estante.nombre)) return 'completado'
        if (estantesConProductos.has(estante.nombre)) return 'pendiente'
        return 'inactivo'
    }

    return (
        <div className="space-y-3">
            {/* leyenda */}
            <div className="flex flex-wrap gap-3 text-xs">
                {[
                    { color: 'bg-blue-500', label: 'Ir aquí ahora' },
                    { color: 'bg-amber-100 border border-amber-400', label: 'Pendiente' },
                    { color: 'bg-green-500', label: 'Completado' },
                    { color: 'bg-slate-100 border border-slate-300', label: 'Sin productos' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded ${color}`} />
                        <span className="text-slate-600">{label}</span>
                    </div>
                ))}
            </div>

            {/* mapa */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-auto">
                <div
                    className="relative"
                    style={{ width: anchoCanvas, height: altoCanvas, minWidth: '100%' }}
                >
                    {/* cuadrícula */}
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        width={anchoCanvas}
                        height={altoCanvas}
                    >
                        {Array.from({ length: maxX + 1 }, (_, i) => (
                            <line key={`v${i}`}
                                x1={PADDING + i * CELDA} y1={PADDING / 2}
                                x2={PADDING + i * CELDA} y2={altoCanvas - PADDING / 2}
                                stroke="#f1f5f9" strokeWidth="1" />
                        ))}
                        {Array.from({ length: maxY + 1 }, (_, i) => (
                            <line key={`h${i}`}
                                x1={PADDING / 2} y1={PADDING + i * CELDA}
                                x2={anchoCanvas - PADDING / 2} y2={PADDING + i * CELDA}
                                stroke="#f1f5f9" strokeWidth="1" />
                        ))}
                    </svg>

                    {/* estantes */}
                    {estantes.map(estante => (
                        <EstanteBlock
                            key={estante.id}
                            estante={estante}
                            estado={getEstado(estante)}
                            productosAqui={items.filter(
                                i => i.estanteNombre === estante.nombre
                            )}
                            celda={CELDA}
                            padding={PADDING}
                        />
                    ))}

                    {/* entrada */}
                    <div className="absolute text-xl"
                        style={{ left: PADDING / 4, bottom: PADDING / 4 }}>
                        🚪
                    </div>
                </div>
            </div>

            {/* indicador estante activo */}
            {nombreEstanteActivo && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                        <p className="text-sm font-semibold text-blue-800">
                            Dirígete a: {nombreEstanteActivo}
                        </p>
                        <p className="text-xs text-blue-600">
                            {items
                                .filter(i => i.estanteNombre === nombreEstanteActivo && !i.recogido)
                                .map(i => i.productoNombre)
                                .join(', ')
                            }
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}