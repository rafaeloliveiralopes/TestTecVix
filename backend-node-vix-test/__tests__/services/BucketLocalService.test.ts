import { BucketLocalService } from "../../src/services/BucketLocalService";
import fs from "fs/promises";

// Mock do fs/promises para evitar I/O real durante testes
jest.mock("fs/promises");

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("BucketLocalService", () => {
  let bucketService: BucketLocalService;

  beforeEach(() => {
    bucketService = new BucketLocalService();
    jest.clearAllMocks();
  });

  describe("ensureBucketExists", () => {
    it("should not create folder if it already exists", async () => {
      mockedFs.access.mockResolvedValue(undefined);

      await bucketService.ensureBucketExists();

      expect(mockedFs.access).toHaveBeenCalled();
      expect(mockedFs.mkdir).not.toHaveBeenCalled();
    });

    it("should create folder if it does not exist", async () => {
      mockedFs.access.mockRejectedValue(new Error("ENOENT"));
      mockedFs.mkdir.mockResolvedValue(undefined);

      await bucketService.ensureBucketExists();

      expect(mockedFs.mkdir).toHaveBeenCalled();
    });
  });

  describe("ensureNfseFolderExists", () => {
    it("should not create folder if it already exists", async () => {
      mockedFs.access.mockResolvedValue(undefined);

      await bucketService.ensureNfseFolderExists();

      expect(mockedFs.access).toHaveBeenCalled();
      expect(mockedFs.mkdir).not.toHaveBeenCalled();
    });

    it("should create folder if it does not exist", async () => {
      mockedFs.access.mockRejectedValue(new Error("ENOENT"));
      mockedFs.mkdir.mockResolvedValue(undefined);

      await bucketService.ensureNfseFolderExists();

      expect(mockedFs.mkdir).toHaveBeenCalled();
    });
  });

  describe("uploadFile", () => {
    it("should upload file and return public URL", async () => {
      mockedFs.access.mockResolvedValue(undefined);
      mockedFs.writeFile.mockResolvedValue(undefined);

      const mockFile = {
        originalname: "test-file.png",
        buffer: Buffer.from("test content"),
        mimetype: "image/png",
      } as Express.Multer.File;

      const result = await bucketService.uploadFile("bucket", mockFile);

      expect(mockedFs.writeFile).toHaveBeenCalled();
      expect(result).toHaveProperty("objectName");
      expect(result).toHaveProperty("url");
      expect(result.url).toContain("/uploads/");
    });
  });

  describe("renewPresignedUrl", () => {
    it("should return public URL for object", async () => {
      const result = await bucketService.renewPresignedUrl("test-object.png");

      expect(result).toContain("/uploads/test-object.png");
    });
  });
});
