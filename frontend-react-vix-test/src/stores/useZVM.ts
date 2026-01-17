import { create } from "zustand";
import { IGenericOptionsTyped, TOptions } from "../types/FormType";
import { MIN_PASS_SIZE } from "../configs/contants";
import { genStrongPass } from "../utils/genStrongPass";
import { ENetworkType } from "../types/VMTypes";

export interface IVMForm {
  vmSO: TOptions | null;
  isOpenVMMarketPlace: boolean;
  vmPassword: string;
  vmName: string;
  vmvCpu: number;
  vmMemory: number;
  vmDisk: number;
  // Tipo de armazenamento selecionado no formulário (ex: SSD/HD).
  vmStorageType: TOptions | null;
  vmLocalization: TOptions | null;
  hasBackup: boolean;
  vmNetwork: IGenericOptionsTyped<ENetworkType> | null;
  openConfirm: boolean;
  searchMarketPlace: string;
  category: TOptions;
  isOpenModalDetails: boolean;
  currentISOVM: object | null;
  orderBy: TOptions;
}

const INIT_STATE: IVMForm = {
  vmSO: null,
  isOpenVMMarketPlace: false,
  vmPassword: genStrongPass(MIN_PASS_SIZE),
  vmName: "",
  vmvCpu: 1,
  vmMemory: 1,
  vmDisk: 20,
  vmStorageType: null,
  vmLocalization: null,
  hasBackup: false,
  vmNetwork: null,
  openConfirm: false,
  searchMarketPlace: "",
  category: null,
  isOpenModalDetails: false,
  currentISOVM: null,
  orderBy: null,
};

interface IVMFormState extends IVMForm {
  setVmSO(vmSO: TOptions): void;
  setIsOpenVMMarketPlace(isOpenVMMarketPlace: boolean): void;
  setVmPassword(vmPassword: string): void;
  newRandomPassword: () => void;
  setVmName(vmName: string): void;
  setVmvCpu(vmvCpu: number): void;
  setVmMemory(vmMemory: number): void;
  setVmDisk(vmDisk: number): void;
  setVmStorageType(vmStorageType: TOptions | null): void;
  setVmLocalization(vmLocalization: TOptions | null): void;
  setHasBackup(hasBackup: boolean): void;
  setVmNetwork(vmNetwork: IGenericOptionsTyped<ENetworkType> | null): void;
  setOpenConfirm(openConfirm: boolean): void;
  setSearchMarketPlace: (str: string) => void;
  setCategory: (category: TOptions) => void;
  setIsOpenModalDetails: (isOpenModalDetails: boolean) => void;
  setCurrentISOVM: (currentISOVM: object | null) => void;
  setOrderBy: (orderBy: TOptions) => void;
  resetAll: () => void;
}

export const useZVM = create<IVMFormState>((set) => ({
  ...INIT_STATE,
  setVmSO: (vmSO) => set((state) => ({ ...state, vmSO })),
  setIsOpenVMMarketPlace: (isOpenVMMarketPlace) =>
    set((state) => ({ ...state, isOpenVMMarketPlace })),
  setVmPassword: (vmPassword) => set((state) => ({ ...state, vmPassword })),
  newRandomPassword: () =>
    set((state) => ({ ...state, vmPassword: genStrongPass(MIN_PASS_SIZE) })),
  setVmName: (vmName) => set((state) => ({ ...state, vmName })),
  setVmvCpu: (vmvCpu) => set((state) => ({ ...state, vmvCpu })),
  setVmMemory: (vmMemory) => set((state) => ({ ...state, vmMemory })),
  setVmDisk: (vmDisk) => set((state) => ({ ...state, vmDisk })),
  setVmStorageType: (vmStorageType) =>
    set((state) => ({ ...state, vmStorageType })),
  setVmLocalization: (vmLocalization) =>
    set((state) => ({ ...state, vmLocalization })),
  setHasBackup: (hasBackup) => set((state) => ({ ...state, hasBackup })),
  setVmNetwork: (vmNetwork) => set((state) => ({ ...state, vmNetwork })),
  setOpenConfirm: (openConfirm) => set((state) => ({ ...state, openConfirm })),
  setSearchMarketPlace: (str) =>
    set((state) => ({ ...state, searchMarketPlace: str })),
  setCategory: (category) => set((state) => ({ ...state, category })),
  setIsOpenModalDetails: (isOpenModalDetails) =>
    set((state) => ({ ...state, isOpenModalDetails })),
  setCurrentISOVM: (currentISOVM) =>
    set((state) => ({ ...state, currentISOVM })),
  setOrderBy: (orderBy) => set((state) => ({ ...state, orderBy })),
  resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
}));
