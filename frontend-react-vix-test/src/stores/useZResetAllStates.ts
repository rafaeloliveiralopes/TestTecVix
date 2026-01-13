import { useZBrandInfo } from "./useZBrandStore";
import { useZGlobalVar } from "./useZGlobalVar";
import { useZMyVMsList } from "./useZMyVMsList";
import { useZUserProfile } from "./useZUserProfile";
import { useZVM } from "./useZVM";
import { useCallback } from "react";

export const useZResetAllStates = () => {
  const { resetAll: resetAllStates } = useZUserProfile();
  const { resetAll: resetAllStatesBrand } = useZBrandInfo();
  const { resetAll: resetAllStatesGlobal } = useZGlobalVar();
  const { resetAll: resetAllStatesMyVMs } = useZMyVMsList();
  const { resetAll: resetAllStatesVM } = useZVM();

  return {
    resetAllStates: useCallback(() => {
      resetAllStates();
      resetAllStatesBrand();
      resetAllStatesGlobal();
      resetAllStatesMyVMs();
      resetAllStatesVM();
    }, [
      resetAllStates,
      resetAllStatesBrand,
      resetAllStatesGlobal,
      resetAllStatesMyVMs,
      resetAllStatesVM,
    ]),
  };
};
