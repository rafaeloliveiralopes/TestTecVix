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
}
