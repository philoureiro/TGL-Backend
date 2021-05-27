"use strict";

const Bet = use("App/Models/Bet");
const Game = use("App/Models/Game");
const Mail = use("Mail");
const Database = use("Database");
const VerifyNumbersSelecteds = require("../../Services/verifyNumbers");
const dayjs = require("dayjs");

class BetController {
  async store({ request, response, auth }) {
    try {
      const data = request.only(["cart", "totalPrice"]);
      let allTypesOfGames = [];
      let allBets = [];

      const betsTypes = await Game.query().columns("id", "type").fetch();

      betsTypes.rows.forEach((element) => {
        allTypesOfGames.push({ id: element.id, type: element.type });
      });

      const verifyNumbers = new VerifyNumbersSelecteds();
      const gamesInvalited = verifyNumbers.verifyNumbers(
        data.cart,
        allTypesOfGames
      );

      gamesInvalited.length === 0
        ? data.cart.map((element) => {
            allBets.push({
              user_id: auth.user.id,
              game_id: element.id,
              price: element.price,
              numbers_selecteds: element.numbers_selecteds,
            });
          })
        : response.status(404).send({
            message:
              "Aposta com números repetidos ou tipos de jogos inválidos.",
            gamesInvalited,
          });

      if (allBets.length > 0) {
        const bets = await Bet.createMany(allBets);

        // formatando as apostas para envio do email para o usuario
        let betsForEmail = [];
        allTypesOfGames.forEach((game) => {
          data.cart.forEach((bet) => {
            if (game.id === bet.id) {
              betsForEmail.push({
                type: game.type,
                numbers_selecteds: bet.numbers_selecteds,
                price: bet.price,
              });
            }
          });
        });

        // formatando os dados e enviando o email para o usuario
        const dateFormated = dayjs(new Date()).format("DD/MM/YYYY");
        console.log(dateFormated);
        await Mail.send(
          ["emails.new_bet"],
          {
            name: auth.user.username,
            allBets: betsForEmail,
            date: dateFormated,
          },
          (message) => {
            message
              .to(auth.user.email)
              .from("teste@teste.com", "teste")
              .subject("Nova Aposta!");
          }
        );
        return bets;
      }
    } catch (error) {
      console.log(error);
      response.status(404).send({ message: "Erro ao criar aposta." });
    }
  }

  async index({ response, params, auth, request }) {
    try {
      const data = request.only(["filter"]);

      const filterGame =
        data.filter.length > 0 ? `and game_id in (${data.filter})` : "";

      const userBetsBD = await Database.raw(`select * from bets
              where user_id = ${auth.user.id}
              ${filterGame}`);

      return userBetsBD.rows;
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: "Erro recuperar bets!" } });
    }
  }

  async show({ params, response, auth }) {
    try {
      const { id } = params;

      const bets = await Bet.query()
        .where({ user_id: auth.user.id, id: id })
        .firstOrFail();

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

  async update({ params, request, response, auth }) {
    try {
      const { id } = params;
      const data = request.only(["id", "price", "numbers_selecteds"]);

      //busca todos os tipos de jogos do banco

      const betsTypes = await Game.query().columns("id").fetch();

      //filtra se existem jogos com o mesmo tipo do passado por parametro
      const idOfGame = betsTypes.rows.filter((bet) => {
        return bet.id === data.id;
      });

      if (idOfGame.length === 0) {
        return response.status(404).send({
          message: "Tipo de jogo não encontrado!",
        });
      }

      const verifyNumbers = new VerifyNumbersSelecteds();

      //checa se nao tem numero repetido e encontra o jogo salvo do usuario pelo id
      if (!verifyNumbers.checkIfDuplicate(data.numbers_selecteds.split(","))) {
        const userBets = await Bet.query()
          .where({ user_id: auth.user.id, id: id })
          .first();

        //checa se encontrou um jogo no banco, altera os dados e salva
        if (userBets !== null) {
          userBets.merge({
            user_id: auth.user.id,
            game_id: data.id,
            price: data.price,
            numbers_selecteds: data.numbers_selecteds,
          });

          userBets.save();
          return userBets;
        } else {
          return response.status(404).send({
            message: "Não existe aposta salva com esse id!",
          });
        }
      } else {
        return response.status(404).send({
          message: "Jogo com número repetido!",
        });
      }
    } catch (error) {
      console.log(error);
      response.status(404).send({ message: "Erro ao atualizar aposta." });
    }
  }

  async destroy({ params, response, auth }) {
    const { id } = params;

    try {
      const bet = await Bet.query()
        .where({ user_id: auth.user.id, id: id })
        .firstOrFail();

      await bet.delete();
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
