import {
  IUser,
  IUserLogin,
  IUserProfile,
} from "../../frameWork/type/IuserSignUpResult";

interface IUserAuthInteractor {
  userSingUp(user: IUser): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object | null;
  }>;
  userLogin(user: IUserLogin): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object | null;
  }>;
  userProfileData(id: string | undefined): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object;
  }>;
  updateProfileData(
    id: string,
    user: IUserProfile
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object;
  }>;
}

export default IUserAuthInteractor;
