import { Schema, model } from "mongoose";
import { IUser } from "../type/userSchemaType";

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
