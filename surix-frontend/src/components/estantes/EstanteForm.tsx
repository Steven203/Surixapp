'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EstanteFormData } from '@/types/estante'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  coordX: z.number({ message: 'Debe ser un número' }),
  coordY: z.number({ message: 'Debe ser un número' }),
  ordenLogico: z.number({ message: 'Debe ser un número' }).int('Debe ser número entero').positive('Debe ser mayor a 0'),
})

type FormValues = z.infer<typeof schema>
type OutputValues = z.output<typeof schema>

type Props = {
  siguienteOrden: number
  defaultValues?: Partial<EstanteFormData>
  onSubmit: (data: OutputValues) => Promise<boolean>
  onCancel: () => void
}

export default function EstanteForm({
  siguienteOrden,
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
      
      ordenLogico: siguienteOrden,
    },
  })

  useEffect(() => {
    if (defaultValues) reset (defaultValues)
  }, [defaultValues])

  const handleFormSubmit = async (data: OutputValues) => {
    const ok = await onSubmit(data)
    if (ok) reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
      <div className="space-y-1">
        <Label>Nombre *</Label>
        <Input {...register('nombre')} placeholder="Estante A" />
        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Coord X</Label>
          <Input
            {...register('coordX', {
              valueAsNumber: true,
              setValueAs: v => (v === '' ? 0 : Number(v)),
            })}
            type="number"
            placeholder="1"
          />
          {errors.coordX && <p className="text-xs text-red-500">{errors.coordX.message}</p>}
        </div>

        <div className="space-y-1">
          <Label>Coord Y</Label>
          <Input
            {...register('coordY', {
              valueAsNumber: true,
              setValueAs: v => (v === '' ? 0 : Number(v)),
            })}
            type="number"
            placeholder="1"
          />
          {errors.coordY && <p className="text-xs text-red-500">{errors.coordY.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label>
          Orden lógico *
          <span className="ml-2 text-xs text-slate-400 font-normal">
            (sugerido: #{siguienteOrden})
          </span>
        </Label>
        <Input
          {...register('ordenLogico', {
            valueAsNumber: true,
            setValueAs: v => (v === '' ? siguienteOrden : Number(v)),
          })}
          type="number"
        />
        {errors.ordenLogico && (
          <p className="text-xs text-red-500">{errors.ordenLogico.message}</p>
        )}
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