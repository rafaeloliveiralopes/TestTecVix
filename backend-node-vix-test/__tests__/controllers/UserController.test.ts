import { UserController } from "../../src/controllers/UserController";
import { UserService } from "../../src/services/UserService";

jest.mock("../../src/services/UserService");

describe("UserController", () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as any;

  const mockUser = {
    idUser: "user-1",
    username: "testuser",
    email: "test@test.com",
    role: "admin",
  };

  beforeEach(() => {
    userController = new UserController();
    userService = (userController as any)["userService"];
    mockRes.status.mockClear();
    mockRes.json.mockClear();
    mockRes.send.mockClear();
  });

  describe("getSelf", () => {
    it("should return current user with status 200", async () => {
      const req = { user: mockUser } as any;

      await userController.getSelf(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("updateSelf", () => {
    it("should update current user and return status 200", async () => {
      userService.updateSelf.mockResolvedValue(mockUser as any);
      const req = { user: mockUser, body: { fullName: "New Name" } } as any;

      await userController.updateSelf(req, mockRes);

      expect(userService.updateSelf).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateSelfPassword", () => {
    it("should update password and return status 200", async () => {
      userService.updateSelfPassword.mockResolvedValue(mockUser as any);
      const req = {
        user: mockUser,
        body: { oldPassword: "old", newPassword: "NewPass123!" },
      } as any;

      await userController.updateSelfPassword(req, mockRes);

      expect(userService.updateSelfPassword).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("register", () => {
    it("should register user and return status 201", async () => {
      userService.register.mockResolvedValue(mockUser as any);
      const req = { body: {} } as any;

      await userController.register(req, mockRes);

      expect(userService.register).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("login", () => {
    it("should login user and return status 200", async () => {
      userService.login.mockResolvedValue({
        user: mockUser,
        token: "jwt",
      } as any);
      const req = { body: {} } as any;

      await userController.login(req, mockRes);

      expect(userService.login).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getById", () => {
    it("should return user by id with status 200", async () => {
      userService.getById.mockResolvedValue(mockUser as any);
      const req = { params: { idUser: "user-1" } } as any;

      await userController.getById(req, mockRes);

      expect(userService.getById).toHaveBeenCalledWith("user-1");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("listAll", () => {
    it("should return list of users with status 200", async () => {
      userService.listAll.mockResolvedValue([mockUser] as any);
      const req = {} as any;

      await userController.listAll(req, mockRes);

      expect(userService.listAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("create", () => {
    it("should create user and return status 201", async () => {
      userService.register.mockResolvedValue(mockUser as any);
      const req = { body: {} } as any;

      await userController.create(req, mockRes);

      expect(userService.register).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("update", () => {
    it("should update user and return status 200", async () => {
      userService.update.mockResolvedValue(mockUser as any);
      const req = {
        params: { idUser: "user-1" },
        body: {},
        user: mockUser,
      } as any;

      await userController.update(req, mockRes);

      expect(userService.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("delete", () => {
    it("should delete user and return status 204", async () => {
      userService.delete.mockResolvedValue(undefined);
      const req = { params: { idUser: "user-1" } } as any;

      await userController.delete(req, mockRes);

      expect(userService.delete).toHaveBeenCalledWith("user-1");
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });
});
