import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";
import { UserSafeWithBrand } from "../models/UserModel";
import { userCreatedSchema } from "../types/validations/User/createUser";
import { user } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { genToken } from "../utils/jwt";
import userLoginSchema, {
  TUserLogin,
} from "../types/validations/User/loginUser";

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

    const contractDate = validData.contractDate
      ? new Date(validData.contractDate)
      : null;
    if (validData.contractDate && contractDate && isNaN(contractDate.getTime())) {
      throw new AppError(ERROR_MESSAGE.INVALID_DATA, STATUS_CODE.BAD_REQUEST);
    }

    // Criar usuário no banco
    const newUser = await this.userModel.create({
      username: validData.username,
      password: hashedPassword,
      email: validData.email,
      role: validData.role,
      idBrandMaster: validData.idBrandMaster,
      profileImgUrl: validData.profileImgUrl,
      userPhoneNumber: validData.userPhoneNumber,
      field: validData.field,
      department: validData.department,
      contractDate,
      fullName: validData.fullName,
      isActive: validData.isActive ?? true,
    });

    // Remover senha da resposta (segurança)
    const { password: _password, ...userWithoutPassword } = newUser;
    void _password;
    return userWithoutPassword;
  }

  async getById(idUser: string) {
    return await this.userModel.getById(idUser);
  }

  async listAll() {
    return await this.userModel.listAll();
  }

  // Atualiza usuário com sanitização defensiva (autorização via middleware).
  async update(
    idUser: string,
    data: unknown,
    requester: user,
  ): Promise<UserSafeWithBrand> {
    const sanitizedData =
      typeof data === "object" && data !== null && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>) }
        : {};

    // Campos que nunca devem ser alterados via update genérico
    const forbidden = ["password", "deletedAt", "createdAt", "updatedAt", "idUser"];

    for (const field of forbidden) {
      delete sanitizedData[field];
    }

    if (requester.role !== "admin") {
      delete sanitizedData.role;
    }

    return await this.userModel.update(idUser, sanitizedData as Partial<user>);
  }

  async delete(idUser: string) {
    return await this.userModel.delete(idUser);
  }

  async login(data: unknown) {
    const validData = userLoginSchema.parse(data) as TUserLogin;

    const userFound = await this.userModel.findByEmail(validData.email);
    if (!userFound) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    const isValidPassword = await bcrypt.compare(
      validData.password,
      userFound.password,
    );

    if (!isValidPassword) {
      throw new AppError(
        ERROR_MESSAGE.INVALID_EMAIL_OR_PASSWORD,
        STATUS_CODE.UNAUTHORIZED,
      );
    }

    // atualizar lastLoginDate
    await this.userModel.updateLastLoginDate(userFound.idUser);
    const token = genToken({
      idUser: userFound.idUser,
      role: userFound.role as "admin" | "manager" | "member",
    });

    return { token };
  }
}
