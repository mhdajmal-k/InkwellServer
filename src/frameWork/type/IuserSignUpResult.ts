import { Document } from "mongoose";
export default interface IUserResult {
  user: {
    userName: string;
    email: string;
    block: boolean;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  tokenJwt: string | "";
  jwtRefreshToken: string | null;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  phoneNumber?: number;
  password: string;
  profilePicture?: string;
  block?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
