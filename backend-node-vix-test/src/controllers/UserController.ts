import { Response } from "express";
import { user as PrismaUser } from "@prisma/client";
import { CustomRequest } from "../types/custom";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";

// Controller responsável pelas operações CRUD e autenticação de usuários
export class UserController {
  constructor() {}

  // Service de usuários
  private userService = new UserService();

  // Retorna o usuário logado (GET /users/self). Útil para preencher a tela de perfil.
  async getSelf(req: CustomRequest<PrismaUser>, res: Response) {
    return res.status(STATUS_CODE.OK).json(req.user);
  }

  // Atualiza dados do perfil do usuário logado (PUT /users/self).
  async updateSelf(req: CustomRequest<PrismaUser>, res: Response) {
    const currentUser = req.user as PrismaUser;
    const result = await this.userService.updateSelf(
      currentUser.idUser,
      req.body,
      currentUser,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Atualiza a senha do usuário logado (PUT /users/self/password).
  async updateSelfPassword(req: CustomRequest<PrismaUser>, res: Response) {
    const currentUser = req.user as PrismaUser;
    const result = await this.userService.updateSelfPassword(
      currentUser.idUser,
      req.body,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Cria um novo usuário (rota pública /auth/register)
  async register(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.register(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  // Realiza login e retorna um token JWT (rota pública /auth/login)
  async login(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.login(req.body);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Busca um usuário pelo id (GET /users/:idUser)
  async getById(
    req: CustomRequest<PrismaUser, { idUser: string }>,
    res: Response,
  ) {
    const { idUser } = req.params;
    const result = await this.userService.getById(idUser);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Lista todos os usuários (GET /users)
  async listAll(req: CustomRequest<PrismaUser>, res: Response) {
    const result = await this.userService.listAll();
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Cria um novo usuário (POST /users) - protegido por role (middleware na rota)
  async create(req: CustomRequest<PrismaUser>, res: Response) {
    const result = await this.userService.register(req.body);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  // Atualiza um usuário (PUT /users/:idUser).
  // Autorização por role é aplicada na rota via middleware requireRoles.
  async update(
    req: CustomRequest<PrismaUser, { idUser: string }, unknown, unknown>,
    res: Response,
  ) {
    const { idUser } = req.params;
    const user = req.user as PrismaUser;
    const result = await this.userService.update(idUser, req.body, user);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Deleta um usuário (DELETE /users/:idUser) - apenas admin (middleware na rota)
  async delete(
    req: CustomRequest<PrismaUser, { idUser: string }>,
    res: Response,
  ) {
    const { idUser } = req.params;
    await this.userService.delete(idUser);
    return res.status(STATUS_CODE.NO_CONTENT).send();
  }
}
