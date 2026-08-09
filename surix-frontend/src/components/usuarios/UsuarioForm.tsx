'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type UsuarioFormData = {
  username: string
  password?: string
}

const baseSchema = z.object({
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  password: z.string()
    .max(50, 'Máximo 50 caracteres')
    .optional(),
})

type Props =
  | {
    modo: 'crear'
    defaultValues?: Partial<UsuarioFormData>
    onSubmit: (data: UsuarioCreateSubmit) => Promise<boolean>
    onCancel: () => void
  }
  | {
    modo: 'editar'
    defaultValues?: Partial<UsuarioFormData>
    onSubmit: (data: UsuarioFormData) => Promise<boolean>
    onCancel: () => void
  }

type UsuarioCreateSubmit = {
  username: string
  password: string
}

export default function UsuarioForm({ modo, defaultValues, onSubmit, onCancel }: Props) {
  const schema = baseSchema.superRefine((data, ctx) => {
    // En modo crear la contraseña es obligatoria
    if (modo === 'crear' && (!data.password || data.password.length < 4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Mínimo 4 caracteres',
      })
    }
  })

  const resolver = zodResolver(schema) as never

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioFormData>({
    resolver,
    defaultValues: {
      username: '',
      password: '',
      ...defaultValues,
    } as any,
  })

  useEffect(() => {
    reset({
      username: defaultValues?.username ?? '',
      password: '',
      ...(defaultValues ?? {}),
    } as any)
  }, [defaultValues, reset])

  const handleFormSubmit = async (data: UsuarioFormData) => {
    if (modo === 'crear') {
      const ok = await onSubmit(data as UsuarioCreateSubmit)
      if (ok) reset({ username: '', password: '' } as any)
    } else {
      const ok = await onSubmit(data)
      if (ok) reset({ username: '', password: '' } as any)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-2">
      <div className="space-y-1">
        <Label>Username *</Label>
        <Input {...register('username')} placeholder="juan123" />
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>
          Contraseña {modo === 'crear' ? '*' : ''}
          {modo === 'editar' && (
            <span className="ml-1 text-xs text-slate-400 font-normal">
              (dejar vacío para no cambiar)
            </span>
          )}
        </Label>
        <Input {...register('password')} type="password" placeholder="••••••••" />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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
