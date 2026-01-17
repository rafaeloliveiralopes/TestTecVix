import { BrandMasterController } from "../../src/controllers/BrandMasterController";
import { BrandMasterService } from "../../src/services/BrandMasterService";

jest.mock("../../src/services/BrandMasterService");

describe("BrandMasterController", () => {
  let brandMasterController: BrandMasterController;
  let brandMasterService: jest.Mocked<BrandMasterService>;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  const mockUser = { idUser: "user-1", role: "admin", idBrandMaster: 1 };

  beforeEach(() => {
    brandMasterController = new BrandMasterController();
    brandMasterService = (brandMasterController as any)["brandMasterService"];
    mockRes.status.mockClear();
    mockRes.json.mockClear();
  });

  describe("getSelf", () => {
    it("should return null when user has no idBrandMaster", async () => {
      const req = { user: { idUser: "user-1", idBrandMaster: null } } as any;

      await brandMasterController.getSelf(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it("should return null when brandMaster not found", async () => {
      brandMasterService.getById.mockResolvedValue(null);
      const req = { user: mockUser } as any;

      await brandMasterController.getSelf(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(null);
    });

    it("should return brandMaster data when found", async () => {
      const mockBrandMaster = {
        idBrandMaster: 1,
        brandName: "Test Brand",
        domain: "test.com",
      };
      brandMasterService.getById.mockResolvedValue(mockBrandMaster as any);
      const req = { user: mockUser } as any;

      await brandMasterController.getSelf(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return brandMaster by id with status 200", async () => {
      const mockBrandMaster = { idBrandMaster: 1, brandName: "Test" };
      brandMasterService.getById.mockResolvedValue(mockBrandMaster as any);

      const req = { params: { idBrandMaster: "1" } } as any;

      await brandMasterController.getById(req, mockRes);

      expect(brandMasterService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("listAll", () => {
    it("should return list of brandMasters with status 200", async () => {
      const mockResult = { totalCount: 1, result: [{ idBrandMaster: 1 }] };
      brandMasterService.listAll.mockResolvedValue(mockResult as any);

      const req = { query: {} } as any;

      await brandMasterController.listAll(req, mockRes);

      expect(brandMasterService.listAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("createNewBrandMaster", () => {
    it("should create brandMaster and return status 201", async () => {
      const mockBrandMaster = { idBrandMaster: 1, brandName: "New Brand" };
      brandMasterService.createNewBrandMaster.mockResolvedValue(
        mockBrandMaster as any,
      );

      const req = { body: {}, user: mockUser } as any;

      await brandMasterController.createNewBrandMaster(req, mockRes);

      expect(brandMasterService.createNewBrandMaster).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateBrandMaster", () => {
    it("should update brandMaster and return status 200", async () => {
      const mockBrandMaster = { idBrandMaster: 1, brandName: "Updated" };
      brandMasterService.updateBrandMaster.mockResolvedValue(
        mockBrandMaster as any,
      );

      const req = {
        params: { idBrandMaster: "1" },
        body: {},
        user: mockUser,
      } as any;

      await brandMasterController.updateBrandMaster(req, mockRes);

      expect(brandMasterService.updateBrandMaster).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteBrandMaster", () => {
    it("should delete brandMaster and return status 200", async () => {
      const mockBrandMaster = { idBrandMaster: 1 };
      brandMasterService.deleteBrandMaster.mockResolvedValue(
        mockBrandMaster as any,
      );

      const req = { params: { idBrandMaster: "1" }, user: mockUser } as any;

      await brandMasterController.deleteBrandMaster(req, mockRes);

      expect(brandMasterService.deleteBrandMaster).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
