import { useEffect, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useZUserProfile } from "../stores/useZUserProfile";
import { IBrandMasterResponse } from "../types/BrandMasterTypes";
import { useBrandMasterInfos } from "./useBrandMasterInfos";
import { useUserResources } from "./useUserResources";

export const useLoadingApp = (notLoginPage: boolean = false) => {
  const [loading, setLoading] = useState(true);
  const { resetAll: resetAllUser, idUser, token } = useZUserProfile();
  const { setBrandInfos } = useBrandMasterInfos();
  const { getSelf } = useUserResources();
  const path = window.location.pathname;

  const fetchTheme = async () => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      return;
    }

    // Carrega dados do BrandMaster e do perfil do usuário em paralelo.
    // Garante que profileImgUrl e outros dados estejam atualizados no boot do app.
    const [theme] = await Promise.all([
      api.get<IBrandMasterResponse | null>({
        url: "/brand-master/self",
        auth: { Authorization: `Bearer ${token}` },
        tryRefetch: true,
      }),
      getSelf(),
    ]);

    if (theme.error) {
      const { isTokenError } = await import("../utils/translateBackendError");
      if (!isTokenError(theme.message)) toast.error(theme.message);
      return setLoading(false);
    }

    if (!theme.data) {
      setLoading(false);
      if (notLoginPage) return;
      return;
    }
    await setBrandInfos(theme.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTheme();
  }, [path]);

  useEffect(() => {
    if (!notLoginPage && idUser) {
      resetAllUser();
    }
  }, []);

  return {
    loading,
  };
};
