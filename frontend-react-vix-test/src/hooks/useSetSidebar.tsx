import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useTranslation } from "react-i18next";

export const useSetSidebar = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentSidebarSelected, setCurrentSidebarSelected } = useZGlobalVar();
  const [selected, setSelected] = useState<string | null>(
    currentSidebarSelected.label,
  );

  const hashMapRoutes = useMemo<{ [key: string]: string }>(
    () => ({
      "/": t("sidebar.home"),
      "/virtual-machine": t("sidebar.newVM"),
      "/my-virtual-machines": t("sidebar.myVMs"),
      "/dashboard": t("sidebar.dashboard"),
      "/msp-register": t("sidebar.registers"),
      "/company-register": t("sidebar.registers"),
      "/colaborator-register": t("sidebar.registers"),
      "/settings": t("sidebar.settings"),
      "/services": t("sidebar.services"),
      "/msp-management": t("sidebar.management"),
      "/vituax-management": t("sidebar.management"),
      "/support": t("sidebar.support"),
      "/invoices": t("sidebar.reports"),
    }),
    [t],
  );

  const handleSelect = useCallback(
    (value: string, path?: string) => {
      setSelected(value);
      setCurrentSidebarSelected({ label: value, ...(path ? { path } : {}) });
      if (path) return navigate(path);
    },
    [navigate, setCurrentSidebarSelected],
  );

  useEffect(() => {
    // Mantém o item selecionado sincronizado com a URL, sem disparar uma navegação extra.
    const label = hashMapRoutes[pathname] ?? null;
    if (!label) return;
    setSelected(label);
    setCurrentSidebarSelected({ label, path: pathname });
  }, [hashMapRoutes, pathname, setCurrentSidebarSelected]);

  return { selected, handleSelect };
};
