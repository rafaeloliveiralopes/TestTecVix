import { useCallback, useState } from "react";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";
import { IVMCreatedResponse } from "../types/VMTypes";

export const useMyVMList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();

  const fetchMyVmsList = useCallback(
    async (
      params: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string | null;
        orderBy?: string; // field_name:asc or field_name:desc
        idBrandMaster?: number | "null";
      } = {},
    ) => {
      const auth = await getAuth();
      setIsLoading(true);
      const response = await api.get<IListAll<IVMCreatedResponse>>({
        url: "/vm",
        auth,
        params: {
          ...Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== null),
          ),
          //status: "PAUSED", // "RUNNING", "STOPPED", "PAUSED", "null", undefined
        },
      });

      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
        return { totalCount: 0, vmList: [] };
      }

      const vmList = response.data?.result;
      const totalCount = parseInt(response.data?.totalCount?.toString());
      return { totalCount, vmList };
    },
    [getAuth],
  );

  return { isLoading, fetchMyVmsList };
};
