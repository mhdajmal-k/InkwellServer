import mongoose, { Document, Schema } from "mongoose";
export interface IBlog extends mongoose.Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  image: string;
  likes: number;
  dislikes: number;
  publish: boolean;
  likedBy: mongoose.Types.ObjectId[];
  dislikedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface IProfferedBlog extends Document {
  title: string;
  content: string;
  author: { _id: string; firstName: string; lastName: string };
  category: string;
  image: string;
  publish: boolean;
  likes?: number;
  dislikes?: number;
  likedBy: [{ type: Schema.Types.ObjectId; ref: "User" }];
  dislikedBy: [{ type: Schema.Types.ObjectId; ref: "User" }];
  createdAt: Date;
  updatedAt?: Date;
}
export interface IBlogOne extends Document {
  title: string;
  content: string;
  author: { _id: string; firstName: string; lastName: string };
  category: string;
  likes?: number;
  dislikes?: number;
  image: string;
  likedBy: [{ type: Schema.Types.ObjectId; ref: "User" }];
  dislikedBy: [{ type: Schema.Types.ObjectId; ref: "User" }];
  publish?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
