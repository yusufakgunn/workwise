import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import Organization from '#models/organization'
import OrganizationMember from '#models/organization_member'

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
    public async store({ request, auth }: HttpContext) {
        const user = auth.user!

        const data = request.only([
            'name',
            'description',
            'visibility',
            'startDate',
            'endDate',
            'organizationId', // frontend ileride gönderirse kullanırız
        ])

        let organizationId = data.organizationId as number | undefined

        // 1) Eğer organizationId gelmemişse, kullanıcının ilk organizasyonunu bul
        if (!organizationId) {
            const existingMembership = await OrganizationMember.query()
                .where('user_id', user.id)
                .first()

            if (existingMembership) {
                organizationId = existingMembership.organizationId
            } else {
                // 2) Kullanıcının hiç organizasyonu yoksa otomatik bir tane oluştur
                const orgName = user.fullName
                    ? `${user.fullName} Çalışma Alanı`
                    : 'Kişisel Çalışma Alanı'

                const org = await Organization.create({
                    name: orgName,
                    ownerId: user.id,
                })

                await OrganizationMember.create({
                    organizationId: org.id,
                    userId: user.id,
                    role: 'owner',
                })

                organizationId = org.id
            }
        }

        // safety
        if (!organizationId) {
            throw new Error('organizationId belirlenemedi')
        }

        // 3) Projeyi oluştur
        const project = await Project.create({
            name: data.name,
            description: data.description ?? null,
            visibility: (data.visibility as any) ?? 'private',
            startDate: data.startDate ?? null,
            endDate: data.endDate ?? null,
            ownerId: user.id,
            organizationId,
            status: 'active',
        })

        // 4) Proje sahibini otomatik proje üyesi (lead) yap
        await ProjectMember.create({
            projectId: project.id,
            userId: user.id,
            role: 'lead',
        })

        return project
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
