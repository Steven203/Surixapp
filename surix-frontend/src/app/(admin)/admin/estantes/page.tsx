'use client'

import { useState } from 'react'
import { useEstantes } from '@/hooks/useEstantes'
import { Estante, EstanteFormData, EstanteUpdateData } from '@/types/estante'
import { Button } from '@/components/ui/button'
import EstanteForm from '@/components/estantes/EstanteForm'
import EditModal from '@/components/admin/EditModal'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export default function EstantesPage() {
    const { estantes, isLoading, siguienteOrden, crear, actualizar, eliminar } = useEstantes()
    const [openCrear, setOpenCrear] = useState(false)
    const [editando, setEditando] = useState<Estante | null>(null)

    const handleCrear = async (data: EstanteFormData) => {
        const ok = await crear(data)
        if (ok) setOpenCrear(false)
        return ok
    }

    const handleActualizar = async (data: EstanteUpdateData) => {
        if (!editando) return false
        const ok = await actualizar(editando.id, data)
        if (ok) setEditando(null)
        return ok
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Estantes</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {estantes?.length ?? 0} estantes · siguiente orden:{' '}
                        <span className="font-medium text-slate-700">#{siguienteOrden}</span>
                    </p>
                </div>

                <Dialog open={openCrear} onOpenChange={setOpenCrear}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nuevo estante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear estante</DialogTitle>
                        </DialogHeader>
                        <EstanteForm
                            siguienteOrden={siguienteOrden}
                            onSubmit={handleCrear}
                            onCancel={() => setOpenCrear(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* modal editar */}
            <EditModal
                open={!!editando}
                onClose={() => setEditando(null)}
                titulo="Editar estante"
            >
                {editando && (
                    <EstanteForm
                        siguienteOrden={editando.ordenLogico}
                        defaultValues={{
                            nombre: editando.nombre,
                            coordX: editando.coordX,
                            coordY: editando.coordY,
                            ordenLogico: editando.ordenLogico,
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
                            <TableHead className="hidden sm:table-cell">Coord X</TableHead>
                            <TableHead className="hidden sm:table-cell">Coord Y</TableHead>
                            <TableHead>Orden</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {estantes?.map((e: Estante) => (
                            <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.nombre}</TableCell>
                                <TableCell className="hidden sm:table-cell">{e.coordX}</TableCell>
                                <TableCell className="hidden sm:table-cell">{e.coordY}</TableCell>
                                <TableCell>#{e.ordenLogico}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditando(e)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => eliminar(e.id, e.nombre)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && estantes?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                                    No hay estantes registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}