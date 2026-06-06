'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Estante } from '@/types/estante'
import { Categoria } from '@/types/categoria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProductoFormData } from '@/types/producto'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(150, 'Máximo 150 caracteres'),
  precio: z.number({ message: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0'),
  stock: z.number({ message: 'El stock debe ser un número' }).int('Debe ser número entero').min(0, 'No puede ser negativo'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  estanteId: z.number({ message: 'Debes seleccionar un estante' }).positive('Debes seleccionar un estante'),
  categoriaId: z.number({ message: 'Debes seleccionar una categoría' }).positive('Debes seleccionar una categoría'),
})

type FormValues = z.infer<typeof schema>
type OutputValues = z.output<typeof schema>

type Props = {
  estantes: Estante[]
  categorias: Categoria[]
  defaultValues?: Partial<ProductoFormData>
  onSubmit: (data: OutputValues) => Promise<boolean>
  onCancel: () => void
}

export default function ProductoForm({
  estantes,
  categorias,
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, OutputValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      nombre: '',
      precio: 0,
      stock: 0,
      descripcion: '',
      estanteId: undefined as unknown as number,
      categoriaId: undefined as unknown as number,
    },
  })

  const handleFormSubmit = async (data: OutputValues) => {
    const ok = await onSubmit(data)
    if (ok) reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
      <div className="space-y-1">
        <Label>Nombre *</Label>
        <Input {...register('nombre')} placeholder="Leche entera 1L" />
        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Precio *</Label>
          <Input {...register('precio', { valueAsNumber: true })} type="number" placeholder="3500" />
          {errors.precio && <p className="text-xs text-red-500">{errors.precio.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Stock *</Label>
          <Input {...register('stock', { valueAsNumber: true })} type="number" placeholder="50" />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>Descripción</Label>
        <Input {...register('descripcion')} placeholder="Descripción opcional" />
      </div>

      <div className="space-y-1">
        <Label>Estante *</Label>
        <select
          {...register('estanteId', {
            setValueAs: v => (v === '' ? undefined : Number(v)),
          })}
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">Seleccionar estante</option>
          {estantes.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre} (orden: {e.ordenLogico})
            </option>
          ))}
        </select>
        {errors.estanteId && <p className="text-xs text-red-500">{errors.estanteId.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>Categoría *</Label>
        <select
          {...register('categoriaId', {
            setValueAs: v => (v === '' ? undefined : Number(v)),
          })}
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        {errors.categoriaId && <p className="text-xs text-red-500">{errors.categoriaId.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}