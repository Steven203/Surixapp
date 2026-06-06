import { Estante } from '@/types/estante'
import { ItemLista } from '@/types/lista'

type Estado = 'activo' | 'completado' | 'pendiente' | 'inactivo'

type Props = {
    estante: Estante
    estado: Estado
    productosAqui: ItemLista[]
    celda: number
    padding: number
}

export default function EstanteBlock({
    estante, estado, productosAqui, celda, padding
}: Props) {
    const x = padding + (estante.coordX - 1) * celda
    const y = padding + (estante.coordY - 1) * celda
    const esActivo = estado === 'activo'

    const clases = {
        activo: 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-200',
        completado: 'bg-green-500 border-green-600 text-white',
        pendiente: 'bg-amber-100 border-amber-400 text-amber-800',
        inactivo: 'bg-slate-100 border-slate-300 text-slate-500',
    }[estado]

    return (
        <div
            className={`
                absolute border-2 rounded-lg flex flex-col items-center
                justify-center transition-all duration-300 cursor-default
                ${clases}
                ${esActivo ? 'animate-pulse scale-105 z-10' : ''}
            `}
            style={{
                left: x,
                top: y,
                width: celda - 8,
                height: celda - 8,
            }}
            title={productosAqui.map(p => p.productoNombre).join(', ')}
        >
            <span className="text-xs font-bold leading-none">
                #{estante.ordenLogico}
            </span>
            <span className="text-xs leading-none mt-0.5 px-1 truncate w-full text-center">
                {estante.nombre}
            </span>
            {productosAqui.length > 0 && (
                <span className={`
                    text-xs font-bold mt-0.5 px-1.5 py-0.5 rounded-full
                    ${esActivo ? 'bg-white text-blue-600' : 'bg-white/50'}
                `}>
                    {productosAqui.filter(p => !p.recogido).length}/{productosAqui.length}
                </span>
            )}
        </div>
    )
}