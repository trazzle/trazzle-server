import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCountryDto } from "src/modules/back-office/dtos/req/create-country.dto";
import { UpdateCountryDto } from "src/modules/back-office/dtos/req/update-country.dto";
import { CountryEntity } from "src/modules/conuntries/entities/country.entity";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCountryService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateCountryDto) {
    const { code, name, continent } = dto;
    return this.prismaService.$transaction(async transaction => {
      let count = await transaction.country.count({ where: { code } });
      if (count > 0) {
        throw new ConflictException("이미 존재하는 국가 코드 입니다.");
      }

      count = await transaction.country.count({ where: { name } });
      if (count > 0) {
        throw new ConflictException("이미 존재하는 국가 이름 입니다.");
      }

      // 신규 국가 등록
      return transaction.country.create({
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
