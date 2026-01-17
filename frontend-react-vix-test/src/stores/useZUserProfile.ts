import { create } from "zustand";
import { middlewareLocalStorage } from "./middlewareLocalStorage";

export type TRole = "admin" | "manager" | "member";

export interface IUserProfile {
  idUser: number | null;
  fullName?: string | null;
  profileImgUrl: string | null;
  objectName?: string;
  imageUrl?: string;
  // Controle local: indica que o usuário pediu para remover a imagem atual.
  profileImgRemoved?: boolean;
  username: string | null;
  isActive?: boolean;
  lastLoginDate?: string | Date;
  userEmail: string | null;
  userPhoneNumber: string | null;
  token: string | null;
  idBrand: number | null;
  role: TRole | null;
}
const INIT_STATE: IUserProfile = {
  idUser: null,
  fullName: null,
  profileImgUrl: null,
  objectName: "",
  imageUrl: "",
  profileImgRemoved: false,
  username: null,
  userEmail: null,
  userPhoneNumber: null,
  token: null,
  idBrand: null,
  lastLoginDate: "",
  role: null,
};

interface IUserProfileState extends IUserProfile {
  setUser: (user: Partial<IUserProfile>) => void;
  setImage: ({
    imageUrl,
    objectName,
  }: {
    imageUrl: string;
    objectName: string;
  }) => void;
  resetAll: () => void;
}
const middle = middlewareLocalStorage<IUserProfileState>("userProfile");

export const useZUserProfile = create<IUserProfileState>()(
  middle((set) => ({
    ...INIT_STATE,
    setUser: (user) => set((state) => ({ ...state, ...user })),
    setImage: ({ imageUrl, objectName }) =>
      set((state) => ({ ...state, imageUrl, objectName })),
    resetAll: () => set((state) => ({ ...state, ...INIT_STATE })),
  })),
);
