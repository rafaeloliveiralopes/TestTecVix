import { useCallback, useState } from "react";
import { TRole, useZUserProfile } from "../stores/useZUserProfile";
import { useAuth } from "./useAuth";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { translateBackendError } from "../utils/translateBackendError";

export interface IUserDB {
  idUser: string;
  idBrandMaster: number | null;
  username: string;
  email: string;
  userPhoneNumber: string | null;
  profileImgUrl: null | string;
  role: "admin" | "manager" | "member";
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  fullName?: string;
  field?: string | null;
  department?: string | null;
  contractDate?: string | Date | null;
  lastLoginDate?: string | Date | null;
  brandMaster?: { brandName: string | null } | null;
}

interface ICreateNewUser {
  username: string;
  email: string;
  role: TRole;
  password?: string;
  fullName?: string;
  userPhoneNumber?: string;
  field?: string;
  department?: string;
  contractDate?: string;
  idBrandMaster?: number;
  isActive?: boolean;
}

export const useUserResources = () => {
  const { setUser, role, idBrand } = useZUserProfile();
  const { getAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const getSelf = useCallback(async () => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IUserDB>({
      url: `/users/self`,
      auth,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(translateBackendError(response.message, t));
      return null;
    }

    setUser({
      fullName: response.data.fullName ?? null,
      profileImgUrl: response.data.profileImgUrl,
      profileImgRemoved: false,
      objectName: "",
      imageUrl: "",
      username: response.data.username,
      userEmail: response.data.email,
      idBrand: response.data.idBrandMaster,
      role: response.data.role,
      userPhoneNumber: response.data.userPhoneNumber,
    });

    return response.data;
  }, [getAuth, setUser]);

  const updateUser = useCallback(
    async (data: Partial<IUserDB>) => {
      const auth = await getAuth();
      setIsLoading(true);
      const response = await api.put<IUserDB>({
        // Atualização de perfil do próprio usuário (independente de role).
        url: `/users/self`,
        data,
        auth,
      });
      setIsLoading(false);
      if (response.error) {
        toast.error(translateBackendError(response.message, t));
        return null;
      }

      setUser({
        fullName: response.data.fullName ?? null,
        profileImgUrl: response.data.profileImgUrl,
        profileImgRemoved: false,
        objectName: "",
        imageUrl: "",
        username: response.data.username,
        userEmail: response.data.email,
        idBrand: response.data.idBrandMaster,

        role: response.data.role,
        userPhoneNumber: response.data.userPhoneNumber,
      });

      return response.data;
    },
    [getAuth, setUser],
  );

  const updateSelfPassword = useCallback(
    async (password: string) => {
      const auth = await getAuth();
      setIsLoading(true);
      const response = await api.put<{ ok: true }>({
        url: `/users/self/password`,
        data: { password },
        auth,
      });
      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
        return false;
      }
      return true;
    },
    [getAuth],
  );

  const listUsers = async () => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IUserDB[]>({
      url: `/users`,
      auth,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(translateBackendError(response.message, t));
      return null;
    }

    return response.data ?? [];
  };

  const createUserByManager = async (data: ICreateNewUser) => {
    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOnlyAdminOrManager"));
      return null;
    }
    const idBrandMaster = data.idBrandMaster ?? idBrand;
    if (!idBrandMaster) {
      toast.error(t("generic.errorToSaveData"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.post<IUserDB>({
      url: `/users`,
      auth,
      data: {
        ...data,
        idBrandMaster,
      },
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(translateBackendError(response.message, t));
      return null;
    }

    return response.data;
  };

  const updateUserByManager = async (idUser: string, data: ICreateNewUser) => {
    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOnlyAdminOrManager"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<IUserDB>({
      url: `/users/${idUser}`,
      auth,
      data,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(translateBackendError(response.message, t));
      return null;
    }

    return response.data;
  };

  const deleteUserByAdmin = async (idUser: string) => {
    if (!idUser) return false;
    if (role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return false;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.delete<unknown>({
      url: `/users/${idUser}`,
      auth,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(translateBackendError(response.message, t));
      return false;
    }
    return true;
  };

  return {
    isLoading,
    getSelf,
    updateUser,
    updateSelfPassword,
    listUsers,
    createUserByManager,
    updateUserByManager,
    deleteUserByAdmin,
  };
};
