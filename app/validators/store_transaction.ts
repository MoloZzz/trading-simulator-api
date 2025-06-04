import vine from '@vinejs/vine'


export const createTransactionValidator = vine.compile(
  vine.object({
    accountId: vine.number(),
    date: vine.date(),
    type: vine.enum(['income', 'expense']),
    price: vine.number().positive()
  })
)
