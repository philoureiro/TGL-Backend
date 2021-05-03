"use strict";
const Route = use("Route");

//Rotas de login
Route.post("sessions", "SessionController.store");
Route.post("forgotpassword", "ForgotPasswordController.store");
Route.put("forgotpassword", "ForgotPasswordController.update");

// Rotas de usuarios
Route.post("users", "UserController.store");
Route.put("users/:id", "UserController.update");
Route.delete("users/:id", "UserController.destroy");
Route.get("users/:id", "UserController.show");
Route.get("users", "UserController.index");

//Rotas de game
Route.post("games", "GameController.store");
Route.get("games/:id", "GameController.show");
Route.get("games", "GameController.index");
Route.put("games/:id", "GameController.update");
Route.delete("games/:id", "GameController.destroy");

//rotas de apostas
Route.post("bets", "BetController.store");
Route.get("bets", "BetController.index");
Route.get("bets/:id", "BetController.show");
Route.put("bets/:id", "BetController.update");
Route.delete("bets/:id", "BetController.destroy");
