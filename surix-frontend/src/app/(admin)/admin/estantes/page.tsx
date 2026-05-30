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

// esquema de validación — mensajes en español claros
const schema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    coordX: z.coerce.number().positive('La coordenada X debe ser mayor a 0').int('La coordenada X debe ser un número entero'),
    coordY: z.coerce.number().positive('La coordenada Y debe ser mayor a 0').int('La coordenada Y debe ser un número entero'),
    ordenLogico: z.coerce.number({
        invalid_type_error: 'El orden lógico es obligatorio',
    }).positive('El orden lógico debe ser mayor a 0').int('El orden lógico debe ser un número entero'),
})

type FormData = z.infer<typeof schema>

export default function EstantesPage() {
    const { data: estantes, mutate } = useSWR('/api/estantes', estantesApi.list)

    const [open, setOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            await estantesApi.create({
                nombre: data.nombre,
                coordX: data.coordX,
                coordY: data.coordY,
                ordenLogico: data.ordenLogico,
            })
            mutate()
            setOpen(false)
            reset()
            toast.success('Estante creado')
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
            cancel: { label: 'Cancelar', onClick: () => { } },
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Estantes</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {estantes?.length ?? 0} estantes registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
                    <DialogTrigger asChild>
                        <Button>+ Nuevo estante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear estante</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Nombre *</Label>
                                <Input {...register('nombre')} placeholder="Estante A" />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Coord X</Label>
                                    <Input {...register('coordX')} type="number" placeholder="1" />
                                    {errors.coordX && (
                                        <p className="text-xs text-red-500">{errors.coordX.message}</p>
                                    )}

                                </div>
                                <div className="space-y-2">
                                    <Label>Coord Y</Label>
                                    <Input {...register('coordY')} type="number" placeholder="1" />
                                    {errors.coordY && (
                                        <p className="text-xs text-red-500">{errors.coordY.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Orden lógico *</Label>
                                <Input {...register('ordenLogico')} type="number" placeholder="1" />
                                {errors.ordenLogico && (
                                    <p className="text-xs text-red-500">{errors.ordenLogico.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Coord X</TableHead>
                            <TableHead>Coord Y</TableHead>
                            <TableHead>Orden lógico</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {estantes?.map((e: Estante) => (
                            <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.nombre}</TableCell>
                                <TableCell>{e.coordX}</TableCell>
                                <TableCell>{e.coordY}</TableCell>
                                <TableCell>{e.ordenLogico}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(e.id, e.nombre)}
                                    >
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