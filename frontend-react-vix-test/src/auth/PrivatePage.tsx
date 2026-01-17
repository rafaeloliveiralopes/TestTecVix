import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";
import { FullPage } from "../components/Skeletons/FullPage";
import { useEffect, useState } from "react";
import { useZUserProfile } from "../stores/useZUserProfile";

interface IProps {
  children: React.ReactNode;
  onlyManagerOrAdmin?: boolean;
  onlyAdmin?: boolean;
  skeleton?: boolean;
}

export const PrivatePage = ({
  children,
  onlyAdmin = false,
  onlyManagerOrAdmin = false,
}: IProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(() =>
    useZUserProfile.persist?.hasHydrated?.() ?? true,
  );
  const { resetAllStates } = useZResetAllStates();
  const navigate = useNavigate();
  const { role, token } = useZUserProfile();

  useEffect(() => {
    if ((useZUserProfile.persist?.hasHydrated?.() ?? true) === true) {
      setHasHydrated(true);
      return;
    }

    const unsubscribe = useZUserProfile.persist?.onFinishHydration?.(() => {
      setHasHydrated(true);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    switch (true) {
      case !token:
        resetAllStates();
        navigate("/login", { replace: true });
        break;
      // Evita "loop de tela" e voltar na navegação enquanto o estado do usuário ainda está hidratando/atualizando
      case (onlyAdmin || onlyManagerOrAdmin) && role === null:
        return;
      case onlyAdmin && role !== "admin":
        navigate(-1);
        break;
      case onlyManagerOrAdmin && role !== "admin" && role !== "manager":
        navigate(-1);
        break;

      default:
        setIsChecking(false);
        break;
    }
  }, [hasHydrated, navigate, onlyAdmin, onlyManagerOrAdmin, resetAllStates, role, token]);

  if (isChecking) {
    return <FullPage />;
  }

  return <>{children}</>;
};
