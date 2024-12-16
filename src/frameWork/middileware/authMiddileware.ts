import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../type/IuserSignUpResult";
import JwtToken from "../services/jwt";
import { config } from "../config/envConfig";
import { HttpStatusCode, MessageError } from "../helpers/Enums";
import AuthRepository from "../../interFace/repositories/authRepositorie";

export const authorization =
  () =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("in here ");
    const userToken = req.cookies.User_AccessToken;
    console.log(userToken, "is the user Token");
    const jwt = new JwtToken(config.JWT_SECRET, config.JWT_REFRESH_SECRET);
    let decodeToken;

    try {
      decodeToken = jwt.verifyToken(userToken);
      console.log(decodeToken, "is the decoded Token");

      if (!decodeToken) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: MessageError.AuthenticatedError,
          result: {},
          status: false,
        });
      }

      if (decodeToken) {
        const userRepository = new AuthRepository();
        const existUser = await userRepository.getId(decodeToken.id);
        if (!existUser || existUser.block) {
          return res.status(HttpStatusCode.Unauthorized).json({
            message: !existUser
              ? "Authorization denied. User does not exist."
              : "OOPS YOU HAVE BEEN BLOCKED BY ADMIN",
            result: {},
            status: false,
          });
        }
      }

      req.user = { id: decodeToken.id };
      next();
    } catch (error) {
      console.error("Authorization Error:", error);
      return res.status(HttpStatusCode.InternalServerError).json({
        message: "Authorization failed due to server error.",
        result: {},
        status: false,
      });
    }
  };
