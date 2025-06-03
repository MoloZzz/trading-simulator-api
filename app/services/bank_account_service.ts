import BankAccount from '#models/bank_account'
import { Exception } from '@adonisjs/core/exceptions'

export class BankAccountService {
  public async getAll() {
    return await BankAccount.all()
  }

  public async getById(id: number) {
    const account = await BankAccount.find(id)
    if (!account) {
      throw new Exception('Bank account not found')
    }
    return account
  }

  public async create(accountName: string, balance: number) {
    const account = new BankAccount()
    account.accountName = accountName
    account.balance = balance

    await account.save()
    return account
  }

  public async update(id: number, data: Partial<{ accountName: string; balance: number }>) {
    const account = await BankAccount.find(id)
    if (!account) {
      throw new Exception('Bank account not found', { status: 404 })
    }

    if (data.accountName !== undefined) {
      account.accountName = data.accountName
    }

    if (data.balance !== undefined) {
      account.balance = data.balance
    }

    await account.save()
    return account
  }

  public async delete(id: number) {
    const account = await BankAccount.find(id)
    if (!account) {
      throw new Exception('Bank account not found', { status: 404 })
    }

    await account.delete()
    return { message: 'Account deleted successfully' }
  }
}
