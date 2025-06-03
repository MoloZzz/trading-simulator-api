import { HttpContext } from '@adonisjs/core/http'
import { BankAccountService } from '#services/bank_account_service'

export default class BankAccountsController {
  private service = new BankAccountService()

  public async index({}: HttpContext) {
    return this.service.getAll()
  }

  public async show({ params }: HttpContext) {
    const id = Number(params.id)
    return this.service.getById(id)
  }

  public async store({ request }: HttpContext) {
    const { accountName, balance } = request.only(['accountName', 'balance'])
    return this.service.create(accountName, balance)
  }

  public async update({ request, params }: HttpContext) {
    const id = Number(params.id)
    const data = request.only(['accountName', 'balance'])
    return this.service.update(id, data)
  }

  public async destroy({ params }: HttpContext) {
    const id = Number(params.id)
    return this.service.delete(id)
  }
}
