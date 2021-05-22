class verifyNumbersSelecteds {
  verifyNumbersSelectedsAndTypesOfGame(cart, allTypesOfGames) {
    //verifica se tem algum numero repetido nas apostas,
    //e filtra todos os numeros repetidos por jogo
    console.log("verify", cart);
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
}

module.exports = verifyNumbersSelecteds;
