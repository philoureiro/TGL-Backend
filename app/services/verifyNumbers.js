"use strict";

class VerifyNumbersSelecteds {
  checkIfDuplicate = (array) => {
    return array.length !== new Set(array).size;
  };

  verifyNumbers = (cart, allTypesOfGames) => {
    const allIdsBD = allTypesOfGames.map((game) => game.id);

    const equalsNumbers = cart.filter((element) => {
      return this.checkIfDuplicate(element.numbers_selecteds.split(","));
    });

    let gamesInvalited = [];

    //separa todos os jogos válidos baseados em numeros não repetidos e id igual ao do banco
    allIdsBD.forEach((game, index) => {
      cart.forEach((bet) => {
        if (
          (!allIdsBD.includes(bet.id) || equalsNumbers.includes(bet)) &&
          !gamesInvalited.includes(bet)
        ) {
          gamesInvalited.push(bet);
        }
      });
    });

    return gamesInvalited;
  };
}

module.exports = VerifyNumbersSelecteds;
