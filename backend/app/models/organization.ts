import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Project from '#models/project'
import OrganizationMember from '#models/organization_member'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare ownerId: number

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => OrganizationMember, {
    foreignKey: 'organizationId',
  })
  declare members: HasMany<typeof OrganizationMember>

  @hasMany(() => Project, {
    foreignKey: 'organizationId',
  })
  declare projects: HasMany<typeof Project>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
