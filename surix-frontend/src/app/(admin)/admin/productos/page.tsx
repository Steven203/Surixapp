'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { productosApi } from '@/api/productos'
import { estantesApi } from '@/api/estantes'
import { categoriasApi } from '@/api/categorias'
import { Producto } from '@/types/producto'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/Input'

export default function ProductosPage() {
    const { data: productos, mutate } = useSWR('/api/productos', productosApi.list)
    const { data: estantes } = useSWR('/api/estantes', estantesApi.list)
    const { data: categorias } = useSWR('/api/categorias', categoriasApi.list)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        nombre: '',
        precio: '',
        stock: '',
        descripcion: '',
        estanteId: '',
        categoriaId: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await productosApi.create({
                nombre: form.nombre,
                precio: parseFloat(form.precio),
                stock: parseInt(form.stock),
                descripcion: form.descripcion || undefined,
                estanteId: parseInt(form.estanteId),
                categoriaId: form.categoriaId ? parseInt(form.categoriaId) : undefined,
            })
            mutate()
            setOpen(false)
            setForm({ nombre: '', precio: '', stock: '', descripcion: '', estanteId: '', categoriaId: '' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este producto?')) return
        try {
            await productosApi.delete(id)
            mutate()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {productos?.length ?? 0} productos registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Nuevo producto</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear producto</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Nombre *</Label>
                                <Input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Leche entera 1L"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Precio *</Label>
                                    <Input
                                        name="precio"
                                        type="number"
                                        value={form.precio}
                                        onChange={handleChange}
                                        placeholder="3500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Stock *</Label>
                                    <Input
                                        name="stock"
                                        type="number"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Input
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción opcional"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Estante *</Label>
                                <select
                                    name="estanteId"
                                    value={form.estanteId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <option value="">Seleccionar estante</option>
                                    {estantes?.map(e => (
                                        <option key={e.id} value={e.id}>
                                            {e.nombre} (orden: {e.ordenLogico})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Categoría</Label>
                                <select
                                    name="categoriaId"
                                    value={form.categoriaId}
                                    onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <option value="">Sin categoría</option>
                                    {categorias?.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar'}
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
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estante</TableHead>
                            <TableHead>Categoría</TableHead>
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
                                <TableCell>{p.estanteNombre ?? '—'}</TableCell>
                                <TableCell>{p.categoriaNombre ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
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