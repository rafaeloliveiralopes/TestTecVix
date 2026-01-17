import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { AddressService } from "../services/AddressService";
import { STATUS_CODE } from "../constants/statusCode";

export class AddressController {
  constructor() {}
  private addressService = new AddressService();

  async getByCep(req: CustomRequest<unknown>, res: Response) {
    const { cep } = req.params as { cep?: string };
    const result = await this.addressService.getByCep(String(cep ?? ""));
    return res.status(STATUS_CODE.OK).json(result);
  }
}
