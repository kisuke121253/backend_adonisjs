/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ClientesController = () => import('#controllers/clientes_controller')
const EnderecoController = () => import('#controllers/enderecos_controller')
const VendaController = () => import('#controllers/vendas_controller')
const AuthController = () => import('#controllers/auth_controller')
import { middleware } from './kernel.js'

router
  .group(() => {
    router.resource('/clientes', ClientesController).apiOnly()
    router.resource('/endereco', EnderecoController).apiOnly()
    router.resource('/venda', VendaController).apiOnly()
  })
  .prefix('/api')
  .use(middleware.auth())

router
  .group(() => {
    router.post('signup', [AuthController, 'register'])
    router.post('login', [AuthController, 'login'])
    router.post('logout', [AuthController, 'logout']).use(middleware.auth())
  })
  .prefix('user')

router
  .get('me', async ({ auth, response }) => {
    try {
      const user = auth.getUserOrFail()
      return response.ok(user)
    } catch (error) {
      return response.unauthorized({ error: 'User not found' })
    }
  })
  .use(middleware.auth())
