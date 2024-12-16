import { Request, Response, NextFunction } from "express";

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log(err, "in the middileeare");
  if (err instanceof CustomError) {
    console.log("in the error in custom");
    console.log(err.message);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  }
};