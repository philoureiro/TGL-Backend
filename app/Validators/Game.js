"use strict";

class Game {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      type: "required",
      description: "required",
      price: "required",
      range: "required",
      max_number: "required",
      color: "required",
      min_cart_value: "required",
    };
  }
}

module.exports = Game;
