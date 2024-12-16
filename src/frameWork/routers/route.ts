import { Application } from "express";
import { userRouter } from "./authRoute";
import multer from "multer";
import blogRouter from "./blogRoute";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const routes = (app: Application) => {
  app.use("/api/user/", userRouter);
  app.use("/api/blog/", blogRouter);
};
export default routes;
