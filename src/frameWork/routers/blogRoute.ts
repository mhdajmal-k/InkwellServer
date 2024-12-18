import { Router } from "express";
import { validateBlog } from "../middileware/validator/validateBlog";
import { authorization } from "../middileware/authMiddileware";
import upload from "../storage/storage";
import { BlogController } from "../../interFace/controllers/blogControler";
import BlotInteractor from "../../useCases/blogUseCAses/useCase";
import BlogRepository from "../../interFace/repositories/blogRepository";

const blogRouter = Router();
const repository = new BlogRepository();
const interactor = new BlotInteractor(repository);

const blogController = new BlogController(interactor);

blogRouter.post(
  "/create",
  upload.single("image"),
  validateBlog,
  authorization(),
  blogController.createBlog.bind(blogController)
);
blogRouter.get(
  "/",
  authorization(),
  blogController.getallBlogs.bind(blogController)
);
blogRouter.get(
  "/userblog",
  authorization(),
  blogController.getallUserBlogs.bind(blogController)
);

blogRouter.get(
  "/view/:id",
  authorization(),
  blogController.getOneBlog.bind(blogController)
);
blogRouter.put(
  "/edit/:blogId",
  (req, res, next) => {
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      return next();
    }
    upload.single("image")(req, res, next);
  },
  validateBlog,
  authorization(),
  blogController.updateBlog.bind(blogController)
);
blogRouter.patch(
  "/:blogId",
  authorization(),
  blogController.deleteBlog.bind(blogController)
);
blogRouter.get(
  "/like/:id",
  authorization(),
  blogController.BlogLike.bind(blogController)
);
blogRouter.get(
  "/dislike/:id",
  authorization(),
  blogController.disLike.bind(blogController)
);
export default blogRouter;
