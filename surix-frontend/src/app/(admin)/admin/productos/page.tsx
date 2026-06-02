'use client'

import { useState } from 'react'
import { useProductosAdmin } from '@/hooks/useProductosAdmin'
import { Producto } from '@/types/producto'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProductoForm from '@/components/productos/ProductoForm'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export default function ProductosPage() {
    const {
        productos, estantes, categorias,
        isLoading, crear, eliminar,
    } = useProductosAdmin()

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
                    <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {productos?.length ?? 0} productos registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nuevo producto</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear producto</DialogTitle>
                        </DialogHeader>
                        <ProductoForm
                            estantes={estantes ?? []}
                            categorias={categorias ?? []}
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
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="hidden md:table-cell">Estante</TableHead>
                            <TableHead className="hidden lg:table-cell">Categoría</TableHead>
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
                                <TableCell className="hidden md:table-cell">
                                    {p.estanteNombre ?? '—'}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {p.categoriaNombre ?? '—'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm"
                                        onClick={() => eliminar(p.id, p.nombre)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && productos?.length === 0 && (
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