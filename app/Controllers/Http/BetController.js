"use strict";

const Bet = use("App/Models/Bet");
const Game = use("App/Models/Game");
const Token = use("App/Models/Token");

function verifyNumbersSelecteds(numbers_selecteds) {
  let filter = numbers_selecteds.filter(function (elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
  return filter.length === numbers_selecteds.length;
}
class BetController {
  async store({ request, response, auth }) {
    const data = request.only(["price", "numbers_selecteds", "type"]);

    try {
      if (verifyNumbersSelecteds(data.numbers_selecteds.split(","))) {
        const gameSelected = await Game.findBy("type", data.type);
        return gameSelected !== null
          ? await Bet.create({
              user_id: auth.user.id,
              game_id: gameSelected.id,
              price: data.price,
              numbers_selecteds: data.numbers_selecteds,
            })
          : response
              .status(404)
              .send({ message: "O tipo de jogo enviado não existe." });
      } else {
        response
          .status(404)
          .send({ message: "Existem números repetidos no jogo." });
      }
    } catch (error) {
      response.status(404).send({ message: "Erro ao criar aposta." });
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
