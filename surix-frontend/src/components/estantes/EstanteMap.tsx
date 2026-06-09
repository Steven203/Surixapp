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

// calcula el centro de un estante en el canvas
function getCentro(estante: Estante) {
    return {
        x: PADDING + (estante.coordX - 1) * CELDA + (CELDA - 8) / 2,
        y: PADDING + (estante.coordY - 1) * CELDA + (CELDA - 8) / 2,
    }
}

// posición de la entrada del supermercado
const ENTRADA = { x: PADDING / 2, y: PADDING / 2 }

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

    // estantes en la ruta — ordenados por orden_logico, solo los que tienen productos
    const estantesEnRuta = estantes
        .filter(e => estantesConProductos.has(e.nombre))
        .sort((a, b) => a.ordenLogico - b.ordenLogico)

    // puntos de la ruta: entrada + estantes con productos
    const puntosRuta = [ENTRADA, ...estantesEnRuta.map(getCentro)]

    // posición actual del muñeco — estante activo o entrada si no hay
    const estanteActivo = estantesEnRuta.find(e => e.nombre === nombreEstanteActivo)
    const posicionMuneco = estanteActivo
        ? getCentro(estanteActivo)
        : estantesEnRuta.length > 0 && estantesCompletados.size === estantesEnRuta.length
            ? getCentro(estantesEnRuta[estantesEnRuta.length - 1]) // todos completados
            : ENTRADA

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
                    <svg
                        className="absolute inset-0"
                        width={anchoCanvas}
                        height={altoCanvas}
                        style={{ zIndex: 1 }}
                    >
                        {/* cuadrícula */}
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

                        {/* línea de ruta — conecta entrada con estantes en orden */}
                        {puntosRuta.length > 1 && puntosRuta.map((punto, i) => {
                            if (i === 0) return null
                            const anterior = puntosRuta[i - 1]
                            const estante = estantesEnRuta[i - 1]
                            const completado = estante
                                ? estantesCompletados.has(estante.nombre)
                                : false

                            return (
                                <line
                                    key={`ruta-${i}`}
                                    x1={anterior.x}
                                    y1={anterior.y}
                                    x2={punto.x}
                                    y2={punto.y}
                                    stroke={completado ? '#22c55e' : '#3b82f6'}
                                    strokeWidth="2.5"
                                    strokeDasharray={completado ? 'none' : '6 3'}
                                    opacity="0.7"
                                />
                            )
                        })}

                        {/* puntos en cada estante de la ruta */}
                        {estantesEnRuta.map((estante, i) => {
                            const centro = getCentro(estante)
                            const completado = estantesCompletados.has(estante.nombre)
                            return (
                                <circle
                                    key={`punto-${estante.id}`}
                                    cx={centro.x}
                                    cy={centro.y}
                                    r="4"
                                    fill={completado ? '#22c55e' : '#3b82f6'}
                                    opacity="0.8"
                                />
                            )
                        })}

                        {/* número de orden sobre la línea */}
                        {estantesEnRuta.map((estante, i) => {
                            const centro = getCentro(estante)
                            return (
                                <text
                                    key={`num-${estante.id}`}
                                    x={centro.x + 8}
                                    y={centro.y - 8}
                                    fontSize="9"
                                    fill="#3b82f6"
                                    fontWeight="bold"
                                >
                                    {i + 1}
                                </text>
                            )
                        })}

                        {/* muñeco — se mueve con transition CSS */}
                        <g
                            style={{
                                transform: `translate(${posicionMuneco.x}px, ${posicionMuneco.y}px)`,
                                transition: 'transform 0.8s ease-in-out',
                            }}
                        >
                            {/* cuerpo */}
                            <circle cx="0" cy="-18" r="6" fill="#1e40af" />
                            {/* cabeza */}
                            <circle cx="0" cy="-28" r="5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
                            {/* brazos */}
                            <line x1="-8" y1="-16" x2="8" y2="-16" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
                            {/* piernas */}
                            <line x1="0" y1="-12" x2="-5" y2="-4" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="0" y1="-12" x2="5" y2="-4" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                        {/* entrada */}
                        <text x={ENTRADA.x - 8} y={ENTRADA.y + 4} fontSize="18">🚪</text>
                    </svg>

                    {/* estantes como divs encima del SVG */}
                    <div className="absolute inset-0" style={{ zIndex: 2 }}>
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

            {/* todos completados */}
            {estantesEnRuta.length > 0 &&
             estantesCompletados.size === estantesEnRuta.length &&
             estantesEnRuta.every(e => estantesCompletados.has(e.nombre)) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-sm font-semibold text-green-800">
                        🎉 ¡Ruta completada! Ya recogiste todos los productos.
                    </p>
                </div>
            )}
        </div>
    )
}