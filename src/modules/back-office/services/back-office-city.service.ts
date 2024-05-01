import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCityService {
  constructor(private prismaService: PrismaService) {}

  create(createCityDto: CreateCityDto) {
    const { name, countryCode } = createCityDto;

    return this.prismaService.$transaction(async transaction => {
      // 같은 국가 코드와 이름을 가진 도시가 있는지 확인
      const count = await transaction.city.count({
        where: { name, countryCode },
      });
      if (count > 0) {
        throw new ConflictException("이미 존재하는 도시 입니다.");
      }

      // 신규 도시 등록
      return transaction.city.create({
        data: {
          name: createCityDto.name,
          countryCode: createCityDto.countryCode,
        },
      });
    });
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return this.prismaService.city.update({
      where: { id },
      data: {
        ...updateCityDto,
      },
    });
  }
}
