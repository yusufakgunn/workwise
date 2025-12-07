import type { HttpContext } from '@adonisjs/core/http'
import Task from '#models/task'
import Project from '#models/project'

export default class TasksController {
    // GET /projects/:projectId/tasks
    public async index({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.projectId)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const tasks = await Task.query()
            .where('project_id', project.id)
            .orderBy('created_at', 'asc')

        return {
            tasks: tasks.map((t) => ({
                id: t.id,
                projectId: t.projectId,
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                dueDate: t.dueDate,
                assigneeId: t.assigneeId,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
            })),
        }
    }

    // POST /projects/:projectId/tasks
    public async store({ params, request, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.projectId)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const data = request.only([
            'title',
            'description',
            'status',
            'priority',
            'dueDate',
            'assigneeId',
        ])

        if (!data.title || !data.title.trim()) {
            return response.badRequest({
                error: 'Görev başlığı zorunludur.',
            })
        }

        const allowedStatus = ['todo', 'in_progress', 'done'] as const
        const allowedPriority = ['low', 'medium', 'high'] as const

        const status = allowedStatus.includes(data.status)
            ? data.status
            : 'todo'

        const priority = allowedPriority.includes(data.priority)
            ? data.priority
            : 'medium'

        const task = await Task.create({
            projectId: project.id,
            title: data.title.trim(),
            description: data.description ?? null,
            status,
            priority,
            dueDate: data.dueDate ?? null,
            assigneeId: data.assigneeId ?? null,
        })

        return response.created({
            task: {
                id: task.id,
                projectId: task.projectId,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                assigneeId: task.assigneeId,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            },
        })
    }
}
