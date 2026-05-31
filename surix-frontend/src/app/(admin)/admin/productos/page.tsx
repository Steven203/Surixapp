'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { productosApi } from '@/api/productos'
import { estantesApi } from '@/api/estantes'
import { categoriasApi } from '@/api/categorias'
import { Producto } from '@/types/producto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
    nombre: z.string()
        .min(1, 'El nombre es obligatorio')
        .max(150, 'El nombre no puede superar 150 caracteres'),
    precio: z.coerce.number()
        .positive('El precio debe ser mayor a 0'),
    stock: z.coerce.number()
        .positive('El stock debe ser mayor a 0')
        .int('El stock debe ser un número entero')
        .nonnegative('El stock no puede ser negativo').max(10000, 'El stock no puede superar 10,000 unidades'),
    descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
    estanteId: z.coerce.number({
        invalid_type_error: 'Debes seleccionar un estante',
    }).positive('Debes seleccionar un estante'),
    categoriaId: z.coerce.number({
        invalid_type_error: 'Debes seleccionar una categoría',
    }).positive('Debes seleccionar una categoría').optional(),
})

type FormData = z.infer<typeof schema>

export default function ProductosPage() {
    const { data: productos, mutate } = useSWR('/api/productos', productosApi.list)
    const { data: estantes } = useSWR('/api/estantes', estantesApi.list)
    const { data: categorias } = useSWR('/api/categorias', categoriasApi.list)

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
            await productosApi.create(data)
            mutate()
            setOpen(false)
            reset()
            toast.success('Producto creado exitosamente')
        } catch (err: any) {
            toast.error(err.message ?? 'Error al crear el producto')
        }
    }

    const handleDelete = async (id: number, nombre: string) => {
        toast('¿Eliminar este producto?', {
            description: nombre,
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await productosApi.delete(id)
                        mutate()
                        toast.success('Producto eliminado')
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
                    <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {productos?.length ?? 0} productos registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
                    <DialogTrigger asChild>
                        <Button>+ Nuevo producto</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear producto</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">

                            <div className="space-y-1">
                                <Label>Nombre *</Label>
                                <Input {...register('nombre')} placeholder="Leche entera 1L" />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Precio *</Label>
                                    <Input {...register('precio')} type="number" placeholder="3500" />
                                    {errors.precio && (
                                        <p className="text-xs text-red-500">{errors.precio.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label>Stock *</Label>
                                    <Input {...register('stock')} type="number" placeholder="50" />
                                    {errors.stock && (
                                        <p className="text-xs text-red-500">{errors.stock.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Descripción</Label>
                                <Input {...register('descripcion')} placeholder="Descripción opcional" />
                            </div>

                            <div className="space-y-1">
                                <Label>Estante *</Label>
                                <select
                                    {...register('estanteId')}
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <option value="">Seleccionar estante</option>
                                    {estantes?.map(e => (
                                        <option key={e.id} value={e.id}>
                                            {e.nombre} (orden: {e.ordenLogico})
                                        </option>
                                    ))}
                                </select>
                                {errors.estanteId && (
                                    <p className="text-xs text-red-500">{errors.estanteId.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label>Categoría</Label>
                                <select
                                    {...register('categoriaId')}
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categorias?.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                {errors.categoriaId && (
                                    <p className="text-xs text-red-500">{errors.categoriaId.message}</p>
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="hidden md:table-cell">Estante</TableHead>
                            <TableHead className="hidden md:table-cell">Categoría</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productos?.map((p: Producto) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.nombre}</TableCell>
                                <TableCell>${p.precio.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={p.stock > 10 ? 'default' : 'destructive'}>
                                        {p.stock} und
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{p.estanteNombre ?? '—'}</TableCell>
                                <TableCell className="hidden lg:table-cell">{p.categoriaNombre ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm"
                                        onClick={() => handleDelete(p.id, p.nombre)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {productos?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                                    No hay productos registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}