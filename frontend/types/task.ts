export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
    id: number
    projectId: number
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string | null
    assigneeId?: number | null
    createdAt: string
    updatedAt: string
}

export type TasksResponse = {
    tasks: Task[]
}

export type CreateTaskResponse = {
    task: Task
}
