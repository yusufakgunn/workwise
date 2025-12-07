import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('project_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')

      table.string('title', 255).notNullable()
      table.text('description').nullable()

      table
        .string('status', 20)
        .notNullable()
        .defaultTo('todo') // todo | in_progress | done

      table
        .string('priority', 20)
        .notNullable()
        .defaultTo('medium') // low | medium | high

      table.timestamp('due_date', { useTz: true }).nullable()

      table
        .integer('assignee_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
