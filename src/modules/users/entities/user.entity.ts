import { Role, User } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UserEntity implements User {
  id: number;

  name: string;

  account: string;

  intro: string | null;

  profileImageURL: string | null;

  @IsEnum(Role, {
    message: `role must be one of these values: ${Object.values(Role).join(", ")}`,
  })
  role: Role;
}
