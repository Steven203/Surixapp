import { useAuthStore } from '@/store/authStore'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
    let data: any = null

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
        const message =
            typeof data === 'object' && data?.message
                ? data.message
                : typeof data === 'string' && data.trim()
                    ? data
                    : `Error ${res.status}: ${res.statusText}`

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