import { useState } from "react";
import { useAuth } from "./useAuth";
import { api } from "../services/api";
import { IUserResponse } from "../types/userTypes";

export const useListUsers = () => {
  const [userList, setUserList] = useState<IUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();

  const fetchListUsers = async () => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IUserResponse[]>({
      url: "/users",
      auth,
    });

    setIsLoading(false);

    if (response.error) {
      setUserList([]);
      return;
    }

    const sorted = [...(response.data ?? [])].sort((a, b) => {
      const aDate = a?.lastLoginDate ? new Date(a.lastLoginDate).getTime() : 0;
      const bDate = b?.lastLoginDate ? new Date(b.lastLoginDate).getTime() : 0;
      return bDate - aDate;
    });
    setUserList(sorted.filter((u) => u.isActive).slice(0, 5));
  };

  return {
    isLoading,
    userList,
    fetchListUsers,
  };
};
