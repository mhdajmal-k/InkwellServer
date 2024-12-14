import iUserRepository from "../../entities/Irepositories/IauthRepository";
import User from "../../frameWork/database/Schema/userSchema";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { hashPassword } from "../../frameWork/helpers/passwordHelpers";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { IUser } from "../../frameWork/type/IuserSignUpResult";

class AuthRepository implements iUserRepository {
  async userAlreadyExist(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email }).lean();
    return !!user;
  }
  async createUser(data: IUser): Promise<IUser> {
    try {
      const hashedPassword = hashPassword(data.password);
      const newUser = new User({
        userName: data.userName,
        email: data.email,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(
          error.message || "An unexpected error occurred",
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }
}

export default AuthRepository;
