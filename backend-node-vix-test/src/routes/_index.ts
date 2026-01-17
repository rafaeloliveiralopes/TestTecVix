import { Router } from "express";
import { brandMasterRoutes } from "./brandMaster.routes";
import { vMRoutes } from "./vM.routes";
import { uploadsRoutes } from "./uploads.routes";
import { authRoutes } from "./auth.routes";
import { authUser } from "../auth/authUser";
import { userRoutes } from "./user.routes";
import { addressRoutes } from "./address.routes";
import { uploadRoutes } from "./upload.routes";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";

export const routes = Router();

// Rotas públicas (não exigem JWT)
routes.use(authRoutes);
routes.use(uploadsRoutes);
routes.use(uploadRoutes);

// Middleware de autenticação aplicado apenas nos paths protegidos (evita bloqueio global)
routes.use(`${API_VERSION.V1}/users`, authUser);
routes.use(`${API_VERSION.V1}${ROOT_PATH.ADDRESS}`, authUser);
routes.use(`${API_VERSION.V1}${ROOT_PATH.BRANDMASTER}`, authUser);
routes.use(`${API_VERSION.V1}${ROOT_PATH.VM}`, authUser);

// Rotas protegidas
routes.use(userRoutes);
routes.use(addressRoutes);
routes.use(brandMasterRoutes);
routes.use(vMRoutes);
