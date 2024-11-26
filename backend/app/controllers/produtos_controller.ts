import type { HttpContext } from '@adonisjs/core/http'

import Produto from '#models/produto'

export default class ProdutosController {
  public async store({ request, response }: HttpContext) {
    const body = request.body()

    const produto = await Produto.create(body)

    response.status(201)

    return {
      message: 'produto criado com sucesso',
      data: produto,
    }
  }

  public async index() {
    const produto = await Produto.query()
      .select('id', 'nome', 'descricao', 'preco')
      .orderBy('nome', 'asc')
    return {
      data: produto,
    }
  }

  public async show({ params }: HttpContext) {
    const { id } = params

    const produto = await Produto.findOrFail(id)

    return {
      data: {
        produto: {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade_estoque: produto.quantidade_estoque,
        },
      },
    }
  }

  public async update({ params, request }: HttpContext) {
    const body = request.body()

    const produto = await Produto.findOrFail(params.id)

    produto.nome = body.nome
    produto.descricao = body.descricao
    produto.preco = body.preco
    produto.quantidade_estoque = body.quantidade_estoque

    await produto.save()

    return {
      message: 'produto atualizado com sucesso',
      data: produto,
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const { id } = params // ID do cliente

    try {
      const produto = await Produto.findOrFail(id)

      await produto.delete()

      return response.status(200).send({
        message: 'produtos excluídos com sucesso.',
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
