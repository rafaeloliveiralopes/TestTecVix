import request from "supertest";
import { app } from "../../src/app";

describe("Testing API", () => {
  it("should return 200 root", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("should return 501 for non-existent route /api/v1", async () => {
    const res = await request(app).get("/api/v1");
    expect(res.statusCode).toBe(501);
  });

  it("should return 501", async () => {
    const res = await request(app).get("/lorem/ipsum/dolor/sit/amet/not-found");
    expect(res.statusCode).toBe(501);
  });
});
