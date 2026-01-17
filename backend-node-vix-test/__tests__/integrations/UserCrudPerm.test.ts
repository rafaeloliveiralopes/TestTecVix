import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";
import { genToken } from "../../src/utils/jwt";

const BASE_PATH = API_VERSION.V1 + "/users";

const userMember = {
  idUser: "m1",
  role: "member",
  isActive: true,
  deletedAt: null,
} as any;
const userManager = {
  idUser: "g1",
  role: "manager",
  isActive: true,
  deletedAt: null,
} as any;
const userAdmin = {
  idUser: "a1",
  role: "admin",
  isActive: true,
  deletedAt: null,
} as any;

const tokenMember = genToken({
  idUser: userMember.idUser,
  role: userMember.role,
});
const tokenManager = genToken({
  idUser: userManager.idUser,
  role: userManager.role,
});
const tokenAdmin = genToken({ idUser: userAdmin.idUser, role: userAdmin.role });

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Permissões CRUD de usuários", () => {
  it("member não pode criar usuário (403)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMember);
    const res = await request(app)
      .post(BASE_PATH)
      .set("Authorization", `Bearer ${tokenMember}`)
      .send({
        username: "novo",
        email: "novo@x.com",
        password: "123",
        role: "member",
      });
    expect(res.statusCode).toBe(403);
  });

  it("member não pode editar usuário (403)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMember);
    const res = await request(app)
      .put(`${BASE_PATH}/u1`)
      .set("Authorization", `Bearer ${tokenMember}`)
      .send({ username: "editado" });
    expect(res.statusCode).toBe(403);
  });

  it("member não pode deletar usuário (403)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMember);
    const res = await request(app)
      .delete(`${BASE_PATH}/u1`)
      .set("Authorization", `Bearer ${tokenMember}`);
    expect(res.statusCode).toBe(403);
  });

  it("manager não pode deletar usuário (403)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userManager);
    const res = await request(app)
      .delete(`${BASE_PATH}/u1`)
      .set("Authorization", `Bearer ${tokenManager}`);
    expect(res.statusCode).toBe(403);
  });

  it("admin pode deletar usuário (204)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userAdmin);
    prismaMock.user.update.mockResolvedValue({} as any);
    const res = await request(app)
      .delete(`${BASE_PATH}/u1`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("leitura funciona para todos (200)", async () => {
    prismaMock.user.findUnique.mockResolvedValue(userMember);
    prismaMock.user.findMany.mockResolvedValue([
      userMember,
      userManager,
      userAdmin,
    ]);
    const res = await request(app)
      .get(BASE_PATH)
      .set("Authorization", `Bearer ${tokenMember}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
