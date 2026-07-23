'use client'

import { Button } from '@/components/ui/button'

type Props = {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null

    const paginas = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

    return (
        <div className="flex items-center justify-center gap-1 flex-wrap pt-2">
            <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                ← Anterior
            </Button>

            {paginas.map((p, i) => (
                <div key={p} className="flex items-center">
                    {i > 0 && paginas[i - 1] !== p - 1 && (
                        <span className="px-1 text-slate-400 text-sm">…</span>
                    )}
                    <button
                        onClick={() => onPageChange(p)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${p === page
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {p}
                    </button>
                </div>
            ))}

            <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Siguiente →
            </Button>
        </div>
    )
}