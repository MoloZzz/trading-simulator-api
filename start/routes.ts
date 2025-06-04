/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import BankAccountsController from '#controllers/bank_accounts_controller'
import TransactionsController from '#controllers/transactions_controller'

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.resource('bank-accounts', BankAccountsController).apiOnly()
router.post('transactions', [TransactionsController, 'create'])
router.get('transactions/:id', [TransactionsController, 'show'])
router.get('bank-accounts/:accountId/transactions', [TransactionsController, 'index'])
