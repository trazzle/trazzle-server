import { Magnet } from "@prisma/client";

export class MagnetEntity implements Magnet {
  id: number;
  url: string;
  cityId: number;
  isFree: boolean;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}
