import { Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { verifyToken } from "../utils/jwt";
import { CustomRequest } from "../types/custom";
import { user } from "@prisma/client";
import { UserService } from "../services/UserService";

const userService = new UserService();

export const authUser = async (
  req: CustomRequest<user>,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }

  const payload = verifyToken(token);

  const foundUser = await userService.getById(payload.idUser);

  if (!foundUser || foundUser.deletedAt || !foundUser.isActive) {
    throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
  }

  req.user = foundUser;
  return next();
};
