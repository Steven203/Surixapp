'use client'

import { useState } from 'react'
import { useProductosAdmin } from '@/hooks/useProductosAdmin'
import { usePagination } from '@/hooks/usePagination'
import { Producto, ProductoFormData, ProductoUpdateData } from '@/types/producto'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SearchBar from '@/components/ui/searchbar'
import Pagination from '@/components/ui/pagination'
import EmptyState from '@/components/ui/emptystate'
import ProductoForm from '@/components/productos/ProductoForm'
import EditModal from '@/components/admin/EditModal'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

const PER_PAGE = 10

export default function ProductosPage() {
  const { productos, estantes, categorias, isLoading, crear, actualizar, eliminar } =
    useProductosAdmin()

  const [busqueda, setBusqueda] = useState('')
  const [openCrear, setOpenCrear] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)

  const productosFiltrados = productos?.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const { page, setPage, totalPages, itemsPagina } = usePagination(
    productosFiltrados, PER_PAGE
  )

  const handleCrear = async (data: ProductoFormData) => {
    const ok = await crear(data)
    if (ok) setOpenCrear(false)
    return ok
  }

  const handleActualizar = async (data: ProductoUpdateData) => {
    if (!editando) return false
    const ok = await actualizar(editando.id, data)
    if (ok) setEditando(null)
    return ok
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500 text-sm mt-1">
            {productosFiltrados?.length ?? 0} productos
            {busqueda && ` · filtrado de ${productos?.length ?? 0}`}
          </p>
        </div>

        <Dialog open={openCrear} onOpenChange={setOpenCrear}>
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
              onSubmit={handleCrear}
              onCancel={() => setOpenCrear(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SearchBar
        value={busqueda}
        onChange={v => { setBusqueda(v); setPage(1) }}
        placeholder="Buscar producto..."
      />

      <EditModal open={!!editando} onClose={() => setEditando(null)} titulo="Editar producto">
        {editando && (
          <ProductoForm
            estantes={estantes ?? []}
            categorias={categorias ?? []}
            defaultValues={{
              nombre: editando.nombre,
              precio: editando.precio,
              stock: editando.stock,
              descripcion: editando.descripcion ?? '',
              estanteId: editando.estanteId ?? undefined,
              categoriaId: editando.categoriaId ?? undefined,
            }}
            onSubmit={handleActualizar}
            onCancel={() => setEditando(null)}
          />
        )}
      </EditModal>

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
            {itemsPagina.map((p: Producto) => (
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
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm"
                      onClick={() => setEditando(p)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm"
                      onClick={() => eliminar(p.id, p.nombre)}>
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!isLoading && itemsPagina.length === 0 && (
          <EmptyState
            icono="📦"
            titulo={busqueda ? 'Sin resultados' : 'No hay productos registrados'}
            descripcion={busqueda ? `No encontramos "${busqueda}"` : undefined}
          />
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}