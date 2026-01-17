import { AddressController } from "../../src/controllers/AddressController";
import { AddressService } from "../../src/services/AddressService";

jest.mock("../../src/services/AddressService");

describe("AddressController", () => {
  let addressController: AddressController;
  let addressService: jest.Mocked<AddressService>;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    addressController = new AddressController();
    addressService = (addressController as any)["addressService"];
    mockRes.status.mockClear();
    mockRes.json.mockClear();
  });

  describe("getByCep", () => {
    it("should return address for valid CEP with status 200", async () => {
      const mockAddress = {
        cep: "01310100",
        street: "Avenida Paulista",
        district: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        cityCode: 3550308,
      };
      addressService.getByCep.mockResolvedValue(mockAddress);

      const req = { params: { cep: "01310100" } } as any;

      await addressController.getByCep(req, mockRes);

      expect(addressService.getByCep).toHaveBeenCalledWith("01310100");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockAddress);
    });

    it("should handle missing cep param", async () => {
      const mockAddress = {
        cep: "",
        street: null,
        district: null,
        city: null,
        state: null,
        cityCode: null,
      };
      addressService.getByCep.mockResolvedValue(mockAddress);

      const req = { params: {} } as any;

      await addressController.getByCep(req, mockRes);

      expect(addressService.getByCep).toHaveBeenCalledWith("");
    });
  });
});
