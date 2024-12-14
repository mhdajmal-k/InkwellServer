import { Application } from "express";
import { userRouter } from "./authRoute";
import { blogRouter } from "./blogRoute";

const routes = (app: Application) => {
  app.use("/api/user", userRouter);
  app.use("/api/blog", blogRouter);
};
export default routes;
