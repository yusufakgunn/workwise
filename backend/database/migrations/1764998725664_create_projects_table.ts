import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.text('description')
      table
        .enum('status', ['active', 'archived'])
        .defaultTo('active')
        .notNullable()

      table.integer('owner_id').unsigned().references('id').inTable('users')
      table.integer('organization_id').unsigned().nullable()

      table
        .enum('visibility', ['private', 'team', 'public'])
        .defaultTo('private')

      table.date('start_date').nullable()
      table.date('end_date').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
