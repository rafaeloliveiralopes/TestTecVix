import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";

const BASE_PATH = API_VERSION.V1 + "/auth";

describe("Testing API Auth Register", () => {
  const userData = {
    username: "testuser",
    email: "testuser@example.com",
    password: "senhaSegura123",
    role: "member",
  };

  it("should create user successfully", async () => {
    const createdUser = {
      idUser: "uuid-123",
      username: userData.username,
      email: userData.email,
      profileImgUrl: null,
      role: userData.role,
      idBrandMaster: null,
      isActive: true,
      lastLoginDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      password: "$2a$10$hash",
    } as any;

    // findByEmail then findByUsername should return null
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValue(createdUser);

    const res = await request(app).post(`${BASE_PATH}/register`).send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("idUser");
    expect(res.body).toHaveProperty("email", userData.email);
    expect(res.body).toHaveProperty("username", userData.username);
    expect(res.body).not.toHaveProperty("password");
  });

  it("should fail to register with duplicate email", async () => {
    // Primeiro cadastro - preparar mocks e executar
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValue({ idUser: "u1" } as any);

    await request(app)
      .post(`${BASE_PATH}/register`)
      .send({ ...userData, username: "uniqueuser1" });

    // Segundo cadastro - email already exists
    prismaMock.user.findFirst.mockResolvedValueOnce({
      idUser: "existing",
    } as any);

    const res = await request(app)
      .post(`${BASE_PATH}/register`)
      .send({ ...userData, username: "uniqueuser2" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/Email already exists/i);
  });

  it("should fail to register with duplicate username", async () => {
    // Primeiro cadastro - preparar mocks e executar
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValue({ idUser: "u2" } as any);

    await request(app)
      .post(`${BASE_PATH}/register`)
      .send({ ...userData, email: "uniqueemail1@example.com" });

    // Segundo cadastro - username already exists
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ idUser: "existingUser" } as any);

    const res = await request(app)
      .post(`${BASE_PATH}/register`)
      .send({ ...userData, email: "uniqueemail2@example.com" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/Username already exists/i);
  });
});
