import { OmitType } from "@nestjs/mapped-types";
import { LoginSucceedUserResponseDto } from "src/modules/users/dtos/res/login-succeed-user-response.dto";

export class UpdateUserResponseDto extends OmitType(LoginSucceedUserResponseDto, ["user_id"]) {}
