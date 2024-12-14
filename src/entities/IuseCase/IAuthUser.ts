import { IUser } from "../../frameWork/database/type/userSchemaType";

interface IUserAuthInteractor {
  userSingUp(
    user: IUser
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: object | null;
  }>;
}

export default IUserAuthInteractor;
