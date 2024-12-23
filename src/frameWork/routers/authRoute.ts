import { Router } from "express";
import { apiLimiter } from "../config/rateLimit";
import JwtToken from "../services/jwt";
import { config } from "../config/envConfig";
import AuthRepository from "../../interFace/repositories/authRepositorie";
import UserAuthInteractor from "../../useCases/authUseCases/useCase";
import AuthController from "../../interFace/controllers/authControler";
import { validateSignUp } from "../middileware/validator/signUpValidator";
import { validateLogin } from "../middileware/validator/loginValidate";
import { authorization } from "../middileware/authMiddileware";
export const userRouter = Router();
const jwtToken = new JwtToken(config.JWT_SECRET, config.JWT_REFRESH_SECRET);
const repository = new AuthRepository();
const interactor = new UserAuthInteractor(repository, jwtToken);
const authController = new AuthController(interactor);

userRouter.post(
  "/signup",
  apiLimiter,
  validateSignUp,
  authController.signUp.bind(authController)
);
userRouter.post(
  "/login",
  apiLimiter,
  validateLogin,
  authController.singIN.bind(authController)
);
userRouter.get(
  "/profile",
  authorization(),
  authController.getProfileData.bind(authController)
);
userRouter.put(
  "/profile",
  authorization(),
  authController.updateProfileData.bind(authController)
);
userRouter.post(
  "/refreshToken",
  authController.checkRefreshToken.bind(authController)
);
userRouter.post(
  "/logout",
  apiLimiter,
  authController.logout.bind(authController)
);
