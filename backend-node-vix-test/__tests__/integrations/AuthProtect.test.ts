import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";
import { genToken } from "../../src/utils/jwt";

// Mock global do bcrypt.compare para sempre retornar true
jest.mock("bcryptjs", () => ({
  ...jest.requireActual("bcryptjs"),
  compare: jest.fn(() => true),
}));
import * as bcrypt from "bcryptjs";

const BASE_PATH_VM = API_VERSION.V1 + "/vm";

describe("Auth protection (Issue 4 da Milestone 1)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login continua público sem token", async () => {
    // Mock do prisma para fluxo de login
    const userRecord = {
      idUser: "user-2",
      username: "loginuser",
      email: "loginuser@example.com",
      password: "$2a$10$hashcorreto",
      role: "member",
      isActive: true,
      deletedAt: null,
    } as any;

    prismaMock.user.findFirst.mockResolvedValue(userRecord);

    // Mock do bcrypt.compare para sempre retornar true
    const compareSpy = jest.spyOn(
      bcrypt,
      "compare",
    ) as unknown as jest.SpyInstance;
    compareSpy.mockResolvedValueOnce(true);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: userRecord.email, password: "senhaqualquer" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("register continua público sem token", async () => {
    // Mock do prisma para fluxo de register
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null) // findByEmail
      .mockResolvedValueOnce(null); // findByUsername

    prismaMock.user.create.mockResolvedValue({
      idUser: "novo-uuid",
      username: "novouser",
      email: "novouser@example.com",
      profileImgUrl: null,
      role: "member",
      idBrandMaster: null,
      isActive: true,
      lastLoginDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      password: "$2a$10$hash",
    } as any);

    const res = await request(app).post("/api/v1/auth/register").send({
      username: "novouser",
      email: "novouser@example.com",
      password: "senhaSegura123",
      role: "member",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idUser");
    expect(res.body).toHaveProperty("email", "novouser@example.com");
  });

  it("protected route without token returns 401", async () => {
    const res = await request(app).get(BASE_PATH_VM);
    expect(res.statusCode).toBe(401);
  });

  it("protected route with invalid token returns 401", async () => {
    const res = await request(app)
      .get(BASE_PATH_VM)
      .set("Authorization", "Bearer invalid.token.here");
    expect(res.statusCode).toBe(401);
  });

  it("protected route with valid token returns 200", async () => {
    // Prepara prisma mocks: authUser will call user.findUnique
    const userRecord = {
      idUser: "user-1",
      username: "u",
      email: "u@example.com",
      role: "member",
      idBrandMaster: null,
      isActive: true,
      deletedAt: null,
    } as any;

    prismaMock.user.findUnique.mockResolvedValue(userRecord);

    // O modelo vM irá chamar findMany e count
    prismaMock.vM.findMany.mockResolvedValue([] as any);
    prismaMock.vM.count.mockResolvedValue(0 as any);

    const token = genToken({
      idUser: userRecord.idUser,
      role: userRecord.role,
    });

    const res = await request(app)
      .get(BASE_PATH_VM)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body).toHaveProperty("result");
  });
});
