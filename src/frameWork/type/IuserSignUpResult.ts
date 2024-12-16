import { Document } from "mongoose";
import { Request } from "express";
export default interface IUserResult {
  user: string;
  tokenJwt: string | "";
  jwtRefreshToken: string | null;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  profilePicture?: string;
  dob: Date;
  articlePreferences: string[];
  block?: boolean;
}

export interface IUserProfile extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // password: string;
  profilePicture?: string;
  dob: Date;
  articlePreferences?: string[];
  block?: boolean;
}
export interface IUserLogin extends Document {
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
