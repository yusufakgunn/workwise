'use client'

import { useEffect, useState, FormEvent } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAuthStore } from '@/store/auth'

import type {
    Project,
    ProjectsResponse,
    CreateProjectResponse,
} from '@/types/project'

export default function ProjectsPage() {
    const { user } = useAuthStore()

    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)

    const canCreateProject =
        user && (user.role === 'owner' || user.role === 'lead')

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                setError(null)

                const res = await apiClient.get<ProjectsResponse>('/projects', {
                    auth: true,
                })

                setProjects(res.projects ?? [])
            } catch (err: any) {
                const msg =
                    err?.payload?.message ||
                    err?.payload?.error ||
                    'Projeler getirilirken bir hata oluştu.'
                setError(msg)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    function formatDate(dateStr: string) {
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        } catch {
            return ''
        }
    }

    async function handleCreateProject(e: FormEvent) {
        e.preventDefault()
        if (!newName.trim()) {
            setCreateError('Proje adı zorunludur.')
            return
        }

        setCreating(true)
        setCreateError(null)

        try {
            const res = await apiClient.post<CreateProjectResponse>(
                '/projects',
                {
                    name: newName.trim(),
                    description: newDescription.trim() || null,
                },
                { auth: true }
            )

            if (res.project) {
                setProjects((prev) => [res.project, ...prev])
            }

            setNewName('')
            setNewDescription('')
            setCreateDialogOpen(false)
        } catch (err: any) {
            const msg =
                err?.payload?.message ||
                err?.payload?.error ||
                'Proje oluşturulurken bir hata oluştu.'
            setCreateError(msg)
        } finally {
            setCreating(false)
        }
    }

    const handleArchiveProject = (projectId: number) => {
        // TODO: PATCH /projects/:id status: archived
        console.log('archive', projectId)
    }

    const handleEditProject = (projectId: number) => {
        // TODO: edit modal açma vs.
        console.log('edit', projectId)
    }

    const hasProjects = projects.length > 0

    return (
        <div className="space-y-6">
            {/* Üst başlık */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Projeler
                    </p>
                    <h1 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
                        Çalışma alanınızdaki projeler
                    </h1>
                    <p className="mt-1 text-xs text-slate-400 max-w-xl">
                        Ekiplerinizin üzerinde çalıştığı projeleri buradan oluşturup
                        yönetebilirsiniz.
                    </p>
                </div>

                {canCreateProject && (
                    <Button
                        size="sm"
                        className="inline-flex items-center gap-2"
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Yeni Proje
                    </Button>
                )}
            </div>

            {/* İçerik alanı */}
            {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-8 text-center text-sm text-slate-400">
                    Projeler yükleniyor...
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-800 bg-red-950/50 px-4 py-4 text-sm text-red-300">
                    {error}
                </div>
            ) : !hasProjects ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 px-6 py-10 text-center">
                    <p className="text-sm font-medium text-slate-100">
                        Henüz bir projeniz yok.
                    </p>
                    <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
                        Ekip çalışmalarını bir araya toplamak için ilk projenizi oluşturun.
                        Görevler, durumlar ve ekip üyeleri projelere bağlı olarak
                        yönetilecektir.
                    </p>

                    {canCreateProject ? (
                        <Button
                            size="sm"
                            className="mt-4 inline-flex items-center gap-2"
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            İlk projeyi oluştur
                        </Button>
                    ) : (
                        <p className="mt-3 text-[11px] text-slate-500">
                            Proje oluşturma yetkiniz yok. Ekip liderinizden proje oluşturmasını
                            isteyin.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            className="border-slate-800 bg-slate-900/70 hover:bg-slate-900/90 transition-colors"
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-2">
                                <div>
                                    <CardTitle className="text-sm font-semibold text-slate-50">
                                        {project.name}
                                    </CardTitle>
                                    {project.description && (
                                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="rounded-md p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-800/80">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="text-xs">
                                        <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                                            Düzenle
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-400 focus:text-red-400"
                                            onClick={() => handleArchiveProject(project.id)}
                                        >
                                            Arşivle
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={
                                            project.status === 'active'
                                                ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/5'
                                                : 'border-slate-600 text-slate-300 bg-slate-800/60'
                                        }
                                    >
                                        {project.status === 'active' ? 'Aktif' : 'Arşivli'}
                                    </Badge>
                                    <p className="text-[11px] text-slate-500">
                                        Oluşturma: {formatDate(project.createdAt)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Yeni Proje Modalı */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="border-slate-800 bg-slate-950/95 text-slate-50">
                    <DialogHeader>
                        <DialogTitle>Yeni Proje</DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">
                            Ekip çalışmalarınızı organize etmek için yeni bir proje oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleCreateProject}>
                        <div className="space-y-1.5">
                            <label
                                htmlFor="project-name"
                                className="text-xs font-medium text-slate-200"
                            >
                                Proje adı
                            </label>
                            <Input
                                id="project-name"
                                placeholder="Örn. WorkWise SaaS Platformu"
                                className="h-9 bg-slate-950/80 border-slate-700 text-sm"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="project-description"
                                className="text-xs font-medium text-slate-200"
                            >
                                Açıklama <span className="text-slate-500">(opsiyonel)</span>
                            </label>
                            <Textarea
                                id="project-description"
                                placeholder="Proje hakkında kısa bir açıklama yazabilirsiniz."
                                className="min-h-[80px] bg-slate-950/80 border-slate-700 text-sm"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>

                        {createError && (
                            <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 px-3 py-2 rounded-md">
                                {createError}
                            </p>
                        )}

                        <DialogFooter className="flex flex-row items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => setCreateDialogOpen(false)}
                                disabled={creating}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs"
                                disabled={creating}
                            >
                                {creating ? 'Oluşturuluyor...' : 'Oluştur'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
