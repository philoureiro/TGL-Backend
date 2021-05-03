'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({request, response}){
    const data = request.only(['username', 'email', 'password'])
    try {
      const user = await User.create(data)

      return user

    } catch (error) {
      return error.message.includes('duplicate key value violates unique constraint') ? response.status(404).send({message: 'Já existe um usuário cadastrado com esse email.'}) :
      response.send({message: 'Não foi possível criar o usuário'})

    }

  }

  async update ({request, response, params}){
    const data = request.only(['username', 'email', 'password'])
    const {id} = params

    try {
      const user = await User.findOrFail(id)

      user.merge(data)
      await user.save()

      return user

    } catch (error) {
      return error.message.includes('Cannot find database') ? response.status(404).send({message: 'Não encontramos o usuário!'}) :
         response.status(404).send({message: 'Não foi possível atualizar o usuário!'})
    }

  }

  async destroy ({request, response, params}){
    const {id} = params

    try {
      const user =  await User.findOrFail(id)
      await user.delete()
      return id

    } catch (error) {
      console.log(error.message)
      if(error.message.includes('Cannot find database')){
        return response.status(404).send({message: 'O usuário não existe!'})
      }
      return response.status(404).send({message: 'Não foi possível deletar o usuário!'})
    }
  }

  async show({params, response}){
    const {id} = params;

    try {
      const user = await User.findOrFail(id);
      return user;
    } catch (error) {
      return error.message.includes('Cannot find database') ? response.status(404).send({message: 'Usuário inexistente.'}) :
      response.status(404).send({message: 'Não encontramos o usuário.'})
    }
  }


  async index({response}){

    try {
      const users = await User.all()
      return users;
    } catch (error) {
      return error.message.includes('Cannot find database') ? response.status(404).send({message: 'Usuário inexistente.'}) :
      response.status(404).send({message: 'Não encontramos o usuário.'})
    }
  }
}

module.exports = UserController
