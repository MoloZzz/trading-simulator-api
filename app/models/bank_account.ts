import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Transaction from './transaction.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class BankAccount extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare accountName: string

  @column()
  declare balance: number

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}