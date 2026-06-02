'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    coordX: z.coerce.number({ invalid_type_error: 'Debe ser un número' }),
    coordY: z.coerce.number({ invalid_type_error: 'Debe ser un número' }),
    ordenLogico: z.coerce.number()
        .int('Debe ser número entero')
        .positive('Debe ser mayor a 0'),
})

type FormData = z.infer<typeof schema>

type Props = {
    siguienteOrden: number
    onSubmit: (data: FormData) => Promise<boolean>
    onCancel: () => void
}

export default function EstanteForm({ siguienteOrden, onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { ordenLogico: siguienteOrden },
    })

    useEffect(() => {
        reset({ nombre: '', coordX: 0, coordY: 0, ordenLogico: siguienteOrden })
    }, [siguienteOrden])

    const handleFormSubmit = async (data: FormData) => {
        const ok = await onSubmit(data)
        if (ok) reset()
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1">
                <Label>Nombre *</Label>
                <Input {...register('nombre')} placeholder="Estante A" />
                {errors.nombre && (
                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Coord X</Label>
                    <Input {...register('coordX')} type="number" placeholder="1" />
                    {errors.coordX && (
                        <p className="text-xs text-red-500">{errors.coordX.message}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label>Coord Y</Label>
                    <Input {...register('coordY')} type="number" placeholder="1" />
                    {errors.coordY && (
                        <p className="text-xs text-red-500">{errors.coordY.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <Label>
                    Orden lógico *
                    <span className="ml-2 text-xs text-slate-400 font-normal">
                        (sugerido: #{siguienteOrden})
                    </span>
                </Label>
                <Input {...register('ordenLogico')} type="number" />
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