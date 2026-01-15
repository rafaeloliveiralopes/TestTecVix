import axios from "axios";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

interface IViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface IAddressByCepResponse {
  cep: string;
  street: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  cityCode: number | null;
}

export class AddressService {
  async getByCep(cep: string): Promise<IAddressByCepResponse> {
    const digits = String(cep ?? "").replace(/\D/g, "");
    if (digits.length !== 8) {
      throw new AppError(ERROR_MESSAGE.INVALID_DATA, STATUS_CODE.BAD_REQUEST);
    }

    const { data } = await axios.get<IViaCepResponse>(
      `https://viacep.com.br/ws/${digits}/json/`,
      { timeout: 15000 },
    );

    if (!data || data.erro) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return {
      cep: digits,
      street: data.logradouro ?? null,
      district: data.bairro ?? null,
      city: data.localidade ?? null,
      state: data.uf ?? null,
      cityCode: data.ibge ? Number(data.ibge) : null,
    };
  }
}
