'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
    nombre: z.string()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'Máximo 100 caracteres'),
    descripcion: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Props = {
    defaultValues?: Partial<FormData>
    onSubmit: (data: FormData) => Promise<boolean>
    onCancel: () => void
}

export default function CategoriaForm({ defaultValues, onSubmit, onCancel }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ?? {},
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues])

    const handleFormSubmit = async (data: FormData) => {
        const ok = await onSubmit(data)
        if (ok) reset()
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1">
                <Label>Nombre *</Label>
                <Input {...register('nombre')} placeholder="Lácteos" />
                {errors.nombre && (
                    <p className="text-xs text-red-500">{errors.nombre.message}</p>
                )}
            </div>
            <div className="space-y-1">
                <Label>Descripción</Label>
                <Input {...register('descripcion')} placeholder="Descripción opcional" />
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