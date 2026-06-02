'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUsuarios } from '@/hooks/useUsuarios'
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

const schema = z.object({
    username: z.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
    password: z.string()
        .min(4, 'Mínimo 4 caracteres')
        .max(50, 'Máximo 50 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function UsuariosPage() {
    const { usuarios, isLoading, crear, asignarRol } = useUsuarios()
    const [open, setOpen] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const onSubmit = async (data: FormData) => {
        const ok = await crear(data)
        if (ok) { setOpen(false); reset() }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {usuarios?.length ?? 0} usuarios registrados
                    </p>
                </div>

                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Nuevo usuario</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear usuario</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <div className="space-y-1">
                                <Label>Username *</Label>
                                <Input {...register('username')} placeholder="juan123" />
                                {errors.username && (
                                    <p className="text-xs text-red-500">{errors.username.message}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label>Contraseña *</Label>
                                <Input {...register('password')} type="password" placeholder="••••••••" />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead>Username</TableHead>
                            <TableHead className="hidden sm:table-cell">Roles</TableHead>
                            <TableHead className="text-right">Asignar rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios?.map((u: Usuario) => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.username}</TableCell>
                                <TableCell className="hidden sm:table-cell">
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
                                            <Button size="sm" variant="outline"
                                                onClick={() => asignarRol(u.id, 1, 'ADMIN')}>
                                                + ADMIN
                                            </Button>
                                        )}
                                        {!u.roles.includes('CLIENTE') && (
                                            <Button size="sm" variant="outline"
                                                onClick={() => asignarRol(u.id, 2, 'CLIENTE')}>
                                                + CLIENTE
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && usuarios?.length === 0 && (
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