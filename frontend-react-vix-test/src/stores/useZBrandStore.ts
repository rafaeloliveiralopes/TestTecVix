import { create } from "zustand";
import { middlewareLocalStorage } from "./middlewareLocalStorage";

export interface IBrandInfo {
  idBrand: number | null;
  brandName?: string;
  brandLogo?: string;
  brandLogoTemp?: string;
  brandContact?: string;
  brandSite?: string;
  brandPrivacyPolicy?: string;
  brandObjectName?: string;
  // Flag para garantir persistência correta quando o usuário optar por remover a logo.
  brandLogoRemoved?: boolean;
  domain?: string;
  setorName?: string; // Incuir no DB 
  fieldName?: string;
  location?: string;
  city?: string;
  emailContact?: string;
  smsContact?: string;
  timezone?: string;
  stripeUserId?: null | string;
  discountRate?: number;
  manual?: null | string;
  termsOfUse?: null | string;
  privacyPolicy?: null | string;
  hasSelfRegister?: boolean;
  hasPrepaid?: boolean;
  retailPercentageDefault?: string | number;
}
const INIT_STATE: IBrandInfo = {
  idBrand: null,
  brandName: "Vituax",
  brandLogo: "",
  brandLogoTemp: "",
  brandObjectName: "",
  brandLogoRemoved: false,
  domain: "",
  brandContact: "https://www.vituax.com/contato/",
  brandSite: "https://vituax.com",
  brandPrivacyPolicy:
    "https://www.vituax.com/pt#:~:text=Termos%20de%20uso-,Pol%C3%ADtica%20de%20privacidade,-%C2%A9%202025%20Vituax.%20Design",
  setorName: "",
  fieldName: "",
  location: "",
  city: "",
  emailContact: "",
  smsContact: "",
  timezone: "",
  stripeUserId: null,
  discountRate: 1,
  manual: null,
  termsOfUse: null,
  privacyPolicy: null,
  hasSelfRegister: false,
  hasPrepaid: false,
  retailPercentageDefault: 1,
};

interface IBrandInfoState extends IBrandInfo {
  setBrandInfo: (brandInfo: Partial<IBrandInfo>) => void;
  resetAll: () => void;
}
const middle = middlewareLocalStorage<IBrandInfoState>("brandInfos");

export const useZBrandInfo = create<IBrandInfoState>()(
  middle((set) => ({
    ...INIT_STATE,
    setBrandInfo: (brandInfo) => set((state) => ({ ...state, ...brandInfo })),
    resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
  })),
);
