/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import IBlogInteractor from "../../entities/IuseCase/IBlog";
import { AuthenticatedRequest } from "../../frameWork/type/IuserSignUpResult";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";

class BlogController {
  private iBlogInteractor: IBlogInteractor;

  constructor(iBlogInteractor: IBlogInteractor) {
    this.iBlogInteractor = iBlogInteractor;
  }

  async createBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const author = req.user?.id;
      const { title, content, category } = req.body;
      const file = req.file;
      const imageUrl = (file as any).path || (file as any).secure_url;

      if (!imageUrl) {
        throw new Error("Image upload failed. No URL found.");
      }

      console.log(imageUrl, "is the Cloudinary image URL");

      const response = await this.iBlogInteractor.createBlog(
        title,
        content,
        author as string,
        category,
        imageUrl
      );

      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getallBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const response = await this.iBlogInteractor.getBlogs(userId);
      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async getallUserBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const response = await this.iBlogInteractor.getUserBlogs(userId);
      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(HttpStatusCode.BadRequest).json({
          status: false,
          message: "blog id is required",
          result: {},
        });
        return;
      }
      const response = await this.iBlogInteractor.getOneBlogById(String(id));
      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async BlogLike(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!id) {
        res.status(HttpStatusCode.BadRequest).json({
          status: false,
          message: "blog id is required",
          result: {},
        });
        return;
      }
      const response = await this.iBlogInteractor.changeBlogLikeById(
        String(id),
        String(userId)
      );
      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async disLike(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!id) {
        res.status(HttpStatusCode.BadRequest).json({
          status: false,
          message: "blog id is required",
          result: {},
        });
        return;
      }
      const response = await this.iBlogInteractor.changeBlogDisLikeById(
        String(id),
        String(userId)
      );
      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const author = req.user?.id;
      const blogId = req.params.blogId;
      const { title, content, category } = req.body;
      const file = req.file;

      let imageUrl: string | undefined;
      if (file) {
        imageUrl = (file as any).path || (file as any).secure_url;

        if (!imageUrl) {
          throw new Error("Image upload failed. No URL found.");
        }
      }

      const response = await this.iBlogInteractor.updateBlog(blogId, {
        title,
        content,
        author: author as string,
        category,
        image: imageUrl,
      });

      res.status(response.statusCode).json({
        status: response.status,
        message: response.message,
        result: response.result,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteBlog(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { blogId } = req.params;
      console.log("called");
      const response = await this.iBlogInteractor.deleteBlog(blogId);
      if (response.status) {
        res.status(response.statusCode).json({
          status: response.status,
          message: response.message,
          result: response.result,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export { BlogController };
