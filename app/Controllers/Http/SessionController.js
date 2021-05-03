"use strict";

const Token = use("App/Models/Token");
const User = use("App/Models/User");
class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.all();

    try {
      const currentToken = await auth.attempt(email, password);
      const user = await User.findByOrFail("email", email);

      const dataLogin = {
        user_id: user.id,
        token: currentToken.token,
        type: currentToken.type,
      };

      const token = await Token.findByOrFail("type", "bearer");
      console.log(token);

      return currentToken;
    } catch (error) {
      if (error.message.includes("Cannot find database row ")) {
        await Token.create(dataLogin);
      }

      console.log(error);
    }
  }
}

// const searchPayload = { type: "bearer" };
// const persistancePayload = {
//   user_id: user.id,
//   token: currentToken.token,
//   type: currentToken.type,
// };

// const token = await Token.firstOrCreate(
//   searchPayload,
//   persistancePayload
// );
//Token.save();

//  token.delete();
//console.log(user.email);

// const currentToken = await Token.create();

// console.log(currentToken);
// data.save();
// // const data = {
// //   type: token.type,
// //   token: token.token,

// // }
// {
//   "type": "bearer",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImlhdCI6MTYyMDA2NTExMn0.4m6-0q8-TQ1xAwebXph9sLt3FRGZgRgltDm7TUIRleE",
//   "refreshToken": null
// }

//     id
// user_id
// token
// type
// is_revoked
// created_at
// updated_at

// const data  = {
//  token: token.
// }

module.exports = SessionController;
