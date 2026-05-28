const BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiError = {
    code: string
    message: string
    path: string
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    if (!res.ok) {
        const error: ApiError = await res.json()
        throw new Error(error.message ?? 'Error en el servidor')
    }

    // DELETE devuelve 204 sin body
    if (res.status === 204) return null as T

    return res.json()
}