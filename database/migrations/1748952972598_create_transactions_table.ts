import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('date')
      table.enum('type', ['income', 'expense'])
      table.decimal('price', 15, 2).notNullable()
      table.decimal('balance_after', 15, 2)
      table.integer('bank_account_id').unsigned().references('id').inTable('bank_accounts')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
