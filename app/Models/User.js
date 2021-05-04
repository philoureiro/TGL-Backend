"use strict";

const Model = use("Model");
const Hash = use("Hash");

class User extends Model {
  static get hidden() {
    return [
      "password",
      "token",
      "token_created_at",
      "created_at",
      "updated_at",
    ];
  }
  static boot() {
    super.boot();

    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }
}

module.exports = User;
