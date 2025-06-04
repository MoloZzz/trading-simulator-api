import NotFoundException from '#exceptions/NotFoundException'
import BankAccount from '#models/bank_account'
import redis from '@adonisjs/redis/services/main'

export class BankAccountService {
  public async getAll() {
    return await BankAccount.all()
  }

  public async getById(id: number) {
    const account = await BankAccount.find(id)
    return account
  }

  public async getBalance(accountId: number): Promise<number> {
    const cacheKey = `account:${accountId}:balance`
    const cached = await redis.get(cacheKey)
    if (cached) {
      return parseFloat(cached)
    }

    const account = await this.getById(accountId)
    if (!account) {
      throw new NotFoundException('Bank account not found')
    }

    await redis.set(cacheKey, account.balance.toString(), 'EX', 60)
    return account.balance
  } // Cache balance for 60 seconds, it is wrong approach; Only for the sake of using Redis

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
      throw new NotFoundException('Bank account not found')
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
      throw new NotFoundException('Bank account not found')
    }

    await account.delete()
    return { message: 'Account deleted successfully' }
  }
}
