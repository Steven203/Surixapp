import { Producto } from '@/types/producto'
import { Badge } from '@/components/ui/badge'

type Props = {
    producto: Producto
    onAgregar: () => void
    cargando: boolean
    yaEnLista: boolean
}

export default function ProductoCard({ producto, onAgregar, cargando, yaEnLista }: Props) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center text-3xl">
                🏷️
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
                    {producto.nombre}
                </p>
                {producto.categoriaNombre && (
                    <p className="text-xs text-slate-400">{producto.categoriaNombre}</p>
                )}
                {producto.estanteNombre && (
                    <p className="text-xs text-blue-600">📍 {producto.estanteNombre}</p>
                )}
            </div>
            <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                    ${producto.precio.toLocaleString()}
                </span>
                <Badge
                    variant={producto.stock > 10 ? 'secondary' : producto.stock > 0 ? 'outline' : 'destructive'}
                    className="text-xs"
                >
                    {producto.stock > 0 ? `${producto.stock} und` : 'Agotado'}
                </Badge>
            </div>
            <button
                onClick={onAgregar}
                disabled={cargando || producto.stock === 0}
                className={`
                    w-full py-2 rounded-lg text-sm font-medium transition-colors
                    ${yaEnLista
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : producto.stock === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'
                    }
                `}
            >
                {cargando ? 'Agregando...' : yaEnLista ? '✓ En tu lista' : '+ Agregar'}
            </button>
        </div>
    )
}