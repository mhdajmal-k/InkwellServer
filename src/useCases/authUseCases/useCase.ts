/* eslint-disable @typescript-eslint/no-unused-vars */
import iUserRepository from "../../entities/Irepositories/IauthRepository";
import { iJwtService } from "../../entities/Iservice/Ijwtservice";
import IUserAuthInteractor from "../../entities/IuseCase/IAuthUser";
import { HttpStatusCode, MessageError } from "../../frameWork/helpers/Enums";
import { comparePassword } from "../../frameWork/helpers/passwordHelpers";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import IUserResult, {
  IUser,
  IUserLogin,
  IUserProfile,
} from "../../frameWork/type/IuserSignUpResult";

class UserAuthInteractor implements IUserAuthInteractor {
  constructor(
    private readonly Repository: iUserRepository,
    private readonly jwt: iJwtService
  ) {}
  async userSingUp(user: IUser): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IUserResult | null;
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
        throw new CustomError(
          MessageError.FiledToCarteNewUser,
          HttpStatusCode.Forbidden
        );
      }
      const jwtToken = this.jwt.generateToken(creatingNewUser.id);
      const jwtRefreshToken = this.jwt.generateRefreshToken(creatingNewUser.id);
      return {
        status: true,
        message: `Signup successful! Welcome, ${creatingNewUser.firstName}.`,
        statusCode: HttpStatusCode.Created,
        result: {
          user: creatingNewUser?.firstName,
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
  async userLogin(user: IUserLogin): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object | null;
  }> {
    try {
      const validUser = await this.Repository.validUser(user.email);
      if (!validUser) {
        throw new CustomError(
          MessageError.InvalidEmail,
          HttpStatusCode.Forbidden
        );
      }
      if (validUser.block) {
        throw new CustomError(MessageError.Block, HttpStatusCode.Unauthorized);
      }
      const validPassword = comparePassword(user.password, validUser.password);
      if (!validPassword) {
        throw new CustomError(
          MessageError.IncorrectPassword,
          HttpStatusCode.Forbidden
        );
      }
      const jwtAccessToken = this.jwt.generateToken(String(validUser._id));
      const jwtRefreshToken = this.jwt.generateRefreshToken(
        String(validUser.id)
      );
      return {
        status: true,
        message: `Welcome Back, ${validUser.firstName}.`,
        statusCode: HttpStatusCode.Created,
        result: {
          user: validUser?.firstName,
          tokenJwt: jwtAccessToken,
          jwtRefreshToken: jwtRefreshToken,
        },
      };
    } catch (error) {
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
  async userProfileData(id: string | undefined): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any;
  }> {
    try {
      const userData = await this.Repository.getId(id);
      const { password, ...withOutUserData } = userData;
      return {
        statusCode: HttpStatusCode.OK,
        status: true,
        message: "",
        result: withOutUserData,
      };
    } catch (error) {
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
  async updateProfileData(
    id: string,
    user: IUserProfile
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object;
  }> {
    try {
      const userData = await this.Repository.getIdAndUpdate(id, user);
      const { password, ...withOutUserData } = userData;
      return {
        statusCode: HttpStatusCode.OK,
        status: true,
        message: "Profile updated SuccessFully",
        result: withOutUserData,
      };
    } catch (error) {
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
