"use strict";

class ForgotPassword {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      email: "required|email",
      redirect_url: "required",
    };
  }
}

module.exports = ForgotPassword;
