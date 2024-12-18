import iUserRepository from "../../entities/Irepositories/IauthRepository";
import User from "../../frameWork/database/Schema/userSchema";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { hashPassword } from "../../frameWork/helpers/passwordHelpers";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { IUser, IUserProfile } from "../../frameWork/type/IuserSignUpResult";

class AuthRepository implements iUserRepository {
  async userAlreadyExist(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email }).lean();
    return !!user;
  }
  async createUser(data: IUser): Promise<IUser> {
    try {
      const hashedPassword = hashPassword(data.password);
      const newUser = new User({
        lastName: data.lastName,
        email: data.email,
        firstName: data.firstName,
        phone: data.phone ?? "",
        dob: data.dob,
        articlePreferences: data.articlePreferences,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      return savedUser as IUser;
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
  async validUser(email: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email: email }).lean();
      return user as IUser;
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
  async getId(id: string): Promise<IUser> {
    try {
      const user = await User.findById({ _id: id }).lean();
      return user as IUser;
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
  async getIdAndUpdate(
    id: string | undefined,
    data: IUserProfile
  ): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).lean();
      return user as IUser;
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
