"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokenSchema extends Schema {
  up() {
    this.table("tokens", (table) => {
      // alter table
      table.dropColumn("is_revoked");
    });
  }

  down() {
    this.table("tokens", (table) => {
      // reverse alternations
      table.boolean("is_revoked").defaultTo(false);
    });
  }
}

module.exports = TokenSchema;
