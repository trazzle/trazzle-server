import { MockClassType } from "test/mock/mock.type";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";

export const mockConfigService = {
  get: jest.fn(),
};

export const mockBackOfficeAdminService: MockClassType<BackOfficeAdminService> = {
  createAdmin: jest.fn(),
  getAdmins: jest.fn(),
  getAdminInfo: jest.fn(),
  updateAdminInfo: jest.fn(),
  deleteAdmin: jest.fn(),
};
