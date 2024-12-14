import iUserRepository from "../entities/Irepositories/IauthRepository";
import { iJwtService } from "../entities/Iservice/Ijwtservice";
import IUserAuthInteractor from "../entities/IuseCase/IAuthUser";
import { HttpStatusCode, MessageError } from "../frameWork/helpers/Enums";
import { CustomError } from "../frameWork/middileware/errorHandiler";
import { IUser } from "../frameWork/type/IuserSignUpResult";

class UserAuthInteractor implements IUserAuthInteractor {
  constructor(
    private readonly Repository: iUserRepository,
    private readonly jwt: iJwtService
  ) {}
  async userSingUp(user: IUser): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object | null;
  }> {
    try {
      const userAlreadyExist = await this.Repository.userAlreadyExist(
        user.email
      );
      if (userAlreadyExist) {
        throw new CustomError(
          MessageError.UserAlreadyExists,
          HttpStatusCode.Forbidden
        );
      }
      const creatingNewUser = await this.Repository.createUser(user);
      if (!creatingNewUser) {
        const error = new Error();
        error.message = "Failed to create new user";
        throw error;
      }
      const jwtToken = this.jwt.generateToken(creatingNewUser.id);
      const jwtRefreshToken = this.jwt.generateRefreshToken(creatingNewUser.id);
      return {
        status: true,
        message: "OTP verified successfully",
        statusCode: HttpStatusCode.Created,
        result: {
          user: creatingNewUser.userName,
          tokenJwt: jwtToken,
          jwtRefreshToken: jwtRefreshToken,
        },
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }
}

export default UserAuthInteractor;
