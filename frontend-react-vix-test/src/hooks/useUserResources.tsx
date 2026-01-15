import { useState } from "react";
import { TRole, useZUserProfile } from "../stores/useZUserProfile";
import { useAuth } from "./useAuth";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export interface IUserDB {
  idUser: number;
  idBrandMaster: number | null;
  username: string;
  email: string;
  userPhoneNumber: string | null;
  profileImgUrl: null | string;
  role: "admin" | "manager" | "member";
  isActive: boolean;
  socketId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  fullName?: string;
}

interface ICreateNewUser {
  username: string;
  email: string;
  role: TRole;
  password?: string;
  fullName?: string;
  userPhoneNumber?: string;
  idBrandMaster?: number;
  isActive?: boolean;
}

export const useUserResources = () => {
  const { idUser, setUser, role, idBrand } = useZUserProfile();
  const { getAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const updateUser = async (data: Partial<IUserDB>) => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<IUserDB>({
      url: `/users/${idUser}`,
      data,
      auth,
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return null;
    }

    setUser({
      profileImgUrl: response.data.profileImgUrl,
      username: response.data.username,
      userEmail: response.data.email,
      idBrand: response.data.idBrandMaster,

      role: response.data.role,
      userPhoneNumber: response.data.userPhoneNumber,
    });

    return response.data;
  };

  const createUserByManager = async (data: ICreateNewUser) => {
    if (role !== "admin" && role !== "manager") return null;
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
      toast.error(response.message);
      return null;
    }

    return response.data;
  };

  return { isLoading, updateUser, createUserByManager };
};
