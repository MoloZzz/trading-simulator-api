import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  public async handle(error: any, ctx: HttpContext) {
    const status = error.status || 500
    const message = error.message || 'Something went wrong'

    if (app.inProduction) {
      return ctx.response.status(status).send({
        message: status === 500 ? 'Internal Server Error' : message,
      })
    }

    if ([400, 401, 403, 404].includes(status)) {
      return ctx.response.status(status).send({ message, status })
    }

    return super.handle(error, ctx)
  }
}
