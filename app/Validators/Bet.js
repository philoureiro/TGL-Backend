"use strict";

class Bet {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      type: "required",
      price: "required",
      numbers_selecteds: "required",
    };
  }
}

module.exports = Bet;
