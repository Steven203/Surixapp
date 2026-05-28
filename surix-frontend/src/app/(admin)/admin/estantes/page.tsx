'use client'

import { useState } from 'react'
import useSWR from 'swr'
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

export default function EstantesPage() {
    const { data: estantes, mutate } = useSWR('/api/estantes', estantesApi.list)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        nombre: '', coordX: '', coordY: '', ordenLogico: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await estantesApi.create({
                nombre: form.nombre,
                coordX: parseFloat(form.coordX),
                coordY: parseFloat(form.coordY),
                ordenLogico: parseInt(form.ordenLogico),
            })
            mutate()
            setOpen(false)
            setForm({ nombre: '', coordX: '', coordY: '', ordenLogico: '' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este estante?')) return
        try {
            await estantesApi.delete(id)
            mutate()
        } catch (err: any) {
            alert(err.message)
        }
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

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Nuevo estante</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear estante</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Nombre *</Label>
                                <Input
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    placeholder="Estante A"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Coord X</Label>
                                    <Input
                                        name="coordX"
                                        type="number"
                                        value={form.coordX}
                                        onChange={handleChange}
                                        placeholder="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Coord Y</Label>
                                    <Input
                                        name="coordY"
                                        type="number"
                                        value={form.coordY}
                                        onChange={handleChange}
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Orden lógico *</Label>
                                <Input
                                    name="ordenLogico"
                                    type="number"
                                    value={form.ordenLogico}
                                    onChange={handleChange}
                                    placeholder="1"
                                    required
                                />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
                                        onClick={() => handleDelete(e.id)}
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