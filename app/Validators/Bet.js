"use strict";

class Bet {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      totalPrice: "required",
      cart: [
        {
          id: "required",
          price: "required",
          numbers_selecteds: "required",
        },
      ],
    };
  }
}

module.exports = Bet;
