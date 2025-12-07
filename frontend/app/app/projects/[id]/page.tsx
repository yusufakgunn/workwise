'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import type { Project } from '@/types/project'
import type { Task, TasksResponse, CreateTaskResponse } from '@/types/task'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Plus } from 'lucide-react'

type ProjectDetailResponse = {
    project: Project
}

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()

    const projectId = Number(params.id)

    const [project, setProject] = useState<Project | null>(null)
    const [loadingProject, setLoadingProject] = useState(true)
    const [projectError, setProjectError] = useState<string | null>(null)

    const [tasks, setTasks] = useState<Task[]>([])
    const [loadingTasks, setLoadingTasks] = useState(true)
    const [tasksError, setTasksError] = useState<string | null>(null)

    const [createTaskOpen, setCreateTaskOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newStatus, setNewStatus] = useState<'todo' | 'in_progress' | 'done'>('todo')
    const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [creatingTask, setCreatingTask] = useState(false)
    const [createTaskError, setCreateTaskError] = useState<string | null>(null)

    // Proje
    useEffect(() => {
        if (!projectId || Number.isNaN(projectId)) {
            setProjectError('Geçersiz proje ID')
            setLoadingProject(false)
            return
        }

        const fetchProject = async () => {
            try {
                setLoadingProject(true)
                setProjectError(null)

                const res = await apiClient.get<ProjectDetailResponse>(
                    `/projects/${projectId}`,
                    { auth: true }
                )

                setProject(res.project)
            } catch (err: any) {
                const msg =
                    err?.payload?.message ||
                    err?.payload?.error ||
                    'Proje yüklenirken bir hata oluştu.'
                setProjectError(msg)
            } finally {
                setLoadingProject(false)
            }
        }

        fetchProject()
    }, [projectId])

    // Görevler
    useEffect(() => {
        if (!projectId || Number.isNaN(projectId)) {
            setTasksError('Geçersiz proje ID')
            setLoadingTasks(false)
            return
        }

        const fetchTasks = async () => {
            try {
                setLoadingTasks(true)
                setTasksError(null)

                const res = await apiClient.get<TasksResponse>(
                    `/projects/${projectId}/tasks`,
                    { auth: true }
                )

                setTasks(res.tasks ?? [])
            } catch (err: any) {
                const msg =
                    err?.payload?.message ||
                    err?.payload?.error ||
                    'Görevler getirilirken bir hata oluştu.'
                setTasksError(msg)
            } finally {
                setLoadingTasks(false)
            }
        }

        fetchTasks()
    }, [projectId])

    const formatDate = (value?: string | null) => {
        if (!value) return '-'
        try {
            const d = new Date(value)
            return d.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        } catch {
            return value
        }
    }

    const visibilityLabel =
        project?.visibility === 'team'
            ? 'Ekip'
            : project?.visibility === 'public'
                ? 'Genel'
                : 'Özel'

    async function handleCreateTask(e: FormEvent) {
        e.preventDefault()

        if (!newTitle.trim()) {
            setCreateTaskError('Görev başlığı zorunludur.')
            return
        }

        setCreatingTask(true)
        setCreateTaskError(null)

        try {
            const res = await apiClient.post<CreateTaskResponse>(
                `/projects/${projectId}/tasks`,
                {
                    title: newTitle.trim(),
                    description: newDescription.trim() || null,
                    status: newStatus,
                    priority: newPriority,
                },
                { auth: true }
            )

            if (res.task) {
                setTasks((prev) => [...prev, res.task])
            }

            setNewTitle('')
            setNewDescription('')
            setNewStatus('todo')
            setNewPriority('medium')
            setCreateTaskOpen(false)
        } catch (err: any) {
            const msg =
                err?.payload?.message ||
                err?.payload?.error ||
                'Görev oluşturulurken bir hata oluştu.'
            setCreateTaskError(msg)
        } finally {
            setCreatingTask(false)
        }
    }

    if (loadingProject) {
        return (
            <div className="text-sm text-slate-400">Proje yükleniyor...</div>
        )
    }

    if (projectError) {
        return (
            <div className="rounded-md border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
                {projectError}
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-sm text-slate-400">Proje bulunamadı.</div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Geri + başlık */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-slate-400 hover:text-slate-100"
                        onClick={() => router.push('/app/projects')}
                    >
                        <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                        Projelere dön
                    </Button>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Proje Detayı
                    </span>
                </div>
            </div>

            {/* Üst bilgi */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                        {project.name}
                    </h1>
                    {project.description && (
                        <p className="mt-1 text-sm text-slate-400 max-w-2xl">
                            {project.description}
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
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
                    <Badge
                        variant="outline"
                        className="border-sky-500/50 text-sky-300 bg-sky-500/5"
                    >
                        {visibilityLabel}
                    </Badge>
                </div>
            </div>

            {/* İçerik alanı */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Genel Bilgiler */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-slate-100 mb-1">
                        Genel Bilgiler
                    </h2>
                    <p className="text-xs text-slate-400">
                        Oluşturma:{' '}
                        <span className="text-slate-200">
                            {formatDate(project.createdAt)}
                        </span>
                    </p>
                    <p className="text-xs text-slate-400">
                        Güncelleme:{' '}
                        <span className="text-slate-200">
                            {formatDate(project.updatedAt)}
                        </span>
                    </p>
                    <p className="text-xs text-slate-400">
                        Başlangıç:{' '}
                        <span className="text-slate-200">
                            {project.startDate ? formatDate(project.startDate) : '-'}
                        </span>
                    </p>
                    <p className="text-xs text-slate-400">
                        Bitiş:{' '}
                        <span className="text-slate-200">
                            {project.endDate ? formatDate(project.endDate) : '-'}
                        </span>
                    </p>
                </div>

                {/* Görevler */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <h2 className="text-sm font-semibold text-slate-100">
                            Görevler
                        </h2>
                        <Button
                            size="xs"
                            className="h-7 text-[11px] inline-flex items-center gap-1.5"
                            onClick={() => setCreateTaskOpen(true)}
                        >
                            <Plus className="h-3 w-3" />
                            Yeni görev
                        </Button>
                    </div>

                    {loadingTasks ? (
                        <p className="text-xs text-slate-400">
                            Görevler yükleniyor...
                        </p>
                    ) : tasksError ? (
                        <p className="text-xs text-red-300">
                            {tasksError}
                        </p>
                    ) : tasks.length === 0 ? (
                        <p className="text-xs text-slate-400">
                            Bu projeye bağlı henüz görev yok.
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-lg border border-slate-800/80 bg-slate-900/80 px-3 py-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-medium text-slate-100">
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <Badge
                                                variant="outline"
                                                className="border-slate-700 text-[10px] text-slate-200"
                                            >
                                                {task.status === 'todo'
                                                    ? 'Yapılacak'
                                                    : task.status === 'in_progress'
                                                        ? 'Devam ediyor'
                                                        : 'Tamamlandı'}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    task.priority === 'high'
                                                        ? 'border-red-500/60 text-red-300 text-[10px]'
                                                        : task.priority === 'low'
                                                            ? 'border-slate-600 text-slate-300 text-[10px]'
                                                            : 'border-amber-500/60 text-amber-300 text-[10px]'
                                                }
                                            >
                                                {task.priority === 'high'
                                                    ? 'Yüksek'
                                                    : task.priority === 'low'
                                                        ? 'Düşük'
                                                        : 'Orta'}
                                            </Badge>
                                        </div>
                                    </div>
                                    {task.description && (
                                        <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ekip placeholder */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                    <h2 className="text-sm font-semibold text-slate-100 mb-1">
                        Ekip
                    </h2>
                    <p className="text-xs text-slate-400">
                        Proje üyeleri ve roller burada görünecek. Organizasyon ve ekip
                        yapısını kurduğumuzda dolduracağız.
                    </p>
                </div>
            </div>

            {/* Yeni görev modalı */}
            <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                <DialogContent className="border-slate-800 bg-slate-950/95 text-slate-50">
                    <DialogHeader>
                        <DialogTitle>Yeni Görev</DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">
                            Bu proje için yeni bir görev oluşturun.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleCreateTask}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-200">
                                Başlık
                            </label>
                            <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Örn. Login sayfasını tamamla"
                                className="h-9 bg-slate-950/80 border-slate-700 text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-200">
                                Açıklama <span className="text-slate-500">(opsiyonel)</span>
                            </label>
                            <Textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Görev hakkında kısa bir açıklama yazabilirsiniz."
                                className="min-h-[70px] bg-slate-950/80 border-slate-700 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-200">
                                    Durum
                                </label>
                                <select
                                    className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/80 text-xs text-slate-100 px-2"
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(e.target.value as typeof newStatus)
                                    }
                                >
                                    <option value="todo">Yapılacak</option>
                                    <option value="in_progress">Devam ediyor</option>
                                    <option value="done">Tamamlandı</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-200">
                                    Öncelik
                                </label>
                                <select
                                    className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/80 text-xs text-slate-100 px-2"
                                    value={newPriority}
                                    onChange={(e) =>
                                        setNewPriority(e.target.value as typeof newPriority)
                                    }
                                >
                                    <option value="low">Düşük</option>
                                    <option value="medium">Orta</option>
                                    <option value="high">Yüksek</option>
                                </select>
                            </div>
                        </div>

                        {createTaskError && (
                            <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 px-3 py-2 rounded-md">
                                {createTaskError}
                            </p>
                        )}

                        <DialogFooter className="flex flex-row items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => setCreateTaskOpen(false)}
                                disabled={creatingTask}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs"
                                disabled={creatingTask}
                            >
                                {creatingTask ? 'Oluşturuluyor...' : 'Oluştur'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
