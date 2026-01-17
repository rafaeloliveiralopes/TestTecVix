import { useCallback, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";

interface IUserLoginResponse {
  token: string | null;
  user?: {
    createdAt: string | Date;
    deletedAt: string | Date | null;
    email: string;
    idBrandMaster: number | null;
    idUser: number;
    isActive: boolean;
    profileImgUrl: null | string;
    role: "admin" | "manager" | "member";
    updatedAt: string | Date;
    username: string;
    userPhoneNumber: string | null;
  };
}

type TJwtPayload = {
  idUser?: number;
  role?: "admin" | "manager" | "member";
  [key: string]: unknown;
};

const decodeJwtPayload = (token: string): TJwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as TJwtPayload;
  } catch {
    return null;
  }
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsOpenModalUserNotActive, setLoginTime } =
    useZGlobalVar();
  const { setUser } = useZUserProfile();
  const { resetAllStates } = useZResetAllStates();
  const navigate = useNavigate();

  const goLogin = useCallback(
    async ({
      username,
      password,
      email,
    }: {
      username: string;
      password: string;
      email: string;
    }) => {
      setIsLoading(true);
      const loginEmail = (email || username || "").trim();
      if (!loginEmail || !password) {
        setIsLoading(false);
        return;
      }

      const response = await api.post<IUserLoginResponse>({
        url: "/auth/login",
        data: {
          email: loginEmail,
          password,
        },
        tryRefetch: true,
      });

      setIsLoading(false);
      if (response.error) {
        toast.error(response.message);
        return;
      }

      if (!response.data?.token) {
        toast.error("Missing token");
        return;
      }

      const payload = decodeJwtPayload(response.data.token);

      if (response.data.user && !response.data.user?.isActive) {
        setIsOpenModalUserNotActive(true);
        return;
      }

      setUser(
        response.data.user
          ? {
              idUser: response.data.user.idUser,
              profileImgUrl: response.data.user.profileImgUrl,
              username: response.data.user.username,
              userEmail: response.data.user.email,
              idBrand: response.data.user.idBrandMaster,
              token: response.data.token,
              role: response.data.user.role,
              userPhoneNumber: response.data.user.userPhoneNumber,
            }
          : {
              token: response.data.token,
              userEmail: loginEmail,
              username: username || null,
              idUser:
                typeof payload?.idUser === "number" ? payload.idUser : null,
              role: payload?.role || null,
            },
      );
      setLoginTime(new Date());
      navigate("/");
    },
    [navigate, setIsOpenModalUserNotActive, setLoginTime, setUser],
  );

  const goLogout = useCallback(() => {
    // Mantém referência estável: evita loops em hooks que dependem desse handler.
    resetAllStates();
    return navigate("/login");
  }, [navigate, resetAllStates]);

  return { goLogin, isLoading, goLogout };
};
