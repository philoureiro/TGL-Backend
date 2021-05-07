"use strict";

const Bet = use("App/Models/Bet");
const Game = use("App/Models/Game");
const Mail = use("Mail");

function verifyNumbersSelectedsAndTypesOfGame(cart, allTypesOfGames) {
  //verifica se tem algum numero repetido nas apostas,
  //e filtra todos os numeros repetidos por jogo
  const equalsNumbers = cart.map((element) => {
    return element.numbers_selecteds
      .split(",")
      .filter(function (elem, index, arr) {
        return arr.indexOf(elem) !== index;
      });
  });

  //verifica se existem todos os tipos de jogos no banco de dados,
  //verifica se existe dentro algo dentro do array de numeros repetidos
  //e filtra todos os jogos que não satisfazem ambas as regras
  const gamesNotRegistered = cart.filter((element, index) => {
    return (
      !allTypesOfGames.includes(element.type) ||
      equalsNumbers[index].length !== 0
    );
  });

  return gamesNotRegistered;
}
class BetController {
  async store({ request, response, auth }) {
    try {
      const data = request.only(["cart", "totalPrice"]);
      let allTypesOfGames = [];
      let allBets = [];

      const betsTypes = await Game.query().columns("type").fetch();

      betsTypes.rows.map((element) => {
        allTypesOfGames.push(element.type);
      });

      const unauthorizedGames = verifyNumbersSelectedsAndTypesOfGame(
        data.cart,
        allTypesOfGames
      );

      unauthorizedGames.length === 0
        ? data.cart.map((element) => {
            allBets.push({
              user_id: auth.user.id,
              type: element.type,
              price: element.price,
              numbers_selecteds: element.numbers_selecteds,
            });
          })
        : response.status(404).send({
            message:
              "Aposta com números repetidos ou tipos de jogos inválidos.",
            unauthorizedGames,
          });

      if (allBets.length > 0) {
        const bets = await Bet.createMany(allBets);

        // formatando a data enviando o email para o usuario
        const date = new Date();
        const dateFormated =
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear();

        await Mail.send(
          ["emails.new_bet"],
          { name: auth.user.username, allBets: allBets, date: dateFormated },
          (message) => {
            message
              .to(auth.user.email)
              .from("teste@teste.com", "teste")
              .subject("Novo usuário!");
          }
        );
        return bets;
      }
    } catch (error) {
      console.log(error);
      response.status(404).send({ message: "Erro ao criar aposta." });
    }
  }

  async index({ response, params, auth }) {
    try {
      const filterOfBets = params.params.split("=");
      console.log(filterOfBets);

      const bets = await Bet.query().where({ user_id: auth.user.id }).fetch();

      //buscar todos os campos que coincidirem com o usuario e pelo menos um dos
      //paramentros caso tenha paramentros

      return bets;
    } catch (error) {
      return response;
      console
        .log(error)
        .status(error.status)
        .send({ error: { message: "Erro recuperar bets!" } });
    }
  }

  async show({ params, response, auth }) {
    try {
      const { id } = params;

      const bets = await Bet.query()
        .where({ user_id: auth.user.id, id: id })
        .fetch();

      return bets;
    } catch (error) {
      console.log(error);
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos essa aposta." })
        : response
            .status(404)
            .send({ message: "Algo deu errado ao encontrar a aposta." });
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
