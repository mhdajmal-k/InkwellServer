import { Schema, model } from "mongoose";
import { IUser } from "../type/userSchemaType";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
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
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
    },
    articlePreferences: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
