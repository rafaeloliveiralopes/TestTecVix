import { toast } from "react-toastify";
import { api } from "../services/api";
import { useAuth } from "./useAuth";
import { useState } from "react";

export const useUploadFile = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();

  const uploadFile = async (file: File) => {
    const auth = await getAuth();
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    // Upload com `FormData` (o `Content-Type` é tratado no client para não quebrar o boundary).
    const response = await api.post<{ objectName: string; url: string }>({
      url: "/upload/file",
      data: formData,
      timeout: 120000,
      auth,
    });
    setIsUploading(false);

    if (response.error) {
      toast.error(response.message);
      return { url: "", objectName: "" };
    }

    return response.data;
  };

  // Função para fazer upload do arquivo
  const handleUpload = async (file: File) => {
    if (!file) {
      return;
    }
    return await uploadFile(file);
  };

  const getFileByObjectName = async (objectName: string) => {
    if (!objectName) return { url: "" };
    if (
      objectName.includes("https://") ||
      objectName.includes("http://") ||
      objectName.includes("/assets")
    )
      return { url: objectName };
    setIsLoading(true);
    const url = objectName[0] === "/" ? objectName.slice(1) : objectName;
    const response = await api.get<{ url: string }>({
      url: `/upload/file/${url}`,
      auth: {},
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return { url: "" };
    }
    return { url: response.data?.url || "" };
  };

  return { handleUpload, isUploading, getFileByObjectName, isLoading };
};
