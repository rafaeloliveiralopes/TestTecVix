export enum ENetworkType {
  public = 1,
  public_private = 2,
  private = 3,
}

export interface IVMResource {
  vmName: string;
  vCPU: number;
  ram: number;
  disk: number;
  hasBackup: boolean;
  os: string;
  pass: string;
  idBrandMaster?: number | null;
  status?: string | null;
  networkType?: ENetworkType;
  vmLocalization?: { label: string | null; value: unknown } | null;
  oldVM?: {
    vmName: string;
    vCPU: number;
    ram: number;
    disk: number;
    hasBackup: boolean;
    os: string;
    pass: string;
    status?: string | null;
    vmLocalization?: { label: string | null; value: unknown } | null;
  } | null;
}

export type IVMResourceUpdate = Omit<IVMResource, "pass"> & { pass?: string };

export interface IPortsByRegions {
  idPortsByRegion: number;
  idVmIpsRegions: number;
  isUsed: boolean;
  port: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
}

export type TAction = "pending" | "started" | "finished" | "rejected";
export type TStatus = "PAUSED" | "RUNNING" | "STOPPED" | "REBOOT" | null;
export type TOperation = "shutdown" | "start" | "hard";
export type TTask =
  | "create"
  | "delete"
  | "operation"
  | "backup_create"
  | "backup_restore"
  | "backup_delete";

export type TTaskLocation = "bre_barueri" | "usa_miami";

export interface IVMTask {
  action: TAction;
  operation?: null | "start" | "reboot" | "shutdown" | "hard" | undefined;
  task?: TTask | null | undefined;
  target?: "bre_barueri" | "usa_miami" | null | undefined;
  error: string | null;
  idTask?: number;
  idVM?: number;
  idVMBackup?: number | null;
  server?: string;
  hostname?: string | null;
  backup?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface IVMCreatedResponse {
  idVM: number;
  vmName: string;
  disk: number;
  ram: number;
  hasBackup: boolean;
  os: string;
  user: string;
  vCPU: number;
  status: string | null;
  location?: TTaskLocation | null;
  idBrandMaster: number | null;
  pass: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
  task: IVMTask[];
  brandMaster: {
    brandLogo: string;
    brandName: string;
  } | null;
  vmIpsRegions: { label: string; region: string } | null;
  idIPList: number | null;
  idVmIpsRegions?: number | null;
  idPortsByRegion?: number | null;
  idVlanGroup?: number | null;
  networkType?: ENetworkType;
}

export interface IVLANGroup {
  idVlanGroup: number;
  idVmIpsRegions: number;
  isUsed: boolean;
  vlan: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
}

export interface IVMBackup {
  idVMBackup: number;
  idVM: number;
  backupName: string;
  isRestored: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  task: IVMTask[];
}

export interface IVMBackupInfos extends IVMCreatedResponse {
  backups?: IVMBackup[];
}

export const taskMock: IVMTask = {
  action: "finished",
  error: null,
  idTask: 1,
  idVM: 1,
  task: "create",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
