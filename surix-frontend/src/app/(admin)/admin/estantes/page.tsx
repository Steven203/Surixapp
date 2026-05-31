'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { estantesApi } from '@/api/estantes'
import { Estante } from '@/types/estante'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const schema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    coordX: z.coerce.number().int('Debe ser un número entero').positive('La coordenada debe ser mayor a 0'),
    coordY: z.coerce.number().int('Debe ser un número entero').positive('La coordenada debe ser mayor a 0'),
    ordenLogico: z.coerce.number()
        .int('Debe ser un número entero')
        .positive('El orden debe ser mayor a 0'),
})

type FormData = z.infer<typeof schema>

export default function EstantesPage() {
    const { data: estantes, mutate } = useSWR('/api/estantes', estantesApi.list)
    const [open, setOpen] = useState(false)

    // calcula el siguiente orden lógico disponible
    const siguienteOrden = estantes && estantes.length > 0
        ? Math.max(...estantes.map(e => e.ordenLogico)) + 1
        : 1

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        values: { nombre: '', coordX: 0, coordY: 0, ordenLogico: siguienteOrden },
    })

    const onSubmit = async (data: FormData) => {
        try {
            await estantesApi.create(data)
            mutate()
            setOpen(false)
            reset()
            toast.success('Estante creado exitosamente')
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear el estante')
        }
    }

    const handleDelete = async (id: number, nombre: string) => {
        toast('¿Eliminar este estante?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await estantesApi.delete(id)
                        mutate()
                        toast.success('Estante eliminado')
                    } catch (err: any) {
                        toast.error(err.message ?? 'Error al eliminar')
                    }
                },
            },
            cancel: { label: 'Cancelar', onClick: () => {} },
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Estantes</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {estantes?.length ?? 0} estantes · siguiente orden: <span className="font-medium text-slate-700">#{siguienteOrden}</span>
                    </p>
                </div>

                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nuevo estante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear estante</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <div className="space-y-1">
                                <Label>Nombre *</Label>
                                <Input {...register('nombre')} placeholder="Estante A" />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Coord X</Label>
                                    <Input {...register('coordX')} type="number" placeholder="1" />
                                    {errors.coordX && (
                                        <p className="text-xs text-red-500">{errors.coordX.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label>Coord Y</Label>
                                    <Input {...register('coordY')} type="number" placeholder="1" />
                                    {errors.coordY && (
                                        <p className="text-xs text-red-500">{errors.coordY.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>
                                    Orden lógico *
                                    <span className="ml-2 text-xs text-slate-400 font-normal">
                                        (sugerido: #{siguienteOrden})
                                    </span>
                                </Label>
                                <Input {...register('ordenLogico')} type="number" />
                                {errors.ordenLogico && (
                                    <p className="text-xs text-red-500">{errors.ordenLogico.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline"
                                    onClick={() => { setOpen(false); reset() }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* tabla — scroll horizontal en móvil */}
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
                                    <Button variant="destructive" size="sm"
                                        onClick={() => handleDelete(e.id, e.nombre)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {estantes?.length === 0 && (
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