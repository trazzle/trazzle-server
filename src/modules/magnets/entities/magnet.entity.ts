import { Magnet } from "@prisma/client";

export class MagnetEntity implements Magnet {
  id: number;
  url: string;
  cityId: number;
  createdAt: Date;
  updatedAt: Date;
}
