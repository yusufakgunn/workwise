const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333/api/v1'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiRequestOptions extends RequestInit {
    auth?: boolean
}

interface ApiError extends Error {
    status?: number
    payload?: any
}

function buildHeaders(options: ApiRequestOptions): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> ?? {}),
    }

    if (options.auth && typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
    }

    return headers
}

export async function apiRequest<TResponse = any>(
    method: HttpMethod,
    path: string,
    options: ApiRequestOptions = {}
): Promise<TResponse> {
    const url = `${API_BASE_URL}${path}`

    const headers = buildHeaders(options)

    const res = await fetch(url, {
        ...options,
        method,
        headers,
    })

    const isJson =
        res.headers.get('content-type')?.includes('application/json') ?? false

    const body = isJson ? await res.json().catch(() => null) : null

    if (!res.ok) {
        const error: ApiError = new Error(
            (body && (body.message || body.error)) || 'API isteği başarısız oldu'
        )
        error.status = res.status
        error.payload = body
        throw error
    }

    return body as TResponse
}

export const apiClient = {
    get: <T = any>(path: string, options?: ApiRequestOptions) =>
        apiRequest<T>('GET', path, options),
    post: <T = any>(path: string, body?: any, options?: ApiRequestOptions) =>
        apiRequest<T>('POST', path, {
            ...options,
            body: body ? JSON.stringify(body) : undefined,
        }),
    put: <T = any>(path: string, body?: any, options?: ApiRequestOptions) =>
        apiRequest<T>('PUT', path, {
            ...options,
            body: body ? JSON.stringify(body) : undefined,
        }),
    patch: <T = any>(path: string, body?: any, options?: ApiRequestOptions) =>
        apiRequest<T>('PATCH', path, {
            ...options,
            body: body ? JSON.stringify(body) : undefined,
        }),
    delete: <T = any>(path: string, options?: ApiRequestOptions) =>
        apiRequest<T>('DELETE', path, options),
}
