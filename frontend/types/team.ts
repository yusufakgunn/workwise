export type ProjectMemberRole = 'lead' | 'member'

export type ProjectMemberUser = {
    id: number
    fullName: string | null
    email: string
}

export type ProjectMember = {
    id: number
    projectId: number
    userId: number
    role: ProjectMemberRole
    user: ProjectMemberUser
}

export type ProjectMembersResponse = {
    members: ProjectMember[]
}

export type CreateProjectMemberResponse = {
    member: ProjectMember
}
