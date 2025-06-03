import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import BankAccount from './bank_account.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare date: DateTime

  @column()
  declare type: 'income' | 'expense'

  @column()
  declare price: number

  @column()
  declare balanceAfter: number

  @column()
  declare bankAccountId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => BankAccount)
  declare bankAccount: BelongsTo<typeof BankAccount>
}