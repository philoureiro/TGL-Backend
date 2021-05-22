"use strict";

class User {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      username: "required",
      email: "required|email|unique:users",
      password: "required",
    };
  }
}

module.exports = User;
