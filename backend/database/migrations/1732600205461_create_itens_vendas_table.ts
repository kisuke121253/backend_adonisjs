import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'itens_vendas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('id_venda').unsigned().references('vendas.id').onDelete('CASCADE')
      table.integer('id_produto').unsigned().references('produtos.id').onDelete('CASCADE')
      table.float('quantidade')
      table.float('preco_unitario')
      table.float('preco_total_item')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
