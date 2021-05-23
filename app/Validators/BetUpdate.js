"use strict";

class updateBet {
  get rules() {
    return {
      // validation rules
      id: "required",
      price: "required",
      numbers_selecteds: "required",
    };
  }
}

module.exports = updateBet;
