import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { api } from "../services/api";
import { useAuth } from "./useAuth";

export interface IAddressByCepResponse {
  cep: string;
  street: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  cityCode: number | null;
}

export const useAddressResources = () => {
  const { t } = useTranslation();
  const { getAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getByCep = async (cep: string) => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IAddressByCepResponse>({
      url: `/address/cep/${cep}`,
      auth,
    });
    setIsLoading(false);

    if (response.error) {
      toast.error(response.message || t("generic.errorToSaveData"));
      return null;
    }

    return response.data;
  };

  return { isLoading, getByCep };
};

