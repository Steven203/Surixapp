'use client'

import { useState } from 'react'
import { useUsuarios } from '@/hooks/useUsuarios'
import { Usuario, UsuarioCreateData, UsuarioUpdateData } from '@/types/usuario'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import UsuarioForm from '@/components/usuarios/UsuarioForm'
import EditModal from '@/components/admin/EditModal'
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

export default function UsuariosPage() {
  const { usuarios, isLoading, crear, actualizar, asignarRol, removerRol, eliminar } = useUsuarios()
  const [openCrear, setOpenCrear] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)

  const handleCrear = async (data: UsuarioCreateData) => {
    const ok = await crear(data)
    if (ok) setOpenCrear(false)
    return ok
  }

  const handleActualizar = async (data: UsuarioUpdateData) => {
    if (!editando) return false
    const ok = await actualizar(editando.id, data)
    if (ok) setEditando(null)
    return ok
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

        <Dialog open={openCrear} onOpenChange={setOpenCrear}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">+ Nuevo usuario</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear usuario</DialogTitle>
            </DialogHeader>
            <UsuarioForm
              modo="crear"
              onSubmit={handleCrear}
              onCancel={() => setOpenCrear(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Username</TableHead>
              <TableHead className="hidden sm:table-cell">Roles</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
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
                        <Badge key={r} variant="secondary">
                          {r}
                        </Badge>
                      ))
                      : <span className="text-slate-400 text-sm">Sin rol</span>}
                  </div>
                </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end flex-wrap">
                      {/* asignar roles que no tiene */}
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

                      {/* quitar roles que sí tiene */}
                      {u.roles.includes('ADMIN') && (
                        <Button size="sm" variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => removerRol(u.id, 1, 'ADMIN')}>
                          − ADMIN
                        </Button>
                      )}
                      {u.roles.includes('CLIENTE') && (
                        <Button size="sm" variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => removerRol(u.id, 2, 'CLIENTE')}>
                          − CLIENTE
                        </Button>
                      )}

                      <Button size="sm" variant="destructive"
                        onClick={() => eliminar(u.id, u.username)}>
                        Eliminar
                      </Button>
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