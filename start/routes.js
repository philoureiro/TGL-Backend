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
Route.post("users", "UserController.store").validator("UserCreate");

//rota de arquivo publica
Route.get("files/:filename", "FileController.show");

Route.group(() => {
  // Rotas de usuarios
  Route.put("users/:id", "UserController.update").validator("UserUpdate");
  Route.delete("users/:id", "UserController.destroy");
  Route.get("users/:id", "UserController.show");
  Route.get("users", "UserController.index");

  //Rotas de game
  Route.post("games", "GameController.store").validator("Game");
  Route.put("games/:id", "GameController.update").validator("Game");
  Route.get("games/:id", "GameController.show");
  Route.get("games", "GameController.index");
  Route.delete("games/:id", "GameController.destroy");

  //rotas de apostas
  Route.post("bets", "BetController.store").validator("Bet");
  Route.put("bets/:id", "BetController.update").validator("BetUpdate");
  Route.post("bets/filter/", "BetController.index");
  Route.get("bets/:id", "BetController.show");
  Route.delete("bets/:id", "BetController.destroy");

  //rotas de arquivos
  Route.post("/files", "FileController.store");
  Route.put("/files/:id", "FileController.update");
  Route.delete("/files/:id", "FileController.destroy");
  Route.get("/files/", "FileController.index");
}).middleware(["auth"]);
