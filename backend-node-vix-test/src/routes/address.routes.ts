import { Response, Router } from "express";
import { API_VERSION, ROOT_PATH } from "../constants/basePathRoutes";
import { AddressController } from "../controllers/AddressController";
import { CustomRequest } from "../types/custom";

const BASE_PATH = API_VERSION.V1 + ROOT_PATH.ADDRESS; // /api/v1/address

const addressRoutes = Router();

export const makeAddressController = () => {
  return new AddressController();
};

const addressController = makeAddressController();

addressRoutes.get(
  `${BASE_PATH}/cep/:cep`,
  async (req: CustomRequest<unknown, { cep: string }>, res: Response) => {
    await addressController.getByCep(req, res);
  },
);

export { addressRoutes };
