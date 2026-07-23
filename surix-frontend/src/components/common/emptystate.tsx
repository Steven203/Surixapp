type Props = {
    icono?: string
    titulo: string
    descripcion?: string
}

export default function EmptyState({ icono = '📭', titulo, descripcion }: Props) {
    return (
        <div className="text-center py-8 space-y-1">
            <div className="text-3xl">{icono}</div>
            <p className="text-slate-400 text-sm font-medium">{titulo}</p>
            {descripcion && (
                <p className="text-slate-400 text-xs">{descripcion}</p>
            )}
        </div>
    )
}