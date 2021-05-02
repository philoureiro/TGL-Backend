'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameSchema extends Schema {
  up () {
    this.table('games', (table) => {
      // alter table
      table.dropColumn('type_of_game')
      table.string('type').notNullable()
    })
  }

  down () {
    this.table('games', (table) => {
      // reverse alternations
      table.string('type_of_game').notNullable()
      table.dropColumn('type')
    })
  }
}

module.exports = GameSchema
