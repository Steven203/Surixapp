'use client'

import { Input } from '@/components/ui/input'

type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar...' }: Props) {
    return (
        <div className="relative">
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
            </span>
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                >
                    ✕
                </button>
            )}
        </div>
    )
}