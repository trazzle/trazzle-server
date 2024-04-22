import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";
import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { CountryEntity } from "../entities/country.entity";
import { SearchCountryDto } from "../dtos/search-country.dto";
import { TAKE_20_PER_PAGE } from "src/commons/constants/pagination.constant";

@Injectable()
export class CountriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateCountryDto): Promise<CountryEntity> {
    const country = await this.prismaService.country.findUnique({
      where: { code: dto.code },
    });

    if (country) {
      throw new ConflictException("이미 존재하는 국가 코드 입니다.");
    }

    return this.prismaService.country.create({
      data: {
        code: dto.code,
        name: dto.name,
        continent: dto.continent,
      },
    });
  }

  findAll(dto: SearchCountryDto): Promise<CountryEntity[]> {
    const { cursor, name, continent } = dto;

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

  update(code: string, dto: UpdateCountryDto): Promise<CountryEntity> {
    return this.prismaService.country.update({
      where: { code },
      data: {
        code: dto.code,
        name: dto.name,
        continent: dto.continent,
      },
    });
  }

  delete(code: string) {
    return this.prismaService.country.delete({ where: { code } });
  }
}
