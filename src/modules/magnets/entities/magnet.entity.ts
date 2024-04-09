import { Magnet } from "@prisma/client";

export class MagnetEntity implements Magnet {
  id: number;
  url: string;
  key: string;
  cityId: number;
  createdAt: Date;
  updatedAt: Date;
}
