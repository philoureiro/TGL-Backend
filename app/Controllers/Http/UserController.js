'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({request}){
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
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
}

module.exports = UserController
