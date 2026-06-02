import { Categoria } from '@/types/categoria'

type Props = {
    categorias: Categoria[]
    categoriaFiltro: number | null
    onCambiar: (id: number | null) => void
}

export default function ProductoFiltros({
    categorias,
    categoriaFiltro,
    onCambiar,
}: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            <button
                onClick={() => onCambiar(null)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoriaFiltro === null
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
            >
                Todos
            </button>
            {categorias.map(c => (
                <button
                    key={c.id}
                    onClick={() => onCambiar(categoriaFiltro === c.id ? null : c.id)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        categoriaFiltro === c.id
                            ? 'bg-slate-800 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                >
                    {c.nombre}
                </button>
            ))}
        </div>
    )
}