"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BetsSchema extends Schema {
  up() {
    this.create("bets", (table) => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table
        .integer("game_id")
        .unsigned()
        .references("id")
        .inTable("games")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table.float("price", 2).notNullable();
      table.string("numbers_selecteds").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("bets");
  }
}

module.exports = BetsSchema;
