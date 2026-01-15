import { Router } from "express";
import { brandMasterRoutes } from "./brandMaster.routes";
import { vMRoutes } from "./vM.routes";
import { uploadsRoutes } from "./uploads.routes";
import { authRoutes } from "./auth.routes";
import { authUser } from "../auth/authUser";
import { userRoutes } from "./user.routes";
import { addressRoutes } from "./address.routes";

export const routes = Router();

routes.use(authRoutes);

// Rotas públicas: /auth/login e /auth/register. A partir daqui, exigir JWT nas demais rotas
routes.use(authUser);

routes.use(userRoutes);
routes.use(addressRoutes);
routes.use(uploadsRoutes);
routes.use(brandMasterRoutes);
routes.use(vMRoutes);
