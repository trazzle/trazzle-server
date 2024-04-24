import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { CountryEntity } from "../entities/country.entity";
import { SearchCountryDto } from "../dtos/search-country.dto";
import { TAKE_20_PER_PAGE } from "src/commons/constants/pagination.constant";

@Injectable()
export class CountriesService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(dto: SearchCountryDto): Promise<CountryEntity[]> {
    const { cursor } = dto;

    return this.prismaService.country.findMany({
      take: TAKE_20_PER_PAGE,
      cursor: {
        id: cursor ?? 1,
      },
      where: {
        AND: [
          { name: { contains: dto.name } },
          { code: { contains: dto.code } },
          {
            continent: dto.continent,
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
