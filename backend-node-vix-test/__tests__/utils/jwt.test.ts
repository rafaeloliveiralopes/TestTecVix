import { genToken, verifyToken } from "../../src/utils/jwt";
import { AppError } from "../../src/errors/AppError";
import { ERROR_MESSAGE } from "../../src/constants/erroMessages";
import { STATUS_CODE } from "../../src/constants/statusCode";

beforeAll(() => {
  process.env.JWT_SECRET = "test_secret";
  delete process.env.JWT_EXPIRES_IN;
});

describe("JWT util", () => {
  it("gera token e valida token retornando payload", () => {
    const payload = { idUser: "uuid-test-1", role: "admin" as const };
    const token = genToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.idUser).toBe(payload.idUser);
    expect(decoded.role).toBe(payload.role);
  });

  it("token inválido lança AppError INVALID_TOKEN", () => {
    expect(() => verifyToken("invalid.token.here")).toThrowError(AppError);

    try {
      verifyToken("invalid.token.here");
    } catch (err: any) {
      expect(err.message).toBe(ERROR_MESSAGE.INVALID_TOKEN);
    }
  });
});
