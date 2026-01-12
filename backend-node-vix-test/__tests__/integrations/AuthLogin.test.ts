import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const BASE_PATH = API_VERSION.V1 + "/auth";

describe("Testing API Auth Login", () => {
  const email = "login@example.com";
  const password = "plainpwd";

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("credenciais válidas retornam 200 e token definido", async () => {
    const userInDb = {
      idUser: "uuid-login-1",
      email,
      password: "$2a$10$hashed",
      role: "member",
      idBrandMaster: null,
    } as any;

    prismaMock.user.findFirst.mockResolvedValueOnce(userInDb);
    prismaMock.user.update.mockResolvedValueOnce({} as any);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce("mocked-jwt-token");

    const res = await request(app)
      .post(`${BASE_PATH}/login`)
      .send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toBe("mocked-jwt-token");
    expect(prismaMock.user.update).toHaveBeenCalled();
  });

  it("email inexistente retorna 401", async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);

    const res = await request(app)
      .post(`${BASE_PATH}/login`)
      .send({ email: "noone@example.com", password });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  it("senha errada retorna 401", async () => {
    const userInDb = {
      idUser: "uuid-login-2",
      email,
      password: "$2a$10$hashed",
      role: "member",
      idBrandMaster: null,
    } as any;

    prismaMock.user.findFirst.mockResolvedValueOnce(userInDb);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const res = await request(app)
      .post(`${BASE_PATH}/login`)
      .send({ email, password });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
