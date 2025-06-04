import { TransactionService } from '#services/transaction_service'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class TransactionsController {
  private transactionService = new TransactionService()

  public async create({ request, response }: HttpContext) {
    const payload = request.only(['accountId', 'date', 'type', 'price'])
    const date = DateTime.fromISO(payload.date)
    if (!date.isValid) {
      return response.status(400).send({ message: 'Invalid date format' })
    }

    const transaction = await this.transactionService.create({
      accountId: payload.accountId,
      date,
      type: payload.type,
      price: payload.price,
    })

    return response.created(transaction)
  }

  public async show({ params, response }: HttpContext) {
    try {
      const transaction = await this.transactionService.getById(Number(params.id))
      return response.ok(transaction)
    } catch (error) {
      return response.status(404).send({ message: error.message })
    }
  }

  public async index({ params, response }: HttpContext) {
    const transactions = await this.transactionService.getAllByAccountId(Number(params.accountId))
    return response.ok(transactions)
  }
}
