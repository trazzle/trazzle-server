import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BackOfficeMagnetService } from "src/modules/back-office/services/back-office-magnet.service";

@Controller("magnets")
@ApiTags("백오피스 API - 마그넷")
export class BackOfficeMagnetController {
  constructor(private readonly backOfficeMagnetService: BackOfficeMagnetService) {}
}
