import { VMService } from "../../src/services/VMService";
import { VMModel } from "../../src/models/VMModel";

jest.mock("../../src/models/VMModel");

describe("VMService", () => {
  let vmService: VMService;
  let vmModel: jest.Mocked<VMModel>;

  const mockUser = {
    idUser: "user-1",
    username: "testuser",
    password: "hashed",
    email: "test@test.com",
    role: "admin" as const,
    idBrandMaster: 1,
    isActive: true,
    profileImgUrl: null,
    userPhoneNumber: null,
    field: null,
    department: null,
    contractDate: null,
    fullName: null,
    lastLoginDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    vmService = new VMService();
    // Acessa o model mockado criado internamente pelo service
    vmModel = (vmService as any)["vMModel"];
  });

  describe("getById", () => {
    it("should return VM without password", async () => {
      // Garante que senha nunca vaza no retorno
      const mockVM = { idVM: 1, vmName: "test-vm", pass: "secret123" };
      vmModel.getById.mockResolvedValue(mockVM as any);

      const result = await vmService.getById(1);

      expect(result).not.toHaveProperty("pass");
      expect(result).toHaveProperty("vmName", "test-vm");
    });

    it("should return null when VM not found", async () => {
      vmModel.getById.mockResolvedValue(null);

      const result = await vmService.getById(999);

      expect(result).toBeNull();
    });
  });

  describe("listAll", () => {
    it("should return list of VMs without passwords", async () => {
      const mockResult = {
        totalCount: 1,
        result: [{ idVM: 1, vmName: "vm1", pass: "secret" }],
      };
      vmModel.listAll.mockResolvedValue(mockResult as any);

      const result = await vmService.listAll({}, mockUser);

      expect(result.result[0]).not.toHaveProperty("pass");
      expect(result.totalCount).toBe(1);
    });
  });

  describe("createNewVM", () => {
    it("should create VM and return without password", async () => {
      const newVM = {
        vmName: "new-vm",
        vCPU: 2,
        ram: 4,
        disk: 50,
        pass: "NewPass123!@#$",
        os: "ubuntu2404",
        location: "bre_barueri",
      };
      const createdVM = { ...newVM, idVM: 1 };
      vmModel.createNewVM.mockResolvedValue(createdVM as any);

      const result = await vmService.createNewVM(newVM, mockUser);

      expect(vmModel.createNewVM).toHaveBeenCalled();
      expect(result).not.toHaveProperty("pass");
    });

    it("should handle vmLocalization field", async () => {
      // Testa normalização do campo vmLocalization.value -> location
      const newVM = {
        vmName: "new-vm",
        vCPU: 2,
        ram: 4,
        disk: 50,
        pass: "NewPass123!@#$",
        os: "ubuntu2404",
        vmLocalization: { value: "usa_miami" },
      };
      vmModel.createNewVM.mockResolvedValue({ ...newVM, idVM: 1 } as any);

      await vmService.createNewVM(newVM, mockUser);

      expect(vmModel.createNewVM).toHaveBeenCalled();
    });
  });

  describe("updateVM", () => {
    it("should update VM and return without password", async () => {
      const existingVM = { idVM: 1, vmName: "old-vm" };
      const updateData = { vmName: "updated-vm" };
      vmModel.getById.mockResolvedValue(existingVM as any);
      vmModel.updateVM.mockResolvedValue({
        ...existingVM,
        ...updateData,
      } as any);

      const result = await vmService.updateVM(1, updateData, mockUser);

      expect(vmModel.updateVM).toHaveBeenCalled();
      expect(result).toHaveProperty("vmName", "updated-vm");
    });

    it("should throw error when VM not found", async () => {
      vmModel.getById.mockResolvedValue(null);

      await expect(vmService.updateVM(999, {}, mockUser)).rejects.toBeTruthy();
    });

    it("should hash password when updating", async () => {
      const existingVM = { idVM: 1, vmName: "vm" };
      vmModel.getById.mockResolvedValue(existingVM as any);
      vmModel.updateVM.mockResolvedValue(existingVM as any);

      await vmService.updateVM(1, { pass: "NewPass123!@#$" }, mockUser);

      expect(vmModel.updateVM).toHaveBeenCalled();
    });
  });

  describe("deleteVM", () => {
    it("should delete VM and return without password", async () => {
      const existingVM = { idVM: 1, vmName: "vm", pass: "secret" };
      vmModel.getById.mockResolvedValue(existingVM as any);
      vmModel.deleteVM.mockResolvedValue(existingVM as any);

      const result = await vmService.deleteVM(1, mockUser);

      expect(vmModel.deleteVM).toHaveBeenCalledWith(1);
      expect(result).not.toHaveProperty("pass");
    });

    it("should throw error when VM not found", async () => {
      vmModel.getById.mockResolvedValue(null);

      await expect(vmService.deleteVM(999, mockUser)).rejects.toBeTruthy();
    });
  });
});
