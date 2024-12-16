import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../../helpers/Enums";
import { loginValidatorSchema } from "../../helpers/validatorSchema/loginvalidator";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = loginValidatorSchema.validate(req.body);
  let particularError;
  if (error) {
    particularError = error?.details
      .map((detail) => detail.message.replace(/"/g, ""))
      .filter((message) => message);
    res.status(HttpStatusCode.BadRequest).json({
      status: false,
      message: `${error.name}-${particularError}`,
      result: {},
    });
  } else {
    next(error);
  }
};
