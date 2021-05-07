"use strict";

const User = use("App/Models/User");
const Mail = use("Mail");

class UserController {
  async store({ request, response, auth }) {
    const data = request.only(["username", "email", "password"]);

    try {
      const user = await User.create(data);

      // enviando o email para o usuario
      await Mail.send(
        ["emails.new_user"],
        { name: data.username },
        (message) => {
          message
            .to(data.email)
            .from("teste@teste.com", "teste")
            .subject("Novo usuário!");
        }
      );

      return user;
    } catch (error) {
      console.log(error);
      response
        .status(404)
        .send({ message: "Não foi possível criar o usuário!" });
    }
  }

  async update({ request, response, params }) {
    const data = request.only(["username", "email", "password"]);
    const { id } = params;

    try {
      const user = await User.findOrFail(id);

      user.merge(data);
      await user.save();

      return user;
    } catch (error) {
      return error.message.includes("Cannot find database")
        ? response.status(404).send({ message: "Não encontramos o usuário!" })
        : response
            .status(404)
            .send({ message: "Não foi possível atualizar o usuário!" });
    }
  }

  async destroy({ request, response, params }) {
    const { id } = params;
    const user = await User.findOrFail(id);
    await user.delete();
    return id;
  }

  async show({ params, response }) {
    const { id } = params;

    const user = await User.findOrFail(id);
    return user;
  }

  async index({ response }) {
    const users = await User.all();
    return users;
  }
}

module.exports = UserController;
