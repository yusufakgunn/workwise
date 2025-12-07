import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import User from '#models/user'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public projectId: number

  @column()
  declare public title: string

  @column()
  declare public description: string | null

  @column()
  declare public status: 'todo' | 'in_progress' | 'done'

  @column()
  declare public priority: 'low' | 'medium' | 'high'

  @column()
  declare public dueDate: DateTime | null

  @column()
  declare public assigneeId: number | null

  @belongsTo(() => Project, {
    foreignKey: 'projectId',
  })
  declare public project: BelongsTo<typeof Project>

  @belongsTo(() => User, {
    foreignKey: 'assigneeId',
  })
  declare public assignee: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
