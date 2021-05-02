'use strict'

const Game = use('App/Models/Game')

class GameController {


  async store ({ request}) {
    const data = request.only(['type', 'description', 'price', 'range', 'max_number', 'color', 'min_cart_value'])

    const game = await Game.create(data);

    return game;

  }

  async show ({ params}){
    const{id} = params;
   const game = await Game.findOrFail(id)

    return game;
  }

  async index(){
    const games = await Game.all()
    return games
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = GameController
