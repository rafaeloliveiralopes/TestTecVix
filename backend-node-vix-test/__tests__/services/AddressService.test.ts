import { AddressService } from "../../src/services/AddressService";
import axios from "axios";

// Mock da lib axios para isolar testes do serviço externo ViaCEP
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddressService", () => {
  let addressService: AddressService;

  beforeEach(() => {
    addressService = new AddressService();
    mockedAxios.get.mockClear();
  });

  describe("getByCep", () => {
    it("should return formatted address for valid CEP", async () => {
      const mockViaCepResponse = {
        data: {
          cep: "01310-100",
          logradouro: "Avenida Paulista",
          bairro: "Bela Vista",
          localidade: "São Paulo",
          uf: "SP",
          ibge: "3550308",
        },
      };
      mockedAxios.get.mockResolvedValue(mockViaCepResponse);

      const result = await addressService.getByCep("01310100");

      expect(result).toEqual({
        cep: "01310100",
        street: "Avenida Paulista",
        district: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        cityCode: 3550308,
      });
    });

    it("should handle CEP with formatting", async () => {
      const mockViaCepResponse = {
        data: {
          cep: "01310-100",
          logradouro: "Avenida Paulista",
        },
      };
      mockedAxios.get.mockResolvedValue(mockViaCepResponse);

      const result = await addressService.getByCep("01310-100");

      expect(result.cep).toBe("01310100");
    });

    it("should throw error for invalid CEP length", async () => {
      await expect(addressService.getByCep("123")).rejects.toBeTruthy();
    });

    it("should throw error when ViaCep returns error", async () => {
      mockedAxios.get.mockResolvedValue({ data: { erro: true } });

      await expect(addressService.getByCep("00000000")).rejects.toBeTruthy();
    });

    it("should throw error when ViaCep returns empty data", async () => {
      mockedAxios.get.mockResolvedValue({ data: null });

      await expect(addressService.getByCep("00000000")).rejects.toBeTruthy();
    });

    it("should return null for optional fields not provided", async () => {
      const mockViaCepResponse = {
        data: {
          cep: "01310-100",
        },
      };
      mockedAxios.get.mockResolvedValue(mockViaCepResponse);

      const result = await addressService.getByCep("01310100");

      expect(result.street).toBeNull();
      expect(result.district).toBeNull();
      expect(result.city).toBeNull();
      expect(result.state).toBeNull();
      expect(result.cityCode).toBeNull();
    });
  });
});
