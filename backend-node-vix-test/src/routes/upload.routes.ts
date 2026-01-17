import { Router } from "express";
import multer from "multer";
import { API_VERSION } from "../constants/basePathRoutes";
import { authUser } from "../auth/authUser";
import { BucketController } from "../controllers/BucketController";
import { BucketLocalService } from "../services/BucketLocalService";

const BASE_PATH = API_VERSION.V1 + "/upload";

const uploadRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const bucketController = new BucketController(new BucketLocalService());

// GET público: resolve um `objectName` para uma URL pública do arquivo (usado pelo frontend para exibição).
uploadRoutes.get(`${BASE_PATH}/file/:objectName`, async (req, res) => {
  await bucketController.getFileByObjectName(req, res);
});

// POST protegido: upload de arquivo (multipart/form-data). O frontend envia `FormData` com a chave "file".
uploadRoutes.post(
  `${BASE_PATH}/file`,
  authUser,
  upload.single("file"),
  async (req, res) => {
    await bucketController.uploadFile(req, res);
  },
);

export { uploadRoutes };
