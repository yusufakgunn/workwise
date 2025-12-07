// app/models/organization_member.ts
import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    belongsTo,
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Organization from '#models/organization'
import User from '#models/user'

export default class OrganizationMember extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare organizationId: number

    @column()
    declare userId: number

    @column()
    declare role: 'owner' | 'admin' | 'member'

    @belongsTo(() => Organization, {
        foreignKey: 'organizationId',
    })
    declare organization: BelongsTo<typeof Organization>

    @belongsTo(() => User, {
        foreignKey: 'userId',
    })
    declare user: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
