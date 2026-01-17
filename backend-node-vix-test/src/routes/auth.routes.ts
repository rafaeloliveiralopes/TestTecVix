import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { API_VERSION } from "../constants/basePathRoutes";

const BASE_PATH = API_VERSION.V1 + "/auth";

const authRoutes = Router();

export const makeUserController = () => {
  return new UserController();
};

const userController = makeUserController();

// POST /api/v1/auth/register
authRoutes.post(`${BASE_PATH}/register`, async (req, res) => {
  await userController.register(req, res);
});

// POST /api/v1/auth/login
authRoutes.post(`${BASE_PATH}/login`, async (req, res) => {
  await userController.login(req, res);
});

export { authRoutes };
