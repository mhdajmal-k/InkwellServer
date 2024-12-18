/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import IBlogRepository from "../../entities/Irepositories/IblogRepository";
import Blog from "../../frameWork/database/Schema/blogSchema";
import User from "../../frameWork/database/Schema/userSchema";
import {
  IBlog,
  IBlogOne,
  IProfferedBlog,
} from "../../frameWork/database/type/blogShemaType";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";

class BlogRepository implements IBlogRepository {
  async createBlog(
    author: string,
    content: string,
    title: string,
    category: string,
    image: string
  ): Promise<IBlog> {
    try {
      const newBlog = new Blog({
        author,
        content,
        title,
        category,
        image,
        publish: true,
      });
      await newBlog.save();
      return newBlog;
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
  async getAllBlogs(preference: string[]): Promise<IProfferedBlog[]> {
    try {
      const query: any = { publish: true };
      if (preference.length > 0) {
        query.category = { $in: preference };
      }
      const blogs = await Blog.find(query)
        .populate("author", "firstName lastName")
        .lean();
      console.log(blogs, "in the repo");
      return blogs as unknown as IProfferedBlog[];
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
  async getBlogPreference(id: string): Promise<string[]> {
    try {
      const preference = await User.findOne(
        { _id: id },
        { articlePreferences: 1 }
      );
      return preference?.articlePreferences as string[];
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
  async getAllUserBlogs(id: string): Promise<IBlog[]> {
    try {
      const blogs = await Blog.find({ author: id, publish: true });
      return blogs as IBlog[];
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
  async getOneBlog(id: string): Promise<IBlogOne | null> {
    try {
      console.log(id, "is the id from the repo");
      const blog = await Blog.findById({ _id: id, publish: true }).populate(
        "author",
        "firstName lastName"
      );
      return blog as IBlogOne | null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateBlogLike(id: string, userId: string): Promise<IBlogOne | null> {
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new CustomError("Blog not found", HttpStatusCode.NotFound);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const hasLiked = blog.likedBy.some(
        (likedUserId) => likedUserId.toString() === userObjectId.toString()
      );
      const hasDisliked = blog.dislikedBy.some(
        (dislikedUserId) =>
          dislikedUserId.toString() === userObjectId.toString()
      );

      if (hasLiked) {
        blog.likedBy = blog.likedBy.filter(
          (likedUserId) => likedUserId.toString() !== userObjectId.toString()
        );
        blog.likes = Math.max(0, blog.likes - 1);
      } else {
        if (hasDisliked) {
          blog.dislikedBy = blog.dislikedBy.filter(
            (dislikedUserId) =>
              dislikedUserId.toString() !== userObjectId.toString()
          );
          blog.dislikes = Math.max(0, blog.dislikes - 1);
        }

        blog.likedBy.push(userObjectId);
        blog.likes += 1;
      }

      await blog.save();
      return blog as any;
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
  async updateBlogDisLike(
    id: string,
    userId: string
  ): Promise<IBlogOne | null> {
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        throw new CustomError("Blog not found", HttpStatusCode.NotFound);
      }
      const userObjectId = new mongoose.Types.ObjectId(userId);

      if (blog.dislikedBy.includes(userObjectId)) {
        if (!blog) {
          throw new CustomError("Already Disliked", HttpStatusCode.NotFound);
        }
      }
      if (blog.likedBy.includes(userObjectId)) {
        blog.likedBy = blog.likedBy.filter((id) => id.toString() !== userId);
        blog.likes -= 1;
      }
      blog.dislikedBy.push(userObjectId);
      blog.dislikes += 1;
      await blog.save();
      return blog as any;
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
  async findBlogById(blogId: string): Promise<IBlog | null> {
    try {
      return await Blog.findById({ _id: blogId, publish: true });
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
  async updateBlog(
    blogId: string,
    updateData: {
      title?: string;
      content?: string;
      category?: string;
      image?: string;
    }
  ): Promise<IBlog> {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedBlog) {
        throw new CustomError("Blog not found", HttpStatusCode.NotFound);
      }

      return updatedBlog;
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(
          error.message || "An unexpected error occurred",
          HttpStatusCode.InternalServerError
        );
      }
      throw error;
    }
  }
  async deleteBlogs(id: string): Promise<boolean> {
    try {
      console.log("called in delete Blog");
      const deleteBlog = await Blog.findByIdAndUpdate(
        id,
        { publish: false },
        { new: true }
      );

      return !!deleteBlog;
    } catch (error) {
      if (error instanceof Error) {
        throw new CustomError(
          error.message || "An unexpected error occurred",
          HttpStatusCode.InternalServerError
        );
      }
      throw error;
    }
  }
}

export default BlogRepository;
