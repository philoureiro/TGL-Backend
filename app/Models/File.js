"use strict";

const Env = use("Env");
const Model = use("Model");

class File extends Model {
  static get computed() {
    return ["url"];
  }
  getUrl({ filename }) {
    return `${Env.get("APP_URL")}/files/${filename}`;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = File;
