"use strict";

class Bet {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      user_id: "required",
      type: "required",
      price: "required",
      numbers_selecteds: "required",
    };
  }
}

module.exports = Bet;
