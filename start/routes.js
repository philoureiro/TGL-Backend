'use strict'
const Route = use('Route')

// Rotas de usuarios
Route.post('users', 'UserController.store')
Route.put('users/:id', 'UserController.update')
Route.delete('users/:id', 'UserController.destroy')

//Rotas de login
Route.post('sessions', 'SessionController.store')
Route.post('forgotpassword', 'ForgotPasswordController.store' )
Route.put('forgotpassword', 'ForgotPasswordController.update' )


//Rotas de game
Route.post('games', 'GameController.store')
Route.get('games/:id','GameController.show')
Route.get('games','GameController.index')
