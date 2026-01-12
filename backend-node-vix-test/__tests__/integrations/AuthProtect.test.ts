import request from "supertest";
import { app } from "../../src/app";
import { API_VERSION } from "../../src/constants/basePathRoutes";
import { prismaMock } from "../singleton";
import { genToken } from "../../src/utils/jwt";

const BASE_PATH_VM = API_VERSION.V1 + "/vm";

describe("Auth protection - minimal (Issue 4)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
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
