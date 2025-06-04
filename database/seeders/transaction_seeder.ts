import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Transaction from '#models/transaction'
import BankAccount from '#models/bank_account'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'

export default class extends BaseSeeder {
  public async run() {
    const account = await BankAccount.create({
      accountName: 'Future Account',
      balance: 1000,
    })
    const transactions: Partial<Transaction>[] = []
    let balance = account.balance
    let currentDate = DateTime.now().plus({ minutes: 1 })

    for (let i = 0; i < 10_000; i++) {
      currentDate = currentDate.plus({ minutes: faker.number.int({ min: 5, max: 60 }) })

      const type = faker.helpers.arrayElement(['income', 'expense']) as 'income' | 'expense'
      const price = parseFloat(
        faker.number.float({ min: 5, max: 1000, fractionDigits: 2 }).toFixed(2)
      )

      const delta = type === 'income' ? price : -price
      balance += delta

      transactions.push({
        bankAccountId: account.id,
        date: currentDate,
        type,
        price,
        balanceAfter: balance,
      })
    }

    await Transaction.createMany(transactions)
  }
}
