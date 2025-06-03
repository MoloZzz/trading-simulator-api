import NotFoundException from '#exceptions/NotFoundException'
import { BankAccountService } from './bank_account_service.js'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export class TransactionService {
  bankAccountService: BankAccountService

  constructor() {
    this.bankAccountService = new BankAccountService()
  }

  public async getById(id: number) {
    const transaction = await Transaction.find(id)
    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }
    return transaction
  }

  public async create(data: {
    accountId: number
    date: DateTime
    type: 'income' | 'expense'
    price: number
  }) {
    const lastTransaction = await Transaction.query()
      .where('bank_account_id', data.accountId)
      .where('date', '<=', data.date.toSQL()!)
      .orderBy('date', 'desc')
      .first()

    const balanceBefore = lastTransaction
      ? lastTransaction.balanceAfter
      : await this.bankAccountService.getBalance(data.accountId)

    const balanceAfter = balanceBefore + (data.type === 'income' ? data.price : -data.price)

    let createdTransaction
    try {
      createdTransaction = await Transaction.create({
        bankAccountId: data.accountId,
        date: data.date,
        type: data.type,
        price: data.price,
        balanceAfter,
      })
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation (postgres)
        throw new NotFoundException('Invalid account ID')
      }
      throw error
    }

    await this.recalculateFollowingBalances(createdTransaction)
    return createdTransaction
  }

  private async recalculateFollowingBalances(transaction: Transaction) {
    const startingBalance = transaction.balanceAfter
    const accountId = transaction.bankAccountId
    const transactionDate = transaction.date.toSQL()!
    await db.rawQuery(
      `
        WITH updated_balances AS (
          SELECT
            id,
            bank_account_id,
            date,
            type,
            price,
            SUM(
              CASE WHEN type = 'income' THEN price ELSE -price END
            ) OVER (ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
            + ? AS new_balance_after
          FROM transactions
          WHERE bank_account_id = ?
            AND date > ?
        )
        UPDATE transactions t
        SET balance_after = ub.new_balance_after
        FROM updated_balances ub
        WHERE t.id = ub.id
        `,
      [startingBalance, accountId, transactionDate]
    )
  }
}
