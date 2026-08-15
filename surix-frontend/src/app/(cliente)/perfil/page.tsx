'use client'

import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
    passwordActual: z.string()
        .min(1, 'Ingresa tu contraseña actual'),
    nuevaContraseña: z.string()
        .min(4, 'Mínimo 4 caracteres')
        .max(50, 'Máximo 50 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function PerfilPage() {
    const { usuario } = useAuthStore()
    const { handleLogout } = useAuth()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            passwordActual: '',
            nuevaContraseña: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            await authApi.cambiarContraseña(data.passwordActual, data.nuevaContraseña)
            toast.success('Contraseña actualizada correctamente')
            reset({ passwordActual: '', nuevaContraseña: '' })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al actualizar'
            toast.error(message)
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
                        <Label>Contraseña actual</Label>
                        <Input {...register('passwordActual')} type="password" placeholder="••••••••" />
                        {errors.passwordActual && (
                            <p className="text-xs text-red-500">{errors.passwordActual.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Nueva contraseña</Label>
                        <Input {...register('nuevaContraseña')} type="password" placeholder="••••••••" />
                        {errors.nuevaContraseña && (
                            <p className="text-xs text-red-500">{errors.nuevaContraseña.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting || !usuario} className="w-full">
                        {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
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
