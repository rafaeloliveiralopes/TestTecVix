import { isAdmin } from "../../src/auth/isAdmin";
import { isManagerOrIsAdmin } from "../../src/auth/isManagerOrIsAdmin";
import { isSelfOrIsManagerOrIsAdm } from "../../src/auth/isSelfOrIsManagerOrIsAdm";
import { STATUS_CODE } from "../../src/constants/statusCode";

describe("Auth Middlewares", () => {
  const mockResponse = {} as any;
  const mockNext = jest.fn();

  beforeEach(() => {
    mockNext.mockClear();
  });

  describe("isAdmin", () => {
    it("should call next when user is admin", () => {
      const req = { user: { role: "admin" } } as any;

      isAdmin(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw error when user is not admin", () => {
      const req = { user: { role: "member" } } as any;

      expect(() => isAdmin(req, mockResponse, mockNext)).toThrow();
    });

    it("should throw error when user is manager", () => {
      const req = { user: { role: "manager" } } as any;

      expect(() => isAdmin(req, mockResponse, mockNext)).toThrow();
    });
  });

  describe("isManagerOrIsAdmin", () => {
    it("should call next when user is admin", () => {
      const req = { user: { role: "admin" } } as any;

      isManagerOrIsAdmin(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next when user is manager", () => {
      const req = { user: { role: "manager" } } as any;

      isManagerOrIsAdmin(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw error when user is member", () => {
      const req = { user: { role: "member" } } as any;

      expect(() => isManagerOrIsAdmin(req, mockResponse, mockNext)).toThrow();
    });
  });

  describe("isSelfOrIsManagerOrIsAdm", () => {
    it("should call next when user is admin", () => {
      const req = { user: { role: "admin" }, params: {} } as any;

      isSelfOrIsManagerOrIsAdm(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next when user is manager", () => {
      const req = { user: { role: "manager" }, params: {} } as any;

      isSelfOrIsManagerOrIsAdm(req, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw error when user is member", () => {
      const req = { user: { role: "member" }, params: {} } as any;

      expect(() =>
        isSelfOrIsManagerOrIsAdm(req, mockResponse, mockNext),
      ).toThrow();
    });
  });
});
