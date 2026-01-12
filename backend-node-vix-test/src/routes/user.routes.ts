import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { requireRoles } from "../middlewares/requireRoles";
import { API_VERSION } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + "/users";
const userRoutes = Router();
const userController = new UserController();

// Leitura para todos
userRoutes.get(BASE_PATH, (req, res) => userController.listAll(req, res));
userRoutes.get(`${BASE_PATH}/:idUser`, (req, res) =>
  userController.getById(req, res),
);

// Criação e edição: apenas manager e admin
userRoutes.post(BASE_PATH, requireRoles(["manager", "admin"]), (req, res) =>
  userController.create(req, res),
);
userRoutes.put(
  `${BASE_PATH}/:idUser`,
  requireRoles(["manager", "admin"]),
  (req, res) => userController.update(req, res),
);

// Exclusão: apenas admin
userRoutes.delete(`${BASE_PATH}/:idUser`, requireRoles(["admin"]), (req, res) =>
  userController.delete(req, res),
);

export { userRoutes };
