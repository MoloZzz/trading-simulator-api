import NotFoundException from '#exceptions/NotFoundException'
import { BankAccountService } from './bank_account_service.js'
import Transaction from '#models/transaction'
import { DateTime } from 'luxon'

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
      const followingTransactions = await Transaction.query()
          .where('bank_account_id', transaction.bankAccountId)
          .where('date', '>', transaction.date.toSQL()!)
          .orderBy('date', 'asc')

      let currentBalance = transaction.balanceAfter
      for (const tx of followingTransactions) {
        currentBalance += tx.type === 'income' ? tx.price : -tx.price
        tx.balanceAfter = currentBalance
        await tx.save()
      }
  }
}