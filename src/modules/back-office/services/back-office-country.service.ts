import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";
import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";
import { CountryEntity } from "src/modules/conuntries/entities/country.entity";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCountryService {
  constructor(private prismaService: PrismaService) {}

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
}
