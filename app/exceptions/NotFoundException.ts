import { Exception } from '@adonisjs/core/exceptions'

export default class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, { status: 404 })
  }
}
