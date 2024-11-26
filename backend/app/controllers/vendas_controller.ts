import type { HttpContext } from '@adonisjs/core/http'

import Venda from '#models/venda'

export default class VendasController {
  public async store({ request, response }: HttpContext) {
    const body = request.body()

    const venda = await Venda.create(body)

    response.status(201)

    return {
      message: 'venda criada com sucesso',
      data: venda,
    }
  }

  public async index() {
    const venda = await Venda.all()

    return {
      data: venda,
    }
  }
}
