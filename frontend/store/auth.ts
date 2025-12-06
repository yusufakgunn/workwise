import { create } from 'zustand'

type AuthUser = {
    id: number
    fullName: string | null
    email: string
}

type AuthState = {
    user: AuthUser | null
    token: string | null
    isHydrated: boolean
    setAuth: (payload: { user: AuthUser; token: string }) => void
    clearAuth: () => void
    hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isHydrated: false,

    setAuth: ({ user, token }) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        }

        set({ user, token })
    },

    clearAuth: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }

        set({ user: null, token: null })
    },

    hydrate: () => {
        if (typeof window === 'undefined') return

        const token = localStorage.getItem('token')
        const userRaw = localStorage.getItem('user')

        if (token && userRaw) {
            try {
                const user = JSON.parse(userRaw) as AuthUser
                set({ user, token, isHydrated: true })
            } catch {
                set({ user: null, token: null, isHydrated: true })
            }
        } else {
            set({ user: null, token: null, isHydrated: true })
        }
    },
}))
