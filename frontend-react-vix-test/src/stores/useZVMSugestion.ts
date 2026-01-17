import { create } from "zustand";

export enum EOS {
  ubuntu2404 = "ubuntu2404",
  ubuntu2204 = "ubuntu2204",
  ubuntu2004 = "ubuntu2004",
  debian12 = "debian12",
  debian13 = "debian13",
  debian11 = "debian11",
  opensuse = "opensuse",
  archlinux = "archlinux",
  fedora40 = "fedora40",
  centos9 = "centos9",
  centos10 = "centos10",
  win10 = "win10",
  win2019std = "win2019std",
  win2022std = "win2022std",
  edgeprotectv1 = "edgeprotectv1",
  os3cx = "3cx",
  yeastar = "yeastar",
  mikrotik = "mikrotik",
  pfsense = "pfsense",
  rockylinux10 = "rockylinux10",
  notFound = "",
}
export interface IVMSugestion {
  os: EOS | null;
  vCPU: number | null;
  ram: number | null;
  disk: number | null;
}

const INIT_STATE: IVMSugestion = {
  os: null,
  vCPU: null,
  ram: null,
  disk: null,
};

interface IVMSugestionState extends IVMSugestion {
  setVmSugestion: (vmSugestion: IVMSugestion | null) => void;
  resetAll: () => void;
}

export const useZVMSugestion = create<IVMSugestionState>((set) => ({
  ...INIT_STATE,
  setVmSugestion: (vmSugestion: IVMSugestion | null) =>
    set((state) => {
      if (!vmSugestion) {
        return { ...state, ...INIT_STATE };
      }
      return { ...state, ...vmSugestion };
    }),
  resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
}));
