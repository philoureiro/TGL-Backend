"use strict";

class Bet {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      totalPrice: "required",
      cart: "required",
    };
  }
}

module.exports = Bet;
