import { VMController } from "../../src/controllers/VMController";
import { VMService } from "../../src/services/VMService";

jest.mock("../../src/services/VMService");

describe("VMController", () => {
  let vmController: VMController;
  let vmService: jest.Mocked<VMService>;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  const mockUser = { idUser: "user-1", role: "admin" };

  beforeEach(() => {
    vmController = new VMController();
    vmService = (vmController as any)["vMService"];
    mockRes.status.mockClear();
    mockRes.json.mockClear();
  });

  describe("getById", () => {
    it("should return VM by id with status 200", async () => {
      const mockVM = { idVM: 1, vmName: "test-vm" };
      vmService.getById.mockResolvedValue(mockVM);

      const req = { params: { idVM: "1" } } as any;

      await vmController.getById(req, mockRes);

      expect(vmService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockVM);
    });
  });

  describe("listAll", () => {
    it("should return list of VMs with status 200", async () => {
      const mockResult = { totalCount: 1, result: [{ idVM: 1 }] };
      vmService.listAll.mockResolvedValue(mockResult);

      const req = { query: {}, user: mockUser } as any;

      await vmController.listAll(req, mockRes);

      expect(vmService.listAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("createVM", () => {
    it("should create VM and return status 201", async () => {
      const mockVM = { idVM: 1, vmName: "new-vm" };
      vmService.createNewVM.mockResolvedValue(mockVM);

      const req = { body: {}, user: mockUser } as any;

      await vmController.createVM(req, mockRes);

      expect(vmService.createNewVM).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe("updateVM", () => {
    it("should update VM and return status 200", async () => {
      const mockVM = { idVM: 1, vmName: "updated" };
      vmService.updateVM.mockResolvedValue(mockVM);

      const req = { params: { idVM: "1" }, body: {}, user: mockUser } as any;

      await vmController.updateVM(req, mockRes);

      expect(vmService.updateVM).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteVM", () => {
    it("should delete VM and return status 200", async () => {
      const mockVM = { idVM: 1 };
      vmService.deleteVM.mockResolvedValue(mockVM);

      const req = { params: { idVM: "1" }, user: mockUser } as any;

      await vmController.deleteVM(req, mockRes);

      expect(vmService.deleteVM).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
