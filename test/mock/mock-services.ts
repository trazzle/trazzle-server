import { MockClassType } from "test/mock/mock.type";
import { BackOfficeAdminService } from "src/modules/back-office/services/back-office-admin.service";
import { CustomConfigService } from "src/modules/core/config/custom-config.service";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/modules/core/redis/redis.service";

export const mockConfigService = {
  get: jest.fn(),
};

export const mockCustomConfigService: MockClassType<CustomConfigService> = {
  get: jest.fn(),
};

export const mockBackOfficeAdminService: MockClassType<BackOfficeAdminService> = {
  createAdmin: jest.fn(),
  getAdmins: jest.fn(),
  getAdminInfo: jest.fn(),
  updateAdminInfo: jest.fn(),
  deleteAdmin: jest.fn(),
};

export const mockJwtService: MockClassType<JwtService> = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};

export const mockRedisService: MockClassType<RedisService> = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  onModuleDestroy: jest.fn(),
};
