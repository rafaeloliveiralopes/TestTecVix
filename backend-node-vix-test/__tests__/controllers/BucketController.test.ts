import { BucketController } from "../../src/controllers/BucketController";
import { IBucketService } from "../../src/types/Interfaces/IBucketService";

describe("BucketController", () => {
  let bucketController: BucketController;
  let mockBucketService: jest.Mocked<IBucketService>;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendFile: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    mockBucketService = {
      uploadFile: jest.fn(),
      renewPresignedUrl: jest.fn(),
      ensureBucketExists: jest.fn(),
      ensureNfseFolderExists: jest.fn(),
    } as any;
    bucketController = new BucketController(mockBucketService);
    mockRes.status.mockClear();
    mockRes.json.mockClear();
    mockRes.send.mockClear();
    mockRes.sendFile.mockClear();
  });

  describe("getFileInBucketByObjectName", () => {
    it("should send file for valid object name", async () => {
      const req = { params: { objectName: "test-file.png" } } as any;

      await bucketController.getFileInBucketByObjectName(req, mockRes);

      expect(mockRes.sendFile).toHaveBeenCalled();
    });

    it("should throw error for path traversal attempt", async () => {
      // Testa proteção contra ataques de path traversal
      const req = { params: { objectName: "../../../etc/passwd" } } as any;

      await expect(
        bucketController.getFileInBucketByObjectName(req, mockRes),
      ).rejects.toBeTruthy();
    });
  });

  describe("getFileByObjectName", () => {
    it("should return presigned URL for valid object name", async () => {
      mockBucketService.renewPresignedUrl.mockResolvedValue(
        "http://localhost/uploads/test.png",
      );
      const req = { params: { objectName: "test.png" } } as any;

      await bucketController.getFileByObjectName(req, mockRes);

      expect(mockBucketService.renewPresignedUrl).toHaveBeenCalledWith(
        "test.png",
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("uploadFile", () => {
    it("should upload file and return URL", async () => {
      const mockFile = {
        originalname: "test.png",
        buffer: Buffer.from("content"),
      };
      mockBucketService.uploadFile.mockResolvedValue({
        objectName: "123-test.png",
        url: "http://localhost/uploads/123-test.png",
      });
      const req = { file: mockFile } as any;

      await bucketController.uploadFile(req, mockRes);

      expect(mockBucketService.uploadFile).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when no file uploaded", async () => {
      const req = { file: null } as any;

      await bucketController.uploadFile(req, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
