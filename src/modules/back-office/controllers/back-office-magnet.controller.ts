import { Controller, Delete, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/guards/admin-auth.guard";
import { BackOfficeMagnetService } from "src/modules/back-office/services/back-office-magnet.service";

@UseGuards(AdminGuard)
@Controller("magnets")
export class BackOfficeMagnetController {
  constructor(private readonly backOfficeMagnetService: BackOfficeMagnetService) {}

  @Post()
  createMagnet() {
    return "createMagnet";
  }

  @Patch()
  updateMagnet() {
    return "updateMagnet";
  }

  @Delete()
  deleteMagnet() {
    return "deleteMagnet";
  }
}
