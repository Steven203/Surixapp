'use client'

import { useState } from 'react'
import { useEstantes } from '@/hooks/useEstantes'
import { Estante } from '@/types/estante'
import { Button } from '@/components/ui/button'
import EstanteForm from '@/components/estantes/EstanteForm'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export default function EstantesPage() {
    const { estantes, isLoading, siguienteOrden, crear, eliminar } = useEstantes()
    const [open, setOpen] = useState(false)

    const handleSubmit = async (data: any) => {
        const ok = await crear(data)
        if (ok) setOpen(false)
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

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nuevo estante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear estante</DialogTitle>
                        </DialogHeader>
                        <EstanteForm
                            siguienteOrden={siguienteOrden}
                            onSubmit={handleSubmit}
                            onCancel={() => setOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

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
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => eliminar(e.id, e.nombre)}
                                    >
                                        Eliminar
                                    </Button>
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