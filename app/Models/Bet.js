'use strict'

const Model = use('Model')

class Bet extends Model {

  user(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Bet
