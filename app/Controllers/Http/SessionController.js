"use strict";

const Token = use("App/Models/Token");
const User = use("App/Models/User");
class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.all();
    const currentToken = await auth.attempt(email, password);
    const user = await User.findBy("email", email);
    console.log(auth.uid);
    return { user, currentToken };
  }
}

module.exports = SessionController;
