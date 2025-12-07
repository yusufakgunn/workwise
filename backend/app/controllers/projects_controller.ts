import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
    // GET /projects
    public async index({ auth }: HttpContext) {
        const user = auth.user!

        const projects = await Project.query()
            .where('owner_id', user.id)
            .orderBy('created_at', 'desc')

        // 🔹 Frontend'in beklediği format: { projects: [...] }
        return {
            projects: projects.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                status: p.status,
                visibility: p.visibility,
                organizationId: p.organizationId,
                startDate: p.startDate,
                endDate: p.endDate,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            })),
        }
    }

    // POST /projects
    public async store({ request, auth, response }: HttpContext) {
        const user = auth.user!

        if (!['owner', 'lead'].includes(user.role)) {
            return response.forbidden({
                error: 'Bu işlem için yetkiniz bulunmuyor.',
            })
        }

        // Şimdilik basit, sonra validator yazarız
        const data = request.only([
            'name',
            'description',
            'visibility',
            'startDate',
            'endDate',
            'organizationId',
        ])

        if (!data.name || !data.name.trim()) {
            return response.badRequest({
                error: 'Proje adı zorunludur.',
            })
        }

        const visibility =
            data.visibility === 'team' || data.visibility === 'public'
                ? data.visibility
                : 'private'

        const project = await Project.create({
            name: data.name.trim(),
            description: data.description ?? null,
            visibility,
            startDate: data.startDate ?? null,
            endDate: data.endDate ?? null,
            organizationId: data.organizationId ?? null,
            ownerId: user.id,
            status: 'active',
        })

        // 🔹 Frontend'in beklediği format: { project: {...} }
        return response.created({
            project: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                visibility: project.visibility,
                organizationId: project.organizationId,
                startDate: project.startDate,
                endDate: project.endDate,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        })
    }

    // GET /projects/:id
    public async show({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.id)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        return {
            project: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                visibility: project.visibility,
                organizationId: project.organizationId,
                startDate: project.startDate,
                endDate: project.endDate,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        }
    }

    // PUT /projects/:id
    public async update({ params, request, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.id)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const data = request.only([
            'name',
            'description',
            'status',
            'visibility',
            'startDate',
            'endDate',
        ])

        if (data.name && !data.name.trim()) {
            return response.badRequest({
                error: 'Proje adı boş olamaz.',
            })
        }

        if (data.visibility) {
            const allowed = ['private', 'team', 'public']
            if (!allowed.includes(data.visibility)) {
                return response.badRequest({
                    error: 'Geçersiz görünürlük değeri.',
                })
            }
        }

        project.merge({
            ...data,
            name: data.name ? data.name.trim() : project.name,
        })
        await project.save()

        return {
            project: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                visibility: project.visibility,
                organizationId: project.organizationId,
                startDate: project.startDate,
                endDate: project.endDate,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            },
        }
    }

    // DELETE /projects/:id
    public async destroy({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.id)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        await project.delete()

        return { message: 'Proje silindi' }
    }
}
