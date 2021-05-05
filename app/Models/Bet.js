"use strict";

const Model = use("Model");

class Bet extends Model {
  user() {
    return this.belongsTo("App/Models/User");
  }

  games() {
    return this.belongsTo("App/Models/Game");
  }
}

module.exports = Bet;
