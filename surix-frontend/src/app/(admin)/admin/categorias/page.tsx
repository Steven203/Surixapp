'use client'

import { useState } from 'react'
import { useCategorias } from '@/hooks/useCategorias'
import { Categoria, CategoriaFormData, CategoriaUpdateData } from '@/types/categoria'
import { Button } from '@/components/ui/button'
import CategoriaForm from '@/components/categorias/CategoriaForm'
import EditModal from '@/components/admin/EditModal'
import { usePagination } from '@/hooks/usePagination'
import SearchBar from '@/components/ui/searchbar'
import Pagination from '@/components/ui/pagination'
import EmptyState from '@/components/ui/emptystate'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const PER_PAGE = 10

export default function CategoriasPage() {
    const { categorias, isLoading, crear, actualizar, eliminar } = useCategorias()
    const [openCrear, setOpenCrear] = useState(false)
    const [editando, setEditando] = useState<Categoria | null>(null)
    const [busqueda, setBusqueda] = useState('')

    const categoriasFiltradas = categorias?.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    const { page, setPage, totalPages, itemsPagina } = usePagination(
        categoriasFiltradas, PER_PAGE
    )

    const handleCrear = async (data: CategoriaFormData) => {
        const ok = await crear(data)
        if (ok) setOpenCrear(false)
        return ok
    }

    const handleActualizar = async (data: CategoriaUpdateData) => {
        if (!editando) return false
        const ok = await actualizar(editando.id, data)
        if (ok) setEditando(null)
        return ok
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {categoriasFiltradas?.length ?? 0} categorías
                        {busqueda && ` · filtrado de ${categorias?.length ?? 0}`}
                    </p>
                </div>

                <Dialog open={openCrear} onOpenChange={setOpenCrear}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nueva categoría</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear categoría</DialogTitle>
                        </DialogHeader>
                        <CategoriaForm
                            onSubmit={handleCrear}
                            onCancel={() => setOpenCrear(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <SearchBar
                value={busqueda}
                onChange={v => { setBusqueda(v); setPage(1) }}
                placeholder="Buscar categoría..."
            />

            {/* modal editar */}
            <EditModal
                open={!!editando}
                onClose={() => setEditando(null)}
                titulo="Editar categoría"
            >
                {editando && (
                    <CategoriaForm
                        defaultValues={{
                            nombre: editando.nombre,
                            descripcion: editando.descripcion ?? '',
                        }}
                        onSubmit={handleActualizar}
                        onCancel={() => setEditando(null)}
                    />
                )}
            </EditModal>

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemsPagina.map((c: Categoria) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{c.nombre}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {c.descripcion ?? '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditando(c)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => eliminar(c.id, c.nombre)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!isLoading && itemsPagina.length === 0 && (
                    <EmptyState
                        icono="📦"
                        titulo={busqueda ? 'Sin resultados' : 'No hay productos registrados'}
                        descripcion={busqueda ? `No encontramos "${busqueda}"` : undefined}
                    />
                )}


            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    )
}