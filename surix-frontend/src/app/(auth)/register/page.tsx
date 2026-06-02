'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
    username: z.string()
        .min(3, 'Mínimo 3 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
    password: z.string()
        .min(4, 'Mínimo 4 caracteres')
        .max(50, 'Máximo 50 caracteres'),
    confirmar: z.string(),
}).refine(d => d.password === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
    const router = useRouter()
    const { register: registerUser, loading, error } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) })

    const onSubmit = async (data: FormData) => {
        await registerUser(data.username, data.password)
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        🛒 Crear cuenta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Usuario</Label>
                            <Input
                                {...register('username')}
                                placeholder="juan123"
                            />
                            {errors.username && (
                                <p className="text-xs text-red-500">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Contraseña</Label>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Confirmar contraseña</Label>
                            <Input
                                {...register('confirmar')}
                                type="password"
                                placeholder="••••••••"
                            />
                            {errors.confirmar && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmar.message}
                                </p>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </Button>

                        <p className="text-center text-sm text-slate-500">
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Inicia sesión
                            </button>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}