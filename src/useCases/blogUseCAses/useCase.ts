import IBlogRepository from "../../entities/Irepositories/IblogRepository";
import IBlogInteractor from "../../entities/IuseCase/IBlog";
import {
  IBlog,
  IBlogOne,
  IProfferedBlog,
} from "../../frameWork/database/type/blogShemaType";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";

class BlogInteractor implements IBlogInteractor {
  constructor(private readonly Repository: IBlogRepository) {}

  async createBlog(
    title: string,
    content: string,
    author: string,
    category: string,
    imageUrl: string
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlog;
  }> {
    try {
      const createBlog = await this.Repository.createBlog(
        author,
        content,
        title,
        category,
        imageUrl as string
      );
      return {
        status: true,
        statusCode: HttpStatusCode.Created,
        message: "blog Created",
        result: createBlog,
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }

  async getBlogs(userId: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: { blogs: IProfferedBlog[]; preferences: string[] };
  }> {
    try {
      const preference = await this.Repository.getBlogPreference(userId);
      const preferredBlogs = await this.Repository.getAllBlogs(preference);
      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "",
        result: {
          blogs: preferredBlogs,
          preferences: preference,
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }
  async getUserBlogs(userId?: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: { blogs: IBlog[] };
  }> {
    try {
      const Blogs = await this.Repository.getAllUserBlogs(String(userId));

      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "",
        result: {
          blogs: Blogs,
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }
  async getOneBlogById(id: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }> {
    try {
      const blog = await this.Repository.getOneBlog(id);

      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "",
        result: blog as IBlogOne,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async changeBlogLikeById(
    id: string,
    usrId: string
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }> {
    try {
      const likeBlog = await this.Repository.updateBlogLike(id, usrId);
      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "",
        result: likeBlog as IBlogOne,
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
          HttpStatusCode.InternalServerError
        );
      } else {
        throw error;
      }
    }
  }
  async changeBlogDisLikeById(
    id: string,
    userId: string
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }> {
    try {
      const likeBlog = await this.Repository.updateBlogDisLike(id, userId);
      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "",
        result: likeBlog as IBlogOne,
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw new CustomError(
          error.message,
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
      author: string;
      category?: string;
      image?: string;
    }
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlog;
  }> {
    try {
      const existingBlog = await this.Repository.findBlogById(blogId);

      if (!existingBlog) {
        throw new CustomError("Blog not found", HttpStatusCode.NotFound);
      }
      if (existingBlog.author.toString() !== updateData.author) {
        throw new CustomError(
          "Unauthorized to edit this blog",
          HttpStatusCode.Forbidden
        );
      }

      // Optional: If new image is uploaded, delete old image from Cloudinary
      // if (updateData.image && existingBlog.image) {
      //   const publicId = existingBlog.image.split("/").pop()?.split(".")[0];
      //   if (publicId) {
      //     await CloudinaryStorage.uploader.destroy(publicId);
      //   }
      // }

      const updatedBlog = await this.Repository.updateBlog(blogId, updateData);

      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "Blog Updated",
        result: updatedBlog,
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          "Error updating blog",
          HttpStatusCode.InternalServerError
        );
      }
    }
  }
  async deleteBlog(blogId: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: "";
  }> {
    try {
      console.log("called in int useCases");
      const deleteBlog = await this.Repository.deleteBlogs(blogId);
      if (!deleteBlog) {
        return {
          status: true,
          statusCode: HttpStatusCode.OK,
          message: "error during  blog deletion",
          result: "",
        };
      }
      console.log(deleteBlog, "is expecting the deleted Blog");
      return {
        status: true,
        statusCode: HttpStatusCode.OK,
        message: "blog deleted successFully",
        result: "",
      };
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          "Error updating blog",
          HttpStatusCode.InternalServerError
        );
      }
    }
  }
}

export default BlogInteractor;
