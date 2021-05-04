"use strict";
const Route = use("Route");

//Rotas de login
Route.post("sessions", "SessionController.store").validator("Session");
Route.post("forgotpassword", "ForgotPasswordController.store").validator(
  "ForgotPassword"
);
Route.put("forgotpassword", "ForgotPasswordController.update").validator(
  "ResetPassword"
);

// Rotas de usuarios
Route.post("users", "UserController.store").validator("User");
Route.put("users/:id", "UserController.update").validator("User");
Route.delete("users/:id", "UserController.destroy");
Route.get("users/:id", "UserController.show");
Route.get("users", "UserController.index");

//Rotas de game
Route.post("games", "GameController.store").validator("Game");
Route.put("games/:id", "GameController.update").validator("Game");
Route.get("games/:id", "GameController.show");
Route.get("games", "GameController.index");
Route.delete("games/:id", "GameController.destroy");

Route.group(() => {
  //rotas de apostas
  Route.post("bets", "BetController.store").validator("Bet");
  Route.put("bets/:id", "BetController.update").validator("Bet");
  Route.get("bets", "BetController.index");
  Route.get("bets/:id", "BetController.show");
  Route.delete("bets/:id", "BetController.destroy");

  //rotas de arquivos
  Route.post("/files", "FileController.store");
  Route.put("/files/:id", "FileController.update");
  Route.get("/files/:id", "FileController.show");
  Route.delete("/files/:id", "FileController.destroy");
}).middleware(["auth"]);
