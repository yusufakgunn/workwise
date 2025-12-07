import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import User from '#models/user'

export default class ProjectMembersController {
    // GET /projects/:projectId/members
    public async index({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.projectId)
            .where('owner_id', user.id) // şimdilik: sadece proje sahibi görebilsin
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const members = await ProjectMember.query()
            .where('project_id', project.id)
            .preload('user')
            .orderBy('id', 'asc')

        return {
            members: members.map((m) => ({
                id: m.id,
                projectId: m.projectId,
                userId: m.userId,
                role: m.role,
                user: {
                    id: m.user.id,
                    fullName: m.user.fullName,
                    email: m.user.email,
                },
            })),
        }
    }

    // POST /projects/:projectId/members
    public async store({ params, request, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.projectId)
            .where('owner_id', user.id) // şimdilik: sadece proje sahibi üye ekleyebilsin
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const payload = request.only(['email', 'role'])

        if (!payload.email || !payload.email.trim()) {
            return response.badRequest({ error: 'E-posta zorunludur.' })
        }

        const targetUser = await User.findBy('email', payload.email.trim())

        if (!targetUser) {
            return response.badRequest({
                error: 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.',
            })
        }

        // Aynı user zaten projede mi?
        const exists = await ProjectMember.query()
            .where('project_id', project.id)
            .where('user_id', targetUser.id)
            .first()

        if (exists) {
            return response.badRequest({
                error: 'Bu kullanıcı zaten proje üyesi.',
            })
        }

        const role: 'lead' | 'member' =
            payload.role === 'lead' ? 'lead' : 'member'

        const member = await ProjectMember.create({
            projectId: project.id,
            userId: targetUser.id,
            role,
        })

        return response.created({
            member: {
                id: member.id,
                projectId: member.projectId,
                userId: member.userId,
                role: member.role,
                user: {
                    id: targetUser.id,
                    fullName: targetUser.fullName,
                    email: targetUser.email,
                },
            },
        })
    }

    // DELETE /projects/:projectId/members/:id
    public async destroy({ params, auth, response }: HttpContext) {
        const user = auth.user!

        const project = await Project.query()
            .where('id', params.projectId)
            .where('owner_id', user.id)
            .first()

        if (!project) {
            return response.notFound({ message: 'Proje bulunamadı' })
        }

        const member = await ProjectMember.query()
            .where('id', params.id)
            .where('project_id', project.id)
            .first()

        if (!member) {
            return response.notFound({ message: 'Proje üyesi bulunamadı' })
        }

        await member.delete()

        return { message: 'Üye projeden çıkarıldı' }
    }
}
