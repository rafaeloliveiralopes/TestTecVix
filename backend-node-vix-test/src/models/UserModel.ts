import { prisma } from "../database/client";
import { user } from "@prisma/client";

export class UserModel {
  async findByEmail(email: string): Promise<user | null> {
    return await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  async findByUsername(username: string): Promise<user | null> {
    return await prisma.user.findFirst({
      where: {
        username,
        deletedAt: null,
      },
    });
  }

  async create(data: {
    username: string;
    password: string;
    email: string;
    role?: "admin" | "member" | "manager";
    idBrandMaster?: number | null;
    profileImgUrl?: string | null;
  }): Promise<user> {
    return await prisma.user.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  async getById(idUser: string): Promise<user | null> {
    return await prisma.user.findUnique({
      where: { idUser },
    });
  }

  async listAll(): Promise<user[]> {
    return await prisma.user.findMany({ where: { deletedAt: null } });
  }

  async update(idUser: string, data: Partial<user>): Promise<user> {
    // Não permitir update de campos sensíveis diretamente
    return await prisma.user.update({
      where: { idUser },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async delete(idUser: string): Promise<void> {
    await prisma.user.update({
      where: { idUser },
      data: { deletedAt: new Date(), updatedAt: new Date() },
    });
  }

  async updateLastLoginDate(idUser: string): Promise<void> {
    await prisma.user.update({
      where: { idUser },
      data: { lastLoginDate: new Date() },
    });
  }
}
