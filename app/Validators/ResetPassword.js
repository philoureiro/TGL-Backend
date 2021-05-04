"use strict";

class ResetPassword {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules

      token: "required",
      password: "required|confirmed",
    };
  }
}

module.exports = ResetPassword;
