import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { ParamsDictionary } from "express-serve-static-core";
import { TBrandMaster } from "../types/validations/BrandMaster/createBrandMaster";
import { BrandMasterService } from "../services/BrandMasterService";
import { user } from "@prisma/client";
import { STATUS_CODE } from "../constants/statusCode";

export class BrandMasterController {
  constructor() {}
  private brandMasterService = new BrandMasterService();

  async getSelf(req: CustomRequest<unknown>, res: Response) {
    return res.status(STATUS_CODE.OK).json(null);
  }

  async getById(req: CustomRequest<unknown>, res: Response) {
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.getById(Number(idBrandMaster));
    return res.status(STATUS_CODE.OK).json(result);
  }

  async listAll(req: CustomRequest<unknown>, res: Response) {
    const result = await this.brandMasterService.listAll(req.query);
    return res.status(STATUS_CODE.OK).json(result);
  }

  async createNewBrandMaster(
    req: CustomRequest<user, ParamsDictionary, unknown, TBrandMaster>,
    res: Response,
  ) {
    const user = req.user as user;
    const result = await this.brandMasterService.createNewBrandMaster(
      req.body,
      user,
    );
    return res.status(STATUS_CODE.CREATED).json(result);
  }

  async updateBrandMaster(
    req: CustomRequest<user, { idBrandMaster: string }, unknown, TBrandMaster>,
    res: Response,
  ) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.updateBrandMaster(
      Number(idBrandMaster),
      req.body,
      user,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }

  async deleteBrandMaster(req: CustomRequest<unknown>, res: Response) {
    const user = req.user as user;
    const { idBrandMaster } = req.params;
    const result = await this.brandMasterService.deleteBrandMaster(
      Number(idBrandMaster),
      user,
    );
    return res.status(STATUS_CODE.OK).json(result);
  }
}
