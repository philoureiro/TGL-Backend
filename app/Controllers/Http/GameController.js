"use strict";

const Game = use("App/Models/Game");

class GameController {
  async store({ request }) {
    const data = request.only([
      "type",
      "description",
      "price",
      "range",
      "max_number",
      "color",
      "min_cart_value",
    ]);

    const game = await Game.create(data);

    return game;
  }

  async index() {
    const games = await Game.all();
    return games;
  }

  async show({ params }) {
    const { id } = params;
    const game = await Game.findOrFail(id);

    return game;
  }

  async update({ params, request, response }) {
    const data = request.only([
      "type",
      "description",
      "price",
      "range",
      "max_number",
      "color",
      "min_cart_value",
    ]);

    const { id } = params;

    try {
      const game = await Game.findOrFail(id);
      game.merge(data);
      game.save();
      return game;
    } catch (error) {
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos esse jogo." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao atualizar o game." });
    }
  }

  async destroy({ params, request, response }) {
    const { id } = params;

    try {
      const game = await Game.findOrFail(id);
      game.delete();
    } catch (error) {
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos esse jogo." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao deletar o game." });
    }
  }
}

module.exports = GameController;
