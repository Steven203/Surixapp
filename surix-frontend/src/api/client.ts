import { useAuthStore } from '@/store/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiError = {
    code: string
    message: string
    path?: string
    timestamp?: string
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const token = useAuthStore.getState().token

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> || {}),
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    })

    const contentType = res.headers.get('content-type') || ''
    let data: unknown = null  // ← unknown en lugar de any

    if (contentType.includes('application/json')) {
        try {
            data = await res.json()
        } catch {
            data = null
        }
    } else {
        try {
            data = await res.text()
        } catch {
            data = null
        }
    }

    if (!res.ok) {
        // extraer mensaje según el tipo de data
        let message = `Error ${res.status}: ${res.statusText}`

        if (isApiError(data)) {
            message = data.message
        } else if (typeof data === 'string' && data.trim()) {
            message = data
        }

        if (res.status === 401) {
            useAuthStore.getState().logout()
            setTimeout(() => {
                window.location.href = '/login'
            }, 1200)
            throw new Error(message)
        }

        throw new Error(message)
    }

    if (res.status === 204) return null as T
    return data as T
}

// type guard — verifica en tiempo de ejecución que data es ApiError
function isApiError(data: unknown): data is ApiError {
    return (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as ApiError).message === 'string'
    )
}