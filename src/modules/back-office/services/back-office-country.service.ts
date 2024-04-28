import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCountryDto } from "src/modules/conuntries/dtos/create-country.dto";
import { UpdateCountryDto } from "src/modules/conuntries/dtos/update-country.dto";
import { CountryEntity } from "src/modules/conuntries/entities/country.entity";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCountryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCountryDto) {
    const { code, name, continent } = dto;
    this.prismaService.$transaction(async transaction => {
      // 기존의 국가가 들어있는지 확인
      const country = await transaction.country.findMany({
        where: {
          OR: [
            {
              code: { contains: code },
            },
            {
              name: { contains: name },
            },
          ],
        },
      });

      if (country.length > 0) {
        throw new ConflictException("이미 존재하는 국가 입니다.");
      }

      // 신규 국가 등록
      return await transaction.country.create({
        data: {
          code: code,
          name: name,
          continent: continent,
        },
      });
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
