import type { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await auth.use('jwt').generate(user)

    // Retorna o token no corpo da resposta
    return response.ok({
      token: token, // Apenas o valor do JWT
      user: user.serialize(), // Retorna informações do usuário (opcional)
    })
  }
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)

    return response.created(user)
  }

  async logout({ response }: HttpContext) {
    try {
      response.clearCookie('token')

      return response.ok({ message: 'Logged out successfully' })
    } catch (error) {
      return response.badRequest({ message: 'Failed to logout', error })
    }
  }
}
