'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { usuariosApi } from '@/api/usuarios'
import { Usuario } from '@/types/usuario'
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

export default function UsuariosPage() {
    const { data: usuarios, mutate } = useSWR('/api/usuarios', usuariosApi.list)

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ username: '', password: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await usuariosApi.create(form)
            mutate()
            setOpen(false)
            setForm({ username: '', password: '' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAssignRole = async (usuarioId: number, roleId: number) => {
        try {
            await usuariosApi.assignRole(usuarioId, roleId)
            mutate()
        } catch (err: any) {
            alert(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {usuarios?.length ?? 0} usuarios registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Nuevo usuario</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear usuario</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Username *</Label>
                                <Input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="juan123"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contraseña *</Label>
                                <Input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
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
                            <TableHead>Username</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="text-right">Asignar rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios?.map((u: Usuario) => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.username}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1 flex-wrap">
                                        {u.roles.length > 0
                                            ? u.roles.map(r => (
                                                <Badge key={r} variant="secondary">{r}</Badge>
                                            ))
                                            : <span className="text-slate-400 text-sm">Sin rol</span>
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {!u.roles.includes('ADMIN') && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAssignRole(u.id, 1)}
                                            >
                                                + ADMIN
                                            </Button>
                                        )}
                                        {!u.roles.includes('CLIENTE') && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAssignRole(u.id, 2)}
                                            >
                                                + CLIENTE
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {usuarios?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-slate-400 py-8">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}