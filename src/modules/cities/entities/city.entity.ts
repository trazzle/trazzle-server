import { City } from "@prisma/client";
export class CityEntity implements City {
  id: number;

  name: string;

  countryCode: string;

  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
}
