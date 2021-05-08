"use strict";

class updateBet {
  get rules() {
    return {
      // validation rules
      type: "required",
      price: "required",
      numbers_selecteds: "required",
    };
  }
}

module.exports = updateBet;
