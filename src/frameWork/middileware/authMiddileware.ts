/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../type/IuserSignUpResult";
import JwtToken from "../services/jwt";
import { config } from "../config/envConfig";
import { HttpStatusCode, Messages } from "../helpers/Enums";
import AuthRepository from "../../interFace/repositories/authRepositorie";

export const authorization =
  () =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.cookies, "is cookies");
    const userToken = req.cookies.User_AccessToken;
    console.log(userToken, "is the user Token");
    const jwt = new JwtToken(config.JWT_SECRET, config.JWT_REFRESH_SECRET);
    let decodeToken;

    try {
      decodeToken = jwt.verifyToken(userToken);

      if (!decodeToken) {
        return res.status(HttpStatusCode.Unauthorized).json({
          message: Messages.AuthenticatedError,
          result: {},
          status: false,
        });
      }

      if (decodeToken) {
        const userRepository = new AuthRepository();
        const existUser = await userRepository.getId(decodeToken.id);
        if (!existUser || existUser.block) {
          return res.status(HttpStatusCode.Unauthorized).json({
            message: !existUser ? Messages.UserNotFound : Messages.Block,
            result: {},
            status: false,
          });
        }
      }

      req.user = { id: decodeToken.id };
      next();
    } catch (error: any) {
      return res.status(HttpStatusCode.InternalServerError).json({
        message: error.message,
        result: {},
        status: false,
      });
    }
  };
