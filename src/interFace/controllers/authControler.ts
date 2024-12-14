import IUserAuthInteractor from "../../entities/IuseCase/IAuthUser";
import { NextFunction, Request, Response } from "express";
import IUserResult from "../../frameWork/type/IuserSignUpResult";

class AuthController {
  constructor(private AuthInteractor: IUserAuthInteractor) {}
  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
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
        const token = data.tokenJwt;
        const userName = data.user.userName;
        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: { token, userName },
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
