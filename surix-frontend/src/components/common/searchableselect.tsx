'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

type Option = {
  value: number
  label: string
}

type Props = {
  options: Option[]
  value?: number
  placeholder?: string
  onChange: (value: number | undefined) => void
  pageSize?: number
}

export default function SearchableSelect({
  options,
  value,
  placeholder = 'Seleccionar...',
  onChange,
  pageSize = 8,
}: Props) {
  const [open, setOpen] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [page, setPage] = useState(1)
  const ref = useRef<HTMLDivElement>(null)

  // cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setBusqueda('')
        setPage(1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtrados = options.filter(o =>
    o.label.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalPages = Math.ceil(filtrados.length / pageSize)
  const visibles = filtrados.slice((page - 1) * pageSize, page * pageSize)
  const seleccionado = options.find(o => o.value === value)

  const handleSelect = (opcion: Option) => {
    onChange(opcion.value)
    setOpen(false)
    setBusqueda('')
    setPage(1)
  }

  const handleBusqueda = (v: string) => {
    setBusqueda(v)
    setPage(1)
  }

  return (
    <div ref={ref} className="relative">
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
                    w-full border rounded-md px-3 py-2 text-sm text-left
                    flex items-center justify-between transition-colors
                    focus:outline-none focus:ring-2 focus:ring-slate-400
                    ${open
            ? 'border-slate-400 ring-2 ring-slate-400'
            : 'border-slate-200 hover:border-slate-300'
          }
                `}
      >
        <span className={seleccionado ? 'text-slate-800' : 'text-slate-400'}>
          {seleccionado ? seleccionado.label : placeholder}
        </span>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

          {/* buscador */}
          <div className="p-2 border-b border-slate-100">
            <Input
              autoFocus
              value={busqueda}
              onChange={e => handleBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="h-8 text-sm"
            />
          </div>

          {/* opciones */}
          <div className="max-h-48 overflow-y-auto">
            {visibles.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">
                {busqueda ? `Sin resultados para "${busqueda}"` : 'Sin opciones'}
              </p>
            ) : (
              visibles.map(opcion => (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => handleSelect(opcion)}
                  className={`
                                        w-full text-left px-3 py-2 text-sm transition-colors
                                        ${opcion.value === value
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-50 text-slate-700'
                    }
                                    `}
                >
                  {opcion.label}
                </button>
              ))
            )}
          </div>

          {/* paginación del select */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-xs text-slate-400">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* limpiar selección */}
          {value && (
            <div className="border-t border-slate-100">
              <button
                type="button"
                onClick={() => { onChange(undefined); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50"
              >
                ✕ Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}