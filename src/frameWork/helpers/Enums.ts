export enum Messages {
  UserAlreadyExists = "User already exists",
  UserLogOut = "Logout successful",
  FiledToCarteNewUser = "Filed To Carte NewUser",
  InvalidEmail = "Invalid Email",
  Block = "oops you have been blocked By Admin",
  IncorrectPassword = "Incorrect Password",
  AuthenticatedError = "Authorization denied. Invalid token",
  ProfileUpdate = "Profile updated SuccessFully",
  CreatedAccess = "Access token refreshed successfully.",
  MissingRefresh = "Bad Parameters - Refresh token missing.",
  UserNotFound = "Authorization denied. User does not exist.",
}

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}
