'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { categoriasApi } from '@/api/categorias'
import { Categoria } from '@/types/categoria'
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
    nombre: z.string()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'Máximo 100 caracteres'),
    descripcion: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CategoriasPage() {
    const { data: categorias, mutate } = useSWR('/api/categorias', categoriasApi.list)
    const [open, setOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const onSubmit = async (data: FormData) => {
        try {
            await categoriasApi.create(data)
            mutate()
            setOpen(false)
            reset()
            toast.success('Categoría creada exitosamente')
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear la categoría')
        }
    }

    const handleDelete = async (id: number, nombre: string) => {
        toast('¿Eliminar esta categoría?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await categoriasApi.delete(id)
                        mutate()
                        toast.success('Categoría eliminada')
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
                    <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {categorias?.length ?? 0} categorías registradas
                    </p>
                </div>

                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nueva categoría</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear categoría</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <div className="space-y-1">
                                <Label>Nombre *</Label>
                                <Input {...register('nombre')} placeholder="Lácteos" />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Descripción</Label>
                                <Input {...register('descripcion')} placeholder="Descripción opcional" />
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
                        {categorias?.map((c: Categoria) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{c.nombre}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {c.descripcion ?? '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm"
                                        onClick={() => handleDelete(c.id, c.nombre)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categorias?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-slate-400 py-8">
                                    No hay categorías registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}