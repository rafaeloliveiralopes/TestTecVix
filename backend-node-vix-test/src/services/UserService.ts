import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";
import { userCreatedSchema } from "../types/validations/User/createUser";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

export class UserService {
  constructor() {}
  private userModel = new UserModel();

  async register(data: unknown) {
    // Validar input com Zod
    const validData = userCreatedSchema.parse(data);

    // Verificar se email já existe
    const existingEmail = await this.userModel.findByEmail(validData.email);
    if (existingEmail) {
      throw new AppError(
        ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    // Verificar se username já existe
    const existingUsername = await this.userModel.findByUsername(
      validData.username,
    );
    if (existingUsername) {
      throw new AppError(
        ERROR_MESSAGE.USERNAME_ALREADY_EXISTS,
        STATUS_CODE.CONFLICT,
      );
    }

    // Hash da senha (NUNCA salvar em texto puro)
    const hashedPassword = await bcrypt.hash(validData.password, 10);

    // Criar usuário no banco
    const newUser = await this.userModel.create({
      username: validData.username,
      password: hashedPassword,
      email: validData.email,
      role: validData.role,
      idBrandMaster: validData.idBrandMaster,
      profileImgUrl: validData.profileImgUrl,
    });

    // Remover senha da resposta (segurança)
    const { password: _password, ...userWithoutPassword } = newUser;
    void _password;
    return userWithoutPassword;
  }

  async getById(idUser: string) {
    return await this.userModel.getById(idUser);
  }
}
