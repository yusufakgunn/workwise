import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public name: string

  @column()
  declare public description: string | null

  @column()
  declare public status: 'active' | 'archived'

  @column()
  declare public ownerId: number

  @column()
  declare public organizationId?: number | null

  @column()
  declare public visibility: 'private' | 'team' | 'public'

  @column()
  declare public startDate?: string | null

  @column()
  declare public endDate?: string | null

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare public owner: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime
}
