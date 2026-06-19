'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { usuariosApi } from '@/api/usuarios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
    username: z.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
    password: z.string()
        .min(4, 'Mínimo 4 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function PerfilPage() {
    const { usuario, setUsuario, token } = useAuthStore()
    const { handleLogout } = useAuth()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    useEffect(() => {
        if (usuario) {
            reset({
                username: usuario.username ?? '',
                password: '',
            })
        }
    }, [usuario, reset])

    const onSubmit = async (data: FormData) => {
        if (!usuario) return
        try {
            const actualizado = await usuariosApi.update(usuario.id, {
                username: data.username,
                password: data.password || undefined,
            })
            setUsuario(actualizado, token ?? '')
            toast.success('Perfil actualizado')
        } catch (err: any) {
            toast.error(err.message ?? 'Error al actualizar')
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mi perfil</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Gestiona tu información personal
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Username</Label>
                        <Input {...register('username')} />
                        {errors.username && (
                            <p className="text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>
                            Nueva contraseña
                            <span className="ml-1 text-xs text-slate-400 font-normal">
                                (dejar vacío para no cambiar)
                            </span>
                        </Label>
                        <Input {...register('password')} type="password" placeholder="••••••••" />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting || !usuario} className="w-full">
                        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
                <h2 className="font-semibold text-slate-700">Sesión</h2>
                <p className="text-sm text-slate-500">
                    Logueado como <span className="font-medium">{usuario?.username}</span>
                </p>
                <Button variant="destructive" onClick={handleLogout} className="w-full">
                    Cerrar sesión
                </Button>
            </div>
        </div>
    )
}
