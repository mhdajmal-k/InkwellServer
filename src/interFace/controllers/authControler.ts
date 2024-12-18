import IUserAuthInteractor from "../../entities/IuseCase/IAuthUser";
import { NextFunction, Request, Response } from "express";
import IUserResult, {
  AuthenticatedRequest,
  IUser,
} from "../../frameWork/type/IuserSignUpResult";
import { HttpStatusCode, MessageError } from "../../frameWork/helpers/Enums";

class AuthController {
  constructor(private AuthInteractor: IUserAuthInteractor) {}
  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userDat = req.body;
      const response = await this.AuthInteractor.userSingUp(userDat);
      if (response.status) {
        const data = response.result as IUserResult;
        res.cookie("User_AccessToken", data.tokenJwt, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 20 * 60 * 1000,
        });
        res.cookie("User_RefreshToken", data.jwtRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: response.result,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async singIN(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("in here called");
      const userDat = req.body;
      const response = await this.AuthInteractor.userLogin(userDat);
      if (response.status) {
        const data = response.result as IUserResult;
        res.cookie("User_AccessToken", data.tokenJwt, {
          httpOnly: true,
          sameSite: "none",
          maxAge: 20 * 60 * 1000,
        });
        res.cookie("User_RefreshToken", data.jwtRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: response.result,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getProfileData(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("called");
      const userId = req.user?.id;

      const response = await this.AuthInteractor.userProfileData(userId);
      if (response.status) {
        const data = response.result as IUser;
        console.log(response, "is the final response");
        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: data,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updateProfileData(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const data = req.body;

      const response = await this.AuthInteractor.updateProfileData(
        String(userId),
        data
      );
      if (response.status) {
        const data = response.result as IUser;

        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: data,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("User_AccessToken");
      res.clearCookie("User_RefreshToken");
      res.status(HttpStatusCode.OK).json({
        status: true,
        message: MessageError.UserLogOut,
        result: {},
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
