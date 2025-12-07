'use client'

import { create } from 'zustand'
import type { AuthUser } from '@/types/auth'
import { apiClient } from '@/lib/api-client'

type AuthState = {
    user: AuthUser | null
    token: string | null
    isHydrated: boolean
    hydrate: () => void
    setAuth: (data: { user: AuthUser; token: string }) => void
    clearAuth: () => void
    fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isHydrated: false,

    hydrate: () => {
        if (typeof window === 'undefined') return

        const token = localStorage.getItem('token')
        const userJson = localStorage.getItem('user')

        set({
            token: token ?? null,
            user: userJson ? JSON.parse(userJson) : null,
            isHydrated: true,
        })
    },

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

    fetchMe: async () => {
        const token = get().token
        if (!token) return // login değil

        try {
            const me = await apiClient.get<AuthUser>('/auth/me', { auth: true })

            // güncel user bilgisini store'a yaz
            set({ user: me })

            // localstorage da güncel kalsın
            localStorage.setItem('user', JSON.stringify(me))
        } catch (err) {
            // Token bozuk / süresi dolmuş olabilir → auth resetle
            set({ user: null, token: null })
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    },
}))
