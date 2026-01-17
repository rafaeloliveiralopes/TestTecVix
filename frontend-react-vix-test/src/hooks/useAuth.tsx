import { useZUserProfile } from "../stores/useZUserProfile";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import moment from "moment";
import { api } from "../services/api";
import { useCallback, useEffect, useRef } from "react";

const REFRESH_TIME = 50;

export const useAuth = () => {
  const { token, setUser, idUser } = useZUserProfile();
  const { loginTime, setLoginTime } = useZGlobalVar();
  const loginTimeRef = useRef(loginTime);

  useEffect(() => {
    loginTimeRef.current = loginTime;
  }, [loginTime]);

  const fetchNewUserToken = useCallback(async (): Promise<string | null> => {
    if (!idUser || !token) return null;
    const response = await api.get<{ token: string | null }>({
      url: `/user/token/${idUser}`,
      auth: { Authorization: `Bearer ${token}` },
      tryRefetch: true,
    });
    if (response.error || !response.data.token) return null;

    return response.data.token;
  }, [idUser, token]);

  const getAuth = useCallback(
    async (force = false) => {
      const lastLoginTime = loginTimeRef.current;
      if (
        !force &&
        token &&
        lastLoginTime &&
        moment(lastLoginTime).add(REFRESH_TIME, "minutes") > moment()
      ) {
        return { Authorization: `Bearer ${token}` };
      }

      const now = new Date();
      // Mantém `getAuth` estável (para consumidores poderem depender dela) sem depender
      // do estado `loginTime`. O `ref` guarda o valor mais recente.
      loginTimeRef.current = now;
      setLoginTime(now);

      if (!token) return {};

      const newToken = await fetchNewUserToken();
      if (newToken) setUser({ token: newToken });
      return { Authorization: `Bearer ${newToken || token}` };
    },
    [fetchNewUserToken, setLoginTime, setUser, token],
  );

  return {
    getAuth,
  };
};
