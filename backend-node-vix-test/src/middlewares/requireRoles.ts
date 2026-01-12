import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { user } from "@prisma/client";

export function requireRoles(rolesPermitidos: Array<user["role"]>) {
  return (req: CustomRequest<user>, res: Response, next: NextFunction) => {
    const usuario = req.user;
    if (!usuario || !rolesPermitidos.includes(usuario.role)) {
      throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
    }
    return next();
  };
}
