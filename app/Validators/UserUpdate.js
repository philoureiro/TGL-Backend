"use strict";

class User {
  get validateAll() {
    return true;
  }
  get rules() {
    const userId = this.ctx.params.id;
    return {
      // validation rules
      username: "required",
      email: `unique:users,email,id,${userId}`,
      password: "required|confirmed",
    };
  }
}

module.exports = User;
