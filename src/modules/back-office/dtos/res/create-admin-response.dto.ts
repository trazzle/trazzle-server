import { OmitType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/modules/users/entities/user.entity";

export class CreateAdminResponseDto extends OmitType(UserEntity, ["intro", "profileImageURL", "role"] as const) {
  @ApiProperty({
    description: "유저 PK",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "관리자 이름",
    example: "최은강",
  })
  name: string;

  @ApiProperty({
    description: "관리자 계정",
    example: "admin-{관리자계정값}",
  })
  account: string;
}
