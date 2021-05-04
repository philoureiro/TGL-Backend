"use strict";

const Bet = use("App/Models/Bet");
const Token = use("App/Models/Token");
const jwt = require("jsonwebtoken");
class BetController {
  async store({ request, response }) {
    const data = request.only([
      "type",
      "price",
      "numbers_selecteds",
      "user_id",
    ]);

    try {
      const bet = await Bet.create(data);
      return bet;
    } catch (error) {
      console.log(error);
    }
  }

  async index() {
    const data = Bet.all();
    return data;
  }

  async show({ params }) {
    try {
      const { id } = params;
      const bet = Bet.findOrFail(id);
      return bet;
    } catch (error) {
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos essa aposta." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao deletar a aposta." });
    }
  }

  async update({ params, request, response }) {
    const { id } = params;
    try {
      const data = request.only(["type", "price", "numbers_selecteds"]);
      const bet = await Bet.findOrFail(id);
      bet.merge(data);
      bet.save();

      return bet;
    } catch (error) {
      console.log(error);
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos essa aposta." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao atualizar a aposta!" });
    }
  }

  async destroy({ params, response }) {
    const { id } = params;

    try {
      const bet = await Bet.findOrFail(id);

      bet.delete();
    } catch (error) {
      console.log(error);
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos essa aposta." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao excluir a aposta." });
    }
  }
}

module.exports = BetController;
