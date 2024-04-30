import { PickType } from "@nestjs/mapped-types";
import { CreateAdminRequestBodyDto } from "src/modules/back-office/dtos/req/create-admin-request-body.dto";

export class UpdateAdminInfoRequestBodyDto extends PickType(CreateAdminRequestBodyDto, ["name"]) {}
