import { Router } from "express";
import { brandMasterRoutes } from "./brandMaster.routes";
import { vMRoutes } from "./vM.routes";
import { uploadsRoutes } from "./uploads.routes";
import { authRoutes } from "./auth.routes";
import { authUser } from "../auth/authUser";

export const routes = Router();

routes.use(authRoutes);

// Aplicar middleware de autenticação a todas as rotas após /auth (login/register)
routes.use(authUser);

routes.use(uploadsRoutes);
routes.use(brandMasterRoutes);
routes.use(vMRoutes);
