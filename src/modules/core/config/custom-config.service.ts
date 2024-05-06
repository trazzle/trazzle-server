import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import ENV_KEY from "./constants/env-config.constant";

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService<typeof ENV_KEY, true>) {}

  get<T>(key: (typeof ENV_KEY)[keyof typeof ENV_KEY]): T {
    return this.configService.get<T>(key);
  }
}
