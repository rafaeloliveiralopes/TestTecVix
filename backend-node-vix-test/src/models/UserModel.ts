import { prisma } from "../database/client";
import { user, Prisma } from "@prisma/client";

export type UserSafeWithBrand = Prisma.userGetPayload<{
  select: {
    idUser: true;
    username: true;
    email: true;
    profileImgUrl: true;
    role: true;
    idBrandMaster: true;
    isActive: true;
    lastLoginDate: true;
    createdAt: true;
    updatedAt: true;
    deletedAt: true;
    userPhoneNumber: true;
    field: true;
    department: true;
    contractDate: true;
    fullName: true;
    brandMaster: { select: { brandName: true } };
  };
}>;

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
    userPhoneNumber?: string | null;
    field?: string | null;
    department?: string | null;
    contractDate?: Date | string | null;
    fullName?: string | null;
    isActive?: boolean | null;
  }): Promise<user> {
    return await prisma.user.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }

  async getById(idUser: string): Promise<UserSafeWithBrand | null> {
    return await prisma.user.findUnique({
      where: { idUser },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        userPhoneNumber: true,
        field: true,
        department: true,
        contractDate: true,
        fullName: true,
        brandMaster: { select: { brandName: true } },
      },
    });
  }

  async listAll(): Promise<UserSafeWithBrand[]> {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        userPhoneNumber: true,
        field: true,
        department: true,
        contractDate: true,
        fullName: true,
        brandMaster: { select: { brandName: true } },
      },
    });
  }

  async update(
    idUser: string,
    data: Partial<user>,
  ): Promise<UserSafeWithBrand> {
    return await prisma.user.update({
      where: { idUser },
      data: { ...data, updatedAt: new Date() },
      select: {
        idUser: true,
        username: true,
        email: true,
        profileImgUrl: true,
        role: true,
        idBrandMaster: true,
        isActive: true,
        lastLoginDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        userPhoneNumber: true,
        field: true,
        department: true,
        contractDate: true,
        fullName: true,
        brandMaster: { select: { brandName: true } },
      },
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

  async updatePassword(idUser: string, password: string): Promise<void> {
    await prisma.user.update({
      where: { idUser },
      data: { password, updatedAt: new Date() },
    });
  }
}
