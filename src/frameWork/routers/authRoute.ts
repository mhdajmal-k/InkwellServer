import { Router } from "express";
import { apiLimiter } from "../config/rateLimit";
import JwtToken from "../services/jwt";
import { config } from "../config/envConfig";
import AuthRepository from "../../interFace/repositories/authRepositorie";
import UserAuthInteractor from "../../useCases/useCase";
import AuthController from "../../interFace/controllers/authControler";
import { validateSignUp } from "../middileware/validator/signupvalidator";
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
