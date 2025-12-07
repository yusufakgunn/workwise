export type UserRole = 'owner' | 'lead' | 'member'

export type AuthUser = {
    id: number
    fullName: string | null
    email: string
    role: UserRole
}
