'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users2,
    Settings,
    LogOut,
} from 'lucide-react'

import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Projects', href: '/app/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/app/tasks', icon: CheckSquare },
    { name: 'Team', href: '/app/team', icon: Users2 },
    { name: 'Settings', href: '/app/settings', icon: Settings },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { token, hydrate, isHydrated, clearAuth } = useAuthStore()

    useEffect(() => {
        if (!isHydrated) {
            hydrate()
            return
        }

        if (!token) {
            router.replace('/login')
        }
    }, [hydrate, isHydrated, token, router])

    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
                <p className="text-sm text-slate-400">WorkWise yükleniyor...</p>
            </div>
        )
    }

    if (!token) return null

    const handleLogout = () => {
        clearAuth()
        router.replace('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-50 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-80px] right-[-40px] h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="relative z-10 flex min-h-screen flex-col">
                {/* TOPBAR */}
                <header className="border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
                    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/40">
                                <span className="text-xs font-semibold tracking-tight">WW</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-tight">WorkWise</p>
                                <p className="text-[10px] text-slate-400">
                                    Modern iş yönetim platformu
                                </p>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-1 py-0.5 text-xs">
                            {navItems.map((item) => {
                                const active = pathname === item.href
                                const Icon = item.icon

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors',
                                            active
                                                ? 'bg-slate-800 text-sky-300'
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                                        )}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Sağ taraf (logout vs) */}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-400 hover:text-red-300 hover:border-red-500/60 hover:bg-red-950/40 transition-colors"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Çıkış</span>
                        </button>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
