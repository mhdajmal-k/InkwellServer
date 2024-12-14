// import { Types } from "mongoose";

import { IUser } from "../../frameWork/type/IuserSignUpResult";

interface iUserRepository {
  userAlreadyExist(email: string): Promise<boolean>;
  createUser(data: IUser): Promise<IUser>;
  //   createUserFromGoogle(data: object): Promise<any>;
  //   validUser(email: string): Promise<any>;
  //   getId(id: string): Promise<Types.ObjectId | null | any>;
}

export default iUserRepository;
