'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const createSchema = z.object({
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  password: z.string()
    .min(4, 'Mínimo 4 caracteres')
    .max(50, 'Máximo 50 caracteres'),
})

const editSchema = z.object({
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  password: z.string()
    .max(50, 'Máximo 50 caracteres')
    .optional()
    .transform(v => (v === '' ? undefined : v)),
})

type UsuarioCreateFormData = z.infer<typeof createSchema>
type UsuarioEditFormData = z.infer<typeof editSchema>

type Props =
  | {
      modo: 'crear'
      defaultValues?: Partial<UsuarioCreateFormData>
      onSubmit: (data: UsuarioCreateFormData) => Promise<boolean>
      onCancel: () => void
    }
  | {
      modo: 'editar'
      defaultValues?: Partial<UsuarioEditFormData>
      onSubmit: (data: UsuarioEditFormData) => Promise<boolean>
      onCancel: () => void
    }

export default function UsuarioForm({ modo, defaultValues, onSubmit, onCancel }: Props) {
  const schema = modo === 'crear' ? createSchema : editSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioCreateFormData | UsuarioEditFormData>({
    resolver: zodResolver(schema),
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

  const handleFormSubmit = async (data: UsuarioCreateFormData | UsuarioEditFormData) => {
    const ok = await onSubmit(data as any)
    if (ok) reset({ username: '', password: '' } as any)
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