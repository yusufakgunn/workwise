import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('organization_id')
        .unsigned()
        .nullable()
        .alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('organization_id')
      table.integer('organization_id').nullable().alter()
    })
  }
}
