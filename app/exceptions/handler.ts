import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  public async handle(error: any, ctx: HttpContext) {
    if (error.status === 404 || error.status === 400) {
      return ctx.response.status(error.status).send({
        message: error.message,
      })
    }

    if (process.env.NODE_ENV === 'production') {
      return ctx.response.status(error.status || 500).send({
        message: 'Something went wrong',
      })
    }

    return super.handle(error, ctx)
  }
}
