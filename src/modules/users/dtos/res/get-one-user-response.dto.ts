import { PickType } from "@nestjs/mapped-types";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";

export class GetOneUserResponseDto extends PickType(LoginSucceedUserResponseDto, ["name", "intro", "profile_image"]) {}
