import type { HttpContext } from '@adonisjs/core/http'

import Endereco from '#models/endereco'

export default class EnderecosController {
  public async store({ request, response }: HttpContext) {
    const body = request.body()

    const endereco = await Endereco.create(body)

    response.status(201)

    return {
      message: 'endereço criado com sucesso',
      data: endereco,
    }
  }

  public async index() {
    const endereco = await Endereco.all()

    return {
      data: endereco,
    }
  }
}
