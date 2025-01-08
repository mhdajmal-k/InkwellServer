import {
  IBlog,
  IBlogOne,
  IProfferedBlog,
} from "../../frameWork/database/type/blogShemaType";

interface IBlogRepository {
  createBlog(
    author: string,
    content: string,
    title: string,
    category: string,
    imageUrl: string
  ): Promise<IBlog>;

  getAllBlogs(
    preference: string[],
    skip?: number,
    limit?: number
  ): Promise<IProfferedBlog[]>;
  getBlogsCount(preference: string[]): Promise<number>;
  deleteBlogs(id: string): Promise<boolean>;
  getAllUserBlogs(id: string): Promise<IBlog[]>;
  getOneBlog(id: string): Promise<IBlogOne | null>;
  updateBlogLike(id: string, userId: string): Promise<IBlogOne | null>;
  updateBlogDisLike(id: string, userId: string): Promise<IBlogOne | null>;
  getBlogPreference(userId: string): Promise<string[]>;
  updateBlog(
    blogId: string,
    updateData: {
      title?: string;
      content?: string;
      category?: string;
      image?: string;
    }
  ): Promise<IBlog>;
  findBlogById(blogId: string): Promise<IBlog | null>;
}
export default IBlogRepository;
