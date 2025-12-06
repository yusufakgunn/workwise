'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth'

type LoginResponse = {
    user: {
        id: number
        fullName: string | null
        email: string
    }
    token: {
        type: string
        value: string
        expiresAt?: string
    }
}

export default function LoginPage() {
    const router = useRouter()
    const { setAuth, token, hydrate, isHydrated } = useAuthStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // İlk açılışta store'u localStorage'dan hydrate et
    useEffect(() => {
        if (!isHydrated) {
            hydrate()
            return
        }

        // Zaten login ise appe gönder
        if (token) {
            router.replace('/app')
        }
    }, [hydrate, isHydrated, token, router])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await apiClient.post<LoginResponse>('/auth/login', {
                email,
                password,
            })

            setAuth({
                user: res.user,
                token: res.token.value,
            })

            router.push('/app')
        } catch (err: any) {
            const msg =
                err?.payload?.message ||
                err?.payload?.error ||
                'Giriş başarısız oldu. Bilgilerinizi kontrol edin.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const year = new Date().getFullYear()

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-50">
            {/* SOL PANEL – Branding */}
            <div className="hidden lg:flex relative flex-1 flex-col overflow-hidden border-r border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900/60">
                <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-[-120px] h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative z-10 flex h-full flex-col px-12 py-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/40">
                            <span className="text-sm font-semibold tracking-tight">WW</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold tracking-tight">WorkWise</p>
                            <p className="text-xs text-slate-400">
                                Modern iş yönetim platformu
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 max-w-xl">
                        <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-slate-900/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                            <Sparkles className="h-3 w-3" />
                            WorkWise · Task & Project Hub
                        </p>

                        <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-slate-50">
                            Proje ve görevlerinizi{' '}
                            <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
                                daha düzenli
                            </span>{' '}
                            yönetin.
                        </h1>

                        <p className="mt-4 text-sm text-slate-300/90">
                            WorkWise, ekiplerin projelerini ve görevlerini tek merkezden
                            yönetmesine yardımcı olan, ölçeklenebilir bir iş yönetim platformudur.
                        </p>
                    </div>

                    <div className="mt-auto grid gap-4 pt-10 text-xs text-slate-200 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                            <p className="text-[10px] text-slate-400">Planlama</p>
                            <p className="mt-1 text-sm font-semibold">Proje & sprint takibi</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                            <p className="text-[10px] text-slate-400">Görev yönetimi</p>
                            <p className="mt-1 text-sm font-semibold">Rol bazlı atamalar</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                            <p className="text-[10px] text-slate-400">SaaS mimarisi</p>
                            <p className="mt-1 text-sm font-semibold">Çoklu ekip / şirket desteği</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ PANEL – Login formu */}
            <div className="flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/40">
                            <span className="text-xs font-semibold tracking-tight">WW</span>
                        </div>
                        <div>
                            <p className="text-base font-semibold tracking-tight">WorkWise</p>
                            <p className="text-[11px] text-slate-400">
                                Proje & görev yönetim platformu
                            </p>
                        </div>
                    </div>

                    <Card className="border-slate-800 bg-slate-900/90 shadow-xl shadow-slate-950/70">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl font-semibold text-slate-50">
                                Giriş yap
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">
                                WorkWise hesabınızla giriş yaparak iş süreçlerinizi yönetmeye devam edin.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs text-slate-200">
                                        E-posta
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            className="h-10 bg-slate-950/80 pl-9 text-sm text-slate-50 placeholder:text-slate-500 border-slate-700 focus-visible:ring-sky-500"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs text-slate-200">
                                        Şifre
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="h-10 bg-slate-950/80 pl-9 text-sm text-slate-50 placeholder:text-slate-500 border-slate-700 focus-visible:ring-sky-500"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Lock className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 px-3 py-2 rounded-md">
                                        {error}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 inline-flex w-full items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? (
                                        'Giriş yapılıyor...'
                                    ) : (
                                        <>
                                            Giriş yap
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Hesabınız yok mu?</span>
                                <button
                                    type="button"
                                    className="text-sky-400 hover:text-sky-300"
                                    onClick={() => router.push('/register')}
                                >
                                    Kayıt olun
                                </button>
                            </div>
                        </CardContent>

                        <CardFooter className="mt-2 flex flex-col items-center justify-between gap-2 text-[11px] text-slate-500 sm:flex-row">
                            <span>© {year} WorkWise</span>
                            <span className="text-slate-500/80">
                                AdonisJS · Next.js · PostgreSQL
                            </span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
