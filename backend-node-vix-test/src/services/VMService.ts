import { user } from "@prisma/client";
import { VMModel } from "../models/VMModel";
import { vMCreatedSchema } from "../types/validations/VM/createVM";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { vMUpdatedSchema } from "../types/validations/VM/updateVM";
import { vmListAllSchema } from "../types/validations/VM/vmListAll";
import bcrypt from "bcryptjs";

export class VMService {
  constructor() {}

  private vMModel = new VMModel();

  private omitPass(vm: Record<string, unknown>) {
    const { pass: _pass, ...withoutPass } = vm;
    void _pass;
    return withoutPass;
  }

  private async hashPassIfNeeded(pass: string) {
    const isHashed =
      pass.startsWith("$2a$") ||
      pass.startsWith("$2b$") ||
      pass.startsWith("$2y$");
    return isHashed ? pass : await bcrypt.hash(pass, 10);
  }

  async getById(idVM: number) {
    const vm = await this.vMModel.getById(idVM);
    return vm ? this.omitPass(vm as unknown as Record<string, unknown>) : vm;
  }

  async listAll(query: unknown, user: user) {
    void user;
    const validQuery = vmListAllSchema.parse(query);
    const result = await this.vMModel.listAll({
      query: validQuery,
    });
    return {
      ...result,
      result: result.result.map((vm) =>
        this.omitPass(vm as unknown as Record<string, unknown>),
      ),
    };
  }

  async createNewVM(data: unknown, user: user) {
    void user;
    const normalizedData: Record<string, unknown> =
      typeof data === "object" && data !== null && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>) }
        : {};

    const vmLocalization = normalizedData.vmLocalization as
      | { value?: unknown }
      | undefined;
    if (
      normalizedData.location === undefined &&
      vmLocalization &&
      typeof vmLocalization === "object" &&
      vmLocalization.value !== undefined
    ) {
      normalizedData.location = vmLocalization.value;
    }

    const validateData = vMCreatedSchema.parse(normalizedData);
    const pass = await this.hashPassIfNeeded(validateData.pass);

    const createdVM = await this.vMModel.createNewVM({
      ...validateData,
      pass,
      status: "RUNNING",
    });

    return this.omitPass(createdVM as unknown as Record<string, unknown>);
  }

  async updateVM(idVM: number, data: unknown, user: user) {
    void user;
    const normalizedData: Record<string, unknown> =
      typeof data === "object" && data !== null && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>) }
        : {};

    const vmLocalization = normalizedData.vmLocalization as
      | { value?: unknown }
      | undefined;
    if (
      normalizedData.location === undefined &&
      vmLocalization &&
      typeof vmLocalization === "object" &&
      vmLocalization.value !== undefined
    ) {
      normalizedData.location = vmLocalization.value;
    }

    const validateDataSchema = vMUpdatedSchema.parse(normalizedData);
    const oldVM = await this.getById(idVM);

    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const updateData = {
      ...validateDataSchema,
    } as typeof validateDataSchema & {
      pass?: string;
    };
    if (updateData.pass) {
      updateData.pass = await this.hashPassIfNeeded(updateData.pass);
    }

    const updatedVM = await this.vMModel.updateVM(idVM, updateData);
    return this.omitPass(updatedVM as unknown as Record<string, unknown>);
  }

  async deleteVM(idVM: number, user: user) {
    void user;
    const oldVM = await this.getById(idVM);
    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    const deletedVm = await this.vMModel.deleteVM(idVM);
    return this.omitPass(deletedVm as unknown as Record<string, unknown>);
  }
}
