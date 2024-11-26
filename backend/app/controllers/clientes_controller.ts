import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

import Cliente from '#models/cliente'
import Venda from '#models/venda'

export default class ClientesController {
  public async store({ request, response }: HttpContext) {
    const body = request.body()

    const cliente = await Cliente.create(body)

    response.status(201)

    return {
      message: 'cliente criado com sucesso',
      data: cliente,
    }
  }

  public async index() {
    const clientes = await Cliente.query()
      .select('id', 'name', 'cpf', 'number')
      .orderBy('id', 'asc')

    return {
      data: clientes,
    }
  }

  public async show({ params, request }: HttpContext) {
    const { id } = params
    const query = request.qs()
    const mes = query.mes ? parseInt(query.mes, 10) : null
    const ano = query.ano ? parseInt(query.ano, 10) : null

    const cliente = await Cliente.findOrFail(id)

    const vendasQuery = Venda.query().where('id_cliente', id).orderBy('data_hora', 'desc')

    if (mes && ano) {
      const inicioMes = DateTime.local(ano, mes, 1).startOf('month').toSQL()
      const fimMes = DateTime.local(ano, mes, 1).endOf('month').toSQL()
      vendasQuery.whereBetween('data_hora', [inicioMes, fimMes])
    }

    const vendas = await vendasQuery

    return {
      data: {
        cliente: {
          id: cliente.id,
          nome: cliente.name,
          cpf: cliente.cpf,
          numero: cliente.number,
          endereco_id: cliente.id_endereco,
          usuario_id: cliente.id_user,
          criado_em: cliente.createdAt,
          atualizado_em: cliente.updatedAt,
        },
        vendas: vendas.map((venda) => ({
          id: venda.id,
          data_hora: venda.data_hora,
          preco_total: venda.preco_total,
        })),
      },
    }
  }

  public async update({ params, request }: HttpContext) {
    const body = request.body()

    const cliente = await Cliente.findOrFail(params.id)

    cliente.name = body.name
    cliente.cpf = body.cpf
    cliente.number = body.numer
    cliente.id_endereco = body.id_endereco
    cliente.id_user = body.id_user

    await cliente.save()

    return {
      message: 'cliente atualizado com sucesso',
      data: cliente,
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const { id } = params // ID do cliente

    try {
      const cliente = await Cliente.findOrFail(id)

      await Venda.query().where('id_cliente', id).delete()

      await cliente.delete()

      return response.status(200).send({
        message: 'Cliente e vendas associadas excluídos com sucesso.',
      })
    } catch (error) {
      console.error(error)

      return response.status(500).send({
        message: 'Erro ao excluir cliente e vendas associadas.',
        error: error.message,
      })
    }
  }
}
