export type ProjectStatus = 'active' | 'archived'

export type ProjectVisibility = 'private' | 'team' | 'public'

export type Project = {
    id: number
    name: string
    description: string | null
    status: ProjectStatus
    visibility?: ProjectVisibility
    organizationId?: number | null
    startDate?: string | null
    endDate?: string | null
    createdAt: string
    updatedAt: string
}

export type ProjectsResponse = {
    projects: Project[]
}

export type CreateProjectResponse = {
    project: Project
}
