import { Router, Response } from "express";
import { CustomRequest } from "../types/custom";
import { ParamsDictionary } from "express-serve-static-core";
import { user } from "@prisma/client";
import { UserController } from "../controllers/UserController";
import { requireRoles } from "../middlewares/requireRoles";
import { API_VERSION } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + "/users";
const userRoutes = Router();
const userController = new UserController();

// Leitura para todos
userRoutes.get(
  BASE_PATH,
  (req: CustomRequest<user, ParamsDictionary>, res: Response) =>
    userController.listAll(req, res),
);
userRoutes.get(
  `${BASE_PATH}/:idUser`,
  (req: CustomRequest<user, { idUser: string }>, res: Response) =>
    userController.getById(req, res),
);

// Criação e edição: apenas manager e admin
userRoutes.post(
  BASE_PATH,
  requireRoles(["manager", "admin"]),
  (
    req: CustomRequest<user, ParamsDictionary, unknown, Partial<user>>,
    res: Response,
  ) => userController.create(req, res),
);
userRoutes.put(
  `${BASE_PATH}/:idUser`,
  requireRoles(["manager", "admin"]),
  (
    req: CustomRequest<user, { idUser: string }, unknown, Partial<user>>,
    res: Response,
  ) => userController.update(req, res),
);

// Exclusão: apenas admin
userRoutes.delete(
  `${BASE_PATH}/:idUser`,
  requireRoles(["admin"]),
  (req: CustomRequest<user, { idUser: string }>, res: Response) =>
    userController.delete(req, res),
);

export { userRoutes };
