import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { UserService } from "../services/UserService";
import { STATUS_CODE } from "../constants/statusCode";

// Controller responsável pelas operações CRUD e autenticação de usuários
export class UserController {
  constructor() {}
  // Service de usuários
  private userService = new UserService();

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
  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    const userId = Array.isArray(idUser) ? idUser[0] : idUser;
    const result = await this.userService.getById(userId);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Lista todos os usuários (GET /users)
  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.userService.listAll();
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Cria um novo usuário (POST /users) - protegido por role
  async create(req: CustomRequest<unknown>, res: Response) {
    // Se não for admin, não pode setar role
    let data = { ...req.body };
    if (req.user?.role !== "admin") {
      delete data.role;
    }
    const result = await this.userService.register(data);
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  // Atualiza um usuário existente (PUT /users/:idUser) - protegido por role
  async update(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    let data = { ...req.body };
    // Nunca permitir alteração destes campos
    ["password", "deletedAt", "createdAt", "updatedAt", "idUser"].forEach(
      (field) => {
        delete data[field];
      },
    );
    // Se não for admin, não pode editar role
    if (req.user?.role !== "admin") {
      delete data.role;
    }
    const result = await this.userService.update(idUser, data);
    return res.status(STATUS_CODE.OK).json(result);
  }

  // Deleta um usuário (DELETE /users/:idUser) - apenas admin
  async delete(req: CustomRequest<unknown>, res: Response) {
    const { idUser } = req.params;
    await this.userService.delete(idUser);
    return res.status(STATUS_CODE.NO_CONTENT).send();
  }
}
