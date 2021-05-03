'use strict'

const Schema = use('Schema')

class BetSchema extends Schema {
  up () {
    this.table('bets', (table) => {
      table.dropColumn('type_of_game')
      table.string('type')

      // alter table
    })
  }

  down () {
    this.table('bets', (table) => {
      // reverse alternations

      table.dropColumn('type')
      table.string('type_of_game')
    })
  }
}

module.exports = BetSchema
