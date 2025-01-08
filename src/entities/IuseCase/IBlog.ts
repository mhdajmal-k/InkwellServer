import {
  IBlog,
  IBlogOne,
  IProfferedBlog,
} from "../../frameWork/database/type/blogShemaType";

interface IBlogInteractor {
  createBlog(
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
  }>;
  getBlogs(
    userId?: string,
    page?: number,
    limit?: number
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: {
      blogs: IProfferedBlog[];
      preferences: string[];
    };
    hasMore: boolean;
  }>;
  getUserBlogs(userId?: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: {
      blogs: IBlog[];
    };
  }>;

  getOneBlogById(id: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }>;

  changeBlogLikeById(
    id: string,
    userId: string
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }>;
  changeBlogDisLikeById(
    id: string,
    userId: string
  ): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: IBlogOne;
  }>;
  updateBlog(
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
  }>;
  deleteBlog(blogId: string): Promise<{
    statusCode: number;
    status: boolean;
    message: string;
    result: "";
  }>;
}
export default IBlogInteractor;
