"use strict";

const Bet = use("App/Models/Bet");
const Game = use("App/Models/Game");
const Mail = use("Mail");

const verifyNumbersSelectedsAndTypesOfGame = (cart, allTypesOfGames) => {
  //verifica se tem algum numero repetido nas apostas,
  //e filtra todos os numeros repetidos por jogo
  const equalsNumbers = cart.map((element) => {
    return element.numbers_selecteds
      .split(",")
      .filter(function (elem, index, arr) {
        return arr.indexOf(elem) !== index;
      });
  });

  let gamesValidated = [];
  let gamesInvalited = [];

  //separa todos os jogos válidos baseados em numeros não repetidos e id igual ao do banco
  cart.forEach((bet, index) => {
    allTypesOfGames.forEach((game) => {
      if (bet.id === game.id && equalsNumbers[index].length === 0) {
        gamesValidated.push(bet);
      }
    });
  });

  //separa todos os jogos não válidos baseado nos jogos válidos
  cart.forEach((bet) => {
    gamesValidated.forEach((game) => {
      if (!gamesValidated.includes(bet)) {
        gamesInvalited.push(bet);
      }
    });
  });

  return gamesInvalited;
};
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

      const gamesInvalited = verifyNumbersSelectedsAndTypesOfGame(
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
      let allBetsFiltereds = [];
      // console.log("filter", data.filter);
      const userBets = await Bet.query()
        .where({ user_id: auth.user.id })
        .fetch();

      if (data.filter.length === 0) {
        return userBets.rows;
      } else {
        //verifica se existe jogos salvos com o mesmo tipo e salva no vetor
        userBets.rows.forEach((bet) => {
          data.filter.forEach((params) => {
            console.log("params", params);
            if (bet.game_id === params) {
              allBetsFiltereds.push(bet);
            }
          });
        });

        return allBetsFiltereds;
      }
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
      console.log(id);
      console.log(auth.user.id);

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

      const checkIfDuplicate = (array) => {
        return array.length !== new Set(array).size;
      };

      //checa se nao tem numero repetido e encontra o jogo salvo do usuario pelo id
      if (!checkIfDuplicate(data.numbers_selecteds.split(","))) {
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
        .fetch();

      bet.rows[0].delete();
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
