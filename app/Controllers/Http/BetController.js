"use strict";

const Bet = use("App/Models/Bet");
const Game = use("App/Models/Game");
const Mail = use("Mail");

function verifyNumbersSelectedsAndTypesOfGame(cart, allTypesOfGames) {
  //verifica se tem algum numero repetido nas apostas,
  //e filtra todos os numeros repetidos por jogo
  console.log(cart);
  const equalsNumbers = cart.map((element) => {
    return element.numbersSelecteds
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
              numbers_selecteds: element.numbersSelecteds,
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
        userBets.rows.map((bet) => {
          data.filter.map((params) => {
            console.log("params", params);
            if (bet.type === params) {
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
      const data = request.only(["type", "price", "numbers_selecteds"]);

      //busca todos os tipos de jogos do banco
      let typeOfGame = [];
      const betsTypes = await Game.query().columns("type").fetch();

      //filtra se existem jogos com o mesmo tipo do passado por parametro
      typeOfGame = betsTypes.rows.filter((bet) => {
        return bet.type === data.type;
      });

      if (typeOfGame.length === 0) {
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
          .fetch();

        //checa se encontrou um jogo no banco, altera os dados e salva
        if (userBets.rows.length > 0) {
          userBets.rows[0].merge({
            user_id: auth.user.id,
            type: data.type,
            price: data.price,
            numbers_selecteds: data.numbers_selecteds,
          });

          userBets.rows[0].save();
          return userBets.rows[0];
        } else {
          return response.status(404).send({
            message: "Não existe jogo com esse id!",
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
