import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
    // GET /projects
    public async index({ auth }: HttpContext) {
        const user = auth.user!
        const projects = await Project.query().where('owner_id', user.id)

        return projects
    }

    // POST /projects
    public async store({ request, auth }: HttpContext) {
        const user = auth.user!

        // Şimdilik basit tutalım, sonra validator yazarız
        const data = request.only([
            'name',
            'description',
            'visibility',
            'startDate',
            'endDate',
        ])

        const project = await Project.create({
            ...data,
            ownerId: user.id,
            status: 'active',
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

        return project
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

        const data = request.only(['name', 'description', 'status', 'visibility'])
        project.merge(data)
        await project.save()

        return project
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
